import React, { useState, useRef, useEffect } from 'react';
import { RoxiMessage, Transaction } from '../types';
import { Send, Bot, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

interface AIPanelProps {
  transactions: Transaction[];
  monthlyBudgetLimit: number;
  isFullTab?: boolean;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  transactions,
  monthlyBudgetLimit,
  isFullTab = false,
}) => {
  const [messages, setMessages] = useState<RoxiMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello! I am your AI Financial Assistant. How can I help you manage your budget, expenses, or financial calculations today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Financial calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;
  const remainingBudget = monthlyBudgetLimit - totalExpense;

  const quickPrompts = [
    '📊 Monthly Budget Status',
    '💡 Savings Advice',
    '☕ Daily Expenses Check',
    '❓ Check Current Balance',
  ];

  // Smart local advisor response generator
  const generateAIResponse = (userQuery: string): string => {
    const q = userQuery.toLowerCase();

    if (q.includes('টাকা শেষ') || q.includes('out of money') || q.includes('low balance')) {
      return `Your current balance is ৳${currentBalance.toLocaleString('en-BD')}.\n\nTips to manage low balance:\n1. Limit dining out and non-essential shopping.\n2. Prioritize essential bills and dining costs.\n3. Keep track of daily small cash expenses.`;
    }

    if (q.includes('budget') || q.includes('status')) {
      const percentUsed = Math.round((totalExpense / monthlyBudgetLimit) * 100);
      return `Here is your current budget status:\n\n• Total Income: ৳${totalIncome.toLocaleString('en-BD')}\n• Total Expense: ৳${totalExpense.toLocaleString('en-BD')}\n• Budget Used: ${percentUsed}%\n• Remaining Budget: ৳${remainingBudget.toLocaleString('en-BD')}\n\n${
        percentUsed > 80
          ? '⚠️ You have used over 80% of your monthly budget limit. Consider slowing down expenses.'
          : '✅ Your spending is within a healthy range.'
      }`;
    }

    if (q.includes('savings') || q.includes('save')) {
      return `To save effectively:\n• Set aside 10%–20% of income as soon as you receive it.\n• Review daily categories like snacks, tea, and dining out.\n• Keep your monthly limit set to realistic goals.`;
    }

    if (q.includes('balance') || q.includes('check balance')) {
      return `Your current net balance is ৳${currentBalance.toLocaleString('en-BD')} and remaining budget allowance is ৳${remainingBudget.toLocaleString('en-BD')}.`;
    }

    return `Thank you for asking! Your current net balance is ৳${currentBalance.toLocaleString('en-BD')} and total expense this month is ৳${totalExpense.toLocaleString('en-BD')}. Let me know if you need any specific budget or loan calculations.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: RoxiMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/roxi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: { currentBalance, totalExpense, remainingBudget, monthlyBudgetLimit },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.reply || generateAIResponse(query);
        const aiMsg: RoxiMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      setTimeout(() => {
        const fallbackText = generateAIResponse(query);
        const aiMsg: RoxiMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }, 400);
    } finally {
      setIsTyping(false);
    }
  };

  const containerStyle = isFullTab
    ? 'flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col min-h-[calc(100vh-160px)] pb-24'
    : 'w-[320px] h-full bg-white border-l border-[rgba(0,0,0,0.08)] flex flex-col overflow-hidden shrink-0 select-none';

  return (
    <div className={containerStyle}>
      {/* HEADER */}
      <div className="p-3.5 border border-[rgba(0,0,0,0.08)] bg-white rounded-2xl shadow-2xs flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1D9E75] to-[#2B6CB0] flex items-center justify-center text-white text-lg shadow-xs">
            🤖
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-bn text-[#2C2820]">
                Finance AI Assistant
              </span>
              <span className="w-2 h-2 rounded-full bg-[#1D9E75] animate-pulse" />
            </div>
            <span className="text-[10px] text-[#6B6355] font-medium">
              Smart Money & Budget Guide
            </span>
          </div>
        </div>

        <div className="text-[10px] font-bold bg-[#E1F5EE] text-[#1D9E75] px-2.5 py-1 rounded-full">
          ৳{currentBalance.toLocaleString('en-BD')} Bal
        </div>
      </div>

      {/* MESSAGES BOX */}
      <div className="flex-1 p-3.5 bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl shadow-2xs overflow-y-auto scroll-touch flex flex-col gap-3 mb-3">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[90%] gap-1 animate-slide-in ${
                isAI ? 'self-start' : 'self-end items-end'
              }`}
            >
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed font-bn ${
                  isAI
                    ? 'bg-[#EEEDFE] text-[#2C2820] rounded-tl-xs border border-[#AFA9EC]/40'
                    : 'bg-[#E1F5EE] text-[#2C2820] rounded-tr-xs border border-[#9FE1CB]/40 font-medium'
                }`}
              >
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-1' : ''}>
                    {line}
                  </p>
                ))}
              </div>
              <span className="text-[9px] text-[#A8A090] px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {isTyping && (
          <div className="self-start flex items-center gap-1.5 p-3 rounded-2xl bg-[#EEEDFE] text-[#534AB7]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#534AB7] typing-dot-1" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#534AB7] typing-dot-2" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#534AB7] typing-dot-3" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK PROMPTS & INPUT */}
      <div className="bg-white p-3 rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-2xs flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-1.5">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="p-2 rounded-xl bg-[#F7F4EF] hover:bg-[#E1F5EE] text-[11px] font-semibold text-[#2C2820] font-bn text-left truncate transition-colors border border-[rgba(0,0,0,0.06)]"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 mt-1"
        >
          <input
            type="text"
            placeholder="Ask your AI Assistant..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl text-xs font-bn border border-[rgba(0,0,0,0.13)] bg-[#F7F4EF] focus:outline-none focus:border-[#1D9E75]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="w-9 h-9 rounded-xl bg-[#1D9E75] text-white flex items-center justify-center hover:bg-[#1D9E75]/90 disabled:opacity-40 transition-all shrink-0 shadow-2xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
