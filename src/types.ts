export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  budget: number; // Monthly budget in BDT ৳
}

export interface Transaction {
  id: string;
  type: TransactionType;
  desc: string;
  category?: string; // Category ID or Name
  source?: string;   // Income source name (e.g., Monthly Allowance, Tuition)
  amount: number;    // Stored in BDT ৳
  date: string;      // YYYY-MM-DD
  note?: string;
}

export interface EssentialPreset {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface PartnerPreset {
  id: string;
  name: string;
  price: number;
  emoji: string;
}

export interface GamingEntry {
  id: string;
  amount: number;
  type: 'profit' | 'loss';
  note: string;
  date: string;
}

export interface RoxiMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export interface AppStats {
  totalBalance: number;
  totalSpent: number;
  totalSaved: number;
  dailyEssentialsSpend: number;
  partnerSpend: number;
  gamingNet: number;
}
