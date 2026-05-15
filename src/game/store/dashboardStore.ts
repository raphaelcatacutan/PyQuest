import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DashboardProps {
  displayDashboard: boolean;
  toggleDisplayDashboard: (state?: boolean | null) => void;
}

export const useDashboardStore = create<DashboardProps>()(
  persist(
    (set) => ({
      displayDashboard: false,

      toggleDisplayDashboard: (state) => 
        set((s) => ({ 
          displayDashboard: typeof state === 'boolean' ? state : !s.displayDashboard 
        })),
    }),
    {
      name: "dashboard-default",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true
    }
  )
);
