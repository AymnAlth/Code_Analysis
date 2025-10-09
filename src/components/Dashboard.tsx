import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getResultsStats } from '../utils/storage';

export function Dashboard() {
  const stats = getResultsStats();

  // بيانات وهمية للرسوم البيانية (في التطبيق الحقيقي ستأتي من البيانات المحفوظة)
  const languageData = Object.entries(stats.languages).map(([lang, count]) => ({
    name: lang,
    count
  }));

  const scoreData = [
    { name: 'ممتاز (90-100)', count: 2, color: '#10b981' },
    { name: 'جيد (70-89)', count: 5, color: '#3b82f6' },
    { name: 'متوسط (50-69)', count: 3, color: '#f59e0b' },
    { name: 'ضعيف (0-49)', count: 1, color: '#ef4444' }
  ];

  const trendData = [
    { month: 'يناير', score: 65 },
    { month: 'فبراير', score: 72 },
    { month: 'مارس', score: 78 },
    { month: 'أبريل', score: 85 },
    { month: 'مايو', score: 88 }
  ];

  return (
    <div className="space-y-8" dir="rtl">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">إجمالي المراجعات</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalReviews}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% من الشهر الماضي</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">متوسط النتيجة</p>
              <p className="text-2xl font-bold text-slate-900">{stats.averageScore}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+5.2 نقطة</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">اللغات المدعومة</p>
              <p className="text-2xl font-bold text-slate-900">{Object.keys(stats.languages).length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-600">JavaScript, Python, Java...</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">آخر مراجعة</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.lastReview ? 'اليوم' : 'لا توجد'}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-slate-600">
              {stats.lastReview ? stats.lastReview.toLocaleDateString('ar-SA') : 'ابدأ أول مراجعة'}
            </span>
          </div>
        </div>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* توزيع اللغات */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">توزيع اللغات</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={languageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* توزيع النتائج */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">توزيع النتائج</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {scoreData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* اتجاه التحسن */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">اتجاه التحسن</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* نصائح وتوصيات */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">نصائح لتحسين جودة الكود</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800">الأمان</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• تجنب استخدام eval() في JavaScript</li>
              <li>• استخدم prepared statements في SQL</li>
              <li>• تحقق من صحة المدخلات دائماً</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800">الأداء</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• تجنب الحلقات المعقدة والمتداخلة</li>
              <li>• استخدم الذاكرة بكفاءة</li>
              <li>• قم بتحسين استعلامات قاعدة البيانات</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}