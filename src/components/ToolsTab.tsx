import React, { useState } from 'react';
import { Transaction } from '../types';
import { ESSENTIAL_PRESETS, PARTNER_PRESETS } from '../constants/categories';
import { Cigarette, Heart, Dices, Plus, Sparkles } from 'lucide-react';

interface ToolsTabProps {
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onShowToast: (msg: string) => void;
  transactions: Transaction[];
}

export const ToolsTab: React.FC<ToolsTabProps> = ({
  onAddTransaction,
  onShowToast,
  transactions,
}) => {
  // Tool 1: Daily Limit state
  const [essentialDailyBudget, setEssentialDailyBudget] = useState(150);

  // Tool 3: Gaming & Activity State
  const [gamingAmount, setGamingAmount] = useState<number | ''>('');
  const [gamingType, setGamingType] = useState<'profit' | 'loss'>('loss');
  const [gamingNote, setGamingNote] = useState('');

  // Calculate Net Gaming
  const gamingTransactions = transactions.filter(
    (t) => t.type === 'expense' && t.category === 'gaming'
  );
  const gamingProfits = transactions
    .filter((t) => t.category === 'gaming' && t.note?.toLowerCase().includes('profit'))
    .reduce((acc, t) => acc + t.amount, 0);
  const gamingLosses = gamingTransactions.reduce((acc, t) => acc + t.amount, 0);
  const gamingNet = gamingProfits - gamingLosses;

  // Handle Preset Quick Add
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

  // Handle Date Night Bundle
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
    onShowToast(`Date Night Bundle logged (৳${bundleAmount}) 💘 ✓`);
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
      onShowToast(`Activity win logged (৳${gamingAmount}) 🎉 ✓`);
    }

    setGamingAmount('');
    setGamingNote('');
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-5 pb-24">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-[#2C2820] font-serif-display">
          Quick Logging Student Tools
        </h2>
        <p className="text-xs text-[#6B6355]">
          Fast one-tap logging for daily BD student essentials, outings, and activity entries.
        </p>
      </div>

      {/* Tool 1: Cigarette & Daily Essentials Budget */}
      <div className="bg-white p-4.5 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] pb-2.5">
          <span className="text-sm font-bold text-[#2C2820] flex items-center gap-2">
            <Cigarette className="w-4 h-4 text-[#445566]" />
            Cigarettes & Daily Essentials
          </span>
          <span className="text-[10px] font-bold bg-[#F0ECE4] text-[#6B6355] px-2 py-0.5 rounded-full">
            1-Tap Add
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-[#6B6355] bg-[#F7F4EF] p-2.5 rounded-xl border border-[rgba(0,0,0,0.06)]">
          <span>Target Daily Limit:</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={essentialDailyBudget}
              onChange={(e) => setEssentialDailyBudget(Number(e.target.value))}
              className="w-16 px-2 py-1 text-xs font-bold rounded border border-[rgba(0,0,0,0.13)] bg-white text-right"
            />
            <span className="font-bold text-[#1D9E75]">৳/day</span>
          </div>
        </div>

        {/* Preset Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {ESSENTIAL_PRESETS.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F4EF] hover:bg-[#F0ECE4] text-xs transition-colors"
            >
              <span className="font-medium text-[#2C2820]">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[#6B6355] font-bold">৳{item.price}</span>
                <button
                  onClick={() => handleAddPreset(item.name, item.price, item.category)}
                  className="px-2.5 py-1 rounded-lg bg-[#1D9E75] text-white text-[11px] font-bold hover:bg-[#1D9E75]/90 active:scale-95 transition-all shadow-2xs"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Combo Box */}
        <div className="bg-[#E1F5EE] border border-[#9FE1CB] p-3 rounded-xl text-xs text-[#1D9E75] flex items-center justify-between mt-1">
          <span className="font-semibold">Suggested Daily Combo:</span>
          <span className="font-bold">1 Stick (৳23) + Milk Tea (৳15) = ৳38</span>
        </div>
      </div>

      {/* Tool 2: Partner & Outings Expenses */}
      <div className="bg-white p-4.5 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] pb-2.5">
          <span className="text-sm font-bold text-[#2C2820] flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#993556]" />
            Partner & Outings Expenses
          </span>
          <span className="text-[10px] font-bold bg-[#FAECE7] text-[#D85A30] px-2 py-0.5 rounded-full">
            Treats
          </span>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PARTNER_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F4EF] hover:bg-[#F0ECE4] text-xs transition-colors"
            >
              <span className="font-medium text-[#2C2820] flex items-center gap-1.5">
                <span>{preset.emoji}</span>
                <span>{preset.name}</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#6B6355] font-bold">৳{preset.price}</span>
                <button
                  onClick={() => handleAddPreset(preset.name, preset.price, 'partner')}
                  className="px-2.5 py-1 rounded-lg bg-[#993556] text-white text-[11px] font-bold hover:bg-[#993556]/90 active:scale-95 transition-all shadow-2xs"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Date Night Bundle Button */}
        <button
          onClick={handleAddDateBundle}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#993556] to-[#D85A30] text-white text-xs font-bold shadow-xs hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 mt-1"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>+ Add Date Night Bundle (Ice Cream + Dinner + Hangout = ৳1,480)</span>
        </button>
      </div>

      {/* Tool 3: Activity & Gaming Tracker */}
      <div className="bg-white p-4.5 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] pb-2.5">
          <span className="text-sm font-bold text-[#2C2820] flex items-center gap-2">
            <Dices className="w-4 h-4 text-[#185FA5]" />
            Activity & Gaming P/L Tracker
          </span>
          <span className="text-[10px] font-bold bg-[#EEEDFE] text-[#534AB7] px-2 py-0.5 rounded-full">
            Profit/Loss
          </span>
        </div>

        <form onSubmit={handleAddGamingEntry} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#A8A090] uppercase block mb-1">
                Amount (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={gamingAmount}
                onChange={(e) => setGamingAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#185FA5]"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#A8A090] uppercase block mb-1">
                Entry Type
              </label>
              <select
                value={gamingType}
                onChange={(e) => setGamingType(e.target.value as 'profit' | 'loss')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#185FA5]"
              >
                <option value="loss">Loss Entry (-Expense)</option>
                <option value="profit">Win / Profit (+Income)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#A8A090] uppercase block mb-1">
              Note / Event Name
            </label>
            <input
              type="text"
              placeholder="e.g. Turf tournament match or FIFA series"
              value={gamingNote}
              onChange={(e) => setGamingNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#185FA5]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#185FA5] to-[#2B6CB0] text-white text-xs font-bold hover:opacity-95 active:scale-98 transition-all shadow-xs"
          >
            Submit Activity Entry
          </button>
        </form>

        <div className="bg-[#F0ECE4] p-3 rounded-xl text-xs flex justify-between items-center text-[#6B6355]">
          <span>Month Activity Net Result:</span>
          <span className={`font-bold ${gamingNet >= 0 ? 'text-[#1D9E75]' : 'text-[#D85A30]'}`}>
            {gamingNet >= 0 ? `+৳${gamingNet}` : `-৳${Math.abs(gamingNet)}`}
          </span>
        </div>
      </div>
    </div>
  );
};
