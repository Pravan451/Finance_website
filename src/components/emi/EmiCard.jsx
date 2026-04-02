import { motion as Motion } from 'framer-motion';
import { CreditCard, Calendar, CheckCircle2, Trash2 } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';

export default function EmiCard({ emi, onPay }) {
  const { deleteEmi, darkMode, role } = useFinanceStore();

  const percentage = Math.min(Math.round((emi.monthsPaid / emi.totalMonths) * 100), 100);
  const isCompleted = emi.monthsPaid >= emi.totalMonths;
  const remainingMonths = emi.totalMonths - emi.monthsPaid;
  const remainingAmount = emi.totalAmount - (emi.monthlyAmount * emi.monthsPaid);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const cardBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200 shadow-sm';
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-slate-500';

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={`relative flex flex-col rounded-2xl border p-5 transition-shadow hover:shadow-lg ${cardBg}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-semibold ${textTitle}`}>{emi.name}</h3>
            <p className={`text-xs ${textMuted}`}>₹{emi.monthlyAmount.toLocaleString()} / month</p>
          </div>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => deleteEmi(emi.id)}
            className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Delete EMI"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className={darkMode ? 'text-gray-800' : 'text-slate-100'}
            />
            <Motion.circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={isCompleted ? 'text-emerald-500' : 'text-indigo-500'}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-lg font-bold ${isCompleted ? 'text-emerald-500' : textTitle}`}>{percentage}%</span>
          </div>
        </div>

        <div className="flex-1 pl-6 space-y-3">
          <div>
            <p className={`text-xs ${textMuted} mb-1`}>Remaining Balance</p>
            <p className={`font-semibold ${textTitle}`}>₹{Math.max(0, remainingAmount).toLocaleString()}</p>
          </div>
          <div>
            <p className={`text-xs ${textMuted} mb-1`}>Months Left</p>
            <p className={`font-medium ${textTitle}`}>
               {remainingMonths <= 0 ? 'Completed 🎉' : `${remainingMonths} months`}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-dashed border-gray-500/20 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span className={`text-xs font-medium ${textMuted}`}>Due on {emi.paymentDay}th</span>
        </div>
        
        <button
          onClick={() => onPay(emi.id)}
          disabled={isCompleted || role !== 'admin'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isCompleted 
              ? 'bg-emerald-500/10 text-emerald-500 cursor-not-allowed'
              : role === 'admin'
                ? 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed hidden md:flex'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {isCompleted ? 'Paid Off' : 'Mark Paid'}
        </button>
      </div>
    </Motion.div>
  );
}
