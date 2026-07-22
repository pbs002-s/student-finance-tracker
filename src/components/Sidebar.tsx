import React from 'react';
import { Category, Transaction } from '../types';
import { Wallet, PieChart, TrendingUp, Layers } from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  transactions: Transaction[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  monthlyBudgetLimit: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  transactions,
  selectedCategory,
  onSelectCategory,
  monthlyBudgetLimit,
}) => {
  // Calculate category spend map
  const categorySpendMap: Record<string, number> = {};
  let totalSpent = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'expense') {
      totalSpent += tx.amount;
      const catKey = tx.category || 'misc';
      categorySpendMap[catKey] = (categorySpendMap[catKey] || 0) + tx.amount;
    }
  });

  // Calculate Quick Stats
  const expenseTxns = transactions.filter((t) => t.type === 'expense');
  const now = new Date();
  const daysInMonth = now.getDate() || 1;
  const dailyAverage = Math.round(totalSpent / daysInMonth);
  const highestSpend = expenseTxns.reduce((max, t) => (t.amount > max ? t.amount : max), 0);

  // Budget calculations
  const budgetPercent = Math.min(Math.round((totalSpent / monthlyBudgetLimit) * 100), 100);
  const budgetRemaining = monthlyBudgetLimit - totalSpent;

  const getBudgetProgressColor = (percent: number) => {
    if (percent >= 90) return '#D85A30'; // Coral
    if (percent >= 70) return '#BA7517'; // Amber
    return '#1D9E75'; // Teal
  };

  return (
    <aside className="w-[260px] h-full bg-white border-r border-[rgba(0,0,0,0.08)] flex flex-col overflow-y-auto p-4 gap-6 select-none shrink-0">
      {/* SECTION 1: CATEGORIES */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-[#A8A090] tracking-widest uppercase flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#1D9E75]" />
            Categories
          </span>
          <span className="text-[10px] font-semibold text-[#6B6355] bg-[#F0ECE4] px-1.5 py-0.5 rounded">
            {categories.length}
          </span>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          {/* All Expenses Row */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
              selectedCategory === null
                ? 'bg-[#E1F5EE] border border-[#9FE1CB] text-[#1D9E75] font-semibold shadow-2xs'
                : 'hover:bg-[#F0ECE4] text-[#2C2820]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1D9E75]" />
              <span>All Expenses</span>
            </div>
            <span className="font-semibold">৳{totalSpent.toLocaleString('en-BD')}</span>
          </button>

          {/* Dynamic Category List */}
          <div className="flex flex-col gap-1.5 mt-1 max-h-[340px] overflow-y-auto pr-0.5">
            {categories.map((cat) => {
              const spent = categorySpendMap[cat.id] || 0;
              const catBudget = cat.budget || 1000;
              const catPercent = Math.min(Math.round((spent / catBudget) * 100), 100);
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full px-3 py-2 rounded-lg text-xs flex flex-col gap-1 transition-all ${
                    isActive
                      ? 'bg-[#E1F5EE] border border-[#9FE1CB] text-[#1D9E75] font-semibold shadow-2xs'
                      : 'hover:bg-[#F0ECE4] text-[#2C2820]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <span className="font-medium shrink-0 text-[#6B6355]">
                      ৳{spent.toLocaleString('en-BD')}
                    </span>
                  </div>

                  {/* Thin 3px Budget Progress Bar */}
                  <div className="w-full h-[3px] bg-[#F0ECE4] rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${catPercent}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: MONTHLY BUDGET */}
      <div className="flex flex-col gap-2 pt-4 border-t border-[rgba(0,0,0,0.08)]">
        <span className="text-[10px] font-bold text-[#A8A090] tracking-widest uppercase flex items-center gap-1 px-1">
          <PieChart className="w-3 h-3 text-[#BA7517]" />
          Monthly Budget
        </span>

        <div className="bg-[#F7F4EF] p-3.5 rounded-xl border border-[rgba(0,0,0,0.08)] flex flex-col gap-2">
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-[#6B6355] font-medium">Spent vs Budget</span>
            <span className="font-bold text-[#2C2820]">
              ৳{totalSpent.toLocaleString('en-BD')} / ৳{monthlyBudgetLimit.toLocaleString('en-BD')}
            </span>
          </div>

          <div className="w-full h-2 bg-[#F0ECE4] rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${budgetPercent}%`,
                backgroundColor: getBudgetProgressColor(budgetPercent),
              }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] pt-0.5 text-[#6B6355]">
            <span>{budgetPercent}% used</span>
            <span
              className={budgetRemaining >= 0 ? 'text-[#1D9E75] font-semibold' : 'text-[#D85A30] font-semibold'}
            >
              {budgetRemaining >= 0 ? `৳${budgetRemaining.toLocaleString('en-BD')} left` : 'Over Budget!'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: QUICK STATS */}
      <div className="flex flex-col gap-2 pt-4 border-t border-[rgba(0,0,0,0.08)]">
        <span className="text-[10px] font-bold text-[#A8A090] tracking-widest uppercase flex items-center gap-1 px-1">
          <TrendingUp className="w-3 h-3 text-[#2B6CB0]" />
          Quick Stats
        </span>

        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="bg-[#F7F4EF] p-2.5 rounded-lg border border-[rgba(0,0,0,0.06)] flex justify-between items-center">
            <span className="text-[#6B6355]">Daily Average</span>
            <span className="font-semibold text-[#2C2820]">৳{dailyAverage.toLocaleString('en-BD')}/day</span>
          </div>

          <div className="bg-[#F7F4EF] p-2.5 rounded-lg border border-[rgba(0,0,0,0.06)] flex justify-between items-center">
            <span className="text-[#6B6355]">Transactions</span>
            <span className="font-semibold text-[#2C2820]">{transactions.length} entries</span>
          </div>

          <div className="bg-[#F7F4EF] p-2.5 rounded-lg border border-[rgba(0,0,0,0.06)] flex justify-between items-center">
            <span className="text-[#6B6355]">Highest Spend</span>
            <span className="font-semibold text-[#D85A30]">৳{highestSpend.toLocaleString('en-BD')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
