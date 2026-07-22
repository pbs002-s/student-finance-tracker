import React from 'react';
import { Settings, Sparkles, Plus, Wallet } from 'lucide-react';

interface AndroidHeaderProps {
  currentMonthYear: string;
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
  onOpenSettings: () => void;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  currentMonthYear,
  onOpenExpenseModal,
  onOpenIncomeModal,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[rgba(0,0,0,0.08)] shadow-2xs select-none">
      {/* Android Top Status Bar Simulation */}
      <div className="bg-[#2C2820] text-white/80 text-[10px] px-4 py-1 flex justify-between items-center font-mono">
        <span className="font-semibold tracking-wider">BD STUDENT FINANCE</span>
        <div className="flex items-center gap-2">
          <span>৳ BDT</span>
          <span>● ONLINE</span>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Logo & Bengali Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1D9E75] to-[#2B6CB0] flex items-center justify-center text-white text-lg shadow-xs shrink-0">
            💸
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold font-bn text-[#1D9E75] leading-tight tracking-tight">
              টাকার হিসাব
            </span>
            <span className="text-[10px] font-semibold text-[#6B6355] tracking-wider uppercase">
              {currentMonthYear}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExpenseModal}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#D85A30] text-[#D85A30] hover:bg-[#FAECE7] active:scale-95 transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expense</span>
          </button>

          <button
            onClick={onOpenIncomeModal}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1D9E75] text-white hover:bg-[#1D9E75]/90 active:scale-95 transition-all flex items-center gap-1 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Income</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-[#6B6355] hover:bg-[#F0ECE4] active:scale-95 transition-all"
            title="App Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
