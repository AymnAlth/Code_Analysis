// أنواع البيانات الأساسية للأداة
export interface CodeReviewResult {
  id: string;
  filename: string;
  language: string;
  timestamp: Date;
  analysis: {
    warnings: ReviewIssue[];
    errors: ReviewIssue[];
    improvements: ReviewIssue[];
  };
  overallScore: number;
  summary: string;
  codeQuality?: {
    maintainability: number;
    readability: number;
    performance: number;
    security: number;
  };
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  bestPractices?: string[];
  metrics?: AdvancedCodeMetrics;
}

export interface AdvancedCodeMetrics {
  // مقاييس أساسية
  totalLines: number;
  codeLines: number;
  commentLines: number;
  emptyLines: number;
  
  // مقاييس متقدمة
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  maintainabilityIndex: number;
  technicalDebt: number;
  
  // مقاييس الجودة
  duplicatedLines: number;
  duplicatedBlocks: number;
  codeSmells: number;
  
  // مقاييس الهيكل
  functionCount: number;
  classCount: number;
  interfaceCount: number;
  moduleCount: number;
  
  // مقاييس الأداء
  nestedLoops: number;
  recursiveFunctions: number;
  largeClasses: number;
  longMethods: number;
  
  // مقاييس الأمان
  hardcodedSecrets: number;
  sqlInjectionRisks: number;
  xssVulnerabilities: number;
  
  // مقاييس التوثيق
  documentedFunctions: number;
  todoComments: number;
  fixmeComments: number;
}

export interface CodePattern {
  type: 'design_pattern' | 'anti_pattern' | 'code_smell';
  name: string;
  description: string;
  location: { line: number; column: number };
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}
export interface ReviewIssue {
  id: string;
  type: 'warning' | 'error' | 'improvement';
  category: ReviewCategory;
  line?: number;
  column?: number;
  message: string;
  description: string;
  suggestedFix?: string;
  codeExample?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export type ReviewCategory = 
  | 'clean-code'
  | 'performance' 
  | 'security'
  | 'best-practices'
  | 'maintainability'
  | 'readability'
  | 'documentation';

export interface SupportedLanguage {
  id: string;
  name: string;
  extension: string;
  enabled: boolean;
}

export interface AppConfig {
  ai: {
    provider: 'gemini' | 'openai' | 'claude';
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  review: {
    enabledCategories: ReviewCategory[];
    maxFileSize: number;
    supportedLanguages: SupportedLanguage[];
    outputFormat: 'json' | 'markdown' | 'html';
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: 'ar' | 'en';
    showLineNumbers: boolean;
  };
}