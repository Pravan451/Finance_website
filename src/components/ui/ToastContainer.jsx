import { useEffect, useState, useRef } from 'react';
import useFinanceStore from '../../store/useFinanceStore';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { transactions, emis, lastEmiAlertDate, setLastEmiAlertDate } = useFinanceStore();
  const [toasts, setToasts] = useState([]);
  const prevLenRef = useRef(null);

  // High spending alert
  useEffect(() => {
    if (prevLenRef.current === null) {
      prevLenRef.current = transactions.length;
      return;
    }
    if (transactions.length <= prevLenRef.current) {
      prevLenRef.current = transactions.length;
      return;
    }
    prevLenRef.current = transactions.length;

    const latestTx = transactions[transactions.length - 1];
    if (latestTx.type === 'expense' && latestTx.amount > 10000) {
      const newToast = {
        id: Date.now(),
        message: `High spending alert: ₹${latestTx.amount} on ${latestTx.category}`,
        type: 'warning',
      };

      queueMicrotask(() => {
        setToasts((prev) => [...prev, newToast]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, 5000);
      });
    }
  }, [transactions]);

  // EMI Alert
  useEffect(() => {
    if (!emis || emis.length === 0) return;

    const todayDate = new Date();
    const todayStr = todayDate.toISOString().split('T')[0];
    
    if (lastEmiAlertDate === todayStr) return; // already alerted today

    const tomorrow = new Date(todayDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = tomorrow.getDate();

    const upcomingEmis = emis.filter(emi => emi.paymentDay === tomorrowDay && emi.monthsPaid < emi.totalMonths);

    if (upcomingEmis.length > 0) {
      upcomingEmis.forEach(emi => {
        const newToast = {
          id: Date.now() + Math.random(),
          message: `Reminder: EMI "${emi.name}" (₹${emi.monthlyAmount}) is due tomorrow! Maintain your balance.`,
          type: 'warning',
        };
        setToasts((prev) => [...prev, newToast]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, 10000);
      });

      setLastEmiAlertDate(todayStr); // Guard against multiple alerts today
    }
  }, [emis, lastEmiAlertDate, setLastEmiAlertDate]);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="bg-gray-800/95 backdrop-blur border border-yellow-500/50 text-white p-4 rounded-xl shadow-2xl flex items-start justify-between min-w-[320px] max-w-sm"
          >
            <div className="flex items-start gap-3 mt-0.5">
              <div className="bg-yellow-500/20 p-2 rounded-full">
                <AlertTriangle className="text-yellow-400 w-5 h-5" />
              </div>
              <p className="text-sm font-medium leading-relaxed pt-1 text-gray-200">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-500 hover:text-white transition-colors bg-gray-900/50 p-1.5 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </Motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
