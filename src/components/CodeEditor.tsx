import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  language: string;
  filename: string;
  isDark?: boolean;
  showLineNumbers?: boolean;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ 
  code, 
  language, 
  filename, 
  isDark = false,
  showLineNumbers = true,
  onCodeChange,
  readOnly = true
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('فشل في نسخ الكود:', error);
    }
  };

  const getLanguageForHighlighter = (lang: string): string => {
    const languageMap: Record<string, string> = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'csharp': 'csharp',
      'go': 'go',
      'rust': 'rust'
    };
    return languageMap[lang] || 'text';
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        isDark ? 'bg-slate-800 border-slate-600' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className={`w-3 h-3 rounded-full ${
            language === 'javascript' ? 'bg-yellow-500' :
            language === 'typescript' ? 'bg-blue-500' :
            language === 'python' ? 'bg-green-500' :
            language === 'java' ? 'bg-red-500' :
            'bg-gray-500'
          }`} />
          <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {filename}
          </span>
          <span className={`text-sm px-2 py-1 rounded ${
            isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
          }`}>
            {language}
          </span>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-1.5 rounded hover:bg-opacity-80 transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
            }`}
            title={showPreview ? 'إخفاء المعاينة' : 'إظهار المعاينة'}
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded hover:bg-opacity-80 transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
            }`}
            title={isExpanded ? 'تصغير' : 'توسيع'}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          <button
            onClick={handleCopy}
            className={`p-1.5 rounded hover:bg-opacity-80 transition-colors ${
              isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
            }`}
            title="نسخ الكود"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Code Content */}
      {showPreview && (
        <div className={`${isExpanded ? 'h-96' : 'max-h-64'} overflow-auto`}>
          <SyntaxHighlighter
            language={getLanguageForHighlighter(language)}
            style={isDark ? vscDarkPlus : vs}
            showLineNumbers={showLineNumbers}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              color: isDark ? '#6b7280' : '#9ca3af',
              userSelect: 'none'
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )}

      {/* Stats */}
      <div className={`px-4 py-2 text-xs border-t ${
        isDark ? 'bg-slate-800 border-slate-600 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
      }`}>
        <div className="flex items-center justify-between">
          <span>{code.split('\n').length} سطر • {code.length} حرف</span>
          <span>{(new Blob([code]).size / 1024).toFixed(1)} كيلوبايت</span>
        </div>
      </div>
    </div>
  );
}