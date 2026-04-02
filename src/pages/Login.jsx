import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ArrowRight, ShieldCheck, Mail, KeyRound, User, AlertCircle } from 'lucide-react';
import useFinanceStore from '../store/useFinanceStore';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pin, setPin] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, registerUser, darkMode } = useFinanceStore();

  const handleAuth = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (isSignup) {
      if (!username || !email || !password || !confirmPassword || !pin) {
        setErrorMsg('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
      }
      if (pin.length !== 4) {
        setErrorMsg('Access PIN must be 4 digits');
        return;
      }
      
      const success = registerUser(username, email, password, pin);
      if (success) {
        login(email, password);
        triggerSuccess();
      } else {
        setErrorMsg('Email is already registered');
      }
    } else {
      if (!email || !password) {
        setErrorMsg('Please fill in both fields');
        return;
      }
      const success = login(email, password);
      if (success) {
        triggerSuccess();
      } else {
        setErrorMsg('Invalid email or password');
      }
    }
  };
  
  const triggerSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 800);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setErrorMsg('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPin('');
  };

  const inputClasses = `w-full pl-11 pr-4 py-3.5 rounded-xl text-sm transition-all duration-300 outline-none border ${
    isSuccess
      ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-600 ' + (darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50')
      : darkMode 
        ? 'bg-gray-950/50 border-gray-700/80 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' 
        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
  }`;

  const iconClasses = `absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isSuccess ? 'text-emerald-500' : darkMode ? 'text-gray-500' : 'text-slate-400'}`;

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${darkMode ? 'bg-gray-950' : 'bg-slate-50'}`}>
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/20 blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`relative z-10 w-full max-w-sm p-8 rounded-3xl border shadow-2xl backdrop-blur-xl ${
          darkMode 
            ? 'bg-gray-900/60 border-gray-800 shadow-black/50' 
            : 'bg-white/70 border-white shadow-slate-200/50'
        }`}
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            animate={errorMsg ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.3 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg ${
              isSuccess 
                ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                : darkMode 
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/20' 
                  : 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-indigo-500/30'
            }`}
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div key="success" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}>
                  <Unlock className="w-8 h-8" />
                </motion.div>
              ) : (
                <motion.div key="lock" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Lock className="w-8 h-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <h1 className={`text-2xl font-bold tracking-tight mb-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            {isSignup ? 'Enter your details to register.' : 'Sign in to access your dashboard.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          
          <AnimatePresence>
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="relative overflow-hidden"
              >
                <User className={iconClasses} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className={inputClasses}
                  disabled={isSuccess}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className={iconClasses} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={inputClasses}
              disabled={isSuccess}
              autoFocus
            />
          </div>

          <div className="relative">
            <KeyRound className={iconClasses} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={inputClasses}
              disabled={isSuccess}
            />
          </div>

          <AnimatePresence>
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="relative overflow-hidden"
              >
                <KeyRound className={iconClasses} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className={inputClasses}
                  disabled={isSuccess}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="relative overflow-hidden"
              >
                <Lock className={iconClasses} />
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Set Access PIN (4 digits)"
                  maxLength={4}
                  className={`${inputClasses} tracking-[0.2em] font-mono`}
                  disabled={isSuccess}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 text-xs font-medium text-rose-500 mt-1"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMsg}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSuccess}
            className={`group relative mt-3 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all overflow-hidden shadow-lg ${
              isSuccess 
                ? 'bg-emerald-500 shadow-emerald-500/25' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25'
            }`}
          >
            {isSuccess ? (
              <>
                <ShieldCheck className="w-5 h-5" />
                Access Granted
              </>
            ) : (
              <>
                {isSignup ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button 
            type="button" 
            onClick={toggleMode}
            disabled={isSuccess}
            className={`text-sm font-semibold transition-colors ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
