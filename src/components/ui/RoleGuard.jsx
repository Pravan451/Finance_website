import { ShieldAlert } from 'lucide-react';
import useFinanceStore from '../../store/useFinanceStore';

export default function RoleGuard({ children, requiredRole = 'admin', fallbackText = "Admin Required" }) {
  const { role, darkMode } = useFinanceStore();

  const hasAccess = role === requiredRole;

  if (hasAccess) return <>{children}</>;

  return (
    <div className={`p-4 rounded-xl border flex w-full max-w-sm gap-4 items-center transition-all ${
      darkMode ? 'bg-gray-800/40 border-gray-800' : 'bg-slate-50 border-slate-200'
    }`}
    title={`Role restricted. Required: ${requiredRole}`}>
       <div className={`p-2.5 rounded-lg shrink-0 ${darkMode ? 'bg-rose-500/10' : 'bg-rose-100'}`}>
         <ShieldAlert className="w-5 h-5 text-rose-500" />
       </div>
       <div className="flex flex-col overflow-hidden">
         <span className={`text-sm font-semibold truncate tracking-tight ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
           No Access
         </span>
         <span className={`text-xs truncate opacity-80 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
           {fallbackText}
         </span>
       </div>
    </div>
  );
}
