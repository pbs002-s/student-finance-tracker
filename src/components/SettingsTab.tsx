import React, { useState } from 'react';
import { Category, Transaction } from '../types';
import { SEED_TRANSACTIONS } from '../constants/categories';
import { Settings, Shield, Download, Upload, Trash2, RefreshCw, CheckCircle } from 'lucide-react';

interface SettingsTabProps {
  categories: Category[];
  transactions: Transaction[];
  monthlyBudgetLimit: number;
  onUpdateMonthlyBudget: (newLimit: number) => void;
  onClearAllData: () => void;
  onLoadSampleData: () => void;
  onShowToast: (msg: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  categories,
  transactions,
  monthlyBudgetLimit,
  onUpdateMonthlyBudget,
  onClearAllData,
  onLoadSampleData,
  onShowToast,
}) => {
  const [budgetInput, setBudgetInput] = useState(monthlyBudgetLimit.toString());

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(budgetInput);
    if (val && val > 0) {
      onUpdateMonthlyBudget(val);
      onShowToast(`Monthly Budget updated to ৳${val.toLocaleString('en-BD')} ✓`);
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `takar_hishab_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Backup file downloaded ✓');
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all transactions and reset data? This cannot be undone.')) {
      onClearAllData();
      onShowToast('All data cleared. Ready for fresh use! ✓');
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-5 pb-24">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-[#2C2820] font-serif-display">
          App Settings & Preferences
        </h2>
        <p className="text-xs text-[#6B6355]">
          Manage monthly allowance limits, data backups, and budget configuration.
        </p>
      </div>

      {/* 1. Monthly Budget Goal Settings */}
      <div className="bg-white p-4.5 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xs flex flex-col gap-3">
        <span className="text-sm font-bold text-[#2C2820] flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#1D9E75]" />
          Monthly Allowance & Budget Limit
        </span>

        <form onSubmit={handleSaveBudget} className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#A8A090]">
              ৳
            </span>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-full pl-7 pr-3 py-2 text-xs font-bold rounded-xl border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#1D9E75]"
              placeholder="e.g. 20000"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#1D9E75] text-white text-xs font-bold hover:bg-[#1D9E75]/90 transition-all shadow-2xs"
          >
            Save Target
          </button>
        </form>
      </div>

      {/* 2. Data Backup & Reset */}
      <div className="bg-white p-4.5 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xs flex flex-col gap-3">
        <span className="text-sm font-bold text-[#2C2820] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#534AB7]" />
          Data Management & Storage
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Export JSON */}
          <button
            onClick={handleExportData}
            className="p-3 rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#F7F4EF] hover:bg-[#EEEDFE] text-xs font-bold text-[#2C2820] flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-[#534AB7]" />
              <span>Export Backup JSON</span>
            </div>
            <span className="text-[10px] text-[#A8A090]">Save file</span>
          </button>

          {/* Load Sample Data */}
          <button
            onClick={() => {
              onLoadSampleData();
              onShowToast('Sample test data loaded ✓');
            }}
            className="p-3 rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#F7F4EF] hover:bg-[#E1F5EE] text-xs font-bold text-[#2C2820] flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#1D9E75]" />
              <span>Load Sample Test Data</span>
            </div>
            <span className="text-[10px] text-[#A8A090]">Demo entries</span>
          </button>
        </div>

        {/* Clear All Data */}
        <div className="pt-2 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#D85A30]">Reset All Data</span>
            <span className="text-[10px] text-[#A8A090]">
              Delete all logged transactions and start with a clean slate
            </span>
          </div>

          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-xl border border-[#D85A30] text-[#D85A30] hover:bg-[#FAECE7] text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* 3. Category Budgets Reference */}
      <div className="bg-white p-4.5 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xs flex flex-col gap-3">
        <span className="text-sm font-bold text-[#2C2820]">
          Default Category Budget Limits
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-2.5 rounded-xl bg-[#F7F4EF] flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>{cat.emoji}</span>
                <span className="font-semibold text-[#2C2820]">{cat.name}</span>
              </div>
              <span className="font-bold text-[#6B6355]">
                ৳{cat.budget.toLocaleString('en-BD')}/mo
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
