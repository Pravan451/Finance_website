import { NavLink } from "react-router-dom";
import useFinanceStore from "../../store/useFinanceStore";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Wallet,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

const links = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { path: "/insights", label: "Insights", icon: Lightbulb },
  { path: "/budget", label: "Budget", icon: Wallet },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { darkMode, sidebarCollapsed, toggleSidebar, setMobileNavOpen } = useFinanceStore();

  return (
    <aside
      className={`relative z-20 hidden shrink-0 flex-col border-r transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:flex ${
        darkMode
          ? "border-gray-800/80 bg-gray-950/70 backdrop-blur-xl"
          : "border-slate-200/80 bg-white/70 backdrop-blur-xl"
      } ${sidebarCollapsed ? "w-[76px]" : "w-60"}`}
    >
      <div
        className={`flex h-14 items-center border-b px-3 transition-colors duration-300 ${
          darkMode ? "border-gray-800/80" : "border-slate-200/80"
        }`}
      >
        {!sidebarCollapsed && (
          <span
            className={`truncate bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-lg font-bold text-transparent ${
              darkMode ? "" : "from-indigo-600 to-violet-600"
            }`}
          >
            FinFlow
          </span>
        )}
        {sidebarCollapsed && (
          <span
            className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-transform duration-300 hover:scale-105`}
          >
            F
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/dashboard"}
              onClick={() => setMobileNavOpen(false)}
              title={sidebarCollapsed ? link.label : undefined}
              className={({ isActive }) =>
                `nav-link-item group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-out ${
                  sidebarCollapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? darkMode
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/10"
                      : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                    : darkMode
                    ? "text-gray-400 hover:translate-x-0.5 hover:bg-gray-800/60 hover:text-white"
                    : "text-slate-600 hover:translate-x-0.5 hover:bg-slate-100/90 hover:text-slate-900"
                }`
              }
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                  sidebarCollapsed ? "" : ""
                }`}
              />
              {!sidebarCollapsed && <span className="truncate">{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className={`border-t p-2 ${darkMode ? "border-gray-800/80" : "border-slate-200/80"}`}>
        <button
          type="button"
          onClick={toggleSidebar}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition-all duration-300 ${
            darkMode
              ? "text-gray-500 hover:bg-gray-800/80 hover:text-white"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
          ) : (
            <PanelLeftClose className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
          )}
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
