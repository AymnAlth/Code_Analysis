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
  metrics?: {
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
  };
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