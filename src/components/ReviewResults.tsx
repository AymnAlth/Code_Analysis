import React from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  Lightbulb, 
  TrendingUp, 
  Clock,
  FileText,
  Code,
  CheckCircle
} from 'lucide-react';
import { CodeReviewResult, ReviewIssue, AdvancedCodeMetrics } from '../types';
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

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
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

      {/* مقاييس جودة الكود */}
      {result.codeQuality && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">مقاييس جودة الكود</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold px-3 py-1 rounded-full ${getQualityColor(result.codeQuality.maintainability)}`}>
                {result.codeQuality.maintainability}
              </div>
              <div className="text-sm text-slate-600 mt-1">قابلية الصيانة</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold px-3 py-1 rounded-full ${getQualityColor(result.codeQuality.readability)}`}>
                {result.codeQuality.readability}
              </div>
              <div className="text-sm text-slate-600 mt-1">القابلية للقراءة</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold px-3 py-1 rounded-full ${getQualityColor(result.codeQuality.performance)}`}>
                {result.codeQuality.performance}
              </div>
              <div className="text-sm text-slate-600 mt-1">الأداء</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold px-3 py-1 rounded-full ${getQualityColor(result.codeQuality.security)}`}>
                {result.codeQuality.security}
              </div>
              <div className="text-sm text-slate-600 mt-1">الأمان</div>
            </div>
          </div>
        </div>
      )}

      {/* إحصائيات الكود */}
      {result.metrics && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">إحصائيات الكود</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{result.metrics.totalLines}</div>
              <div className="text-sm text-blue-800">إجمالي الأسطر</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{result.metrics.functionCount}</div>
              <div className="text-sm text-green-800">عدد الدوال</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{result.metrics.cyclomaticComplexity}</div>
              <div className="text-sm text-purple-800">التعقد الدوري</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round((result.metrics.commentLines / result.metrics.codeLines) * 100)}%
              </div>
              <div className="text-sm text-yellow-800">نسبة التعليقات</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{result.metrics.codeSmells || 0}</div>
              <div className="text-sm text-red-800">روائح الكود</div>
            </div>
          </div>
          
          {/* مقاييس متقدمة إضافية */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-900 mb-2">مؤشر قابلية الصيانة</h4>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="text-2xl font-bold text-indigo-600">
                  {result.metrics.maintainabilityIndex || 'N/A'}
                </div>
                <div className="text-sm text-indigo-700">/100</div>
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">الدين التقني</h4>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="text-2xl font-bold text-orange-600">
                  {result.metrics.technicalDebt || 0}
                </div>
                <div className="text-sm text-orange-700">دقيقة</div>
              </div>
            </div>
            
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-semibold text-teal-900 mb-2">الدوال الموثقة</h4>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="text-2xl font-bold text-teal-600">
                  {result.metrics.documentedFunctions || 0}
                </div>
                <div className="text-sm text-teal-700">
                  /{result.metrics.functionCount || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* نقاط القوة والضعف */}
      {(result.strengths?.length || result.weaknesses?.length) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.strengths && result.strengths.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">نقاط القوة</h3>
              <ul className="space-y-2">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2 rtl:space-x-reverse text-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.weaknesses && result.weaknesses.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">نقاط الضعف</h3>
              <ul className="space-y-2">
                {result.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start space-x-2 rtl:space-x-reverse text-red-800">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* التوصيات وأفضل الممارسات */}
      {(result.recommendations?.length || result.bestPractices?.length) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">التوصيات</h3>
              <ul className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2 rtl:space-x-reverse text-blue-800">
                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.bestPractices && result.bestPractices.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">أفضل الممارسات</h3>
              <ul className="space-y-2">
                {result.bestPractices.map((practice, index) => (
                  <li key={index} className="flex items-start space-x-2 rtl:space-x-reverse text-purple-800">
                    <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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