import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import Budget from './pages/Budget';
import Settings from './pages/Settings';
import Emi from './pages/Emi';
import Login from './pages/Login';
import ToastContainer from './components/ui/ToastContainer';
import useFinanceStore from './store/useFinanceStore';
import { useEffect } from 'react';

const ProtectedRoute = () => {
  const { isAuthenticated } = useFinanceStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
  const { darkMode } = useFinanceStore();

  useEffect(() => {
    // Basic root level class for dark mode if we wanted to expand light theme later
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="emis" element={<Emi />} />
              <Route path="insights" element={<Insights />} />
              <Route path="budget" element={<Budget />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}