import { create } from 'zustand';
import { ChartResult, ThemeMode, PeriodType } from '@/types';

const initialState = {
  chart: null as ChartResult | null,
  theme: 'professional' as ThemeMode,
  selectedPalace: null as number | null,
  selectedPeriod: 'liunian' as PeriodType,
  fortuneYear: new Date().getFullYear(),
  isLoading: false,
};

export const useChartStore = create((set) => ({
  ...initialState,
  setChart: (chart) => set({ chart }),
  setTheme: (theme) => set({ theme }),
  setSelectedPalace: (selectedPalace) => set({ selectedPalace }),
  setSelectedPeriod: (selectedPeriod) => set({ selectedPeriod }),
  setFortuneYear: (fortuneYear) => set({ fortuneYear }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set(initialState),
}));