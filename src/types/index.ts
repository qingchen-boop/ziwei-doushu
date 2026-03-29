export type Gender = 'male' | 'female';
export type Sect = 'nan' | 'bei';
export type PeriodType = 'dayun' | 'liunian' | 'liuyue' | 'liuri' | 'liushi';
export type ThemeMode = 'professional' | 'modern';

export interface BirthInfo {
  name: string;
  gender: Gender;
  birthDate: string;
  birthTime: string;
  longitude?: number;
  latitude?: number;
  timezone?: string;
  isEarlyZiShi?: boolean;
  sect?: Sect;
}

export interface Star {
  id: string;
  name: string;
  type: 'main' | 'secondary' | 'mda' | 'transform';
  isSoft: boolean;
}

export interface TransformStar extends Star {
  transformType: 'lu' | 'quan' | 'ke' | '忌';
  originalStem: string;
}

export interface Palace {
  id: number;
  name: string;
  stem: string;
  branch: string;
  mainStars: Star[];
  secondaryStars: Star[];
  mdaStars: Star[];
  transformStars: TransformStar[];
  angularPalaces: number[];
  oppositePalace: number;
}

export interface ChartResult {
  birthInfo: BirthInfo;
  mingGong: number;
  shenGong: number;
  mingGan: string;
  wuXingJu: string;
  chartData: {
    palaces: Palace[];
    stars: Star[];
    fourTransforms: TransformStar[];
  };
  liuNian: LiuNianInfo[];
  daYun: DaYunInfo[];
  createdAt?: string;
}

export interface LiuNianInfo {
  year: number;
  ganZhi: string;
  palace: number;
  transforms: TransformStar[];
  stars: Star[];
}

export interface DaYunInfo {
  startAge: number;
  endAge: number;
  ganZhi: string;
  palace: number;
  stars: Star[];
  transforms: TransformStar[];
}

export interface ChartStore {
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