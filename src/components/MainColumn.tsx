import React, { useState } from 'react';
import { Category, Transaction } from '../types';
import { ESSENTIAL_PRESETS, PARTNER_PRESETS } from '../constants/categories';
import { Plus, Search, Trash2, Heart, Dices, Cigarette, Flame, DollarSign, Filter, RefreshCw } from 'lucide-react';

interface MainColumnProps {
  categories: Category[];
  transactions: Transaction[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  monthlyBudgetLimit: number;
  onShowToast: (msg: string) => void;
}

export const MainColumn: React.FC<MainColumnProps> = ({
  categories,
  transactions,
  selectedCategory,
  onSelectCategory,
  onAddTransaction,
  onDeleteTransaction,
  monthlyBudgetLimit,
  onShowToast,
}) => {
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Tool 1: Cigarette & Daily Essentials Budget state
  const [essentialDailyBudget, setEssentialDailyBudget] = useState(150);

  // Tool 3: Gaming & Activity state
  const [gamingAmount, setGamingAmount] = useState<number | ''>('');
  const [gamingType, setGamingType] = useState<'profit' | 'loss'>('loss');
  const [gamingNote, setGamingNote] = useState('');

  // Financial Calculations
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

  const gamingTransactions = transactions.filter(
    (t) => t.type === 'expense' && t.category === 'gaming'
  );

  const gamingProfits = transactions
    .filter((t) => t.category === 'gaming' && t.note?.toLowerCase().includes('profit'))
    .reduce((acc, t) => acc + t.amount, 0);

  const gamingLosses = gamingTransactions.reduce((acc, t) => acc + t.amount, 0);
  const gamingNet = gamingProfits - gamingLosses;

  // Filtered transactions logic
  const filteredTransactions = transactions.filter((tx) => {
    const matchesCategory = selectedCategory ? tx.category === selectedCategory : true;
    const matchesSearch =
      tx.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Handle preset quick add
  const handleAddPreset = (name: string, price: number, catId: string) => {
    onAddTransaction({
      type: 'expense',
      desc: name,
      category: catId,
      amount: price,
      date: new Date().toISOString().split('T')[0],
      note: 'Quick preset entry',
    });
    onShowToast(`Added ${name} (৳${price}) ✓`);
  };

  // Handle Partner Date Night Bundle (Combines treats + dinner + hangout)
  const handleAddDateBundle = () => {
    const bundleAmount = 180 + 850 + 450; // ৳1480
    onAddTransaction({
      type: 'expense',
      desc: 'Date Night Bundle (Ice Cream + Dinner + Hangout)',
      category: 'partner',
      amount: bundleAmount,
      date: new Date().toISOString().split('T')[0],
      note: 'Combined date night package',
    });
    onShowToast(`Date Night Bundle added (৳${bundleAmount}) 💘 ✓`);
  };

  // Handle Gaming Entry
  const handleAddGamingEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gamingAmount || gamingAmount <= 0) return;

    if (gamingType === 'loss') {
      onAddTransaction({
        type: 'expense',
        desc: `Activity / Gaming Entry: ${gamingNote || 'Loss'}`,
        category: 'gaming',
        amount: Number(gamingAmount),
        date: new Date().toISOString().split('T')[0],
        note: `Loss entry: ${gamingNote}`,
      });
      onShowToast(`Activity loss logged (৳${gamingAmount}) ✓`);
    } else {
      onAddTransaction({
        type: 'income',
        desc: `Activity / Gaming Win: ${gamingNote || 'Profit'}`,
        source: 'Activity P/L',
        amount: Number(gamingAmount),
        date: new Date().toISOString().split('T')[0],
        note: `Profit entry: ${gamingNote}`,
      });
      onShowToast(`Activity profit logged (৳${gamingAmount}) 🎉 ✓`);
    }

    setGamingAmount('');
    setGamingNote('');
  };

  // Calculate Category Percentages for CSS Bar Chart
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

  return (
    <main className="flex-1 h-full bg-[#F7F4EF] p-6 overflow-y-auto flex flex-col gap-6">
      {/* 1. SUMMARY CARDS GRID (3 Columns x 2 Rows) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Current Balance */}
        <div className="relative bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-xs hover:shadow-md transition-all group overflow-hidden">
          <div className="w-full h-[3px] bg-[#1D9E75] absolute top-0 left-0" />
          <span className="text-[10px] font-bold text-[#A8A090] tracking-widest uppercase">
            Current Balance
          </span>
          <div className="text-2xl font-bold font-serif-display text-[#1D9E75] mt-1">
            ৳{currentBalance.toLocaleString('en-BD')}
          </div>
          <span className="text-xs text-[#6B6355] mt-1 block">Net Available Taka</span>
          <span className="absolute bottom-2 right-3 text-3xl opacity-15 select-none pointer-events-none group-hover:scale-110 transition-transform">
            💰
          </span>
        </div>

        {/* Card 2: Total Spent */}
        <div className="relative bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-xs hover:shadow-md transition-all group overflow-hidden">
          <div className="w-full h-[3px] bg-[#D85A30] absolute top-0 left-0" />
          <span className="text-[10px] font-bold text-[#A8A090] tracking-widest uppercase">
            Total Spent
          </span>
          <div className="text-2xl font-bold font-serif-display text-[#D85A30] mt-1">
            ৳{totalExpense.toLocaleString('en-BD')}
          </div>
          <span className="text-xs text-[#6B6355] mt-1 block">This month's expenses</span>
          <span className="absolute bottom-2 right-3 text-3xl opacity-15 select-none pointer-events-none group-hover:scale-110 transition-transform">
            🧾
          </span>
        </div>

        {/* Card 3: Saved / Remaining */}
        <div className="relative bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-xs hover:shadow-md transition-all group overflow-hidden">
          <div className="w-full h-[3px] bg-[#534AB7] absolute top-0 left-0" />
          <span className="text-[10px] font-bold text-[#A8A090] tracking-widest uppercase">
            Saved / Remaining
          </span>
          <div className="text-2xl font-bold font-serif-display text-[#534AB7] mt-1">
            ৳{savedRemaining.toLocaleString('en-BD')}
          </div>
          <span className="text-xs text-[#6B6355] mt-1 block">Budget left to spend</span>
          <span className="absolute bottom-2 right-3 text-3xl opacity-15 select-none pointer-events-none group-hover:scale-110 transition-transform">
            🎯
          </span>
        </div>

        {/* Card 4: Daily Essentials Spend */}
        <div className="relative bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-xs hover:shadow-md transition-all group overflow-hidden">
          <div className="w-full h-[3px] bg-[#445566] absolute top-0 left-0" />
          <span className="text-[10px] font-bold text-[#A8A090] tracking-widest uppercase">
            Essentials & Cigarettes
          </span>
          <div className="text-2xl font-bold font-serif-display text-[#445566] mt-1">
            ৳{essentialSpend.toLocaleString('en-BD')}
          </div>
          <span className="text-xs text-[#6B6355] mt-1 block">Snacks, tea & daily items</span>
          <span className="absolute bottom-2 right-3 text-3xl opacity-15 select-none pointer-events-none group-hover:scale-110 transition-transform">
            🚬
          </span>
        </div>

        {/* Card 5: Partner & Outings Budget */}
        <div className="relative bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-xs hover:shadow-md transition-all group overflow-hidden">
          <div className="w-full h-[3px] bg-[#993556] absolute top-0 left-0" />
          <span className="text-[10px] font-bold text-[#A8A090] tracking-widest uppercase">
            Partner & Outings
          </span>
          <div className="text-2xl font-bold font-serif-display text-[#993556] mt-1">
            ৳{partnerSpend.toLocaleString('en-BD')}
          </div>
          <span className="text-xs text-[#6B6355] mt-1 block">Treats, dinners & hangouts</span>
          <span className="absolute bottom-2 right-3 text-3xl opacity-15 select-none pointer-events-none group-hover:scale-110 transition-transform">
            💘
          </span>
        </div>

        {/* Card 6: Activity & Gaming P/L */}
        <div className="relative bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-xs hover:shadow-md transition-all group overflow-hidden">
          <div className="w-full h-[3px] bg-[#185FA5] absolute top-0 left-0" />
          <span className="text-[10px] font-bold text-[#A8A090] tracking-widest uppercase">
            Gaming & Activity P/L
          </span>
          <div
            className={`text-2xl font-bold font-serif-display mt-1 ${
              gamingNet >= 0 ? 'text-[#1D9E75]' : 'text-[#D85A30]'
            }`}
          >
            {gamingNet >= 0 ? `+৳${gamingNet.toLocaleString('en-BD')}` : `-৳${Math.abs(gamingNet).toLocaleString('en-BD')}`}
          </div>
          <span className="text-xs text-[#6B6355] mt-1 block">Net result this month</span>
          <span className="absolute bottom-2 right-3 text-3xl opacity-15 select-none pointer-events-none group-hover:scale-110 transition-transform">
            🎲
          </span>
        </div>
      </section>

      {/* 2. TOOLS GRID (3 FAST-LOGGING TOOL CARDS) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tool Card 1: Cigarette & Daily Essentials Helper */}
        <div className="bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-xs flex flex-col justify-between min-h-[260px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] pb-2">
              <span className="text-xs font-bold text-[#2C2820] flex items-center gap-1.5">
                <Cigarette className="w-4 h-4 text-[#445566]" />
                Cigarette & Essentials Budget
              </span>
              <span className="text-[10px] font-semibold bg-[#F0ECE4] text-[#6B6355] px-2 py-0.5 rounded">
                Quick Add
              </span>
            </div>

            {/* Budget Input Row */}
            <div className="flex items-center gap-2 mt-1">
              <label className="text-xs text-[#6B6355]">Daily Limit:</label>
              <input
                type="number"
                value={essentialDailyBudget}
                onChange={(e) => setEssentialDailyBudget(Number(e.target.value))}
                className="w-20 px-2 py-1 text-xs font-semibold rounded border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#1D9E75]"
              />
              <span className="text-xs font-semibold text-[#1D9E75]">৳/day</span>
            </div>

            {/* Scrollable Preset Item Buttons */}
            <div className="flex flex-col gap-1.5 mt-2 max-h-[110px] overflow-y-auto pr-1">
              {ESSENTIAL_PRESETS.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-1.5 rounded-lg bg-[#F7F4EF] hover:bg-[#F0ECE4] text-xs transition-colors"
                >
                  <span className="font-medium text-[#2C2820]">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B6355] font-semibold">৳{item.price}</span>
                    <button
                      onClick={() => handleAddPreset(item.name, item.price, item.category)}
                      className="px-2 py-0.5 rounded bg-[#1D9E75] text-white text-[10px] font-bold hover:bg-[#1D9E75]/90 transition-all"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teal Combo Box */}
          <div className="bg-[#E1F5EE] border border-[#9FE1CB] p-2.5 rounded-xl text-xs text-[#1D9E75] flex items-center justify-between mt-3">
            <span className="font-medium">Suggested Combo:</span>
            <span className="font-bold">1 Stick (৳23) + Milk Tea (৳15) = ৳38</span>
          </div>
        </div>

        {/* Tool Card 2: Partner & Outings Expenses */}
        <div className="bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-xs flex flex-col justify-between min-h-[260px]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] pb-2">
              <span className="text-xs font-bold text-[#2C2820] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#993556]" />
                Partner & Outings Expenses
              </span>
              <span className="text-[10px] font-semibold bg-[#FAECE7] text-[#D85A30] px-2 py-0.5 rounded">
                Treats
              </span>
            </div>

            {/* Presets List */}
            <div className="flex flex-col gap-1.5 mt-1 max-h-[120px] overflow-y-auto pr-1">
              {PARTNER_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center justify-between p-1.5 rounded-lg bg-[#F7F4EF] hover:bg-[#F0ECE4] text-xs transition-colors"
                >
                  <span className="font-medium text-[#2C2820] flex items-center gap-1.5">
                    <span>{preset.emoji}</span>
                    <span>{preset.name}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B6355] font-semibold">৳{preset.price}</span>
                    <button
                      onClick={() => handleAddPreset(preset.name, preset.price, 'partner')}
                      className="px-2 py-0.5 rounded bg-[#993556] text-white text-[10px] font-bold hover:bg-[#993556]/90 transition-all"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Date Night Bundle Button */}
          <button
            onClick={handleAddDateBundle}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#993556] to-[#D85A30] text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-3"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>+ Add Date Night Bundle (৳1,480)</span>
          </button>
        </div>

        {/* Tool Card 3: Gaming & Activity Tracker */}
        <div className="bg-white p-4 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-xs flex flex-col justify-between min-h-[260px]">
          <form onSubmit={handleAddGamingEntry} className="flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] pb-2">
              <span className="text-xs font-bold text-[#2C2820] flex items-center gap-1.5">
                <Dices className="w-4 h-4 text-[#185FA5]" />
                Activity & Gaming Tracker
              </span>
              <span className="text-[10px] font-semibold bg-[#EEEDFE] text-[#534AB7] px-2 py-0.5 rounded">
                P/L
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <label className="text-[10px] font-bold text-[#A8A090] uppercase block mb-1">
                  Amount (৳)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={gamingAmount}
                  onChange={(e) => setGamingAmount(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#185FA5]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#A8A090] uppercase block mb-1">
                  Type
                </label>
                <select
                  value={gamingType}
                  onChange={(e) => setGamingType(e.target.value as 'profit' | 'loss')}
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#185FA5]"
                >
                  <option value="loss">Loss Entry</option>
                  <option value="profit">Win / Profit</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#A8A090] uppercase block mb-1">
                Note / Match
              </label>
              <input
                type="text"
                placeholder="e.g. FIFA tournament entry"
                value={gamingNote}
                onChange={(e) => setGamingNote(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#185FA5]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-1 rounded-xl bg-gradient-to-r from-[#185FA5] to-[#2B6CB0] text-white text-xs font-bold hover:opacity-95 transition-all shadow-xs"
            >
              Add Gaming Entry
            </button>
          </form>

          {/* Live Net Summary Box */}
          <div className="bg-[#F0ECE4] p-2.5 rounded-xl text-xs flex justify-between items-center text-[#6B6355] mt-2">
            <span>Month Net Result:</span>
            <span
              className={`font-bold ${
                gamingNet >= 0 ? 'text-[#1D9E75]' : 'text-[#D85A30]'
              }`}
            >
              {gamingNet >= 0 ? `+৳${gamingNet}` : `-৳${Math.abs(gamingNet)}`}
            </span>
          </div>
        </div>
      </section>

      {/* 3. CHART SECTION: SPENDING BY CATEGORY */}
      <section className="bg-white p-5 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#2C2820]">Spending by Category</span>
            <span className="text-xs text-[#A8A090]">Top Expense Areas</span>
          </div>
          <span className="text-xs text-[#6B6355] font-serif-display italic">Live Breakdown</span>
        </div>

        {/* Animated Bar Chart */}
        {categoryChartData.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#A8A090]">
            No category expense data recorded yet.
          </div>
        ) : (
          <div className="flex items-end justify-between gap-4 h-36 pt-6 pb-2 px-2 border-b border-[rgba(0,0,0,0.06)]">
            {categoryChartData.map((item, idx) => {
              const heightPercent = Math.max(Math.round((item.spent / maxCategorySpent) * 100), 12);
              return (
                <div key={item.id} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Amount Label on Hover */}
                  <span className="text-[10px] font-semibold text-[#6B6355] opacity-80 group-hover:opacity-100 transition-opacity">
                    ৳{item.spent.toLocaleString('en-BD')}
                  </span>

                  {/* Bar Element */}
                  <div className="w-full max-w-[42px] bg-[#F0ECE4] rounded-t-lg overflow-hidden h-full flex items-end">
                    <div
                      className="w-full rounded-t-lg transition-all duration-700 animate-float-bar"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: item.color,
                        animationDelay: `${idx * 0.2}s`,
                      }}
                    />
                  </div>

                  {/* Category Emoji & Name */}
                  <span className="text-[11px] font-medium text-[#2C2820] truncate max-w-full flex items-center gap-1">
                    <span>{item.emoji}</span>
                    <span className="hidden sm:inline truncate">{item.name.split(' ')[0]}</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. TRANSACTIONS SECTION */}
      <section className="bg-white p-5 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-xs flex flex-col gap-4">
        {/* Title & Count Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(0,0,0,0.06)] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-[#2C2820]">Transaction History</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F0ECE4] text-[#6B6355]">
              {filteredTransactions.length} entries
            </span>
          </div>

          {/* Search Filter Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A090]" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#1D9E75]"
            />
          </div>
        </div>

        {/* Category Filter Chips Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === null
                ? 'bg-[#1D9E75] text-white shadow-2xs font-semibold'
                : 'bg-[#F0ECE4] text-[#6B6355] hover:bg-[#A8A090]/20'
            }`}
          >
            All Category Filter
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-[#1D9E75] text-white shadow-2xs font-semibold'
                  : 'bg-[#F0ECE4] text-[#6B6355] hover:bg-[#A8A090]/20'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="flex flex-col gap-2 mt-1">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#A8A090] flex flex-col items-center gap-2">
              <Filter className="w-6 h-6 text-[#A8A090]" />
              <span>No transactions match your search or filter criteria.</span>
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const catObj = categories.find((c) => c.id === tx.category);
              const isExpense = tx.type === 'expense';

              return (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-[#F7F4EF] hover:bg-[#F0ECE4] transition-all flex items-center justify-between group border border-[rgba(0,0,0,0.04)] animate-slide-in"
                >
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 shadow-2xs"
                      style={{
                        backgroundColor: catObj ? `${catObj.color}15` : '#1D9E7515',
                        color: catObj?.color || '#1D9E75',
                      }}
                    >
                      {catObj ? catObj.emoji : isExpense ? '🧾' : '💰'}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#2C2820] line-clamp-1">
                        {tx.desc}
                      </span>
                      <span className="text-[10px] text-[#A8A090] flex items-center gap-2">
                        <span>{tx.date}</span>
                        {tx.note && <span>• {tx.note}</span>}
                        {tx.source && <span>• Source: {tx.source}</span>}
                      </span>
                    </div>
                  </div>

                  {/* Amount & Delete */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold font-serif-display tabular-nums ${
                        isExpense ? 'text-[#D85A30]' : 'text-[#1D9E75]'
                      }`}
                    >
                      {isExpense ? '-' : '+'}৳{tx.amount.toLocaleString('en-BD')}
                    </span>

                    <button
                      onClick={() => {
                        onDeleteTransaction(tx.id);
                        onShowToast('Transaction removed');
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#A8A090] hover:text-[#A32D2D] hover:bg-[#FCEBEB] transition-all"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
};
