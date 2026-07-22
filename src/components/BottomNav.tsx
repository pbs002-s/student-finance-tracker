import React from 'react';
import { Home, Zap, Receipt, Bot, Settings } from 'lucide-react';

export type NavTab = 'home' | 'tools' | 'txns' | 'ai' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadAiBadge?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadAiBadge,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'tools' as NavTab, label: 'Tools', icon: Zap },
    { id: 'txns' as NavTab, label: 'History', icon: Receipt },
    { id: 'ai' as NavTab, label: 'Finance AI', icon: Bot, badge: unreadAiBadge },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-white border-t border-[rgba(0,0,0,0.08)] shadow-lg px-2 py-1.5 flex items-center justify-around select-none pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
              isActive
                ? 'text-[#1D9E75] font-bold scale-105'
                : 'text-[#6B6355] font-medium hover:text-[#2C2820]'
            }`}
          >
            {/* Active Pill Indicator */}
            {isActive && (
              <span className="absolute inset-0 bg-[#E1F5EE] rounded-2xl -z-10 animate-slide-in" />
            )}

            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D85A30] rounded-full ring-2 ring-white animate-pulse" />
              )}
            </div>

            <span className="text-[10px] tracking-tight mt-1 font-bn">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
