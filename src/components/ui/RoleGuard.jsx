import { ShieldAlert, LockKeyhole } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';
import { motion } from 'framer-motion';

export default function RoleGuard({ children, requiredRole = 'admin', fallbackText = "Admin Access Required" }) {
  const { role, darkMode } = useFinanceStore();

  const hasAccess = role === requiredRole;

  if (hasAccess) return <>{children}</>;

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-800/50 bg-slate-50 dark:bg-gray-900/20">
      <div className="filter blur-md opacity-30 select-none pointer-events-none transition-all duration-500 grayscale-[0.5]">
        {children}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-sm z-10 p-6"
      >
         <motion.div 
           initial={{ scale: 0.9, y: 10, opacity: 0 }}
           animate={{ scale: 1, y: 0, opacity: 1 }}
           transition={{ type: "spring", stiffness: 300, damping: 25 }}
           className={`flex flex-col items-center p-6 rounded-3xl border shadow-2xl max-w-sm text-center w-full ${
             darkMode 
              ? 'bg-gray-950/80 border-gray-800/60 shadow-black/50' 
              : 'bg-white/90 border-slate-200/80 shadow-slate-200/50'
           } backdrop-blur-xl`}
         >
           <motion.div 
             animate={{ 
               y: [0, -6, 0],
             }}
             transition={{ 
               duration: 3, 
               repeat: Infinity,
               ease: "easeInOut"
             }}
             className="relative mb-5"
           >
             <div className="absolute inset-0 bg-rose-500/20 dark:bg-rose-500/30 blur-xl rounded-full" />
             <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-slate-50 border-slate-100'} shadow-inner`}>
                <LockKeyhole className="w-8 h-8 text-rose-500 drop-shadow-md" />
             </div>
           </motion.div>
           
           <h3 className={`text-xl font-bold mb-2 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
             Access Restricted
           </h3>
           <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
             {fallbackText}. You are currently viewing as a <span className="font-semibold text-indigo-500">Viewer</span>.
           </p>

           <div className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium border ${darkMode ? 'bg-gray-900/50 border-gray-800 text-gray-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
             <ShieldAlert className="w-4 h-4 text-amber-500" />
             Requires Admin Privileges
           </div>
         </motion.div>
      </motion.div>
    </div>
  );
}
