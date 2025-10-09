import React, { useCallback, useState } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';
import { detectLanguage, validateFileContent, readFileAsText } from '../utils/fileUtils';
import { ConfigManager } from '../core/ConfigManager';

interface FileUploaderProps {
  onFileSelect: (file: File, content: string, language: string) => void;
  isLoading?: boolean;
}

export function FileUploader({ onFileSelect, isLoading }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const configManager = ConfigManager.getInstance();
  const config = configManager.getConfig();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = async (file: File) => {
    setError('');
    setSuccess('');

    try {
      // التحقق من نوع الملف
      const language = detectLanguage(file.name, config.review.supportedLanguages);
      if (!language) {
        setError(`نوع الملف غير مدعوم: ${file.name}`);
        return;
      }

      // قراءة محتوى الملف
      const content = await readFileAsText(file);
      
      // التحقق من صحة المحتوى
      const validation = validateFileContent(content, config.review.maxFileSize);
      if (!validation.isValid) {
        setError(validation.error || 'الملف غير صحيح');
        return;
      }

      setSelectedFile(file);
      setSuccess(`تم تحديد الملف: ${file.name} (${language.name})`);
      onFileSelect(file, content, language.id);

    } catch (error) {
      setError('فشل في قراءة الملف: ' + (error as Error).message);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setError('');
    setSuccess('');
  };

  const supportedExtensions = config.review.supportedLanguages
    .filter(lang => lang.enabled)
    .map(lang => lang.extension)
    .join(', ');

  return (
    <div className="space-y-4" dir="rtl">
      {/* منطقة رفع الملفات */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-slate-300 hover:border-slate-400'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept={supportedExtensions}
          disabled={isLoading}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`h-12 w-12 ${dragActive ? 'text-blue-500' : 'text-slate-400'}`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-slate-900">
              اسحب وأفلت ملف الكود هنا
            </p>
            <p className="text-slate-600 mt-1">
              أو انقر لتحديد ملف من جهازك
            </p>
          </div>
          
          <div className="text-sm text-slate-500">
            <p>الأنواع المدعومة: {supportedExtensions}</p>
            <p>الحد الأقصى للحجم: {Math.round(config.review.maxFileSize / 1024 / 1024)} ميجابايت</p>
          </div>
        </div>
      </div>

      {/* الملف المحدد */}
      {selectedFile && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <File className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">{selectedFile.name}</p>
                <p className="text-sm text-green-700">
                  {(selectedFile.size / 1024).toFixed(1)} كيلوبايت
                </p>
              </div>
            </div>
            <button
              onClick={clearSelection}
              className="text-green-600 hover:text-green-800 transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* رسائل النجاح والخطأ */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}