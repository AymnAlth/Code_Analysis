import { GoogleGenerativeAI } from '@google/generative-ai';
import { CodeReviewResult, ReviewIssue, ReviewCategory } from '../types';
import { ConfigManager } from './ConfigManager';

export class AIService {
  private static instance: AIService;
  private genAI: GoogleGenerativeAI | null = null;
  private configManager: ConfigManager;

  private constructor() {
    this.configManager = ConfigManager.getInstance();
    this.initializeAI();
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * تهيئة نموذج الذكاء الاصطناعي
   */
  private initializeAI(): void {
    const config = this.configManager.getConfig();
    if (config.ai.apiKey) {
      this.genAI = new GoogleGenerativeAI(config.ai.apiKey);
    }
  }

  /**
   * تحديث مفتاح API
   */
  public updateApiKey(apiKey: string): void {
    this.configManager.updateConfigValue('ai', {
      ...this.configManager.getConfigValue('ai'),
      apiKey
    });
    this.initializeAI();
  }

  /**
   * التحقق من صحة الاتصال
   */
  public async validateConnection(): Promise<boolean> {
    if (!this.genAI) return false;
    
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent('Test connection');
      return Boolean(result.response.text());
    } catch (error) {
      console.error('فشل في التحقق من الاتصال:', error);
      return false;
    }
  }

  /**
   * مراجعة الكود باستخدام الذكاء الاصطناعي
   */
  public async reviewCode(
    filename: string,
    code: string,
    language: string
  ): Promise<CodeReviewResult> {
    if (!this.genAI) {
      throw new Error('لم يتم تكوين مفتاح API');
    }

    const config = this.configManager.getConfig();
    const model = this.genAI.getGenerativeModel({ 
      model: config.ai.model,
      generationConfig: {
        temperature: config.ai.temperature,
        maxOutputTokens: config.ai.maxTokens,
      }
    });

    const prompt = this.buildReviewPrompt(code, language, config.review.enabledCategories);
    
    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      return this.parseAIResponse(response, filename, language);
    } catch (error) {
      console.error('خطأ في مراجعة الكود:', error);
      throw new Error('فشل في مراجعة الكود: ' + (error as Error).message);
    }
  }

  /**
   * بناء prompt للمراجعة
   */
  private buildReviewPrompt(
    code: string, 
    language: string, 
    categories: ReviewCategory[]
  ): string {
    const categoriesText = categories.map(cat => {
      const categoryMap = {
        'clean-code': 'نظافة الكود والوضوح',
        'performance': 'الأداء والكفاءة',
        'security': 'الأمان والثغرات',
        'best-practices': 'أفضل الممارسات',
        'maintainability': 'قابلية الصيانة',
        'readability': 'القابلية للقراءة',
        'documentation': 'التوثيق والتعليقات'
      };
      return categoryMap[cat] || cat;
    }).join('، ');

    return `
أنت خبير في مراجعة الكود. قم بمراجعة الكود التالي المكتوب بلغة ${language} وفقاً للمعايير التالية: ${categoriesText}.

الكود المراد مراجعته:
\`\`\`${language}
${code}
\`\`\`

يرجى تقديم المراجعة بصيغة JSON بالشكل التالي:
{
  "overallScore": رقم من 0 إلى 100,
  "summary": "ملخص عام للمراجعة",
  "issues": [
    {
      "type": "warning|error|improvement",
      "category": "clean-code|performance|security|best-practices|maintainability|readability|documentation",
      "line": رقم السطر (اختياري),
      "message": "رسالة مختصرة",
      "description": "وصف تفصيلي للمشكلة",
      "suggestedFix": "الحل المقترح",
      "severity": "low|medium|high|critical"
    }
  ]
}

تأكد من:
1. تقديم ملاحظات بناءة ومفيدة
2. تحديد أرقام الأسطر عند الإمكان
3. تقديم حلول عملية
4. التركيز على المعايير المطلوبة فقط
5. استخدام اللغة العربية في الوصف والرسائل
`;
  }

  /**
   * تحليل استجابة الذكاء الاصطناعي
   */
  private parseAIResponse(
    response: string, 
    filename: string, 
    language: string
  ): CodeReviewResult {
    try {
      // استخراج JSON من الاستجابة
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('لم يتم العثور على استجابة JSON صحيحة');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // تحويل البيانات إلى التنسيق المطلوب
      const issues: ReviewIssue[] = (parsed.issues || []).map((issue: any, index: number) => ({
        id: `issue_${Date.now()}_${index}`,
        type: issue.type || 'improvement',
        category: issue.category || 'best-practices',
        line: issue.line,
        column: issue.column,
        message: issue.message || 'ملاحظة عامة',
        description: issue.description || issue.message || 'لا يوجد وصف',
        suggestedFix: issue.suggestedFix,
        severity: issue.severity || 'medium'
      }));

      // تصنيف المشاكل
      const warnings = issues.filter(issue => issue.type === 'warning');
      const errors = issues.filter(issue => issue.type === 'error');
      const improvements = issues.filter(issue => issue.type === 'improvement');

      return {
        id: `review_${Date.now()}`,
        filename,
        language,
        timestamp: new Date(),
        analysis: {
          warnings,
          errors,
          improvements
        },
        overallScore: Math.max(0, Math.min(100, parsed.overallScore || 75)),
        summary: parsed.summary || 'تمت مراجعة الكود بنجاح'
      };

    } catch (error) {
      console.error('خطأ في تحليل الاستجابة:', error);
      
      // إنشاء نتيجة افتراضية في حالة الخطأ
      return {
        id: `review_${Date.now()}`,
        filename,
        language,
        timestamp: new Date(),
        analysis: {
          warnings: [],
          errors: [{
            id: 'parse_error',
            type: 'error',
            category: 'best-practices',
            message: 'خطأ في تحليل الاستجابة',
            description: 'فشل في تحليل استجابة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.',
            severity: 'high'
          }],
          improvements: []
        },
        overallScore: 0,
        summary: 'فشل في تحليل الاستجابة من الذكاء الاصطناعي'
      };
    }
  }

  /**
   * التحقق من حالة الخدمة
   */
  public isConfigured(): boolean {
    return Boolean(this.genAI && this.configManager.isApiKeyValid());
  }
}