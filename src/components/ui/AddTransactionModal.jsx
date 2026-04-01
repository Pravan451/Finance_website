import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';

export default function AddTransactionModal({ isOpen, onClose }) {
  const { addTransaction } = useFinanceStore();
  
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add Transaction</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`p-2 rounded-lg border text-sm font-medium transition-all ${formData.type === 'expense' ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                  >Expense</button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`p-2 rounded-lg border text-sm font-medium transition-all ${formData.type === 'income' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                  >Income</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Grocery Run"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Amount (₹)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
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
