import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface StatusCardProps {
  phase: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  features?: string[];
}

export function StatusCard({ phase, title, description, status, features }: StatusCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'current':
        return <AlertCircle className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <Circle className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50/50';
      case 'current':
        return 'border-blue-200 bg-blue-50/50';
      default:
        return 'border-slate-200 bg-slate-50/50';
    }
  };

  return (
    <div className={`rounded-lg border-2 p-6 transition-all duration-200 ${getStatusColor()}`}>
      <div className="flex items-start space-x-4 rtl:space-x-reverse">
        <div className="flex-shrink-0 mt-1">
          {getStatusIcon()}
        </div>
        
        <div className="flex-1" dir="rtl">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
            <span className="text-sm font-medium text-slate-600">المرحلة {phase}</span>
            <div className={`
              w-2 h-2 rounded-full
              ${status === 'completed' ? 'bg-green-500' : 
                status === 'current' ? 'bg-blue-500' : 'bg-slate-400'}
            `} />
          </div>
          
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600 mb-4">{description}</p>
          
          {features && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-900">المكونات الأساسية:</h4>
              <ul className="space-y-1">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}