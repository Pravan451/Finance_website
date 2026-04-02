import { useMemo, useState } from 'react';
import useFinanceStore from "../store/useFinanceStore";
import SummaryCard from "../components/ui/SummaryCard";
import RoleGuard from "../components/ui/RoleGuard";
import AddTransactionModal from "../components/ui/AddTransactionModal";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Plus, TrendingUp, PiggyBank, Receipt, Layers } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  balanceTrendSeries,
  balanceTrendSeriesByMonth,
  expensesByCategory,
  formatINR,
  calculateMoM,
  cashFlowByMonth,
} from '../utils/helpers';

const PIE_COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#94a3b8'];

function StatPill({ icon, label, value, darkMode }) {
  const Icon = icon;
  return (
    <Motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`surface-card flex items-center gap-3 rounded-xl border p-4 ${
        darkMode ? 'surface-card--dark' : 'surface-card--light'
      }`}
    >
      <div
        className={`rounded-lg p-2 transition-transform duration-300 group-hover:scale-110 ${
          darkMode ? 'bg-indigo-500/20 text-indigo-300 shadow-inner-glow' : 'bg-indigo-50 text-indigo-600'
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>{label}</p>
        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{value}</p>
      </div>
    </Motion.div>
  );
}

export default function Dashboard() {
  const { transactions, darkMode } = useFinanceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const income = transactions.filter((t) => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  const incomeMoM = useMemo(() => calculateMoM(transactions, 'income'), [transactions]);
  const expenseMoM = useMemo(() => calculateMoM(transactions, 'expense'), [transactions]);
  const balanceMoM = useMemo(() => calculateMoM(transactions, 'balance'), [transactions]);

  const recentTransactions = useMemo(() => [...transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5), [transactions]);

  const chartData = useMemo(() => cashFlowByMonth(transactions, 16), [transactions]);
  const balanceData = useMemo(() => balanceTrendSeriesByMonth(transactions, 16), [transactions]);
  const categoryData = useMemo(() => {
    const rows = expensesByCategory(transactions);
    if (rows.length <= 8) return rows.map((r) => ({ name: r.name, value: r.value }));
    const top = rows.slice(0, 7);
    const rest = rows.slice(7).reduce((s, r) => s + r.value, 0);
    return [...top, { name: 'Other', value: rest }];
  }, [transactions]);

  const avgDailyExpense = useMemo(() => {
    const exp = transactions.filter((t) => t.type === 'expense');
    if (exp.length === 0) return 0;
    const days = new Set(exp.map((t) => t.date.split('T')[0])).size || 1;
    return Math.round(exp.reduce((a, t) => a + t.amount, 0) / days);
  }, [transactions]);

  const topCategory = useMemo(() => {
    const rows = expensesByCategory(transactions);
    return rows[0]?.name ?? '—';
  }, [transactions]);

  const panel = darkMode ? 'surface-card surface-card--dark' : 'surface-card surface-card--light';
  const subtext = darkMode ? 'text-gray-400' : 'text-gray-600';
  const heading = darkMode ? 'text-white' : 'text-gray-900';

  const tooltipStyle = {
    backgroundColor: darkMode ? '#1f2937' : '#fff',
    borderColor: darkMode ? '#374151' : '#e5e7eb',
    borderRadius: '8px',
    color: darkMode ? '#fff' : '#111',
  };

  const axisStroke = darkMode ? '#9ca3af' : '#6b7280';
  const gridStroke = darkMode ? '#374151' : '#e5e7eb';

  return (
    <div className="space-y-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`font-display text-2xl font-bold tracking-tight sm:text-3xl ${
              darkMode
                ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-800 bg-clip-text text-transparent'
            }`}
          >
            Dashboard
          </h1>
          <p className={`${subtext} mt-1`}>Financial overview, trends, and spending breakdown.</p>
        </div>

        <RoleGuard requiredRole="admin" fallbackText="Locked">
          <Motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="btn-primary w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            Add Transaction
          </Motion.button>
        </RoleGuard>
      </div>

      <Motion.div
        className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.09 } },
        }}
      >
        <Motion.div
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          <SummaryCard title="Net Balance" amount={balance} type="balance" trend={balanceMoM} />
        </Motion.div>
        <Motion.div
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          <SummaryCard title="Total Income" amount={income} type="income" trend={incomeMoM} />
        </Motion.div>
        <Motion.div
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          <SummaryCard title="Total Expenses" amount={expenses} type="expense" trend={expenseMoM} />
        </Motion.div>
      </Motion.div>

      {transactions.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center ${panel} transition-shadow duration-500`}>
          <Layers className={`mx-auto h-12 w-12 ${subtext}`} />
          <p className={`mt-4 font-medium ${heading}`}>No transactions yet</p>
          <p className={`mt-1 text-sm ${subtext}`}>Add a transaction or reset data in Settings to load sample data.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatPill icon={PiggyBank} label="Savings rate" value={`${savingsRate}%`} darkMode={darkMode} />
            <StatPill icon={Receipt} label="Avg. daily spend" value={formatINR(avgDailyExpense)} darkMode={darkMode} />
            <StatPill icon={TrendingUp} label="Top spend category" value={topCategory} darkMode={darkMode} />
            <StatPill icon={Layers} label="Transactions" value={String(transactions.length)} darkMode={darkMode} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.35 }}
              className={`min-w-0 rounded-2xl p-4 sm:p-6 ${panel}`}
            >
              <h3 className={`mb-1 font-display text-lg font-semibold ${heading}`}>Macro Cash Flow</h3>
              <p className={`text-sm mb-4 ${subtext}`}>Monthly income vs expenses</p>
              <div className="h-[280px] w-full min-w-0">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280} debounce={100}>
                    <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dashIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="dashExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fb7185" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="label" stroke={axisStroke} fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke={axisStroke} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatINR(v)} />
                      <Area type="monotone" dataKey="income" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#dashIncome)" name="Income" />
                      <Area type="monotone" dataKey="expense" stroke="#fb7185" strokeWidth={2} fillOpacity={1} fill="url(#dashExpense)" name="Expense" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className={`text-sm ${subtext}`}>Not enough data for chart.</p>
                )}
              </div>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              whileHover={{ scale: 1.005 }}
              className={`min-w-0 rounded-2xl p-4 sm:p-6 ${panel}`}
            >
              <h3 className={`mb-1 font-display text-lg font-semibold ${heading}`}>Balance Growth</h3>
              <p className={`text-sm mb-4 ${subtext}`}>Cumulative balance aggregated by month</p>
              <div className="h-[280px] w-full min-w-0">
                {balanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280} debounce={100}>
                    <LineChart data={balanceData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                      <XAxis dataKey="label" stroke={axisStroke} fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke={axisStroke} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatINR(v)} />
                      <Line type="monotone" dataKey="balance" stroke="#818cf8" strokeWidth={3} dot={false} name="Balance" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className={`text-sm ${subtext}`}>Not enough data.</p>
                )}
              </div>
            </Motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.005 }}
              className={`min-w-0 rounded-2xl p-4 sm:p-6 ${panel}`}
            >
              <h3 className={`mb-1 font-display text-lg font-semibold ${heading}`}>Spending by category</h3>
              <p className={`text-sm mb-4 ${subtext}`}>Expense distribution</p>
              <div className="h-[300px] w-full min-w-0 flex flex-col sm:flex-row items-center">
                {categoryData.length > 0 ? (
                  <>
                    <div className="h-[260px] w-full sm:w-1/2 min-w-0">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260} debounce={100}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={52}
                            outerRadius={88}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                          >
                            {categoryData.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatINR(v)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full sm:w-1/2 pl-0 sm:pl-4 space-y-2 max-h-[260px] overflow-y-auto">
                      {categoryData.map((c, i) => (
                        <div key={c.name} className="flex items-center justify-between text-sm gap-2">
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                            <span className={`truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{c.name}</span>
                          </span>
                          <span className={`font-medium shrink-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatINR(c.value)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className={`text-sm ${subtext}`}>No expense data.</p>
                )}
              </div>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              whileHover={{ scale: 1.005 }}
              className={`min-w-0 rounded-2xl p-4 sm:p-6 ${panel}`}
            >
              <h3 className={`mb-1 font-display text-lg font-semibold ${heading}`}>Top categories (bars)</h3>
              <p className={`text-sm mb-4 ${subtext}`}>Compare expense totals at a glance</p>
              <div className="h-[300px] w-full min-w-0">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300} debounce={100}>
                    <BarChart data={categoryData.slice(0, 8)} layout="vertical" margin={{ left: 8, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                      <XAxis type="number" stroke={axisStroke} fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <YAxis type="category" dataKey="name" stroke={axisStroke} fontSize={11} width={88} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatINR(v)} />
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} name="Spent" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className={`text-sm ${subtext}`}>No expense data.</p>
                )}
              </div>
            </Motion.div>
          </div>

          <Motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`min-w-0 rounded-2xl p-4 sm:p-6 ${panel} mb-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-display text-lg font-semibold ${heading}`}>Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-gray-800 text-gray-400' : 'border-slate-200 text-slate-500'}`}>
                    <th className="py-3 font-medium">Date</th>
                    <th className="py-3 font-medium">Description</th>
                    <th className="py-3 font-medium">Category</th>
                    <th className="py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {recentTransactions.map((tx, idx) => (
                      <Motion.tr
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: Math.min(idx * 0.05, 0.5) } }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={tx.id}
                        className={`border-b last:border-0 ${darkMode ? 'border-gray-800/50 hover:bg-gray-800/30' : 'border-slate-100 hover:bg-slate-50'} transition-colors`}
                      >
                        <td className={`py-3 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                        <td className={`py-3 font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{tx.title}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-slate-100 text-slate-600'}`}>
                            {tx.category}
                          </span>
                        </td>
                        <td className={`py-3 text-right font-bold ${tx.type === 'income' ? 'text-emerald-500' : darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {tx.type === 'income' ? '+' : '-'} {formatINR(tx.amount)}
                        </td>
                      </Motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Motion.div>
        </>
      )}

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
