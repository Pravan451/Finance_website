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
    (set) => ({
      transactions: mockData,
      role: "admin",
      isAuthenticated: false,
      darkMode: true,
      sidebarCollapsed: false,
      mobileNavOpen: false,
      categoryBudgets: { ...defaultCategoryBudgets },

      setRole: (role) => set({ role }),
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),

      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

      setCategoryBudgets: (budgets) => set({ categoryBudgets: { ...budgets } }),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [...state.transactions, tx],
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            String(t.id) === String(id) ? { ...t, ...updates } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => String(t.id) !== String(id)),
        })),

      resetData: () =>
        set({
          transactions: mockData,
          categoryBudgets: { ...defaultCategoryBudgets },
        }),

      addToast: () => {},
    }),
    {
      name: "finance-storage",
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
        categoryBudgets: state.categoryBudgets,
      }),
    }
  )
);

export default useFinanceStore;
