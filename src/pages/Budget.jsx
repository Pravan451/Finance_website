import useFinanceStore from "../store/useFinanceStore";
import { formatINR } from "../utils/helpers";
import { motion as Motion } from 'framer-motion';
import { Target, AlertCircle, Wallet, Activity, ArrowUpRight } from 'lucide-react';

// Reusable progress gradient map
const getGradient = (percentage, isOver) => {
  if (isOver) return "from-rose-500 to-red-600 shadow-rose-500/50";
  if (percentage > 80) return "from-amber-400 to-orange-500 shadow-orange-500/50";
  return "from-emerald-400 to-teal-500 shadow-emerald-500/50";
};

export default function Budget() {
  const { transactions, categoryBudgets, darkMode } = useFinanceStore();

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

  const totalBudget = categories.reduce((sum, c) => sum + c.limit, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.amount, 0);
  const overallPercentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  
  const heading = darkMode ? 'text-white' : 'text-slate-900';
  const muted = darkMode ? 'text-gray-400' : 'text-slate-500';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className={`font-display text-3xl font-extrabold flex items-center gap-3 ${heading} tracking-tight`}>
          <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
            <Target className="h-6 w-6" />
          </div>
          Budget Analytics
        </h1>
        <p className={muted}>Real-time tracking of your spending limits across all categories.</p>
      </div>

      {categories.length === 0 ? (
        <div className={`rounded-3xl p-12 text-center border shadow-sm ${darkMode ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-slate-200'}`}>
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Activity className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className={`text-xl font-semibold mb-2 ${heading}`}>No Active Budgets</h2>
          <p className={muted}>Log some expenses to start tracking your budget limits automatically.</p>
        </div>
      ) : (
        <>
          {/* Top Level Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <Motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col justify-center ${
                darkMode ? 'bg-gradient-to-br from-indigo-900/40 to-violet-900/20 border-indigo-500/20' : 'bg-gradient-to-br from-indigo-600 to-violet-700 border-indigo-400 text-white'
              }`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none mix-blend-overlay">
                <Wallet className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex flex-col gap-1">
                <span className={`text-sm font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-200'}`}>Cumulative Budget (Active Categories)</span>
                <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-white'}`}>
                  {formatINR(totalBudget)}
                </span>
              </div>
            </Motion.div>

            <Motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              className={`rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col justify-center ${
                darkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-slate-200'
              } backdrop-blur-xl`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <span className={`text-sm font-medium ${muted}`}>Total Spent</span>
                  <span className={`text-3xl font-bold tracking-tight ${totalSpent > totalBudget ? 'text-rose-500' : heading}`}>
                    {formatINR(totalSpent)}
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 ${
                  totalSpent > totalBudget 
                    ? darkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'
                    : darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {overallPercentage.toFixed(1)}% <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Master Bar */}
              <div className={`h-3 w-full rounded-full shadow-inner overflow-hidden ${darkMode ? 'bg-gray-800/80' : 'bg-slate-100'}`}>
                <Motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallPercentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r relative ${getGradient(overallPercentage, totalSpent > totalBudget)}`}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                </Motion.div>
              </div>
            </Motion.div>
          </div>

          <h2 className={`font-display text-xl font-bold mt-10 mb-4 ${heading}`}>Category Breakdown</h2>

          {/* Granular Grid */}
          <Motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {categories.map((item) => {
              const percentage = Math.min((item.amount / item.limit) * 100, 100);
              const isOverBudget = item.amount > item.limit;
              const isNearBudget = percentage > 80 && !isOverBudget;

              return (
                <Motion.div
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  key={item.category}
                  className={`relative group rounded-3xl p-6 border transition-all duration-300 shadow-md hover:shadow-xl ${
                    darkMode 
                      ? isOverBudget ? 'bg-rose-950/20 border-rose-900/50' : 'bg-gray-900/40 border-gray-800'
                      : isOverBudget ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'
                  } backdrop-blur-md`}
                >
                  {isOverBudget && (
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-rose-500 text-white rounded-full p-2 shadow-lg animate-pulse z-10">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}

                  <div className="flex flex-col gap-5 h-full">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold tracking-tight text-lg ${darkMode ? 'text-gray-100' : 'text-slate-800'}`}>
                        {item.category}
                      </h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isOverBudget 
                          ? 'bg-rose-500/20 text-rose-500' 
                          : isNearBudget 
                            ? 'bg-amber-500/20 text-amber-500' 
                            : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isOverBudget ? 'OVER' : isNearBudget ? 'NEAR LIMIT' : 'OK'}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-end justify-between mb-2">
                        <div className="flex flex-col">
                          <span className={`text-sm ${muted}`}>Spent</span>
                          <span className={`text-xl font-extrabold ${isOverBudget ? 'text-rose-500' : heading}`}>
                            {formatINR(item.amount)}
                          </span>
                        </div>
                        <div className="text-right flex flex-col">
                          <span className={`text-sm ${muted}`}>Budget</span>
                          <span className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                            {formatINR(item.limit)}
                          </span>
                        </div>
                      </div>

                      <div className={`mt-2 flex h-2 w-full overflow-hidden rounded-full shadow-inner ${darkMode ? 'bg-gray-800/80' : 'bg-slate-100'}`}>
                        <Motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                          className={`relative h-full rounded-full bg-gradient-to-r shadow-lg ${getGradient(percentage, isOverBudget)}`}
                        >
                          <div className="absolute inset-0 h-full w-full animate-[shimmer_2s_infinite] bg-white/25 mix-blend-overlay"></div>
                        </Motion.div>
                      </div>
                    </div>
                  </div>
                </Motion.div>
              );
            })}
          </Motion.div>
        </>
      )}
    </div>
  );
}
