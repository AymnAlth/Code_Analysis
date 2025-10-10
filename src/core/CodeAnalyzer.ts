import { ReviewIssue, ReviewCategory, CodeReviewResult } from '../types';

/**
 * محلل الكود المتقدم - يقوم بتحليل إضافي قبل إرسال الكود للذكاء الاصطناعي
 */
export class CodeAnalyzer {
  private static instance: CodeAnalyzer;

  private constructor() {}

  public static getInstance(): CodeAnalyzer {
    if (!CodeAnalyzer.instance) {
      CodeAnalyzer.instance = new CodeAnalyzer();
    }
    return CodeAnalyzer.instance;
  }

  /**
   * تحليل الكود قبل إرساله للذكاء الاصطناعي
   */
  public preAnalyzeCode(code: string, language: string): {
    metrics: CodeMetrics;
    staticIssues: ReviewIssue[];
    suggestions: string[];
  } {
    const metrics = this.calculateMetrics(code);
    const staticIssues = this.findStaticIssues(code, language);
    const suggestions = this.generateSuggestions(metrics, language);

    return { metrics, staticIssues, suggestions };
  }

  /**
   * حساب مقاييس الكود
   */
  private calculateMetrics(code: string): CodeMetrics {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const commentLines = this.countCommentLines(code);
    
    return {
      totalLines: lines.length,
      codeLines: nonEmptyLines.length - commentLines,
      commentLines,
      emptyLines: lines.length - nonEmptyLines.length,
      averageLineLength: nonEmptyLines.reduce((sum, line) => sum + line.length, 0) / nonEmptyLines.length || 0,
      maxLineLength: Math.max(...lines.map(line => line.length)),
      cyclomaticComplexity: this.calculateComplexity(code),
      duplicatedLines: this.findDuplicatedLines(lines),
      functionCount: this.countFunctions(code),
      classCount: this.countClasses(code)
    };
  }

  /**
   * البحث عن المشاكل الثابتة في الكود
   */
  private findStaticIssues(code: string, language: string): ReviewIssue[] {
    const issues: ReviewIssue[] = [];
    const lines = code.split('\n');

    // فحص الأسطر الطويلة
    lines.forEach((line, index) => {
      if (line.length > 120) {
        issues.push({
          id: `long-line-${index}`,
          type: 'warning',
          category: 'readability',
          line: index + 1,
          message: 'سطر طويل جداً',
          description: `السطر ${index + 1} يحتوي على ${line.length} حرف. يُنصح بألا يتجاوز السطر 120 حرف.`,
          suggestedFix: 'قم بتقسيم السطر إلى عدة أسطر أو استخدم متغيرات وسطية.',
          severity: 'low'
        });
      }
    });

    // فحص المشاكل الخاصة بكل لغة
    switch (language) {
      case 'javascript':
      case 'typescript':
        issues.push(...this.analyzeJavaScript(code, lines));
        break;
      case 'python':
        issues.push(...this.analyzePython(code, lines));
        break;
      case 'java':
        issues.push(...this.analyzeJava(code, lines));
        break;
    }

    return issues;
  }

  /**
   * تحليل كود JavaScript/TypeScript
   */
  private analyzeJavaScript(code: string, lines: string[]): ReviewIssue[] {
    const issues: ReviewIssue[] = [];

    // فحص استخدام var بدلاً من let/const
    lines.forEach((line, index) => {
      if (line.trim().startsWith('var ')) {
        issues.push({
          id: `var-usage-${index}`,
          type: 'warning',
          category: 'best-practices',
          line: index + 1,
          message: 'استخدام var غير مُنصح به',
          description: 'استخدم let أو const بدلاً من var لتجنب مشاكل النطاق.',
          suggestedFix: 'استبدل var بـ let للمتغيرات القابلة للتغيير أو const للثوابت.',
          severity: 'medium'
        });
      }
    });

    // فحص console.log في الكود
    lines.forEach((line, index) => {
      if (line.includes('console.log')) {
        issues.push({
          id: `console-log-${index}`,
          type: 'improvement',
          category: 'clean-code',
          line: index + 1,
          message: 'وجود console.log في الكود',
          description: 'تجنب ترك console.log في كود الإنتاج.',
          suggestedFix: 'احذف console.log أو استخدم نظام logging مناسب.',
          severity: 'low'
        });
      }
    });

    // فحص الدوال الطويلة
    const functionMatches = code.match(/function\s+\w+\s*\([^)]*\)\s*{[^}]*}/g) || [];
    functionMatches.forEach((func, index) => {
      const funcLines = func.split('\n').length;
      if (funcLines > 50) {
        issues.push({
          id: `long-function-${index}`,
          type: 'warning',
          category: 'maintainability',
          message: 'دالة طويلة جداً',
          description: `الدالة تحتوي على ${funcLines} سطر. يُنصح بألا تتجاوز الدالة 30 سطر.`,
          suggestedFix: 'قم بتقسيم الدالة إلى دوال أصغر ومتخصصة.',
          severity: 'medium'
        });
      }
    });

    return issues;
  }

  /**
   * تحليل كود Python
   */
  private analyzePython(code: string, lines: string[]): ReviewIssue[] {
    const issues: ReviewIssue[] = [];

    // فحص استخدام global
    lines.forEach((line, index) => {
      if (line.trim().startsWith('global ')) {
        issues.push({
          id: `global-usage-${index}`,
          type: 'warning',
          category: 'best-practices',
          line: index + 1,
          message: 'استخدام global غير مُنصح به',
          description: 'تجنب استخدام المتغيرات العامة قدر الإمكان.',
          suggestedFix: 'مرر المتغيرات كمعاملات أو استخدم classes.',
          severity: 'medium'
        });
      }
    });

    // فحص import *
    lines.forEach((line, index) => {
      if (line.includes('import *')) {
        issues.push({
          id: `import-star-${index}`,
          type: 'warning',
          category: 'best-practices',
          line: index + 1,
          message: 'استخدام import * غير مُنصح به',
          description: 'استيراد جميع العناصر يمكن أن يسبب تضارب في الأسماء.',
          suggestedFix: 'استورد العناصر المحددة التي تحتاجها فقط.',
          severity: 'medium'
        });
      }
    });

    return issues;
  }

  /**
   * تحليل كود Java
   */
  private analyzeJava(code: string, lines: string[]): ReviewIssue[] {
    const issues: ReviewIssue[] = [];

    // فحص استخدام System.out.println
    lines.forEach((line, index) => {
      if (line.includes('System.out.println')) {
        issues.push({
          id: `system-out-${index}`,
          type: 'improvement',
          category: 'best-practices',
          line: index + 1,
          message: 'استخدام System.out.println في الكود',
          description: 'تجنب استخدام System.out.println في كود الإنتاج.',
          suggestedFix: 'استخدم نظام logging مثل Log4j أو SLF4J.',
          severity: 'low'
        });
      }
    });

    return issues;
  }

  /**
   * حساب التعقد الدوري
   */
  private calculateComplexity(code: string): number {
    let complexity = 1; // البداية من 1
    
    // عدد نقاط القرار
    const decisionPoints = [
      /\bif\b/g, /\belse\b/g, /\bwhile\b/g, /\bfor\b/g,
      /\bswitch\b/g, /\bcase\b/g, /\bcatch\b/g, /\b\?\b/g,
      /\b&&\b/g, /\b\|\|\b/g
    ];

    decisionPoints.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });

    return complexity;
  }

  /**
   * عد أسطر التعليقات
   */
  private countCommentLines(code: string): number {
    const lines = code.split('\n');
    let commentLines = 0;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || 
          trimmed.startsWith('/*') || 
          trimmed.startsWith('*') || 
          trimmed.startsWith('#') ||
          trimmed.startsWith('"""') ||
          trimmed.startsWith("'''")) {
        commentLines++;
      }
    });

    return commentLines;
  }

  /**
   * البحث عن الأسطر المكررة
   */
  private findDuplicatedLines(lines: string[]): number {
    const lineCount = new Map<string, number>();
    let duplicated = 0;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.length > 10) { // تجاهل الأسطر القصيرة
        const count = lineCount.get(trimmed) || 0;
        lineCount.set(trimmed, count + 1);
      }
    });

    lineCount.forEach(count => {
      if (count > 1) {
        duplicated += count - 1;
      }
    });

    return duplicated;
  }

  /**
   * عد الدوال
   */
  private countFunctions(code: string): number {
    const patterns = [
      /function\s+\w+/g,
      /\w+\s*:\s*function/g,
      /\w+\s*=>\s*/g,
      /def\s+\w+/g,
      /(public|private|protected)?\s*(static)?\s*\w+\s+\w+\s*\(/g
    ];

    let count = 0;
    patterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        count += matches.length;
      }
    });

    return count;
  }

  /**
   * عد الكلاسات
   */
  private countClasses(code: string): number {
    const patterns = [
      /class\s+\w+/g,
      /(public|private)?\s*class\s+\w+/g
    ];

    let count = 0;
    patterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        count += matches.length;
      }
    });

    return count;
  }

  /**
   * توليد اقتراحات التحسين
   */
  private generateSuggestions(metrics: CodeMetrics, language: string): string[] {
    const suggestions: string[] = [];

    if (metrics.commentLines / metrics.codeLines < 0.1) {
      suggestions.push('أضف المزيد من التعليقات لتوضيح الكود');
    }

    if (metrics.averageLineLength > 80) {
      suggestions.push('قلل من طول الأسطر لتحسين القابلية للقراءة');
    }

    if (metrics.cyclomaticComplexity > 10) {
      suggestions.push('قلل من تعقد الكود بتقسيم الدوال الكبيرة');
    }

    if (metrics.duplicatedLines > 5) {
      suggestions.push('تجنب تكرار الكود واستخدم دوال مشتركة');
    }

    if (metrics.functionCount === 0 && metrics.codeLines > 20) {
      suggestions.push('قسم الكود إلى دوال منفصلة لتحسين التنظيم');
    }

    return suggestions;
  }
}

interface CodeMetrics {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  emptyLines: number;
  averageLineLength: number;
  maxLineLength: number;
  cyclomaticComplexity: number;
  duplicatedLines: number;
  functionCount: number;
  classCount: number;
}