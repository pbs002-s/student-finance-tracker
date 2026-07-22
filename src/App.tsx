import React, { useState, useEffect, useRef } from 'react';
import { Transaction } from './types';
import { CATEGORIES, SEED_TRANSACTIONS } from './constants/categories';
import { Navbar } from './components/Navbar';
import { BottomNav, NavTab } from './components/BottomNav';
import { FAB } from './components/FAB';
import { DashboardTab } from './components/DashboardTab';
import { ToolsTab } from './components/ToolsTab';
import { TransactionsTab } from './components/TransactionsTab';
import { AIPanel } from './components/AIPanel';
import { SettingsTab } from './components/SettingsTab';
import { AddExpenseModal } from './components/AddExpenseModal';
import { AddIncomeModal } from './components/AddIncomeModal';
import { Toast } from './components/Toast';
import { motion, AnimatePresence } from 'motion/react';

const TABS: NavTab[] = ['home', 'tools', 'txns', 'ai', 'settings'];

export default function App() {
  // 1. Transactions State: Persisted under key 'txns'.
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('txns');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse txns from localStorage', e);
    }
    return []; // Clean ready-to-use website state
  });

  // 2. Active Tab State ('home' | 'tools' | 'txns' | 'ai' | 'settings')
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Selected Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Monthly Budget limit state (persisted in localStorage as well)
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('monthly_budget_limit');
      if (saved) {
        const num = Number(saved);
        if (num > 0) return num;
      }
    } catch (e) {}
    return 20000;
  });

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Touch Swipe Gesture State
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Sync transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('txns', JSON.stringify(transactions));
    } catch (e) {
      console.warn('Failed to save txns to localStorage', e);
    }
  }, [transactions]);

  // Sync monthly budget to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('monthly_budget_limit', monthlyBudgetLimit.toString());
    } catch (e) {}
  }, [monthlyBudgetLimit]);

  // Change tab with slide direction animation
  const handleTabChange = (newTab: NavTab) => {
    const oldIdx = TABS.indexOf(activeTab);
    const newIdx = TABS.indexOf(newTab);
    if (newIdx > oldIdx) {
      setSlideDirection('right');
    } else {
      setSlideDirection('left');
    }
    setActiveTab(newTab);
  };

  // Touch handlers for horizontal swiping between tabs
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Only trigger swipe if horizontal movement > 45px and more horizontal than vertical
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      const currentIdx = TABS.indexOf(activeTab);
      if (deltaX < 0 && currentIdx < TABS.length - 1) {
        // Swipe left -> Next tab
        handleTabChange(TABS[currentIdx + 1]);
      } else if (deltaX > 0 && currentIdx > 0) {
        // Swipe right -> Previous tab
        handleTabChange(TABS[currentIdx - 1]);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Show Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Handlers
  const handleAddTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...t,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearAllData = () => {
    setTransactions([]);
    try {
      localStorage.removeItem('txns');
    } catch (e) {}
  };

  const handleLoadSampleData = () => {
    setTransactions(SEED_TRANSACTIONS);
  };

  // Format Current Month & Year (e.g. "July 2026")
  const currentMonthYear = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Slide Animation variants
  const slideVariants = {
    initial: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? 60 : -60,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? -60 : 60,
      opacity: 0,
      transition: { duration: 0.15, ease: 'easeIn' },
    }),
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#2C2820] flex flex-col font-sans selection:bg-[#1D9E75]/20 overflow-x-hidden">
      {/* Top Web Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        currentMonthYear={currentMonthYear}
        onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
        onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
      />

      {/* Main Website Viewport */}
      <div className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col relative">
        {/* Mobile Swipe Helper Bar */}
        <div className="md:hidden mb-3 bg-[#E1F5EE] border border-[#9FE1CB]/60 px-3 py-1.5 rounded-xl flex items-center justify-between text-[11px] font-semibold text-[#1D9E75] select-none">
          <span>👈 Swipe screens or tap tabs below 👇</span>
          <div className="flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`h-1.5 rounded-full transition-all ${
                  activeTab === tab ? 'w-4 bg-[#1D9E75]' : 'w-1.5 bg-[#1D9E75]/30'
                }`}
                title={`Go to ${tab}`}
              />
            ))}
          </div>
        </div>

        {/* View Content */}
        <main
          className="flex-1 flex flex-col relative w-full"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={activeTab}
              custom={slideDirection}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 flex flex-col w-full"
            >
              {activeTab === 'home' && (
                <DashboardTab
                  categories={CATEGORIES}
                  transactions={transactions}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  monthlyBudgetLimit={monthlyBudgetLimit}
                  onNavigateToTxns={() => handleTabChange('txns')}
                  onNavigateToTools={() => handleTabChange('tools')}
                  onNavigateToAI={() => handleTabChange('ai')}
                  onNavigateToSettings={() => handleTabChange('settings')}
                  onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
                  onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
                />
              )}

              {activeTab === 'tools' && (
                <ToolsTab
                  onAddTransaction={handleAddTransaction}
                  onShowToast={showToast}
                  transactions={transactions}
                />
              )}

              {activeTab === 'txns' && (
                <TransactionsTab
                  categories={CATEGORIES}
                  transactions={transactions}
                  onDeleteTransaction={handleDeleteTransaction}
                  onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
                  onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'ai' && (
                <AIPanel
                  transactions={transactions}
                  monthlyBudgetLimit={monthlyBudgetLimit}
                  isFullTab={true}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsTab
                  categories={CATEGORIES}
                  transactions={transactions}
                  monthlyBudgetLimit={monthlyBudgetLimit}
                  onUpdateMonthlyBudget={setMonthlyBudgetLimit}
                  onClearAllData={handleClearAllData}
                  onLoadSampleData={handleLoadSampleData}
                  onShowToast={showToast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Action Button (Quick Add) */}
      <FAB
        onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
        onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
      />

      {/* Mobile Bottom Navigation (Hidden on desktop md:) */}
      <div className="md:hidden sticky bottom-0 z-40">
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        categories={CATEGORIES}
        onClose={() => setIsExpenseModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        onShowToast={showToast}
      />

      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
