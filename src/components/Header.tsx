import React from 'react';
import { Plus, Github, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentMonthYear: string;
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
  onLoadDemoData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMonthYear,
  onOpenExpenseModal,
  onOpenIncomeModal,
  onLoadDemoData,
}) => {
  return (
    <header className="sticky top-0 z-50 h-[60px] bg-white border-b border-[rgba(0,0,0,0.08)] px-6 flex items-center justify-between shadow-xs">
      {/* Brand Logo & Wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-[34px] h-[34px] rounded-lg bg-[#1D9E75] flex items-center justify-center text-white text-lg shadow-xs">
          💸
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-[#1D9E75] leading-tight tracking-tight">
            Takar Hishab
          </span>
          <span className="text-[10px] font-semibold text-[#6B6355] tracking-widest uppercase">
            Student Finance Tracker
          </span>
        </div>
      </div>

      {/* Center Month Label */}
      <div className="text-base font-serif-display italic text-[#6B6355] tracking-wide">
        {currentMonthYear}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        {/* GitHub Credit Pill */}
        <a
          href="https://github.com/pbs002-s"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EEEDFE] text-[#534AB7] hover:bg-[#AFA9EC]/30 transition-all flex items-center gap-1.5"
          title="View GitHub Repository"
        >
          <Github className="w-3.5 h-3.5" />
          <span>Credit</span>
        </a>

        {/* Demo Data Button */}
        <button
          onClick={onLoadDemoData}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#2B6CB0] to-[#1D9E75] text-white hover:opacity-95 active:scale-98 transition-all flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demo Data</span>
        </button>

        {/* Add Expense Button */}
        <button
          onClick={onOpenExpenseModal}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-[#D85A30] text-[#D85A30] hover:bg-[#FAECE7] transition-all flex items-center gap-1.5 active:scale-98"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Expense</span>
        </button>

        {/* Add Income Button */}
        <button
          onClick={onOpenIncomeModal}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1D9E75] text-white hover:bg-[#1D9E75]/90 transition-all flex items-center gap-1.5 shadow-xs active:scale-98"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Income</span>
        </button>
      </div>
    </header>
  );
};
