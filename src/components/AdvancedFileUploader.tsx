import React, { useState, useCallback } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle, FolderOpen, Plus } from 'lucide-react';
import { detectLanguage, validateFileContent, readFileAsText } from '../utils/fileUtils';
import { ConfigManager } from '../core/ConfigManager';
import { CodeEditor } from './CodeEditor';
import { notify } from './NotificationSystem';

interface FileData {
  file: File;
  content: string;
  language: string;
  id: string;
}

interface AdvancedFileUploaderProps {
  onFilesSelect: (files: FileData[]) => void;
  isLoading?: boolean;
  maxFiles?: number;
}

export function AdvancedFileUploader({ 
  onFilesSelect, 
  isLoading, 
  maxFiles = 5 
}: AdvancedFileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
  const [previewFile, setPreviewFile] = useState<FileData | null>(null);

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

    const files = Array.from(e.dataTransfer.files);
    handleMultipleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleMultipleFiles(files);
    }
  };

  const handleMultipleFiles = async (files: File[]) => {
    if (selectedFiles.length + files.length > maxFiles) {
      notify.warning(`يمكن رفع ${maxFiles} ملفات كحد أقصى`);
      return;
    }

    const loadingToast = notify.loading('جاري تحميل الملفات...');

    try {
      const newFiles: FileData[] = [];

      for (const file of files) {
        // التحقق من نوع الملف
        const language = detectLanguage(file.name, config.review.supportedLanguages);
        if (!language) {
          notify.warning(`نوع الملف غير مدعوم: ${file.name}`);
          continue;
        }

        // قراءة محتوى الملف
        const content = await readFileAsText(file);
        
        // التحقق من صحة المحتوى
        const validation = validateFileContent(content, config.review.maxFileSize);
        if (!validation.isValid) {
          notify.error(`${file.name}: ${validation.error}`);
          continue;
        }

        newFiles.push({
          file,
          content,
          language: language.id,
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
      }

      if (newFiles.length > 0) {
        const updatedFiles = [...selectedFiles, ...newFiles];
        setSelectedFiles(updatedFiles);
        onFilesSelect(updatedFiles);
        notify.success(`تم تحميل ${newFiles.length} ملف بنجاح`);
      }

    } catch (error) {
      notify.error('فشل في تحميل الملفات: ' + (error as Error).message);
    } finally {
      notify.dismiss(loadingToast);
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = selectedFiles.filter(f => f.id !== id);
    setSelectedFiles(updatedFiles);
    onFilesSelect(updatedFiles);
    
    if (previewFile?.id === id) {
      setPreviewFile(null);
    }
    
    notify.info('تم حذف الملف');
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    setPreviewFile(null);
    onFilesSelect([]);
    notify.info('تم مسح جميع الملفات');
  };

  const supportedExtensions = config.review.supportedLanguages
    .filter(lang => lang.enabled)
    .map(lang => lang.extension)
    .join(', ');

  return (
    <div className="space-y-6" dir="rtl">
      {/* منطقة رفع الملفات */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${dragActive 
            ? 'border-blue-400 bg-blue-50 scale-105' 
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
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
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept={supportedExtensions}
          disabled={isLoading}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-slate-100'}`}>
              <Upload className={`h-8 w-8 ${dragActive ? 'text-blue-500' : 'text-slate-400'}`} />
            </div>
          </div>
          
          <div>
            <p className="text-xl font-semibold text-slate-900 mb-2">
              {dragActive ? 'أفلت الملفات هنا' : 'اسحب وأفلت ملفات الكود'}
            </p>
            <p className="text-slate-600">
              أو انقر لتحديد ملفات متعددة (حتى {maxFiles} ملفات)
            </p>
          </div>
          
          <div className="text-sm text-slate-500 space-y-1">
            <p>الأنواع المدعومة: {supportedExtensions}</p>
            <p>الحد الأقصى للحجم: {Math.round(config.review.maxFileSize / 1024 / 1024)} ميجابايت لكل ملف</p>
          </div>
        </div>
      </div>

      {/* الملفات المحددة */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              الملفات المحددة ({selectedFiles.length})
            </h3>
            <button
              onClick={clearAllFiles}
              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
              disabled={isLoading}
            >
              مسح الكل
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedFiles.map((fileData) => (
              <div
                key={fileData.id}
                className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <File className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900 truncate max-w-32">
                        {fileData.file.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {fileData.language} • {(fileData.file.size / 1024).toFixed(1)} كيلوبايت
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(fileData.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => setPreviewFile(fileData)}
                    className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    معاينة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* معاينة الملف */}
      {previewFile && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">معاينة الملف</h3>
            <button
              onClick={() => setPreviewFile(null)}
              className="text-slate-600 hover:text-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <CodeEditor
            code={previewFile.content}
            language={previewFile.language}
            filename={previewFile.file.name}
            showLineNumbers={true}
            readOnly={true}
          />
        </div>
      )}
    </div>
  );
}