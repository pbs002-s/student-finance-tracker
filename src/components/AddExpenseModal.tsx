import React, { useState } from 'react';
import { Category, Transaction } from '../types';
import { X, Plus } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  categories: Category[];
  onClose: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onShowToast: (msg: string) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  categories,
  onClose,
  onAddTransaction,
  onShowToast,
}) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;

    onAddTransaction({
      type: 'expense',
      desc,
      category,
      amount: Number(amount),
      date,
      note,
    });

    onShowToast(`Expense of ৳${amount} logged ✓`);
    setDesc('');
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-slide-in">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-md border border-[rgba(0,0,0,0.13)] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.08)] pb-3">
          <span className="text-base font-bold text-[#2C2820] font-serif-display">
            Add Expense Entry
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#A8A090] hover:text-[#2C2820] hover:bg-[#F0ECE4] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-bold text-[#A8A090] uppercase block mb-1">
              Description / Item Name
            </label>
            <input
              type="text"
              placeholder="e.g. Hall Khichuri Lunch"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#D85A30]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#A8A090] uppercase block mb-1">
                Amount (৳)
              </label>
              <input
                type="number"
                placeholder="e.g. 250"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#D85A30]"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#A8A090] uppercase block mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#D85A30]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#A8A090] uppercase block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#D85A30]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#A8A090] uppercase block mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Paid via bKash"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#D85A30]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[rgba(0,0,0,0.08)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B6355] hover:bg-[#F0ECE4] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#D85A30] text-white hover:bg-[#D85A30]/90 transition-all shadow-xs"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
