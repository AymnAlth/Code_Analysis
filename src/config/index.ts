import { AppConfig, SupportedLanguage } from '../types';

// اللغات المدعومة افتراضياً
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { id: 'javascript', name: 'JavaScript', extension: '.js', enabled: true },
  { id: 'typescript', name: 'TypeScript', extension: '.ts', enabled: true },
  { id: 'python', name: 'Python', extension: '.py', enabled: true },
  { id: 'java', name: 'Java', extension: '.java', enabled: true },
  { id: 'cpp', name: 'C++', extension: '.cpp', enabled: true },
  { id: 'csharp', name: 'C#', extension: '.cs', enabled: true },
  { id: 'go', name: 'Go', extension: '.go', enabled: true },
  { id: 'rust', name: 'Rust', extension: '.rs', enabled: true },
  { id: 'php', name: 'PHP', extension: '.php', enabled: true },
  { id: 'ruby', name: 'Ruby', extension: '.rb', enabled: true },
  { id: 'swift', name: 'Swift', extension: '.swift', enabled: true },
  { id: 'kotlin', name: 'Kotlin', extension: '.kt', enabled: true },
  { id: 'scala', name: 'Scala', extension: '.scala', enabled: true },
  { id: 'dart', name: 'Dart', extension: '.dart', enabled: true },
  { id: 'r', name: 'R', extension: '.r', enabled: true },
  { id: 'matlab', name: 'MATLAB', extension: '.m', enabled: true },
  { id: 'html', name: 'HTML', extension: '.html', enabled: true },
  { id: 'css', name: 'CSS', extension: '.css', enabled: true },
  { id: 'sql', name: 'SQL', extension: '.sql', enabled: true },
  { id: 'shell', name: 'Shell Script', extension: '.sh', enabled: true },
];

// إعدادات افتراضية للتطبيق
export const DEFAULT_CONFIG: AppConfig = {
  ai: {
    provider: 'gemini',
    apiKey: '',
    model: 'gemini-2.5-flash',
    maxTokens: 4096,
    temperature: 0.1,
  },
  review: {
    enabledCategories: [
      'clean-code',
      'performance',
      'security',
      'best-practices',
      'maintainability',
    ],
    maxFileSize: 1024 * 1024, // 1MB
    supportedLanguages: SUPPORTED_LANGUAGES,
    outputFormat: 'json',
  },
  ui: {
    theme: 'light',
    language: 'ar',
    showLineNumbers: true,
  },
};

// فئات المراجعة مع الأوصاف
export const REVIEW_CATEGORIES = {
  'clean-code': {
    name: 'نظافة الكود',
    description: 'قواعد الكتابة النظيفة والواضحة',
    color: '#10b981',
  },
  'performance': {
    name: 'الأداء',
    description: 'تحسينات الكفاءة والسرعة',
    color: '#f59e0b',
  },
  'security': {
    name: 'الأمان',
    description: 'الثغرات الأمنية والحماية',
    color: '#ef4444',
  },
  'best-practices': {
    name: 'أفضل الممارسات',
    description: 'المعايير المتبعة في الصناعة',
    color: '#3b82f6',
  },
  'maintainability': {
    name: 'قابلية الصيانة',
    description: 'سهولة التطوير والتحديث',
    color: '#8b5cf6',
  },
  'readability': {
    name: 'القابلية للقراءة',
    description: 'وضوح الكود وفهمه',
    color: '#06b6d4',
  },
  'documentation': {
    name: 'التوثيق',
    description: 'التعليقات والوثائق',
    color: '#84cc16',
  },
} as const;