import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { CodeReviewPage } from './components/CodeReviewPage';
import { SettingsPage } from './components/SettingsPage';
import { ReviewHistory } from './components/ReviewHistory';
import { Dashboard } from './components/Dashboard';
import { ThemeProvider } from './components/ThemeProvider';
import { NotificationSystem } from './components/NotificationSystem';
import { ConfigManager } from './core/ConfigManager';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'review' | 'settings' | 'history' | 'about'>('dashboard');
  
  // تهيئة مدير الإعدادات
  React.useEffect(() => {
    const configManager = ConfigManager.getInstance();
    console.log('تم تهيئة مدير الإعدادات:', configManager.getConfig());
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'review':
        return <CodeReviewPage />;
      case 'settings':
        return <SettingsPage />;
      case 'history':
        return <ReviewHistory />;
      case 'about':
        return (
          <div className="max-w-3xl mx-auto" dir="rtl">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">حول أداة مراجعة الكود الذكي</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  أداة متقدمة لمراجعة الكود آلياً باستخدام الذكاء الاصطناعي. 
                  تهدف لمساعدة المطورين في تحسين جودة أكوادهم وتطبيق أفضل الممارسات.
                </p>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">الميزات المخطط لها:</h3>
                  <ul className="space-y-1">
                    <li>• مراجعة شاملة للكود (نظافة، أداء، أمان)</li>
                    <li>• دعم لغات برمجة متعددة</li>
                    <li>• تقارير تفصيلية مع اقتراحات التحسين</li>
                    <li>• تكامل مع أنظمة إدارة الإصدارات</li>
                    <li>• واجهة سهلة الاستخدام</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-blue-800 font-medium">المرحلة الحالية: 2 من 7</p>
                  <p className="text-blue-600 text-sm mt-1">تم إكمال التكامل مع الذكاء الاصطناعي</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <CodeReviewPage />;
    }
  };

  return (
    <ThemeProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderCurrentPage()}
        <NotificationSystem />
      </Layout>
    </ThemeProvider>
  );
}

export default App;