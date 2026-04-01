import { useState } from "react";
import useFinanceStore from "../../store/useFinanceStore";
import { Menu, X, Sparkles } from "lucide-react";
import AuthModal from "../ui/AuthModal";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Wallet,
  Settings,
  Shield,
  Eye,
} from "lucide-react";
import { motion as Motion } from "framer-motion";

const mobileLinks = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { path: "/insights", label: "Insights", icon: Lightbulb },
  { path: "/budget", label: "Budget", icon: Wallet },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Navbar() {
  const { role, setRole, darkMode, mobileNavOpen, setMobileNavOpen } = useFinanceStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);

  const handleRoleSelect = (newRole) => {
    if (role === newRole) return;
    setPendingRole(newRole);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setRole(pendingRole);
  };

  const bar = darkMode
    ? "border-gray-800/80 bg-gray-950/75 backdrop-blur-xl"
    : "border-slate-200/80 bg-white/75 backdrop-blur-xl";

  return (
    <>
      <header
        className={`sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 shadow-sm transition-all duration-300 ${bar}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            className={`rounded-xl p-2 transition-colors duration-300 md:hidden ${
              darkMode ? "bg-gray-800/80 text-white hover:bg-gray-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
            }`}
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Motion.button>
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles className={`h-5 w-5 shrink-0 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            <h2
              className={`truncate font-display text-base font-semibold tracking-tight sm:text-lg ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Finance Dashboard
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`hidden sm:flex items-center rounded-xl p-1 ${darkMode ? "bg-gray-900/80 border border-gray-800/80" : "bg-slate-100 border border-slate-200"}`}>
            <button
              onClick={() => handleRoleSelect('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                role === 'admin' 
                  ? darkMode ? 'bg-gray-800 text-indigo-400 shadow-sm ring-1 ring-gray-700/50' : 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50'
                  : darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
            <button
              onClick={() => handleRoleSelect('viewer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                role === 'viewer' 
                  ? darkMode ? 'bg-gray-800 text-indigo-400 shadow-sm ring-1 ring-gray-700/50' : 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50'
                  : darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              <Eye className="w-4 h-4" />
              Viewer
            </button>
          </div>
        </div>
      </header>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <Motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <Motion.nav
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className={`absolute left-0 top-0 flex h-full w-[min(280px,85vw)] flex-col border-r p-4 shadow-2xl ${
              darkMode ? "border-gray-800 bg-gray-950/95" : "border-slate-200 bg-white"
            }`}
          >
            <p
              className={`mb-4 bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-lg font-bold text-transparent`}
            >
              FinFlow
            </p>
            <div className="flex flex-col gap-1">
              {mobileLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileNavOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
                          : darkMode
                          ? "text-gray-300 hover:bg-gray-800/80 hover:text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    {link.label}
                  </NavLink>
                );
              })}
            </div>
            <div className={`mt-auto border-t pt-4 flex flex-col gap-2 ${darkMode ? "border-gray-800" : "border-slate-200"}`}>
              <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-gray-500" : "text-slate-400"}`}>
                Select Role
              </span>
              <div className={`flex items-center p-1 rounded-xl ${darkMode ? "bg-gray-900/80 border border-gray-800/80" : "bg-slate-100 border border-slate-200"}`}>
                <button
                  onClick={() => handleRoleSelect('admin')}
                  className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    role === 'admin' 
                      ? darkMode ? 'bg-gray-800 text-indigo-400 shadow-sm ring-1 ring-gray-700/50' : 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50'
                      : darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </button>
                <button
                  onClick={() => handleRoleSelect('viewer')}
                  className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    role === 'viewer' 
                      ? darkMode ? 'bg-gray-800 text-indigo-400 shadow-sm ring-1 ring-gray-700/50' : 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50'
                      : darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Viewer
                </button>
              </div>
            </div>
          </Motion.nav>
        </div>
      )}
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
        requiredRole={pendingRole}
      />
    </>
  );
}
