import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';

const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Salary', 'Investment', 'Freelance', 'Health', 'Other'];

function buildFormState(transaction) {
  return {
    title: transaction.title || transaction.category || '',
    amount: String(transaction.amount),
    type: transaction.type,
    category: transaction.category,
    date: (transaction.date && transaction.date.split('T')[0]) || transaction.date,
  };
}

function EditTransactionForm({ transaction, onClose }) {
  const { updateTransaction } = useFinanceStore();
  const [formData, setFormData] = useState(() => buildFormState(transaction));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transaction || !formData.title || !formData.amount) return;
    updateTransaction(transaction.id, {
      title: formData.title,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
    });
    onClose();
  };

  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="relative w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Edit transaction</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={`rounded-lg border p-2 text-sm font-medium transition-all ${
                formData.type === 'expense'
                  ? 'border-rose-500/50 bg-rose-500/20 text-rose-400'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income' })}
              className={`rounded-lg border p-2 text-sm font-medium transition-all ${
                formData.type === 'income'
                  ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">Title</label>
          <input
            required
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2.5 text-white placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">Amount (₹)</label>
            <input
              required
              type="number"
              min="1"
              step="1"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">Date</label>
            <input
              required
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-400">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn-primary mt-2 w-full py-2.5"
        >
          Save changes
        </button>
      </form>
    </Motion.div>
  );
}

export default function EditTransactionModal({ transaction, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && transaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-md">
            <EditTransactionForm key={transaction.id} transaction={transaction} onClose={onClose} />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
