import React from 'react';
import { FileText } from 'lucide-react';
import { CustomPage } from '../types';

interface CustomPageViewProps {
  page: CustomPage;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({ page }) => {
  return (
    <div className="py-8 max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-md">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/60 text-emerald-100 border border-emerald-500/30 text-xs font-semibold mb-4">
          <FileText className="w-4 h-4 text-emerald-300" />
          <span>Halaman Informasi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight flex items-center gap-3">
          <span>{page.icon || '📄'}</span>
          <span>{page.title}</span>
        </h1>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-xs">
        <div className="prose prose-sm sm:prose-base max-w-none text-neutral-700 leading-relaxed whitespace-pre-line">
          {page.content}
        </div>
      </div>
    </div>
  );
};
