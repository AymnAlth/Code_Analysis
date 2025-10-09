import React from 'react';
import { StatusCard } from './StatusCard';
import { Folder, FileText, Settings, Zap, AlertCircle } from 'lucide-react';

export function ProjectOverview() {
  const phases = [
    {
      phase: 1,
      title: 'التخطيط وتهيئة المشروع',
      description: 'إعداد الهيكل الأساسي والملفات والإعدادات',
      status: 'current' as const,
      features: [
        'هيكل مشروع منظم ومعياري',
        'نظام إدارة الإعدادات المتقدم',
        'دعم أنواع البيانات TypeScript',
        'أدوات مساعدة للملفات والتخزين',
        'واجهة أساسية قابلة للتوسع'
      ]
    },
    {
      phase: 2,
      title: 'التكامل مع نموذج الذكاء الاصطناعي',
      description: 'ربط الأداة مع Gemini API لتحليل الكود',
      status: 'pending' as const,
      features: [
        'اتصال آمن مع Gemini API',
        'معالج طلبات الذكاء الاصطناعي',
        'إدارة معدل الطلبات',
        'معالجة الأخطاء والاستثناءات'
      ]
    },
    {
      phase: 3,
      title: 'تحليل الكود الأساسي',
      description: 'تطبيق قواعد مراجعة الكود وتحليل الجودة',
      status: 'pending' as const,
      features: [
        'تحليل نظافة الكود',
        'فحص الأداء والكفاءة',
        'اكتشاف الثغرات الأمنية',
        'دعم لغات برمجة متعددة'
      ]
    },
    {
      phase: 4,
      title: 'نظام الملاحظات',
      description: 'عرض النتائج والتوصيات بشكل منظم',
      status: 'pending' as const,
    },
    {
      phase: 5,
      title: 'واجهة الاستخدام',
      description: 'واجهة متقدمة لتحميل الملفات ومراجعتها',
      status: 'pending' as const,
    },
    {
      phase: 6,
      title: 'الاختبارات والجودة',
      description: 'ضمان جودة الكود واختباره',
      status: 'pending' as const,
    },
    {
      phase: 7,
      title: 'التوسعة المستقبلية',
      description: 'ميزات متقدمة وتكامل مع أنظمة أخرى',
      status: 'pending' as const,
    }
  ];

  const currentPhaseStats = {
    filesCreated: 8,
    modulesImplemented: 4,
    typesDefinitions: 12,
    utilityFunctions: 15
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* حالة المرحلة الحالية */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">المرحلة 1 مكتملة!</h2>
            <p className="text-blue-100">
              تم إنشاء الهيكل الأساسي للمشروع بنجاح
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">100%</div>
            <div className="text-blue-200 text-sm">المرحلة الأولى</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <FileText className="h-8 w-8 text-blue-200" />
            </div>
            <div className="text-2xl font-bold">{currentPhaseStats.filesCreated}</div>
            <div className="text-blue-200 text-sm">ملف تم إنشاؤه</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Folder className="h-8 w-8 text-blue-200" />
            </div>
            <div className="text-2xl font-bold">{currentPhaseStats.modulesImplemented}</div>
            <div className="text-blue-200 text-sm">وحدة أساسية</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Zap className="h-8 w-8 text-blue-200" />
            </div>
            <div className="text-2xl font-bold">{currentPhaseStats.typesDefinitions}</div>
            <div className="text-blue-200 text-sm">نوع بيانات</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Settings className="h-8 w-8 text-blue-200" />
            </div>
            <div className="text-2xl font-bold">{currentPhaseStats.utilityFunctions}</div>
            <div className="text-blue-200 text-sm">دالة مساعدة</div>
          </div>
        </div>
      </div>

      {/* خارطة طريق المشروع */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">خارطة طريق المشروع</h2>
        <div className="grid gap-6">
          {phases.map((phase) => (
            <StatusCard
              key={phase.phase}
              phase={phase.phase}
              title={phase.title}
              description={phase.description}
              status={phase.status}
              features={phase.features}
            />
          ))}
        </div>
      </div>

      {/* الخطوات التالية */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="mr-3">
            <h3 className="text-lg font-medium text-amber-800">
              جاهز للمرحلة التالية!
            </h3>
            <p className="text-amber-700 mt-1">
              تم إكمال هيكل المشروع الأساسي. يمكنك الآن المتابعة للمرحلة الثانية 
              لتطبيق التكامل مع نموذج الذكاء الاصطناعي.
            </p>
            <p className="text-amber-600 mt-2 font-medium">
              أرسل "تابع المرحلة التالية" للانتقال إلى المرحلة 2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}