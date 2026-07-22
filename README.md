<div align="center">

  <h1>💸 Takar Hisab</h1>
  <p><strong>A Modern, Full-Stack Personal & Student Finance Tracker Application</strong></p>

  <p>
    <a href="#key-features">Key Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#license">License</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  </p>

</div>

---

## 🌟 Overview

**Takar Hisab** is a feature-rich web application designed for students and individuals to track daily expenses, manage monthly budget allowances, calculate loan EMIs, convert live currencies, and consult an integrated **AI Finance Assistant**.

Built with a responsive, desktop & mobile-first interface, it features native gesture support, smooth view slide transitions, offline-first localStorage persistence, and server-side AI integration.

---

## 🚀 Key Features

### 📊 1. Real-Time Dashboard & Budget Meter
- **Live Net Balance**: Instantly calculates net balance (`Total Income - Total Expense`).
- **Visual Budget Progress**: Dynamic color-coded meter tracking budget utilization.
- **Spending Analytics**: Categorized bar charts highlighting top spending areas.
- **Recent Activity Feed**: Real-time list of recent transactions with category icons.

### 🛠️ 2. Integrated Utility Tools
- **🧮 Loan / EMI Calculator**: Calculate monthly instalments, total interest, and total payable amount with adjustable interest rates and tenures.
- **👥 Split Bill Manager**: Effortlessly split restaurant or hangout bills among friends with tipping support and individual share breakdowns.
- **💱 Live Currency Converter**: Convert BDT to USD ($), EUR (€), GBP (£), INR (₹), and SAR with real-time exchange rate updates.

### 🤖 3. Finance AI Assistant
- **Smart Budget Guidance**: Instant AI insights on remaining allowance, low balance alerts, and savings tips.
- **Conversational Queries**: Ask financial and budget management questions in natural language.
- **Quick Prompts**: Built-in instant action chips for quick queries.

### 🧾 4. Comprehensive Transaction Management
- **Expense & Income Logging**: Easily log cash, card, and digital payment transactions.
- **Filtering & Search**: Filter transactions by type (Expense / Income) and custom search query.
- **Data Export & Import**: Download your entire transaction log as a CSV spreadsheet or backup JSON.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Motion (Framer Motion)
- **Backend**: Node.js, Express.js
- **Build System**: Vite, Esbuild, TSX
- **Data Storage**: Client-side `localStorage` with JSON export/import capability

---

## 🏁 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18 or higher) and **npm** installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/takar-hisab.git
   cd takar-hisab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional for Gemini AI)
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

---

## 📁 Project Structure

```text
├── src/
│   ├── components/       # React UI Components
│   │   ├── Navbar.tsx           # Web Navigation Bar
│   │   ├── BottomNav.tsx        # Responsive Mobile Navigation
│   │   ├── DashboardTab.tsx     # Financial Overview & Analytics
│   │   ├── ToolsTab.tsx         # EMI, Split Bill & Currency Tools
│   │   ├── TransactionsTab.tsx  # Logs, Filters & Export
│   │   ├── AIPanel.tsx          # Finance AI Assistant Chat UI
│   │   ├── SettingsTab.tsx      # Budget Controls & Data Backups
│   │   ├── AddExpenseModal.tsx  # Add Expense Modal Form
│   │   └── AddIncomeModal.tsx   # Add Income Modal Form
│   ├── constants/        # Categories & Seed Data
│   ├── types.ts          # TypeScript Type Definitions
│   ├── App.tsx           # Main App State & Layout
│   └── main.tsx          # Client Entry Point
├── server.ts             # Express Server & API Proxy
├── package.json          # Dependencies & Scripts
└── README.md             # Project Documentation
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
