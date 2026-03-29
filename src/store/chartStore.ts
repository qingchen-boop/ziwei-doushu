import { create } from 'zustand';
import { ChartResult, ThemeMode, PeriodType } from '@/types';

interface ChartStore {
  chart: ChartResult | null;
  theme: ThemeMode;
  selectedPalace: number | null;
  selectedPeriod: PeriodType;
  fortuneYear: number;
  isLoading: boolean;
  setChart: (chart: ChartResult | null) => void;
  setTheme: (theme: ThemeMode) => void;
  setSelectedPalace: (id: number | null) => void;
  setSelectedPeriod: (period: PeriodType) => void;
  setFortuneYear: (year: number) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  chart: null as ChartResult | null,
  theme: 'professional' as ThemeMode,
  selectedPalace: null as number | null,
  selectedPeriod: 'liunian' as PeriodType,
  fortuneYear: new Date().getFullYear(),
  isLoading: false,
};

export const useChartStore = create<ChartStore>((set) => ({
  ...initialState,
  setChart: (chart) => set({ chart }),
  setTheme: (theme) => set({ theme }),
  setSelectedPalace: (selectedPalace) => set({ selectedPalace }),
  setSelectedPeriod: (selectedPeriod) => set({ selectedPeriod }),
  setFortuneYear: (fortuneYear) => set({ fortuneYear }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set(initialState),
}));