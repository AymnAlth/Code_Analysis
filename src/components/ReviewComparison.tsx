import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  FileText, 
  Calendar, 
  AlertTriangle,
  XCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { CodeReviewResult, ReviewIssue } from '../types';
import { REVIEW_CATEGORIES } from '../config';

interface ReviewComparisonProps {
  results: [CodeReviewResult, CodeReviewResult];
}

export function ReviewComparison({ results }: ReviewComparisonProps) {
  const [result1, result2] = results;

  const getScoreChange = () => {
    const change = result2.overallScore - result1.overallScore;
    return {
      value: change,
      isImprovement: change > 0,
      isDecline: change < 0,
      percentage: Math.abs((change / result1.overallScore) * 100)
    };
  };

  const getIssueComparison = () => {
    const errors1 = result1.analysis.errors.length;
    const errors2 = result2.analysis.errors.length;
    const warnings1 = result1.analysis.warnings.length;
    const warnings2 = result2.analysis.warnings.length;
    const improvements1 = result1.analysis.improvements.length;
    const improvements2 = result2.analysis.improvements.length;

    return {
      errors: { before: errors1, after: errors2, change: errors2 - errors1 },
      warnings: { before: warnings1, after: warnings2, change: warnings2 - warnings1 },
      improvements: { before: improvements1, after: improvements2, change: improvements2 - improvements1 }
    };
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const scoreChange = getScoreChange();
  const issueComparison = getIssueComparison();

  return (
    <div className="space-y-8" dir="rtl">
      {/* رأس المقارنة */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">مقارنة المراجعات</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* المراجعة الأولى */}
          <div className="bg-slate-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{result1.filename}</h3>
                <p className="text-slate-600">{result1.language}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">النتيجة:</span>
                <span className={`text-2xl font-bold ${getScoreColor(result1.overallScore)}`}>
                  {result1.overallScore}/100
                </span>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-slate-600">
                <Calendar className="h-4 w-4" />
                <span>{result1.timestamp.toLocaleString('ar-SA')}</span>
              </div>
            </div>
          </div>

          {/* سهم المقارنة */}
          <div className="flex items-center justify-center lg:hidden">
            <ArrowRight className="h-8 w-8 text-slate-400 rotate-90 lg:rotate-0" />
          </div>

          {/* المراجعة الثانية */}
          <div className="bg-slate-50 rounded-lg p-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <FileText className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{result2.filename}</h3>
                <p className="text-slate-600">{result2.language}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">النتيجة:</span>
                <span className={`text-2xl font-bold ${getScoreColor(result2.overallScore)}`}>
                  {result2.overallScore}/100
                </span>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-slate-600">
                <Calendar className="h-4 w-4" />
                <span>{result2.timestamp.toLocaleString('ar-SA')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* تحليل التغيير */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">تحليل التغيير</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* تغيير النتيجة */}
          <div className={`p-6 rounded-lg border-2 ${
            scoreChange.isImprovement ? 'bg-green-50 border-green-200' :
            scoreChange.isDecline ? 'bg-red-50 border-red-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              {scoreChange.isImprovement ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : scoreChange.isDecline ? (
                <TrendingDown className="h-8 w-8 text-red-600" />
              ) : (
                <Minus className="h-8 w-8 text-gray-600" />
              )}
              <div>
                <h4 className="text-lg font-semibold text-slate-900">تغيير النتيجة</h4>
                <p className={`text-sm ${
                  scoreChange.isImprovement ? 'text-green-700' :
                  scoreChange.isDecline ? 'text-red-700' :
                  'text-gray-700'
                }`}>
                  {scoreChange.isImprovement ? 'تحسن' :
                   scoreChange.isDecline ? 'تراجع' : 'لا تغيير'}
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                scoreChange.isImprovement ? 'text-green-600' :
                scoreChange.isDecline ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {scoreChange.value > 0 ? '+' : ''}{scoreChange.value}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {scoreChange.percentage.toFixed(1)}% تغيير
              </div>
            </div>
          </div>

          {/* تغيير المشاكل */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-900">الأخطاء</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-red-600">{issueComparison.errors.before} → {issueComparison.errors.after}</span>
                {getChangeIcon(issueComparison.errors.change)}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">التحذيرات</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-yellow-600">{issueComparison.warnings.before} → {issueComparison.warnings.after}</span>
                {getChangeIcon(issueComparison.warnings.change)}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">التحسينات</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-blue-600">{issueComparison.improvements.before} → {issueComparison.improvements.after}</span>
                {getChangeIcon(issueComparison.improvements.change)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الملخصات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">الملخص الأول</h4>
          <p className="text-slate-600 leading-relaxed">{result1.summary}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">الملخص الثاني</h4>
          <p className="text-slate-600 leading-relaxed">{result2.summary}</p>
        </div>
      </div>

      {/* التوصيات */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">التوصيات</h4>
        <div className="space-y-2 text-blue-800">
          {scoreChange.isImprovement && (
            <p>• ممتاز! تم تحسين النتيجة بـ {scoreChange.value} نقطة. استمر في تطبيق أفضل الممارسات.</p>
          )}
          {scoreChange.isDecline && (
            <p>• يحتاج الكود لمراجعة إضافية. النتيجة انخفضت بـ {Math.abs(scoreChange.value)} نقطة.</p>
          )}
          {issueComparison.errors.change < 0 && (
            <p>• تم إصلاح {Math.abs(issueComparison.errors.change)} خطأ. عمل رائع!</p>
          )}
          {issueComparison.errors.change > 0 && (
            <p>• ظهرت {issueComparison.errors.change} أخطاء جديدة تحتاج للإصلاح.</p>
          )}
        </div>
      </div>
    </div>
  );
}