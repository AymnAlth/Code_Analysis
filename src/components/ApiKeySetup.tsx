import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { ConfigManager } from '../core/ConfigManager';
import { AIService } from '../core/AIService';

interface ApiKeySetupProps {
  onConfigured: () => void;
}

export function ApiKeySetup({ onConfigured }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [error, setError] = useState('');

  const configManager = ConfigManager.getInstance();
  const aiService = AIService.getInstance();

  useEffect(() => {
    // تحميل المفتاح المحفوظ إن وجد
    const config = configManager.getConfig();
    if (config.ai.apiKey) {
      setApiKey(config.ai.apiKey);
      setValidationStatus('valid');
    }
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      setError('يرجى إدخال مفتاح API');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      // حفظ المفتاح
      aiService.updateApiKey(apiKey.trim());
      
      // التحقق من صحة الاتصال
      const isValid = await aiService.validateConnection();
      
      if (isValid) {
        setValidationStatus('valid');
        onConfigured();
      } else {
        setValidationStatus('invalid');
        setError('مفتاح API غير صحيح أو لا يمكن الوصول للخدمة');
      }
    } catch (error) {
      setValidationStatus('invalid');
      setError('خطأ في التحقق من المفتاح: ' + (error as Error).message);
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyChange = (value: string) => {
    setApiKey(value);
    setValidationStatus('idle');
    setError('');
  };

  if (validationStatus === 'valid' && aiService.isConfigured()) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6" dir="rtl">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-green-900">
            تم تكوين API بنجاح
          </h3>
        </div>
        <p className="text-green-700 mb-4">
          الأداة جاهزة الآن لمراجعة الكود باستخدام Gemini AI
        </p>
        <button
          onClick={() => setValidationStatus('idle')}
          className="text-green-600 hover:text-green-800 text-sm font-medium"
        >
          تغيير المفتاح
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6" dir="rtl">
      <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
        <Key className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">
          إعداد مفتاح Gemini API
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-slate-600 mb-4">
            لاستخدام الأداة، تحتاج إلى مفتاح API من Google AI Studio
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-900 mb-2">كيفية الحصول على المفتاح:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. اذهب إلى Google AI Studio</li>
              <li>2. قم بتسجيل الدخول بحساب Google</li>
              <li>3. انقر على "Get API Key"</li>
              <li>4. انسخ المفتاح والصقه هنا</li>
            </ol>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 rtl:space-x-reverse text-blue-600 hover:text-blue-800 mt-2 text-sm font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              <span>فتح Google AI Studio</span>
            </a>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            مفتاح API
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
              disabled={isValidating}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSaveKey}
          disabled={!apiKey.trim() || isValidating}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isValidating ? 'جاري التحقق...' : 'حفظ والتحقق من المفتاح'}
        </button>
      </div>
    </div>
  );
}