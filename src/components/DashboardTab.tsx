import React from 'react';
import { Category, Transaction } from '../types';
import { Wallet, PieChart, TrendingUp, Layers, ChevronRight, PlusCircle, ArrowUpRight, ArrowDownLeft, Zap, Bot, Receipt, Settings } from 'lucide-react';

interface DashboardTabProps {
  categories: Category[];
  transactions: Transaction[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  monthlyBudgetLimit: number;
  onNavigateToTxns: () => void;
  onNavigateToTools?: () => void;
  onNavigateToAI?: () => void;
  onNavigateToSettings?: () => void;
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  categories,
  transactions,
  selectedCategory,
  onSelectCategory,
  monthlyBudgetLimit,
  onNavigateToTxns,
  onNavigateToTools,
  onNavigateToAI,
  onNavigateToSettings,
  onOpenExpenseModal,
  onOpenIncomeModal,
}) => {
  // Financial calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;
  const savedRemaining = monthlyBudgetLimit - totalExpense;

  const essentialSpend = transactions
    .filter((t) => t.type === 'expense' && (t.category === 'essentials' || t.category === 'tea'))
    .reduce((acc, t) => acc + t.amount, 0);

  const partnerSpend = transactions
    .filter((t) => t.type === 'expense' && t.category === 'partner')
    .reduce((acc, t) => acc + t.amount, 0);

  // Budget calculations
  const budgetPercent = Math.min(Math.round((totalExpense / monthlyBudgetLimit) * 100), 100);

  // Category Chart Data
  const categoryChartData = categories
    .map((cat) => {
      const spent = transactions
        .filter((t) => t.type === 'expense' && t.category === cat.id)
        .reduce((acc, t) => acc + t.amount, 0);
      return { ...cat, spent };
    })
    .filter((cat) => cat.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 6);

  const maxCategorySpent = Math.max(...categoryChartData.map((c) => c.spent), 1);

  // Recent 5 transactions
  const recentTxns = transactions.slice(0, 5);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-5 pb-24">
      {/* Primary Balance Banner Card */}
      <div className="bg-gradient-to-r from-[#1D9E75] to-[#2B6CB0] text-white p-5 rounded-2xl shadow-md flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex justify-between items-center text-xs text-white/80 uppercase font-semibold tracking-wider">
          <span>Current Net Balance</span>
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] text-white font-mono">
            ৳ BDT
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-bold font-serif-display tracking-tight">
          ৳{currentBalance.toLocaleString('en-BD')}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/15 text-xs">
          <div className="flex flex-col">
            <span className="text-white/70 text-[10px] uppercase">Total Income</span>
            <span className="font-semibold text-white flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-300" />
              +৳{totalIncome.toLocaleString('en-BD')}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-white/70 text-[10px] uppercase">Total Expense</span>
            <span className="font-semibold text-white flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-300" />
              -৳{totalExpense.toLocaleString('en-BD')}
            </span>
          </div>
        </div>
      </div>

      {/* Explore Quick Shortcuts */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onNavigateToTools}
          className="p-2.5 bg-white rounded-xl border border-[rgba(0,0,0,0.08)] shadow-2xs hover:bg-[#E1F5EE] active:scale-95 transition-all flex flex-col items-center gap-1"
        >
          <div className="w-8 h-8 rounded-lg bg-[#E1F5EE] text-[#1D9E75] flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-[#2C2820]">Quick Tools</span>
        </button>

        <button
          onClick={onNavigateToAI}
          className="p-2.5 bg-white rounded-xl border border-[rgba(0,0,0,0.08)] shadow-2xs hover:bg-[#E1F5EE] active:scale-95 transition-all flex flex-col items-center gap-1"
        >
          <div className="w-8 h-8 rounded-lg bg-[#E1F5EE] text-[#1D9E75] flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-[#2C2820]">Finance AI</span>
        </button>

        <button
          onClick={onNavigateToTxns}
          className="p-2.5 bg-white rounded-xl border border-[rgba(0,0,0,0.08)] shadow-2xs hover:bg-[#FAECE7] active:scale-95 transition-all flex flex-col items-center gap-1"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FAECE7] text-[#D85A30] flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-[#2C2820]">History</span>
        </button>

        <button
          onClick={onNavigateToSettings}
          className="p-2.5 bg-white rounded-xl border border-[rgba(0,0,0,0.08)] shadow-2xs hover:bg-[#F0ECE4] active:scale-95 transition-all flex flex-col items-center gap-1"
        >
          <div className="w-8 h-8 rounded-lg bg-[#F0ECE4] text-[#6B6355] flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-[#2C2820]">Budget Set</span>
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Saved / Remaining */}
        <div className="bg-white p-3.5 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-[#A8A090] uppercase tracking-wider">
            Budget Left
          </span>
          <div className="text-lg font-bold font-serif-display text-[#534AB7] mt-1">
            ৳{savedRemaining.toLocaleString('en-BD')}
          </div>
          <span className="text-[10px] text-[#6B6355] mt-1">Remaining allowance</span>
        </div>

        {/* Essentials Spend */}
        <div className="bg-white p-3.5 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-[#A8A090] uppercase tracking-wider">
            Cigarettes/Tea
          </span>
          <div className="text-lg font-bold font-serif-display text-[#445566] mt-1">
            ৳{essentialSpend.toLocaleString('en-BD')}
          </div>
          <span className="text-[10px] text-[#6B6355] mt-1">Daily items spend</span>
        </div>

        {/* Partner & Outings */}
        <div className="bg-white p-3.5 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-[#A8A090] uppercase tracking-wider">
            Partner / Outings
          </span>
          <div className="text-lg font-bold font-serif-display text-[#993556] mt-1">
            ৳{partnerSpend.toLocaleString('en-BD')}
          </div>
          <span className="text-[10px] text-[#6B6355] mt-1">Treats & hangouts</span>
        </div>
      </div>

      {/* Monthly Budget Progress Box */}
      <div className="bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xs flex flex-col gap-2.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-[#2C2820] flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-[#BA7517]" />
            Monthly Budget Meter
          </span>
          <span className="font-semibold text-[#6B6355]">
            ৳{totalExpense.toLocaleString('en-BD')} / ৳{monthlyBudgetLimit.toLocaleString('en-BD')}
          </span>
        </div>

        <div className="w-full h-2.5 bg-[#F0ECE4] rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 rounded-full"
            style={{
              width: `${budgetPercent}%`,
              backgroundColor: budgetPercent > 85 ? '#D85A30' : budgetPercent > 65 ? '#BA7517' : '#1D9E75',
            }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-[#6B6355]">
          <span>{budgetPercent}% used this month</span>
          <span className={savedRemaining >= 0 ? 'text-[#1D9E75] font-bold' : 'text-[#D85A30] font-bold'}>
            {savedRemaining >= 0 ? `৳${savedRemaining.toLocaleString('en-BD')} available` : 'Over Budget!'}
          </span>
        </div>
      </div>

      {/* Top Expense Category Chart */}
      <div className="bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xs flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[#2C2820]">Top Spending Areas</span>
          <span className="text-[10px] text-[#A8A090] font-serif-display italic">Live Breakdown</span>
        </div>

        {categoryChartData.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#A8A090]">
            No expense categories recorded yet. Add your first expense below!
          </div>
        ) : (
          <div className="flex items-end justify-between gap-2 h-32 pt-4 pb-1 border-b border-[rgba(0,0,0,0.06)]">
            {categoryChartData.map((item, idx) => {
              const heightPercent = Math.max(Math.round((item.spent / maxCategorySpent) * 100), 15);
              return (
                <div key={item.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[9px] font-semibold text-[#6B6355]">
                    ৳{item.spent}
                  </span>
                  <div className="w-full max-w-[36px] bg-[#F0ECE4] rounded-t-lg overflow-hidden h-full flex items-end">
                    <div
                      className="w-full rounded-t-lg animate-float-bar transition-all"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: item.color,
                        animationDelay: `${idx * 0.15}s`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] truncate max-w-full font-medium">
                    {item.emoji}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Transactions List Preview */}
      <div className="bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] pb-2">
          <span className="text-xs font-bold text-[#2C2820]">Recent Activity</span>
          <button
            onClick={onNavigateToTxns}
            className="text-xs font-semibold text-[#1D9E75] flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTxns.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#A8A090] flex flex-col items-center gap-2">
            <span className="text-2xl">📝</span>
            <p className="font-medium text-[#2C2820]">No transactions logged yet.</p>
            <p className="text-[11px] text-[#6B6355]">
              Tap <span className="text-[#1D9E75] font-bold">+ Expense</span> or <span className="text-[#1D9E75] font-bold">+ Income</span> to log your first entry!
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={onOpenIncomeModal}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1D9E75] text-white hover:bg-[#1D9E75]/90 transition-all shadow-2xs"
              >
                + Add Allowance / Income
              </button>
              <button
                onClick={onOpenExpenseModal}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#D85A30] text-[#D85A30] hover:bg-[#FAECE7] transition-all"
              >
                + Add Expense
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentTxns.map((tx) => {
              const catObj = categories.find((c) => c.id === tx.category);
              const isExpense = tx.type === 'expense';

              return (
                <div
                  key={tx.id}
                  className="p-2.5 rounded-xl bg-[#F7F4EF] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                      style={{
                        backgroundColor: catObj ? `${catObj.color}20` : '#1D9E7520',
                      }}
                    >
                      {catObj ? catObj.emoji : isExpense ? '🧾' : '💰'}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-[#2C2820] line-clamp-1">
                        {tx.desc}
                      </span>
                      <span className="text-[10px] text-[#A8A090]">
                        {tx.date} {tx.source ? `• ${tx.source}` : ''}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`font-bold font-serif-display tabular-nums ${
                      isExpense ? 'text-[#D85A30]' : 'text-[#1D9E75]'
                    }`}
                  >
                    {isExpense ? '-' : '+'}৳{tx.amount.toLocaleString('en-BD')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
