import { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';

function CustomSelect({ value, onChange, options, darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative min-w-[160px]" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500 ${
          darkMode
            ? 'border-gray-700 bg-gray-800 text-white hover:border-indigo-500/50'
            : 'border-slate-300 bg-white text-slate-900 hover:border-indigo-400'
        }`}
      >
        <span className="truncate text-sm">{selectedOption?.label}</span>
        <ChevronDown className={`ml-2 h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 mt-2 z-30 w-full overflow-hidden rounded-xl border py-1 shadow-2xl ${
              darkMode ? 'border-gray-800 bg-gray-900 shadow-black/50' : 'border-slate-200 bg-white shadow-slate-300/50'
            }`}
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    value === option.value
                      ? darkMode
                        ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                        : 'bg-indigo-50 text-indigo-600 font-medium'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AddTransactionModal({ isOpen, onClose }) {
  const { addTransaction, darkMode } = useFinanceStore();
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Salary', 'Investment', 'Freelance', 'Health', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    const newTx = {
      id: Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount)
    };

    addTransaction(newTx);
    setFormData({ ...formData, title: '', amount: '' });
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-transparent backdrop-blur-md"
          />
          
          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative rounded-2xl border p-6 w-full max-w-md shadow-2xl overflow-visible ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Add Transaction</h2>
              <button 
                onClick={onClose} 
                className={`p-1 rounded-full transition-colors ${
                  darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                      formData.type === 'expense' 
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' 
                        : darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >Expense</button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                      formData.type === 'income' 
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500' 
                        : darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >Income</button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Grocery Run"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full rounded-lg border p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-transparent' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-transparent'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>Amount (₹)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={`w-full rounded-lg border p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-transparent' 
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-transparent'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>Date</label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full rounded-lg border p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-transparent [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert' 
                        : 'bg-white border-slate-300 text-slate-900 focus:border-transparent'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>Category</label>
                <div className="relative">
                  <CustomSelect
                    value={formData.category}
                    onChange={(val) => setFormData({ ...formData, category: val })}
                    darkMode={darkMode}
                    options={categories.map((c) => ({ value: c, label: c }))}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary mt-2 w-full py-2.5"
              >
                Save Transaction
              </button>
            </form>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
