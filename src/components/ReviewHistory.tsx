import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Trash2, FileText, Calendar, Star, Download } from 'lucide-react';
import { CodeReviewResult } from '../types';
import { getStoredResults, deleteReviewResult, clearAllResults, searchResults, filterResultsByLanguage } from '../utils/storage';
import { ReviewResults } from './ReviewResults';
import { ReviewComparison } from './ReviewComparison';
import { ExportOptions } from './ExportOptions';
import { notify } from './NotificationSystem';

export function ReviewHistory() {
  const [results, setResults] = useState<CodeReviewResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<CodeReviewResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'filename'>('date');
  const [selectedResult, setSelectedResult] = useState<CodeReviewResult | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareResults, setCompareResults] = useState<CodeReviewResult[]>([]);

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    filterAndSortResults();
  }, [results, searchQuery, selectedLanguage, sortBy]);

  const loadResults = () => {
    const storedResults = getStoredResults();
    setResults(storedResults);
  };

  const filterAndSortResults = () => {
    let filtered = [...results];

    // البحث النصي
    if (searchQuery.trim()) {
      filtered = searchResults(searchQuery);
    }

    // فلترة حسب اللغة
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(result => result.language === selectedLanguage);
    }

    // الترتيب
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'score':
          return b.overallScore - a.overallScore;
        case 'filename':
          return a.filename.localeCompare(b.filename);
        default:
          return 0;
      }
    });

    setFilteredResults(filtered);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المراجعة؟')) {
      deleteReviewResult(id);
      loadResults();
      notify.success('تم حذف المراجعة');
    }
  };

  const handleClearAll = () => {
    if (confirm('هل أنت متأكد من حذف جميع المراجعات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      clearAllResults();
      loadResults();
      setSelectedResult(null);
      setCompareResults([]);
      notify.success('تم حذف جميع المراجعات');
    }
  };

  const handleCompareToggle = (result: CodeReviewResult) => {
    if (compareResults.find(r => r.id === result.id)) {
      setCompareResults(compareResults.filter(r => r.id !== result.id));
    } else if (compareResults.length < 2) {
      setCompareResults([...compareResults, result]);
    } else {
      notify.warning('يمكن مقارنة مراجعتين فقط في المرة الواحدة');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const uniqueLanguages = [...new Set(results.map(r => r.language))];

  if (selectedResult) {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedResult(null)}
            className="flex items-center space-x-2 rtl:space-x-reverse text-blue-600 hover:text-blue-800 transition-colors"
          >
            <History className="h-4 w-4" />
            <span>العودة للسجل</span>
          </button>
          <ExportOptions results={[selectedResult]} />
        </div>
        <ReviewResults result={selectedResult} />
      </div>
    );
  }

  if (compareMode && compareResults.length === 2) {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setCompareMode(false);
              setCompareResults([]);
            }}
            className="flex items-center space-x-2 rtl:space-x-reverse text-blue-600 hover:text-blue-800 transition-colors"
          >
            <History className="h-4 w-4" />
            <span>العودة للسجل</span>
          </button>
        </div>
        <ReviewComparison results={compareResults} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <History className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">سجل المراجعات</h1>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {compareResults.length === 2 && (
              <button
                onClick={() => setCompareMode(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                مقارنة المراجعات
              </button>
            )}
            {results.length > 0 && (
              <button
                onClick={handleClearAll}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1 rtl:space-x-reverse"
              >
                <Trash2 className="h-4 w-4" />
                <span>مسح الكل</span>
              </button>
            )}
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{results.length}</div>
            <div className="text-sm text-blue-800">إجمالي المراجعات</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length) : 0}
            </div>
            <div className="text-sm text-green-800">متوسط النتيجة</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{uniqueLanguages.length}</div>
            <div className="text-sm text-purple-800">اللغات المستخدمة</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {results.length > 0 ? new Date(Math.max(...results.map(r => r.timestamp.getTime()))).toLocaleDateString('ar-SA') : '-'}
            </div>
            <div className="text-sm text-yellow-800">آخر مراجعة</div>
          </div>
        </div>
      </div>

      {/* أدوات البحث والفلترة */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="البحث في المراجعات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">جميع اللغات</option>
            {uniqueLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date">ترتيب حسب التاريخ</option>
            <option value="score">ترتيب حسب النتيجة</option>
            <option value="filename">ترتيب حسب اسم الملف</option>
          </select>

          <div className="text-sm text-slate-600 flex items-center">
            <Filter className="h-4 w-4 ml-1" />
            {filteredResults.length} من {results.length} نتيجة
          </div>
        </div>
      </div>

      {/* قائمة النتائج */}
      {filteredResults.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {results.length === 0 ? 'لا توجد مراجعات محفوظة' : 'لا توجد نتائج مطابقة'}
          </h3>
          <p className="text-slate-600">
            {results.length === 0 
              ? 'ابدأ بمراجعة بعض ملفات الكود لرؤية النتائج هنا'
              : 'جرب تغيير معايير البحث أو الفلترة'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <div key={result.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{result.filename}</h3>
                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-slate-600">
                      <span className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Calendar className="h-4 w-4" />
                        <span>{result.timestamp.toLocaleString('ar-SA')}</span>
                      </span>
                      <span className="bg-slate-100 px-2 py-1 rounded">{result.language}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.overallScore)}`}>
                    {result.overallScore}/100
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {compareMode && (
                      <button
                        onClick={() => handleCompareToggle(result)}
                        className={`p-2 rounded-lg transition-colors ${
                          compareResults.find(r => r.id === result.id)
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="إضافة للمقارنة"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedResult(result)}
                      className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      عرض التفاصيل
                    </button>
                    
                    <button
                      onClick={() => handleDelete(result.id)}
                      className="text-red-600 hover:text-red-800 p-1 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-600">
                <p className="line-clamp-2">{result.summary}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs">
                  <span className="text-red-600">
                    {result.analysis.errors.length} أخطاء
                  </span>
                  <span className="text-yellow-600">
                    {result.analysis.warnings.length} تحذيرات
                  </span>
                  <span className="text-blue-600">
                    {result.analysis.improvements.length} تحسينات
                  </span>
                </div>

                {!compareMode && (
                  <button
                    onClick={() => setCompareMode(true)}
                    className="text-purple-600 hover:text-purple-800 text-xs transition-colors"
                  >
                    تفعيل وضع المقارنة
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* تصدير النتائج */}
      {filteredResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">تصدير النتائج</h3>
            <ExportOptions results={filteredResults} />
          </div>
        </div>
      )}
    </div>
  );
}