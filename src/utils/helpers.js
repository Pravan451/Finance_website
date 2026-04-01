export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row)
      .map(val => `"${val}"`)
      .join(',')
  ).join('\n');

  const csvContent = `${headers}\n${rows}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename = 'export.json') => {
  if (data == null) return;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/** Sum income and expenses per calendar month (YYYY-MM) */
export function monthlyTotalsByMonth(transactions) {
  const map = {};
  transactions.forEach((t) => {
    const key = t.date.slice(0, 7);
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
    if (t.type === 'income') map[key].income += t.amount;
    else map[key].expense += t.amount;
  });
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
}

/** Aggregate expenses by category */
export function expensesByCategory(transactions) {
  const map = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/** Daily cumulative balance (net per day, then running total) */
export function balanceTrendSeries(transactions) {
  const byDay = {};
  [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((t) => {
      const d = t.date.split('T')[0];
      if (!byDay[d]) byDay[d] = { income: 0, expense: 0 };
      if (t.type === 'income') byDay[d].income += t.amount;
      else byDay[d].expense += t.amount;
    });
  const days = Object.keys(byDay).sort();
  let balance = 0;
  return days.map((d) => {
    balance += byDay[d].income - byDay[d].expense;
    return { date: d, balance };
  });
}

/** Cash flow: income & expense per day (for area chart) */
export function cashFlowByDay(transactions, lastN = 45) {
  const byDay = {};
  [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((t) => {
      const d = t.date.split('T')[0];
      if (!byDay[d]) byDay[d] = { date: d, income: 0, expense: 0 };
      if (t.type === 'income') byDay[d].income += t.amount;
      else byDay[d].expense += t.amount;
    });
  return Object.values(byDay).slice(-lastN);
}

/** Unique categories from transactions (for filters) */
export function uniqueCategories(transactions) {
  const s = new Set();
  transactions.forEach((t) => s.add(t.category));
  return Array.from(s).sort();
}

/** Calculate Month-over-Month percentage change */
export function calculateMoM(transactions, type = 'income') {
  if (transactions.length === 0) return 0;

  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestDate = new Date(sorted[0].date);

  const currentMonth = latestDate.getMonth();
  const currentYear = latestDate.getFullYear();

  let prevMonth = currentMonth - 1;
  let prevYear = currentYear;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear -= 1;
  }

  let currentTotal = 0;
  let prevTotal = 0;

  transactions.forEach((t) => {
    // If calculating balance MoM, we sum income as positive and expense as negative
    if (t.type !== type && type !== 'balance') return;

    const d = new Date(t.date);
    const m = d.getMonth();
    const y = d.getFullYear();

    const amount = type === 'balance' ? (t.type === 'income' ? t.amount : -t.amount) : t.amount;

    if (m === currentMonth && y === currentYear) {
      currentTotal += amount;
    } else if (m === prevMonth && y === prevYear) {
      prevTotal += amount;
    }
  });

  if (prevTotal === 0) return 0;
  return Math.round(((currentTotal - prevTotal) / Math.abs(prevTotal)) * 100);
}

/** Cash flow: income & expense per month (for macro trend chart) */
export function cashFlowByMonth(transactions, lastN = 18) {
  const byMonth = {};
  [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((t) => {
      const d = t.date.slice(0, 7); // YYYY-MM
      if (!byMonth[d]) byMonth[d] = { date: d, income: 0, expense: 0 };
      if (t.type === 'income') byMonth[d].income += t.amount;
      else byMonth[d].expense += t.amount;
    });

  const results = Object.values(byMonth).map(item => {
    const [year, month] = item.date.split('-');
    const dateObj = new Date(year, parseInt(month) - 1, 1);
    return {
      ...item,
      label: dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) // e.g. "Jan '25"
    };
  });
  
  return results.slice(-lastN);
}

/** Cumulative balance per month */
export function balanceTrendSeriesByMonth(transactions, lastN = 18) {
  const byMonth = {};
  [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((t) => {
      const d = t.date.slice(0, 7);
      if (!byMonth[d]) byMonth[d] = { income: 0, expense: 0 };
      if (t.type === 'income') byMonth[d].income += t.amount;
      else byMonth[d].expense += t.amount;
    });
    
  const months = Object.keys(byMonth).sort();
  let balance = 0;
  const results = months.map((m) => {
    balance += byMonth[m].income - byMonth[m].expense;
    const [year, month] = m.split('-');
    const dateObj = new Date(year, parseInt(month) - 1, 1);
    return { 
      date: m, 
      label: dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      balance 
    };
  });
  
  return results.slice(-lastN);
}
