import { GoogleGenerativeAI } from '@google/generative-ai';
import { CodeReviewResult, ReviewIssue, ReviewCategory } from '../types';
import { ConfigManager } from './ConfigManager';
import { AdvancedCodeAnalyzer } from './AdvancedCodeAnalyzer';

export class AIService {
  private static instance: AIService;
  private genAI: GoogleGenerativeAI | null = null;
  private configManager: ConfigManager;
  private codeAnalyzer: AdvancedCodeAnalyzer;

  private constructor() {
    this.configManager = ConfigManager.getInstance();
    this.codeAnalyzer = AdvancedCodeAnalyzer.getInstance();
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
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
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

    // تحليل أولي للكود
    const preAnalysis = this.codeAnalyzer.analyzeCode(code, language);
    
    const config = this.configManager.getConfig();
    const model = this.genAI.getGenerativeModel({ 
      model: config.ai.model,
      generationConfig: {
        temperature: config.ai.temperature,
        maxOutputTokens: config.ai.maxTokens,
      }
    });

    const prompt = this.buildReviewPrompt(
      code, 
      language, 
      config.review.enabledCategories,
      preAnalysis
    );
    
    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      return this.parseAIResponse(response, filename, language, preAnalysis);
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
    categories: ReviewCategory[],
    preAnalysis: any
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

    const metricsText = `
إحصائيات الكود المتقدمة:
- إجمالي الأسطر: ${preAnalysis.metrics.totalLines}
- أسطر الكود: ${preAnalysis.metrics.codeLines}
- أسطر التعليقات: ${preAnalysis.metrics.commentLines}
- التعقد الدوري: ${preAnalysis.metrics.cyclomaticComplexity}
- التعقد المعرفي: ${preAnalysis.metrics.cognitiveComplexity}
- مؤشر قابلية الصيانة: ${preAnalysis.metrics.maintainabilityIndex}
- الدين التقني: ${preAnalysis.metrics.technicalDebt} دقيقة
- عدد الدوال: ${preAnalysis.metrics.functionCount}
- عدد الكلاسات: ${preAnalysis.metrics.classCount}
- الأسطر المكررة: ${preAnalysis.metrics.duplicatedLines}
- روائح الكود: ${preAnalysis.metrics.codeSmells}
- الدوال الموثقة: ${preAnalysis.metrics.documentedFunctions}
- تعليقات TODO: ${preAnalysis.metrics.todoComments}
- المخاطر الأمنية: ${preAnalysis.metrics.hardcodedSecrets}
`;

    const staticIssuesText = preAnalysis.issues.length > 0 
      ? `\nالمشاكل المكتشفة مسبقاً:\n${preAnalysis.issues.map(issue => 
          `- ${issue.message} (السطر ${issue.line})`
        ).join('\n')}`
      : '';

    const suggestionsText = preAnalysis.suggestions.length > 0
      ? `\nاقتراحات التحسين:\n${preAnalysis.suggestions.map(s => `- ${s}`).join('\n')}`
      : '';

    const patternsText = preAnalysis.patterns && preAnalysis.patterns.length > 0
      ? `\nالأنماط المكتشفة:\n${preAnalysis.patterns.map(p => 
          `- ${p.name}: ${p.description} (${p.type})`
        ).join('\n')}`
      : '';
    return `
أنت خبير في مراجعة الكود. قم بمراجعة الكود التالي المكتوب بلغة ${language} وفقاً للمعايير التالية: ${categoriesText}.

${metricsText}${staticIssuesText}${suggestionsText}${patternsText}

الكود المراد مراجعته:
\`\`\`${language}
${code}
\`\`\`

يرجى تقديم مراجعة شاملة ومفصلة بصيغة JSON بالشكل التالي (مع مراعاة التحليل المسبق):
{
  "overallScore": رقم من 0 إلى 100 (مع مراعاة جميع المقاييس والمشاكل المكتشفة),
  "summary": "ملخص عام ومفصل للمراجعة مع ذكر النقاط الإيجابية والسلبية",
  "codeQuality": {
    "maintainability": رقم من 0 إلى 100,
    "readability": رقم من 0 إلى 100,
    "performance": رقم من 0 إلى 100,
    "security": رقم من 0 إلى 100
  },
  "strengths": ["نقاط القوة في الكود"],
  "weaknesses": ["نقاط الضعف في الكود"],
  "issues": [
    {
      "type": "warning|error|improvement",
      "category": "clean-code|performance|security|best-practices|maintainability|readability|documentation",
      "line": رقم السطر (اختياري),
      "message": "رسالة مختصرة وواضحة",
      "description": "وصف تفصيلي للمشكلة",
      "suggestedFix": "الحل المقترح مع مثال عملي",
      "severity": "low|medium|high|critical",
      "codeExample": "مثال على الكود المحسن (اختياري)"
    }
  ],
  "recommendations": [
    "توصيات عامة لتحسين الكود"
  ],
  "bestPractices": [
    "أفضل الممارسات المقترحة لهذا النوع من الكود"
  ]
}

تأكد من:
1. تقديم ملاحظات بناءة ومفيدة ومفصلة مع مراعاة التحليل المسبق
2. تحديد أرقام الأسطر بدقة عند الإمكان
3. تقديم حلول عملية مع أمثلة كود محسن
4. مراعاة جميع المقاييس والمشاكل والأنماط المكتشفة مسبقاً
5. تقييم شامل لجميع جوانب جودة الكود
6. استخدام اللغة العربية الواضحة والمفهومة
7. تقديم توصيات عملية قابلة للتطبيق
8. التركيز على المشاكل الحقيقية الموجودة في الكود المرفق
`;
  }

  /**
   * تحليل استجابة الذكاء الاصطناعي
   */
  private parseAIResponse(
    response: string, 
    filename: string, 
    language: string,
    preAnalysis: any
  ): CodeReviewResult {
    try {
      // استخراج JSON من الاستجابة
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('لم يتم العثور على استجابة JSON صحيحة');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // دمج المشاكل المكتشفة مسبقاً مع مشاكل الذكاء الاصطناعي
      const aiIssues: ReviewIssue[] = (parsed.issues || []).map((issue: any, index: number) => ({
        id: `issue_${Date.now()}_${index}`,
        type: issue.type || 'improvement',
        category: issue.category || 'best-practices',
        line: issue.line,
        column: issue.column,
        message: issue.message || 'ملاحظة عامة',
        description: issue.description || issue.message || 'لا يوجد وصف',
        suggestedFix: issue.suggestedFix,
        codeExample: issue.codeExample,
        severity: issue.severity || 'medium'
      }));

      // دمج جميع المشاكل
      const allIssues = [...preAnalysis.issues, ...aiIssues];

      // تصنيف المشاكل
      const warnings = allIssues.filter(issue => issue.type === 'warning');
      const errors = allIssues.filter(issue => issue.type === 'error');
      const improvements = allIssues.filter(issue => issue.type === 'improvement');

      // حساب النتيجة المحسنة
      let finalScore = Math.max(0, Math.min(100, parsed.overallScore || 75));
      
      // تعديل النتيجة بناءً على المقاييس
      if (preAnalysis.metrics.cyclomaticComplexity > 15) finalScore -= 15;
      if (preAnalysis.metrics.duplicatedLines > 10) finalScore -= 10;
      if (preAnalysis.metrics.commentLines / preAnalysis.metrics.codeLines < 0.05) finalScore -= 8;
      if (preAnalysis.metrics.codeSmells > 5) finalScore -= 12;
      if (preAnalysis.metrics.maintainabilityIndex < 50) finalScore -= 20;
      if (preAnalysis.metrics.hardcodedSecrets > 0) finalScore -= 25;
      
      finalScore = Math.max(0, finalScore);

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
        overallScore: finalScore,
        summary: parsed.summary || 'تمت مراجعة الكود بنجاح',
        codeQuality: parsed.codeQuality || {
          maintainability: finalScore,
          readability: finalScore,
          performance: finalScore,
          security: finalScore
        },
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        recommendations: parsed.recommendations || [],
        bestPractices: parsed.bestPractices || [],
        metrics: preAnalysis.metrics
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
          warnings: preAnalysis.issues.filter((i: any) => i.type === 'warning'),
          errors: [{
            id: 'parse_error',
            type: 'error',
            category: 'best-practices',
            message: 'خطأ في تحليل الاستجابة',
            description: 'فشل في تحليل استجابة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.',
            severity: 'high'
          }],
          improvements: preAnalysis.issues.filter((i: any) => i.type === 'improvement')
        },
        overallScore: 0,
        summary: 'فشل في تحليل الاستجابة من الذكاء الاصطناعي',
        metrics: preAnalysis.metrics
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