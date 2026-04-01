import { Outlet, useLocation } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import useFinanceStore from "../../store/useFinanceStore";

export default function Layout() {
  const { darkMode } = useFinanceStore();
  const location = useLocation();

  return (
    <div
      className={`relative flex min-h-screen min-w-0 ${
        darkMode ? "bg-[#030712] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Ambient mesh — subtle depth */}
      <div
        className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-700 ${
          darkMode ? "opacity-100" : "opacity-90"
        }`}
        aria-hidden
      >
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-indigo-600/25 blur-[100px] dark:bg-indigo-600/30" />
        <div className="absolute -right-20 top-1/4 h-[22rem] w-[22rem] rounded-full bg-violet-600/20 blur-[90px] dark:bg-violet-500/25" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-600/10 blur-[80px] dark:bg-emerald-500/15" />
        {darkMode && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        )}
      </div>

      <Sidebar />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Navbar />
        <Motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 ${darkMode ? "" : "bg-white/40"}`}
        >
          <Outlet />
        </Motion.main>
      </div>
    </div>
  );
}
