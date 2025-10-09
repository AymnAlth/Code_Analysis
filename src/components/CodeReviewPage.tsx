import React, { useState } from 'react';
import { ApiKeySetup } from './ApiKeySetup';
import { AdvancedFileUploader } from './AdvancedFileUploader';
import { ReviewResults } from './ReviewResults';
import { AIService } from '../core/AIService';
import { CodeReviewResult } from '../types';
import { saveReviewResult } from '../utils/storage';
import { Loader2, RefreshCw } from 'lucide-react';
import { notify } from './NotificationSystem';

interface FileData {
  file: File;
  content: string;
  language: string;
  id: string;
}

export function CodeReviewPage() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentResults, setCurrentResults] = useState<CodeReviewResult[]>([]);
  const [error, setError] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);

  const aiService = AIService.getInstance();

  React.useEffect(() => {
    setIsConfigured(aiService.isConfigured());
  }, []);

  const handleFilesSelect = async (files: FileData[]) => {
    setSelectedFiles(files);
    if (files.length === 0) {
      setCurrentResults([]);
      return;
    }
  };

  const handleStartReview = async () => {
    if (selectedFiles.length === 0) {
      notify.warning('يرجى تحديد ملف واحد على الأقل');
      return;
    }

    setIsReviewing(true);
    setError('');
    setCurrentResults([]);

    const loadingToast = notify.loading(`جاري مراجعة ${selectedFiles.length} ملف...`);

    try {
      const results: CodeReviewResult[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const fileData = selectedFiles[i];
        notify.dismiss(loadingToast);
        const currentToast = notify.loading(`مراجعة ${fileData.file.name} (${i + 1}/${selectedFiles.length})`);
        
        try {
          const result = await aiService.reviewCode(
            fileData.file.name, 
            fileData.content, 
            fileData.language
          );
          results.push(result);
          saveReviewResult(result);
        } catch (fileError) {
          notify.error(`فشل في مراجعة ${fileData.file.name}: ${(fileError as Error).message}`);
        }
        
        notify.dismiss(currentToast);
      }

      setCurrentResults(results);
      
      if (results.length > 0) {
        notify.success(`تم مراجعة ${results.length} ملف بنجاح`);
      }
      
    } catch (error) {
      setError('فشل في مراجعة الكود: ' + (error as Error).message);
      notify.error('فشل في مراجعة الملفات');
    } finally {
      setIsReviewing(false);
      notify.dismiss(loadingToast);
    }
  };

  const handleNewReview = () => {
    setCurrentResults([]);
    setSelectedFiles([]);
    setError('');
  };

  if (!isConfigured) {
    return (
      <div className="max-w-2xl mx-auto">
        <ApiKeySetup onConfigured={() => setIsConfigured(true)} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {currentResults.length === 0 && !isReviewing && (
        <>
          <div className="text-center" dir="rtl">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              مراجعة الكود الآلية
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              ارفع ملفات الكود الخاصة بك وسيقوم الذكاء الاصطناعي بمراجعتها 
              وتقديم ملاحظات مفصلة لتحسين الجودة والأداء (حتى 5 ملفات)
            </p>
          </div>
          
          <AdvancedFileUploader 
            onFilesSelect={handleFilesSelect}
            isLoading={isReviewing}
            maxFiles={5}
          />

          {selectedFiles.length > 0 && (
            <div className="text-center">
              <button
                onClick={handleStartReview}
                disabled={isReviewing}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                بدء مراجعة {selectedFiles.length} ملف
              </button>
            </div>
          )}
        </>
      )}

      {isReviewing && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            جاري مراجعة الكود...
          </h3>
          <p className="text-slate-600">
            يتم تحليل الكود باستخدام الذكاء الاصطناعي، يرجى الانتظار
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6" dir="rtl">
          <h3 className="text-lg font-semibold text-red-900 mb-2">حدث خطأ</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={handleNewReview}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            المحاولة مرة أخرى
          </button>
        </div>
      )}

      {currentResults.length > 0 && (
        <>
          <div className="flex justify-between items-center" dir="rtl">
            <h2 className="text-2xl font-bold text-slate-900">
              نتائج المراجعة ({currentResults.length} ملف)
            </h2>
            <button
              onClick={handleNewReview}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>مراجعة جديدة</span>
            </button>
          </div>
          
          <div className="space-y-8">
            {currentResults.map((result, index) => (
              <div key={result.id} className="border-b border-slate-200 pb-8 last:border-b-0">
                <ReviewResults result={result} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}