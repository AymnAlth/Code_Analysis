import { SupportedLanguage } from '../types';

/**
 * استخراج امتداد الملف
 */
export function getFileExtension(filename: string): string {
  const match = filename.match(/\.([^.]+)$/);
  return match ? `.${match[1]}` : '';
}

/**
 * تحديد لغة البرمجة من امتداد الملف
 */
export function detectLanguage(
  filename: string, 
  supportedLanguages: SupportedLanguage[]
): SupportedLanguage | null {
  const extension = getFileExtension(filename);
  return supportedLanguages.find(lang => 
    lang.extension === extension && lang.enabled
  ) || null;
}

/**
 * تنسيق حجم الملف
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * التحقق من صحة محتوى الملف
 */
export function validateFileContent(content: string, maxSize: number): {
  isValid: boolean;
  error?: string;
} {
  if (!content || content.trim().length === 0) {
    return { isValid: false, error: 'الملف فارغ' };
  }

  const sizeInBytes = new Blob([content]).size;
  if (sizeInBytes > maxSize) {
    return { 
      isValid: false, 
      error: `حجم الملف كبير جداً (${formatFileSize(sizeInBytes)} > ${formatFileSize(maxSize)})`
    };
  }

  return { isValid: true };
}

/**
 * قراءة ملف كنص
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string || '');
    };
    reader.onerror = (error) => {
      reject(new Error('فشل في قراءة الملف: ' + error));
    };
    reader.readAsText(file);
  });
}

/**
 * تنظيف اسم الملف
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9\-_.]/g, '_');
}

/**
 * إنشاء ID فريد للملف
 */
export function generateFileId(filename: string, content: string): string {
  const timestamp = Date.now();
  const hash = content.slice(0, 100); // استخدم جزء من المحتوى
  return `${sanitizeFilename(filename)}_${timestamp}_${btoa(hash).slice(0, 8)}`;
}