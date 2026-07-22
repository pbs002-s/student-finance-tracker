import React from 'react';
import { NavTab } from './BottomNav';
import { Home, Zap, Receipt, Bot, Settings, Plus, Wallet } from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentMonthYear: string;
  onOpenExpenseModal: () => void;
  onOpenIncomeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentMonthYear,
  onOpenExpenseModal,
  onOpenIncomeModal,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Dashboard', icon: Home },
    { id: 'tools' as NavTab, label: 'Quick Tools', icon: Zap },
    { id: 'txns' as NavTab, label: 'History', icon: Receipt },
    { id: 'ai' as NavTab, label: 'Finance AI', icon: Bot },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[rgba(0,0,0,0.08)] shadow-2xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D9E75] to-[#2B6CB0] flex items-center justify-center text-white text-xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
            💸
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-bn text-[#1D9E75] leading-tight tracking-tight">
                টাকার হিসাব
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E1F5EE] text-[#1D9E75] border border-[#9FE1CB]/50">
                BD Student Finance
              </span>
            </div>
            <span className="text-[11px] font-medium text-[#6B6355]">
              {currentMonthYear} Tracker
            </span>
          </div>
        </div>

        {/* Desktop & Tablet Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#F7F4EF] p-1.5 rounded-2xl border border-[rgba(0,0,0,0.06)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-[#1D9E75] shadow-xs'
                    : 'text-[#6B6355] hover:text-[#2C2820] hover:bg-white/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1D9E75]' : ''}`} />
                <span className="font-bn">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons (+ Expense, + Income) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenExpenseModal}
            className="px-3 py-2 rounded-xl text-xs font-bold border border-[#D85A30] text-[#D85A30] hover:bg-[#FAECE7] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>

          <button
            onClick={onOpenIncomeModal}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1D9E75] text-white hover:bg-[#1D9E75]/90 active:scale-95 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Income</span>
          </button>
        </div>
      </div>
    </header>
  );
};
