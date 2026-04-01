import useFinanceStore from "../store/useFinanceStore";
import { formatINR } from "../utils/helpers";
import { motion as Motion } from 'framer-motion';
import { Target, AlertCircle } from 'lucide-react';

export default function Budget() {
  const { transactions, categoryBudgets, darkMode } = useFinanceStore();

  // Get the most recent month from transactions to treat as "current month" for the budget
  const latestDate = transactions.length > 0 
    ? new Date(Math.max(...transactions.map(t => new Date(t.date).getTime()))) 
    : new Date();
  const currentMonth = latestDate.getMonth();
  const currentYear = latestDate.getFullYear();

  const expenses = transactions.filter((t) => {
    if (t.type !== "expense") return false;
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const categoryMap = {};
  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  const categories = Object.entries(categoryMap)
    .map(([cat, amount]) => ({
      category: cat,
      amount,
      limit: categoryBudgets?.[cat] ?? 10000,
    }))
    .sort((a, b) => b.amount - a.amount);

  const panel = darkMode ? 'surface-card surface-card--dark' : 'surface-card surface-card--light';
  const heading = darkMode ? 'text-white' : 'text-slate-900';
  const muted = darkMode ? 'text-gray-400' : 'text-slate-600';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className={`font-display text-2xl font-bold flex items-center gap-2 ${heading}`}>
            Budget Tracker <Target className="h-5 w-5 text-indigo-400" />
          </h1>
          <p className={`mt-1 ${muted}`}>Category limits vs. spending (persisted)</p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className={`rounded-2xl p-8 text-center ${panel}`}>
          <p className={muted}>No expense data yet to track.</p>
        </div>
      ) : (
        <div className={`space-y-6 rounded-2xl p-4 sm:p-6 ${panel}`}>
          {categories.map((item, i) => {
            const percentage = Math.min((item.amount / item.limit) * 100, 100);
            const isOverBudget = item.amount > item.limit;
            const isNearBudget = percentage > 80 && !isOverBudget;

            let colorClass = "bg-emerald-500";
            if (isNearBudget) colorClass = "bg-yellow-500";
            if (isOverBudget) colorClass = "bg-rose-500";

            return (
              <Motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01 }}
                key={item.category}
                className="group relative"
              >
                <div className="mb-2 flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.category}</span>
                    {isOverBudget && <AlertCircle className="h-4 w-4 animate-pulse text-rose-500" />}
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${isOverBudget ? 'text-rose-400' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatINR(item.amount)}
                    </span>
                    <span className="text-xs text-gray-500 ml-1 block sm:inline">of {formatINR(item.limit)}</span>
                  </div>
                </div>

                <div className={`flex h-2.5 w-full overflow-hidden rounded-full shadow-inner ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <Motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`relative h-full rounded-full ${colorClass}`}
                  >
                    <div className="absolute inset-0 h-full w-full animate-[shimmer_2s_infinite] bg-white/20"></div>
                  </Motion.div>
                </div>
                {isOverBudget && (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-rose-400">Over budget</p>
                )}
              </Motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
