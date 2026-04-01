import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, ShieldAlert } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';

export default function AuthModal({ isOpen, onClose, onSuccess, requiredRole }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const { darkMode } = useFinanceStore();

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === '1234') {
      onSuccess();
      onClose();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`relative w-full max-w-sm overflow-hidden rounded-3xl p-6 shadow-2xl border ${
              darkMode 
                ? 'bg-gray-900 border-gray-800 shadow-black' 
                : 'bg-white border-slate-200 shadow-slate-300'
            }`}
          >
            <button
              onClick={onClose}
              className={`absolute right-4 top-4 rounded-full p-2 transition-colors ${
                darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
                darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
              }`}>
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h2 className={`mb-1 text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Role Authorization
              </h2>
              <p className={`mb-6 text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Enter PIN to switch to {requiredRole === 'admin' ? 'Admin' : 'Viewer'} mode.
              </p>

              <form onSubmit={handleSubmit} className="w-full">
                <div className="relative mb-6">
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="PIN"
                    maxLength={4}
                    autoFocus
                    className={`w-full rounded-xl border px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] outline-none transition-all ${
                      error
                        ? 'border-rose-500 bg-rose-500/10 text-rose-500 ring-4 ring-rose-500/20'
                        : darkMode
                        ? 'border-gray-700 bg-gray-950/50 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                    }`}
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-6 left-0 right-0 text-center text-xs font-medium text-rose-500"
                    >
                      Incorrect PIN
                    </motion.p>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  disabled={pin.length < 4}
                  className={`w-full rounded-xl py-3 font-semibold text-white transition-all ${
                    pin.length < 4
                      ? darkMode ? 'bg-gray-800 text-gray-500' : 'bg-slate-200 text-slate-400'
                      : 'bg-indigo-600 shadow-lg shadow-indigo-600/25 hover:bg-indigo-700'
                  }`}
                >
                  Confirm Switch
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
