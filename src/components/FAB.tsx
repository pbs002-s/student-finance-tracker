import React, { useState } from 'react';
import { Plus, Minus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface FABProps {
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
}

export const FAB: React.FC<FABProps> = ({
  onOpenExpenseModal,
  onOpenIncomeModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2.5">
      {/* Quick Menu items */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 animate-slide-in">
          {/* Income Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenIncomeModal();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1D9E75] text-white text-xs font-bold shadow-md hover:bg-[#1D9E75]/90 active:scale-95 transition-all"
          >
            <span>+ Add Income</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowDownLeft className="w-3.5 h-3.5 text-white" />
            </div>
          </button>

          {/* Expense Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenExpenseModal();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#D85A30] text-white text-xs font-bold shadow-md hover:bg-[#D85A30]/90 active:scale-95 transition-all"
          >
            <span>- Add Expense</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </div>
          </button>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-13 h-13 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-all duration-300 ${
          isOpen ? 'bg-[#2C2820] rotate-45' : 'bg-gradient-to-tr from-[#1D9E75] to-[#2B6CB0]'
        }`}
        title="Add Transaction"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
