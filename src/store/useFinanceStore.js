import { create } from "zustand";
import { persist } from "zustand/middleware";
import mockData from "../data/mockData";

const defaultCategoryBudgets = {
  Food: 6000,
  Transport: 4000,
  Entertainment: 3000,
  Bills: 33000,
  Shopping: 9000,
  Health: 5000,
  Investment: 25000,
  Freelance: 0,
  Salary: 0,
};

const useFinanceStore = create(
  persist(
    (set, get) => ({
      transactions: mockData,
      role: "admin",
      isAuthenticated: false,
      registeredUsers: [
        { username: "Admin", email: "admin@finflow.io", password: "password123", pin: "1234" }
      ],
      currentUser: null,
      darkMode: true,
      sidebarCollapsed: false,
      mobileNavOpen: false,
      categoryBudgets: { ...defaultCategoryBudgets },
      emis: [],
      lastEmiAlertDate: null,

      setRole: (role) => set({ role }),
      
      login: (email, password) => {
        const user = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (user) {
          set({ isAuthenticated: true, currentUser: { username: user.username, email: user.email, pin: user.pin } });
          return true;
        }
        return false;
      },
      
      registerUser: (username, email, password, pin) => {
        const exists = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) return false;
        
        const newUser = { username, email, password, pin };
        set((state) => ({
          registeredUsers: [...state.registeredUsers, newUser]
        }));
        return true;
      },
      
      logout: () => set({ isAuthenticated: false, currentUser: null }),

      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

      setCategoryBudgets: (budgets) => {
        if (get().role !== 'admin') return;
        set({ categoryBudgets: { ...budgets } });
      },

      addTransaction: (tx) => {
        if (get().role !== 'admin') return;
        set((state) => ({
          transactions: [...state.transactions, tx],
        }));
      },

      updateTransaction: (id, updates) => {
        if (get().role !== 'admin') return;
        set((state) => ({
          transactions: state.transactions.map((t) =>
            String(t.id) === String(id) ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        if (get().role !== 'admin') return;
        set((state) => ({
          transactions: state.transactions.filter((t) => String(t.id) !== String(id)),
        }));
      },

      resetData: () => {
        if (get().role !== 'admin') return;
        set({
          transactions: [],
          categoryBudgets: { ...defaultCategoryBudgets },
          emis: [],
          lastEmiAlertDate: null,
        });
      },

      loadDemoData: () => {
        if (get().role !== 'admin') return;
        set({ transactions: mockData });
      },

      addToast: () => {},

      addEmi: (emi) => {
        if (get().role !== 'admin') return;
        set((state) => ({
          emis: [...state.emis, emi],
        }));
      },

      deleteEmi: (id) => {
        if (get().role !== 'admin') return;
        set((state) => ({
          emis: state.emis.filter((e) => String(e.id) !== String(id)),
        }));
      },

      recordEmiPayment: (id) => {
        if (get().role !== 'admin') return;
        let paidEmi = null;
        set((state) => ({
          emis: state.emis.map((e) => {
            if (String(e.id) === String(id) && e.monthsPaid < e.totalMonths) {
              paidEmi = e;
              return { ...e, monthsPaid: e.monthsPaid + 1 };
            }
            return e;
          }),
        }));

        if (paidEmi) {
          get().addTransaction({
            id: Date.now().toString(),
            title: `EMI: ${paidEmi.name}`,
            amount: paidEmi.monthlyAmount,
            type: 'expense',
            category: 'Bills',
            date: new Date().toISOString().split('T')[0]
          });
        }
      },

      setLastEmiAlertDate: (dateString) => set({ lastEmiAlertDate: dateString }),
    }),
    {
      name: "finance-storage",
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        registeredUsers: state.registeredUsers,
        currentUser: state.currentUser,
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
        categoryBudgets: state.categoryBudgets,
        emis: state.emis,
        lastEmiAlertDate: state.lastEmiAlertDate,
      }),
    }
  )
);

export default useFinanceStore;
