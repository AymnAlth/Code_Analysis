import React, { useState } from 'react';
import { Settings, Palette, Globe, Shield, Zap, Save, RotateCcw } from 'lucide-react';
import { ConfigManager } from '../core/ConfigManager';
import { useTheme } from './ThemeProvider';
import { notify } from './NotificationSystem';

export function SettingsPage() {
  const configManager = ConfigManager.getInstance();
  const { theme, setTheme } = useTheme();
  const [config, setConfig] = useState(configManager.getConfig());

  const handleSave = () => {
    configManager.saveConfig(config);
    notify.success('تم حفظ الإعدادات بنجاح');
  };

  const handleReset = () => {
    configManager.resetToDefault();
    setConfig(configManager.getConfig());
    notify.info('تم إعادة تعيين الإعدادات للافتراضية');
  };

  const updateConfig = (section: keyof typeof config, updates: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8" dir="rtl">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <Settings className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">إعدادات الأداة</h1>
        </div>

        <div className="space-y-8">
          {/* إعدادات الواجهة */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Palette className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-900">الواجهة والمظهر</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  المظهر
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="light">فاتح</option>
                  <option value="dark">مظلم</option>
                  <option value="auto">تلقائي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  اللغة
                </label>
                <select
                  value={config.ui.language}
                  onChange={(e) => updateConfig('ui', { language: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={config.ui.showLineNumbers}
                    onChange={(e) => updateConfig('ui', { showLineNumbers: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    إظهار أرقام الأسطر في محرر الكود
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* إعدادات الذكاء الاصطناعي */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Zap className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-slate-900">الذكاء الاصطناعي</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  النموذج
                </label>
                <select
                  value={config.ai.model}
                  onChange={(e) => updateConfig('ai', { model: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  الحد الأقصى للرموز: {config.ai.maxTokens}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="8192"
                  step="256"
                  value={config.ai.maxTokens}
                  onChange={(e) => updateConfig('ai', { maxTokens: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  درجة الحرارة: {config.ai.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.ai.temperature}
                  onChange={(e) => updateConfig('ai', { temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-1">
                  قيمة أقل = إجابات أكثر دقة، قيمة أعلى = إجابات أكثر إبداعاً
                </p>
              </div>
            </div>
          </div>

          {/* إعدادات المراجعة */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Shield className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">إعدادات المراجعة</h2>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  الحد الأقصى لحجم الملف (ميجابايت)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.review.maxFileSize / (1024 * 1024)}
                  onChange={(e) => updateConfig('review', { 
                    maxFileSize: parseInt(e.target.value) * 1024 * 1024 
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  فئات المراجعة المفعلة
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'clean-code', name: 'نظافة الكود' },
                    { id: 'performance', name: 'الأداء' },
                    { id: 'security', name: 'الأمان' },
                    { id: 'best-practices', name: 'أفضل الممارسات' },
                    { id: 'maintainability', name: 'قابلية الصيانة' },
                    { id: 'readability', name: 'القابلية للقراءة' },
                    { id: 'documentation', name: 'التوثيق' }
                  ].map((category) => (
                    <label key={category.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                      <input
                        type="checkbox"
                        checked={config.review.enabledCategories.includes(category.id as any)}
                        onChange={(e) => {
                          const categories = e.target.checked
                            ? [...config.review.enabledCategories, category.id]
                            : config.review.enabledCategories.filter(c => c !== category.id);
                          updateConfig('review', { enabledCategories: categories });
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>إعادة تعيين</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>حفظ الإعدادات</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}