import { motion as Motion } from 'framer-motion';
import useAnimatedCount from '../../hooks/useAnimatedCount';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';

export default function SummaryCard({ title, amount, type, trend, trendLabel }) {
  const darkMode = useFinanceStore((s) => s.darkMode);
  const animatedAmount = useAnimatedCount(amount, 1000);
  
  const config = {
    balance: { icon: Wallet, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    income: { icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    expense: { icon: ArrowDownRight, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  };

  const Icon = config[type]?.icon || Wallet;

  return (
    <Motion.div 
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className={`surface-card flex flex-col gap-3 overflow-hidden rounded-2xl border p-5 md:p-6 ${
        darkMode ? 'surface-card--dark shadow-inner-glow' : 'surface-card--light'
      } group shadow-lg w-full`}
    >
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40 ${config[type].color.replace('text-', 'bg-')}`}></div>
      
      <div className="flex items-center gap-3 relative z-10">
        <div className={`rounded-xl p-2.5 shadow-inner transition-transform duration-300 group-hover:scale-105 ${config[type].bg} ${config[type].color}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <p className={`font-medium tracking-wide text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
      </div>
      
      <div className="relative z-10 mt-1">
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${type === 'balance' ? (darkMode ? 'text-white' : 'text-gray-900') : config[type].color} drop-shadow-sm`}>
          ₹{animatedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </h2>
      </div>

      {trend !== undefined && (
        <div className="relative z-10 mt-2 flex items-center gap-1.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
            trend > 0 
              ? (type === 'expense' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500')
              : trend < 0 
                ? (type === 'expense' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500')
                : 'bg-gray-500/10 text-gray-400'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
            {trendLabel || 'vs last month'}
          </span>
        </div>
      )}
    </Motion.div>
  );
}
