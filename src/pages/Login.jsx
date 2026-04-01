import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ArrowRight, ShieldCheck } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

export default function Login() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, darkMode } = useFinanceStore();

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsSuccess(true);
      setError(false);
      setTimeout(() => {
        login();
        navigate('/dashboard', { replace: true });
      }, 800);
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${darkMode ? 'bg-gray-950' : 'bg-slate-50'}`}>
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/20 blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`relative z-10 w-full max-w-md p-8 md:p-10 rounded-3xl border shadow-2xl backdrop-blur-xl ${
          darkMode 
            ? 'bg-gray-900/60 border-gray-800 shadow-black/50' 
            : 'bg-white/70 border-white shadow-slate-200/50'
        }`}
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-xl ${
              isSuccess 
                ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                : darkMode 
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/20' 
                  : 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-indigo-500/30'
            }`}
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0, opacity: 0, rotate: -90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: 'spring' }}
                >
                  <Unlock className="w-10 h-10" />
                </motion.div>
              ) : (
                <motion.div
                  key="lock"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Lock className="w-10 h-10" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <h1 className={`text-2xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Welcome Back
          </h1>
          <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            Enter your PIN to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter PIN (1234)"
              maxLength={4}
              className={`w-full px-5 py-4 rounded-xl text-center text-2xl tracking-[0.5em] font-mono outline-none transition-all duration-300 ${
                error 
                  ? 'border-rose-500 ring-2 ring-rose-500/20 text-rose-500 ' + (darkMode ? 'bg-rose-500/10' : 'bg-rose-50')
                  : isSuccess
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-500 ' + (darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50')
                    : darkMode 
                      ? 'bg-gray-950/50 border-gray-700/80 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              } border`}
              disabled={isSuccess}
              autoFocus
            />
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-6 left-0 right-0 text-center text-xs font-medium text-rose-500"
              >
                Incorrect PIN. Please try again.
              </motion.p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!pin || pin.length < 4 || isSuccess}
            className={`group relative mt-2 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all overflow-hidden ${
              isSuccess 
                ? 'bg-emerald-500' 
                : !pin || pin.length < 4
                  ? darkMode ? 'bg-gray-800 text-gray-500' : 'bg-slate-200 text-slate-400'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25'
            }`}
          >
            {isSuccess ? (
              <>
                <ShieldCheck className="w-5 h-5" />
                Access Granted
              </>
            ) : (
              <>
                Unlock Dashboard
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
