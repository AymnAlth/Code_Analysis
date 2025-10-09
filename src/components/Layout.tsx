import React from 'react';
import { Code, Settings, History, Info, BarChart3, FileText } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: 'dashboard' | 'review' | 'settings' | 'history' | 'about';
  onPageChange?: (page: 'dashboard' | 'review' | 'settings' | 'history' | 'about') => void;
}

export function Layout({ children, currentPage = 'dashboard', onPageChange }: LayoutProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: BarChart3 },
    { id: 'review', label: 'مراجعة الكود', icon: Code },
    { id: 'history', label: 'السجل', icon: History },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
    { id: 'about', label: 'حول الأداة', icon: Info },
  ] as const;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-slate-50 to-slate-100'
    }`}>
      {/* Header */}
      <header className={`shadow-sm border-b transition-colors duration-200 ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold transition-colors duration-200 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  مراجع الكود الذكي
                </h1>
                <p className={`text-sm transition-colors duration-200 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  مراجعة آلية للكود بالذكاء الاصطناعي
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                المرحلة 5
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`shadow-sm transition-colors duration-200 ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 rtl:space-x-reverse" dir="rtl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange?.(item.id)}
                  className={`
                    flex items-center space-x-2 rtl:space-x-reverse px-4 py-3 text-sm font-medium
                    border-b-2 transition-all duration-200 rounded-t-lg
                    ${isActive
                      ? `border-blue-500 text-blue-600 ${isDark ? 'bg-slate-700' : 'bg-blue-50'}`
                      : `border-transparent transition-colors duration-200 ${
                          isDark 
                            ? 'text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-700' 
                            : 'text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                        }`
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
        {children}
      </main>

      {/* Footer */}
      <footer className={`border-t mt-12 transition-colors duration-200 ${
        isDark 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`text-center text-sm transition-colors duration-200 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <p>أداة مراجعة الكود الآلية • المرحلة 5: واجهة الاستخدام المتقدمة</p>
            <p className="mt-1">تم البناء بـ React + TypeScript + Gemini AI • جاهز للاستخدام الكامل</p>
          </div>
        </div>
      </footer>
    </div>
  );
}