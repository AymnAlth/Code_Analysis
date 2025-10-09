import React from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  Lightbulb, 
  TrendingUp, 
  Clock,
  FileText,
  Code
} from 'lucide-react';
import { CodeReviewResult, ReviewIssue } from '../types';
import { REVIEW_CATEGORIES } from '../config';

interface ReviewResultsProps {
  result: CodeReviewResult;
}

export function ReviewResults({ result }: ReviewResultsProps) {
  const getIssueIcon = (type: ReviewIssue['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'improvement':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: ReviewIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const allIssues = [
    ...result.analysis.errors,
    ...result.analysis.warnings,
    ...result.analysis.improvements
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* رأس النتائج */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{result.filename}</h2>
              <p className="text-slate-600">{result.language}</p>
            </div>
          </div>
          
          <div className="text-left">
            <div className={`text-3xl font-bold ${getScoreColor(result.overallScore)}`}>
              {result.overallScore}/100
            </div>
            <div className="text-sm text-slate-600">النتيجة الإجمالية</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-slate-600">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <Clock className="h-4 w-4" />
            <span>{result.timestamp.toLocaleString('ar-SA')}</span>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <TrendingUp className="h-4 w-4" />
            <span>{allIssues.length} ملاحظة</span>
          </div>
        </div>
      </div>

      {/* الملخص */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">الملخص العام</h3>
        <p className="text-slate-700 leading-relaxed">{result.summary}</p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-900">أخطاء</span>
          </div>
          <div className="text-2xl font-bold text-red-600 mt-2">
            {result.analysis.errors.length}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-yellow-900">تحذيرات</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600 mt-2">
            {result.analysis.warnings.length}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">تحسينات</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            {result.analysis.improvements.length}
          </div>
        </div>
      </div>

      {/* قائمة المشاكل */}
      {allIssues.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">التفاصيل والملاحظات</h3>
          </div>
          
          <div className="divide-y divide-slate-200">
            {allIssues.map((issue, index) => (
              <div key={issue.id || index} className="p-6">
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0 mt-1">
                    {getIssueIcon(issue.type)}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-900">{issue.message}</h4>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        {issue.line && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            السطر {issue.line}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(issue.severity)}`}>
                          {issue.severity === 'critical' ? 'حرج' :
                           issue.severity === 'high' ? 'عالي' :
                           issue.severity === 'medium' ? 'متوسط' : 'منخفض'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-slate-600">{issue.description}</p>
                    
                    {issue.suggestedFix && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h5 className="font-medium text-green-900 mb-1">الحل المقترح:</h5>
                        <p className="text-green-800 text-sm">{issue.suggestedFix}</p>
                      </div>
                    )}
                    
                    {issue.codeExample && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <h5 className="font-medium text-slate-900 mb-2 flex items-center space-x-1 rtl:space-x-reverse">
                          <Code className="h-4 w-4" />
                          <span>مثال:</span>
                        </h5>
                        <pre className="text-sm text-slate-700 overflow-x-auto">
                          <code>{issue.codeExample}</code>
                        </pre>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-500">
                      <span>الفئة:</span>
                      <span className="font-medium">
                        {REVIEW_CATEGORIES[issue.category]?.name || issue.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {allIssues.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            ممتاز! لا توجد مشاكل
          </h3>
          <p className="text-green-700">
            الكود يبدو نظيفاً ويتبع أفضل الممارسات
          </p>
        </div>
      )}
    </div>
  );
}