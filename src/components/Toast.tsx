import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2C2820] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2.5 text-sm font-medium animate-slide-in border border-white/10">
      <CheckCircle2 className="w-4 h-4 text-[#1D9E75]" />
      <span>{message}</span>
    </div>
  );
};
