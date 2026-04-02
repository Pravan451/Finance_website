import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';
import EmiCard from '../components/emi/EmiCard';
import AddEmiModal from '../components/emi/AddEmiModal';

export default function Emi() {
  const { emis, role, recordEmiPayment, darkMode } = useFinanceStore();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const totalMonthlyEmi = emis.reduce((acc, curr) => {
    if (curr.monthsPaid < curr.totalMonths) {
      return acc + curr.monthlyAmount;
    }
    return acc;
  }, 0);

  const totalRemainingDebt = emis.reduce((acc, curr) => {
    return acc + Math.max(0, curr.totalAmount - (curr.monthlyAmount * curr.monthsPaid));
  }, 0);

  const heading = darkMode ? 'text-white' : 'text-slate-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-slate-600';

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`font-display text-2xl font-bold ${heading} mb-1`}>EMIs & Loans</h1>
          <p className={textMuted}>Track and manage your monthly installments</p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 btn-primary py-2.5 px-4 shadow-indigo-500/25 sm:w-auto w-full justify-center"
          >
            <Plus className="h-5 w-5" />
            <span>Add EMI</span>
          </button>
        )}
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-slate-200'}`}>
           <h3 className={`text-sm font-medium ${textMuted} mb-2`}>Total Upcoming EMI (Monthly)</h3>
           <p className={`text-3xl font-bold ${heading}`}>₹{totalMonthlyEmi.toLocaleString()}</p>
        </div>
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-slate-200'}`}>
           <h3 className={`text-sm font-medium ${textMuted} mb-2`}>Total Remaining Debt</h3>
           <p className={`text-3xl font-bold ${heading}`}>₹{totalRemainingDebt.toLocaleString()}</p>
        </div>
      </Motion.div>

      {emis.length > 0 ? (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className={`text-lg font-semibold ${heading} mb-4`}>Your Active EMIs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emis.map((emi) => (
              <EmiCard
                key={emi.id}
                emi={emi}
                onPay={recordEmiPayment}
              />
            ))}
          </div>
        </Motion.div>
      ) : (
        <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed ${darkMode ? 'border-gray-800 bg-gray-900/20 text-gray-500' : 'border-slate-300 bg-slate-50 text-slate-500'}`}>
          <div className={`p-4 rounded-full mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            <Plus className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-slate-300'}`} />
          </div>
          <h3 className={`text-lg font-medium mb-1 ${heading}`}>No EMIs yet</h3>
          <p className="max-w-xs mx-auto">Add your first EMI to start tracking your loans and get timely reminders.</p>
        </div>
      )}

      <AddEmiModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
