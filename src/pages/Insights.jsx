import { useState, useRef, useEffect, useMemo } from 'react';
import useFinanceStore from "../store/useFinanceStore";
import { motion as Motion } from 'framer-motion';
import { Send, Bot, User, Sparkles, TrendingDown, Calendar, PieChart } from 'lucide-react';
import { formatINR, monthlyTotalsByMonth, expensesByCategory } from '../utils/helpers';

export default function Insights() {
  const { transactions, darkMode, categoryBudgets, emis } = useFinanceStore();

  const metrics = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const expense = transactions.filter((t) => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    const byMonth = monthlyTotalsByMonth(transactions);
    const last = byMonth.slice(-2);
    const prev = last[0];
    const curr = last[1];
    const expenseDelta =
      prev && curr ? Math.round(((curr.expense - prev.expense) / (prev.expense || 1)) * 100) : 0;
    const cats = expensesByCategory(transactions);
    const top = cats[0];
    return { income, expense, net: income - expense, prev, curr, expenseDelta, top };
  }, [transactions]);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm a **demo assistant** (no API keys). Ask me about spending, categories, or savings — replies use your live transaction data.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAIResponse = (userQuery) => {
    const q = userQuery.toLowerCase();
    const expenses = transactions.filter((t) => t.type === 'expense');
    const income = transactions.filter((t) => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
    
    const recent = [...transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    const recentStr = recent.map(t => `${t.title} (${formatINR(t.amount)})`).join(', ');

    const activeEmis = emis.filter(e => e.monthsPaid < e.totalMonths);
    const emiTotal = activeEmis.reduce((acc, curr) => acc + curr.monthlyAmount, 0);

    const categoryMap = {};
    expenses.forEach((t) => (categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount));
    
    if (q.includes('budget') || q.includes('limit')) {
      const overBudgetCount = Object.entries(categoryMap).filter(([cat, amt]) => amt > (categoryBudgets[cat] || 0)).length;
      return `Your total monthly budget across all categories is **${formatINR(Object.values(categoryBudgets).reduce((a,b)=>a+b, 0))}**. You are currently over-budget in **${overBudgetCount} categories**.`;
    }

    if (q.includes('emi') || q.includes('loan') || q.includes('debt') || q.includes('upcoming')) {
      return activeEmis.length > 0
        ? `You have **${activeEmis.length} active EMIs** totaling **${formatINR(emiTotal)} per month**. Don't forget to track their payments!`
        : `Great news! You have **0 active EMIs** right now, which means you're debt-free in the tracker.`;
    }

    if (q.includes('recent') || q.includes('transaction')) {
      return recent.length > 0
        ? `Your most recent transactions are: **${recentStr}**. Total spending so far is **${formatINR(totalExpenses)}**.`
        : `You don't have any recent transactions logged yet.`;
    }

    if (q.includes('income') || q.includes('earning') || q.includes('save') || q.includes('saving')) {
      return `Your total tracked income is **${formatINR(income)}**. With expenses at **${formatINR(totalExpenses)}**, your current net savings stand at **${formatINR(income - totalExpenses)}**.`;
    }
    
    if (q.includes('spend') || q.includes('expense')) {
      const highestCat = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];
      return `Your total expenses are **${formatINR(totalExpenses)}**. ${highestCat ? `Most of this is going towards **${highestCat[0]}** (${formatINR(highestCat[1])}).` : ''}`;
    }

    // Default comprehensive catch-all state
    return `Looking at all your data: You have **${formatINR(income)}** in income, **${formatINR(totalExpenses)}** in expenses, and **${activeEmis.length} active EMIs** (${formatINR(emiTotal)}/mo). Your most recent logged transaction was **${recent[0]?.title || 'none'}**.`;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const aiResponseContent = generateAIResponse(input);
      setMessages((prev) => [...prev, { role: 'assistant', content: aiResponseContent }]);
      setIsTyping(false);
    }, 900 + Math.random() * 1000);
  };

  const panel = darkMode ? 'surface-card surface-card--dark' : 'surface-card surface-card--light';
  const sub = darkMode ? 'text-gray-400' : 'text-slate-600';
  const heading = darkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className="flex flex-col gap-6 lg:max-h-[calc(100vh-8rem)]">
      <div>
        <h1 className={`font-display text-2xl font-bold flex items-center gap-2 ${heading}`}>
          Insights <Sparkles className="h-5 w-5 text-indigo-400" />
        </h1>
        <p className={sub}>Observations from your data + optional chat demo</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Motion.div
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className={`rounded-2xl p-4 sm:p-5 ${panel}`}
        >
          <div className="mb-2 flex items-center gap-2 text-rose-400">
            <TrendingDown className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wide">Top spend</span>
          </div>
          <p className={`text-lg font-semibold ${heading}`}>{metrics.top ? metrics.top.name : '—'}</p>
          <p className={`mt-1 text-sm ${sub}`}>{metrics.top ? formatINR(metrics.top.value) : 'No expenses yet'}</p>
        </Motion.div>
        <Motion.div
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className={`rounded-2xl p-4 sm:p-5 ${panel}`}
        >
          <div className="mb-2 flex items-center gap-2 text-amber-400">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wide">Monthly comparison</span>
          </div>
          {metrics.prev && metrics.curr ? (
            <>
              <p className={`text-sm ${sub}`}>
                {metrics.prev.month} → {metrics.curr.month}
              </p>
              <p className={`mt-2 font-semibold ${heading}`}>
                Expenses {metrics.expenseDelta >= 0 ? 'up' : 'down'}{' '}
                <span className={metrics.expenseDelta >= 0 ? 'text-rose-400' : 'text-emerald-400'}>
                  {Math.abs(metrics.expenseDelta)}%
                </span>
              </p>
            </>
          ) : (
            <p className={`text-sm ${sub}`}>Need data in at least two months.</p>
          )}
        </Motion.div>
        <Motion.div
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className={`rounded-2xl p-4 sm:p-5 ${panel}`}
        >
          <div className="mb-2 flex items-center gap-2 text-emerald-400">
            <PieChart className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wide">Net position</span>
          </div>
          <p className={`text-lg font-semibold ${heading}`}>{formatINR(metrics.net)}</p>
          <p className={`mt-1 text-sm ${sub}`}>Income − expenses (all time)</p>
        </Motion.div>
      </div>

      <div className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl ${panel}`}>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, index) => (
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={index}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-500/50 bg-indigo-500/20">
                  <Bot className="h-5 w-5 text-indigo-400" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  msg.role === 'user'
                    ? 'rounded-tr-sm bg-indigo-600 text-white'
                    : darkMode
                    ? 'rounded-tl-sm border border-gray-700 bg-gray-800 text-gray-200'
                    : 'rounded-tl-sm border border-gray-200 bg-gray-50 text-gray-800'
                }`}
                dangerouslySetInnerHTML={{
                  __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                }}
              />

              {msg.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-600 bg-gray-700">
                  <User className="h-5 w-5 text-gray-300" />
                </div>
              )}
            </Motion.div>
          ))}

          {isTyping && (
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/50 bg-indigo-500/20">
                <Bot className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-gray-700 bg-gray-800 px-5 py-4">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
              </div>
            </Motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={`border-t p-4 ${darkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about spending, habits, or savings..."
              className={`w-full rounded-xl border py-3.5 pl-4 pr-12 outline-none transition-all focus:ring-2 focus:ring-indigo-500 ${
                darkMode
                  ? 'border-gray-700 bg-gray-900 text-white placeholder-gray-500'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-indigo-600 p-2 text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-700"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-3 text-center text-xs text-gray-500">Mocked replies — uses your local data only; no external API.</p>
        </div>
      </div>
    </div>
  );
}
