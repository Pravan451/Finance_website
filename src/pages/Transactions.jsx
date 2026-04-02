import { useState, useMemo, useRef, useEffect } from 'react';
import useFinanceStore from '../store/useFinanceStore';
import { exportToCSV, exportToJSON, formatINR, uniqueCategories } from '../utils/helpers';
import EditTransactionModal from '../components/ui/EditTransactionModal';
import { Download, Search, Trash2, ArrowUpDown, Pencil, FileJson, ChevronDown } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

function CustomSelect({ value, onChange, options, darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative min-w-[160px]" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500 ${
          darkMode
            ? 'border-gray-700/80 bg-gray-900/80 text-white hover:border-indigo-500/50'
            : 'border-slate-300 bg-white text-slate-900 hover:border-indigo-400'
        }`}
      >
        <span className="truncate text-sm">{selectedOption.label}</span>
        <ChevronDown className={`ml-2 h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 mt-2 z-30 w-full overflow-hidden rounded-xl border py-1 shadow-2xl ${
              darkMode ? 'border-gray-800 bg-gray-900 shadow-black/50' : 'border-slate-200 bg-white shadow-slate-300/50'
            }`}
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    value === option.value
                      ? darkMode
                        ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                        : 'bg-indigo-50 text-indigo-600 font-medium'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Transactions() {
  const { transactions, deleteTransaction, darkMode, role } = useFinanceStore();
  const isAdmin = role === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editing, setEditing] = useState(null);

  const getTitle = (transaction) => transaction.title || transaction.category || 'Untitled';
  const categories = useMemo(() => uniqueCategories(transactions), [transactions]);

  const filteredData = useMemo(() => {
    let result = transactions.filter((t) => {
      const matchSearch =
        getTitle(t).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.category || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'all' || t.category === categoryFilter;
      return matchSearch && matchCat;
    });

    if (filterType !== 'all') {
      result = result.filter((t) => t.type === filterType);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [transactions, searchTerm, filterType, sortOrder, categoryFilter]);

  const panel = darkMode ? 'surface-card surface-card--dark' : 'surface-card surface-card--light';
  const inputCls = darkMode
    ? 'border-gray-700/80 bg-gray-900/80 text-white placeholder-gray-500 focus:border-indigo-500/50'
    : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-indigo-400';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`font-display text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Transactions</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-slate-600'}>Search, filter, export, and manage entries</p>
        </div>

        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => exportToCSV(filteredData, 'finflow_transactions.csv')}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                darkMode
                  ? 'border-gray-700/80 bg-gray-800/90 text-white hover:border-indigo-500/40 hover:shadow-glow-sm'
                  : 'border-slate-300 bg-white text-slate-900 hover:border-indigo-400 hover:shadow-md'
              }`}
            >
              <Download className="h-4 w-4" />
              CSV
            </button>
            <button
              type="button"
              onClick={() => exportToJSON(filteredData, 'finflow_transactions.json')}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                darkMode
                  ? 'border-gray-700/80 bg-gray-800/90 text-white hover:border-indigo-500/40 hover:shadow-glow-sm'
                  : 'border-slate-300 bg-white text-slate-900 hover:border-indigo-400 hover:shadow-md'
              }`}
            >
              <FileJson className="h-4 w-4" />
              JSON
            </button>
          </div>
        )}
      </div>

      <div className={`rounded-2xl p-4 sm:p-6 ${panel}`}>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:flex-wrap">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl border py-2.5 pl-10 pr-4 outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500 ${inputCls}`}
            />
          </div>

          <CustomSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            darkMode={darkMode}
            options={[
              { value: 'all', label: 'All categories' },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
          />

          <CustomSelect
            value={filterType}
            onChange={setFilterType}
            darkMode={darkMode}
            options={[
              { value: 'all', label: 'All types' },
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' },
            ]}
          />

          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 transition-all duration-300 hover:-translate-y-0.5 ${
              darkMode
                ? 'border-gray-700/80 bg-gray-800/90 text-white hover:border-indigo-500/40'
                : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-white'
            }`}
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </button>
        </div>

        <div className={`overflow-x-auto rounded-xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <table className="w-full text-left text-sm">
            <thead className={`text-xs uppercase ${darkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              <tr>
                <th className="px-4 py-3 font-medium sm:px-6">Date</th>
                <th className="px-4 py-3 font-medium sm:px-6">Title</th>
                <th className="px-4 py-3 font-medium sm:px-6">Category</th>
                <th className="px-4 py-3 text-right font-medium sm:px-6">Amount</th>
                <th className="px-4 py-3 text-center font-medium sm:px-6">Type</th>
                <th className="px-4 py-3 text-center font-medium sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-800 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
              <AnimatePresence>
                {filteredData.length > 0 ? (
                  filteredData.map((t, idx) => (
                    <Motion.tr
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(idx * 0.04, 0.4) } }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={t.id}
                      className={`transition-colors duration-200 ${
                        darkMode ? 'hover:bg-indigo-500/[0.06]' : 'hover:bg-indigo-50/80'
                      }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 sm:px-6">{new Date(t.date).toLocaleDateString('en-IN')}</td>
                    <td className={`px-4 py-3 font-medium sm:px-6 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{getTitle(t)}</td>
                    <td className="px-4 py-3 sm:px-6">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'
                        }`}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium sm:px-6 ${
                        t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}
                      {formatINR(t.amount)}
                    </td>
                    <td className="px-4 py-3 text-center capitalize sm:px-6">{t.type}</td>
                    <td className="px-4 py-3 text-center sm:px-6">
                      {isAdmin ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditing(t)}
                            className={`rounded-lg p-2 transition-all ${
                              darkMode
                                ? 'text-gray-500 hover:bg-indigo-500/10 hover:text-indigo-400'
                                : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                            }`}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTransaction(t.id)}
                            className={`rounded-lg p-2 transition-all ${
                              darkMode ? 'text-gray-500 hover:bg-rose-500/10 hover:text-rose-400' : 'text-gray-500 hover:bg-rose-50 hover:text-rose-600'
                            }`}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}>—</span>
                      )}
                    </td>
                  </Motion.tr>
                  ))
                ) : (
                  <Motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={6} className={`px-6 py-10 text-center ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      No transactions match your filters.
                    </td>
                  </Motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <EditTransactionModal transaction={editing} isOpen={!!editing} onClose={() => setEditing(null)} />
    </div>
  );
}
