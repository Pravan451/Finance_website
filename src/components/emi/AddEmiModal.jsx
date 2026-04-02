import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';

export default function AddEmiModal({ isOpen, onClose }) {
  const { addEmi, darkMode } = useFinanceStore();
  
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    totalMonths: '',
    monthlyAmount: '',
    paymentDay: '1'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.totalAmount || !formData.totalMonths || !formData.monthlyAmount || !formData.paymentDay) return;

    const newEmi = {
      id: Date.now().toString(),
      name: formData.name,
      totalAmount: parseFloat(formData.totalAmount),
      totalMonths: parseInt(formData.totalMonths, 10),
      monthlyAmount: parseFloat(formData.monthlyAmount),
      paymentDay: parseInt(formData.paymentDay, 10),
      monthsPaid: 0
    };

    addEmi(newEmi);
    setFormData({ name: '', totalAmount: '', totalMonths: '', monthlyAmount: '', paymentDay: '1' });
    onClose();
  };

  const bgModal = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200';
  const textTitle = darkMode ? 'text-white' : 'text-slate-900';
  const textLabel = darkMode ? 'text-gray-400' : 'text-slate-600';
  const inputStyle = darkMode 
    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-indigo-500' 
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-indigo-500';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 backdrop-blur-sm ${darkMode ? 'bg-black/60' : 'bg-slate-900/20'}`}
          />
          
          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative border rounded-2xl p-6 w-full max-w-md shadow-2xl overflow-hidden ${bgModal}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${textTitle}`}>Add New EMI</h2>
              <button onClick={onClose} className={`p-1 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${textLabel}`}>Loan Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Car Loan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:border-transparent transition-all ${inputStyle}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${textLabel}`}>Total Amount (₹)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="500000"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2 transition-all ${inputStyle}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${textLabel}`}>Monthly EMI (₹)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="15000"
                    value={formData.monthlyAmount}
                    onChange={(e) => setFormData({ ...formData, monthlyAmount: e.target.value })}
                    className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2 transition-all ${inputStyle}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${textLabel}`}>Total Months</label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="36"
                    value={formData.totalMonths}
                    onChange={(e) => setFormData({ ...formData, totalMonths: e.target.value })}
                    className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2 transition-all ${inputStyle}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${textLabel}`}>Payment Day (1-31)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="31"
                    placeholder="5"
                    value={formData.paymentDay}
                    onChange={(e) => setFormData({ ...formData, paymentDay: e.target.value })}
                    className={`w-full border rounded-lg p-2.5 outline-none focus:ring-2 transition-all ${inputStyle}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary mt-4 w-full py-2.5"
              >
                Save EMI
              </button>
            </form>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
