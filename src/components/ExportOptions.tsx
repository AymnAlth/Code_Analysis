import React, { useState } from 'react';
import { Download, FileText, Code, Globe } from 'lucide-react';
import { CodeReviewResult } from '../types';
import { notify } from './NotificationSystem';

interface ExportOptionsProps {
  results: CodeReviewResult[];
}

export function ExportOptions({ results }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportAsJSON = () => {
    try {
      const dataStr = JSON.stringify(results, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `code-review-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      notify.success('تم تصدير التقرير بصيغة JSON');
    } catch (error) {
      notify.error('فشل في تصدير التقرير');
    }
  };

  const exportAsMarkdown = () => {
    try {
      let markdown = '# تقرير مراجعة الكود\n\n';
      
      results.forEach((result, index) => {
        markdown += `## ${index + 1}. ${result.filename}\n\n`;
        markdown += `**اللغة:** ${result.language}\n`;
        markdown += `**التاريخ:** ${result.timestamp.toLocaleString('ar-SA')}\n`;
        markdown += `**النتيجة:** ${result.overallScore}/100\n\n`;
        markdown += `### الملخص\n${result.summary}\n\n`;
        
        if (result.analysis.errors.length > 0) {
          markdown += `### الأخطاء (${result.analysis.errors.length})\n`;
          result.analysis.errors.forEach(error => {
            markdown += `- **${error.message}** ${error.line ? `(السطر ${error.line})` : ''}\n`;
            markdown += `  ${error.description}\n\n`;
          });
        }
        
        if (result.analysis.warnings.length > 0) {
          markdown += `### التحذيرات (${result.analysis.warnings.length})\n`;
          result.analysis.warnings.forEach(warning => {
            markdown += `- **${warning.message}** ${warning.line ? `(السطر ${warning.line})` : ''}\n`;
            markdown += `  ${warning.description}\n\n`;
          });
        }
        
        markdown += '---\n\n';
      });
      
      const dataBlob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `code-review-${Date.now()}.md`;
      link.click();
      
      URL.revokeObjectURL(url);
      notify.success('تم تصدير التقرير بصيغة Markdown');
    } catch (error) {
      notify.error('فشل في تصدير التقرير');
    }
  };

  const exportAsHTML = () => {
    try {
      let html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تقرير مراجعة الكود</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 30px; }
        .score { font-size: 24px; font-weight: bold; padding: 10px; border-radius: 5px; display: inline-block; }
        .score.high { background: #dcfce7; color: #166534; }
        .score.medium { background: #fef3c7; color: #92400e; }
        .score.low { background: #fee2e2; color: #991b1b; }
        .issue { margin: 15px 0; padding: 15px; border-radius: 5px; border-right: 4px solid; }
        .error { background: #fee2e2; border-color: #dc2626; }
        .warning { background: #fef3c7; border-color: #d97706; }
        .improvement { background: #dbeafe; border-color: #2563eb; }
        .meta { color: #6b7280; font-size: 14px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>تقرير مراجعة الكود</h1>
`;

      results.forEach((result, index) => {
        const scoreClass = result.overallScore >= 80 ? 'high' : result.overallScore >= 60 ? 'medium' : 'low';
        
        html += `
        <h2>${index + 1}. ${result.filename}</h2>
        <div class="meta">
            <strong>اللغة:</strong> ${result.language} | 
            <strong>التاريخ:</strong> ${result.timestamp.toLocaleString('ar-SA')}
        </div>
        <div class="score ${scoreClass}">النتيجة: ${result.overallScore}/100</div>
        <h3>الملخص</h3>
        <p>${result.summary}</p>
`;

        [...result.analysis.errors, ...result.analysis.warnings, ...result.analysis.improvements].forEach(issue => {
          html += `
        <div class="issue ${issue.type}">
            <strong>${issue.message}</strong> ${issue.line ? `(السطر ${issue.line})` : ''}
            <p>${issue.description}</p>
            ${issue.suggestedFix ? `<p><strong>الحل المقترح:</strong> ${issue.suggestedFix}</p>` : ''}
        </div>
`;
        });
      });

      html += `
    </div>
</body>
</html>`;

      const dataBlob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `code-review-${Date.now()}.html`;
      link.click();
      
      URL.revokeObjectURL(url);
      notify.success('تم تصدير التقرير بصيغة HTML');
    } catch (error) {
      notify.error('فشل في تصدير التقرير');
    }
  };

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <button
        onClick={exportAsJSON}
        disabled={isExporting}
        className="flex items-center space-x-1 rtl:space-x-reverse bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <Code className="h-4 w-4" />
        <span>JSON</span>
      </button>
      
      <button
        onClick={exportAsMarkdown}
        disabled={isExporting}
        className="flex items-center space-x-1 rtl:space-x-reverse bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
      >
        <FileText className="h-4 w-4" />
        <span>Markdown</span>
      </button>
      
      <button
        onClick={exportAsHTML}
        disabled={isExporting}
        className="flex items-center space-x-1 rtl:space-x-reverse bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
      >
        <Globe className="h-4 w-4" />
        <span>HTML</span>
      </button>
    </div>
  );
}