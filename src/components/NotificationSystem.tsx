import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

export const NotificationSystem = () => {
  return (
    <Toaster
      position="top-left"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#374151',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '14px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          direction: 'rtl'
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

// Helper functions for notifications
export const notify = {
  success: (message: string) => {
    toast.success(message, {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    });
  },
  
  warning: (message: string) => {
    toast(message, {
      icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      style: {
        borderColor: '#f59e0b',
        backgroundColor: '#fef3c7',
      },
    });
  },
  
  info: (message: string) => {
    toast(message, {
      icon: <Info className="h-5 w-5 text-blue-500" />,
      style: {
        borderColor: '#3b82f6',
        backgroundColor: '#dbeafe',
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        borderColor: '#6b7280',
        backgroundColor: '#f9fafb',
      },
    });
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  }
};