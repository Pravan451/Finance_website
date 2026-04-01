import useFinanceStore from "../store/useFinanceStore";
import { exportToCSV, exportToJSON } from "../utils/helpers";
import { UserCircle, Shield, Download, Sun, Moon, Database, FileJson } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

export default function Settings() {
  const { role, setRole, darkMode, toggleDarkMode, resetData, transactions } = useFinanceStore();

  const shell = darkMode
    ? 'surface-card surface-card--dark overflow-hidden rounded-2xl'
    : 'surface-card surface-card--light overflow-hidden rounded-2xl';
  const sectionBorder = darkMode ? 'border-gray-800/80' : 'border-slate-200/80';
  const textMuted = darkMode ? 'text-gray-400' : 'text-slate-600';
  const heading = darkMode ? 'text-white' : 'text-slate-900';
  const roleIdle = darkMode
    ? 'border-gray-800 bg-gray-800/50 text-gray-500 hover:border-gray-700 hover:text-gray-300'
    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:text-slate-800';
  const roleActive = 'border-indigo-500 bg-indigo-500/10 text-indigo-500 shadow-md shadow-indigo-500/10';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className={`font-display text-2xl font-bold ${heading} mb-1`}>Settings</h1>
        <p className={textMuted}>Preferences, role demo, theme, and data</p>
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={shell}
      >
        <div className={`p-6 border-b ${sectionBorder}`}>
          <div className="mb-4 flex items-center gap-3 text-indigo-400">
            <Shield className="h-5 w-5" />
            <h2 className={`text-lg font-semibold ${heading}`}>Role access</h2>
          </div>
          <p className={`text-sm mb-6 ${textMuted}`}>
            Viewer is read-only for destructive actions; Admin can add, edit, and delete transactions.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('admin')}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all duration-300 ${
                role === 'admin' ? roleActive : roleIdle
              }`}
            >
              <UserCircle className="h-6 w-6" />
              <span className="font-medium">Administrator</span>
            </Motion.button>
            <Motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('viewer')}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all duration-300 ${
                role === 'viewer' ? roleActive : roleIdle
              }`}
            >
              <UserCircle className="h-6 w-6" />
              <span className="font-medium">Viewer</span>
            </Motion.button>
          </div>
        </div>

        <div className={`flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between ${sectionBorder}`}>
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="h-5 w-5 text-indigo-400" /> : <Sun className="h-5 w-5 text-amber-500" />}
            <div>
              <h2 className={`text-lg font-semibold ${heading}`}>Theme</h2>
              <p className={`text-sm ${textMuted}`}>Dark / light — persists across sessions</p>
            </div>
          </div>
          <Motion.button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
            aria-pressed={darkMode}
            whileTap={{ scale: 0.95 }}
            className={`relative h-8 w-14 rounded-full p-1 transition-colors duration-300 ${
              darkMode ? 'bg-gradient-to-r from-indigo-600 to-violet-600' : 'bg-slate-300'
            }`}
          >
            <Motion.div
              className="h-6 w-6 rounded-full bg-white shadow-md"
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              animate={{ x: darkMode ? 24 : 0 }}
            />
          </Motion.button>
        </div>

        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-rose-400" />
            <div>
              <h2 className={`text-lg font-semibold ${heading}`}>Data</h2>
              <p className={`text-sm ${textMuted}`}>Export or reset to bundled sample data</p>
            </div>
          </div>
          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <Motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => exportToCSV(transactions, 'finflow_export.csv')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 sm:flex-none ${
                darkMode
                  ? 'border-gray-700 bg-gray-800/80 text-white hover:border-indigo-500/40 hover:bg-gray-800'
                  : 'border-slate-300 bg-white text-slate-900 hover:border-indigo-400 hover:shadow-md'
              }`}
            >
              <Download className="h-4 w-4" /> CSV
            </Motion.button>
            <Motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => exportToJSON(transactions, 'finflow_export.json')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 sm:flex-none ${
                darkMode
                  ? 'border-gray-700 bg-gray-800/80 text-white hover:border-indigo-500/40 hover:bg-gray-800'
                  : 'border-slate-300 bg-white text-slate-900 hover:border-indigo-400 hover:shadow-md'
              }`}
            >
              <FileJson className="h-4 w-4" /> JSON
            </Motion.button>
            <Motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetData}
              className="flex flex-1 items-center justify-center rounded-xl border border-rose-500/50 bg-rose-500/15 px-4 py-2.5 text-sm font-medium text-rose-500 transition-all duration-300 hover:bg-rose-500 hover:text-white sm:flex-none"
            >
              Reset data
            </Motion.button>
          </div>
        </div>
      </Motion.div>
    </div>
  );
}
