import { BirthInfo, ChartResult, Palace, Star, TransformStar, LiuNianInfo, DaYunInfo, Gender, Sect } from '@/types';
import { Lunar, Solar } from 'lunar-javascript';

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const WU_XING_JU: Record<string, { name: string; value: number }> = {
  '甲': { name: '木三局', value: 3 }, '乙': { name: '木三局', value: 3 },
  '丙': { name: '火六局', value: 6 }, '丁': { name: '火六局', value: 6 },
  '戊': { name: '土五局', value: 5 }, '己': { name: '土五局', value: 5 },
  '庚': { name: '金四局', value: 4 }, '辛': { name: '金四局', value: 4 },
  '壬': { name: '水二局', value: 2 }, '癸': { name: '水二局', value: 2 },
};

const MAIN_STARS_INFO: Record<string, { id: string; isSoft: boolean }> = {
  '紫微': { id: 'ziwei', isSoft: false }, '天机': { id: 'tianji', isSoft: true },
  '太阳': { id: 'taiyang', isSoft: false }, '武曲': { id: 'wuqu', isSoft: false },
  '天同': { id: 'tiantong', isSoft: true }, '廉贞': { id: 'lianzhen', isSoft: false },
  '天府': { id: 'tianfu', isSoft: true }, '太阴': { id: 'taiyin', isSoft: true },
  '贪狼': { id: 'tanlang', isSoft: true }, '巨门': { id: 'jumen', isSoft: false },
  '天相': { id: 'tianxiang', isSoft: true }, '天梁': { id: 'tianliang', isSoft: false },
  '七杀': { id: 'qisha', isSoft: false }, '破军': { id: 'pojun', isSoft: false },
};

const MAIN_STAR_SEQUENCE = [
  { star: '紫微', basePalace: 0 }, { star: '天机', basePalace: 1 },
  { star: '太阳', basePalace: 2 }, { star: '武曲', basePalace: 3 },
  { star: '天同', basePalace: 4 }, { star: '廉贞', basePalace: 5 },
  { star: '天府', basePalace: 6 }, { star: '太阴', basePalace: 7 },
  { star: '贪狼', basePalace: 8 }, { star: '巨门', basePalace: 9 },
  { star: '天相', basePalace: 10 }, { star: '天梁', basePalace: 11 },
  { star: '七杀', basePalace: 12 }, { star: '破军', basePalace: 13 },
];

const FOUR_TRANSFORMS: Record<number, { lu?: string; quan?: string; ke?: string; ji?: string }> = {
  0: { lu: '禄', quan: '权', ke: '科', ji: '忌' },
  1: { ke: '科', ji: '忌', lu: '禄', quan: '权' },
  2: { lu: '禄', quan: '权', ke: '科', ji: '忌' },
  3: { lu: '禄', quan: '权', ke: '科', ji: '忌' },
  4: { lu: '禄', quan: '权', ke: '科', ji: '忌' },
  5: { lu: '禄', quan: '权', ke: '科', ji: '忌' },
  6: { lu: '禄', quan: '权', ke: '科', ji: '忌' },
  7: { lu: '禄', quan: '权', ke: '科', ji: '忌' },
  8: { lu: '禄', quan: '权', ke: '科', ji: '忌' },
  9: { lu: '禄', quan: '权', ke: '科', ji: '忌' },
};

const HUA_JI_PALACE: Record<Sect, Record<string, number>> = {
  nan: { '甲': 5, '乙': 5, '丙': 5, '丁': 5, '戊': 5, '己': 5, '庚': 5, '辛': 5, '壬': 5, '癸': 5 },
  bei: { '甲': 4, '乙': 4, '丙': 4, '丁': 4, '戊': 4, '己': 4, '庚': 4, '辛': 4, '壬': 4, '癸': 4 },
};

const PALACE_NAMES = ['命宫', '父母宫', '福德宫', '田宅宫', '事业宫', '交友宫', '迁移宫', '疾厄宫', '财帛宫', '子女宫', '兄弟宫', '夫妻宫'];

export class ZiWeiEngine {
  private birthInfo: BirthInfo;
  private solarDate: Solar;
  private lunarDate: Lunar;
  private sect: Sect;

  constructor(birthInfo: BirthInfo) {
    this.birthInfo = birthInfo;
    this.sect = birthInfo.sect || 'nan';
    const [year, month, day] = birthInfo.birthDate.split('-').map(Number);
    const [hour, minute] = birthInfo.birthTime.split(':').map(Number);
    this.solarDate = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    this.lunarDate = this.solarDate.getLunar();
  }

  private getStemIndex(date: Date): number {
    return ((date.getFullYear() - 1984) % 10 + 10) % 10;
  }

  private calculateMingGong(lunarMonth: number, birthHour: number, wuXingJu: number): number {
    const birthHourPalace = ((1 + birthHour - 1) % 12) + 1;
    const birthMonthPalace = ((2 + lunarMonth - 2) % 12) + 1;
    return ((birthHourPalace + birthMonthPalace + wuXingJu - 2) % 12) || 12;
  }

  private calculateShenGong(mingGong: number, birthHour: number): number {
    return ((mingGong + birthHour) % 12) || 12;
  }

  private distributePalaces(mingGong: number): Palace[] {
    return Array.from({ length: 12 }, (_, i) => {
      const palacePosition = ((2 - mingGong + 12) % 12 + i) % 12;
      const branchIndex = (palacePosition + 1) % 12;
      return {
        id: i + 1,
        name: PALACE_NAMES[i],
        stem: HEAVENLY_STEMS[(this.getStemIndex(this.solarDate.getDate()) + i) % 10],
        branch: EARTHLY_BRANCHES[branchIndex],
        mainStars: [], secondaryStars: [], mdaStars: [], transformStars: [],
        angularPalaces: [(((i + 1) + 5) % 12) + 1, (((i + 1) + 10) % 12) + 1, (((i + 1)) % 12) + 1],
        oppositePalace: (((i + 5) % 12) + 1),
      };
    });
  }

  private placeMainStars(palaces: Palace[], mingGong: number): void {
    const lunarMonth = this.lunarDate.getMonth();
    const ziweiPalaceOffset = (12 - lunarMonth) % 12;
    MAIN_STAR_SEQUENCE.forEach(({ star, basePalace }) => {
      let offset = (basePalace - ziweiPalaceOffset + 12) % 12;
      let targetIndex = (mingGong - 1 + offset) % 12;
      if (targetIndex < 0) targetIndex += 12;
      const info = MAIN_STARS_INFO[star];
      palaces[targetIndex].mainStars.push({ id: info.id, name: star, type: 'main', isSoft: info.isSoft });
    });
  }

  private placeSecondaryStars(palaces: Palace[]): void {
    const yearGan = HEAVENLY_STEMS[this.getStemIndex(this.solarDate.getDate())];
    const yearZhi = EARTHLY_BRANCHES[this.lunarDate.getYear() % 12];
    const zuoYouTable: Record<string, number[]> = { '甲': [1, 2], '乙': [2, 3], '丙': [3, 4], '丁': [4, 5], '戊': [5, 6], '己': [6, 7], '庚': [7, 8], '辛': [8, 9], '壬': [9, 10], '癸': [10, 11] };
    (zuoYouTable[yearGan] || [1, 2]).forEach((pos, idx) => {
      palaces[(pos - 1 + 12) % 12].secondaryStars.push({ id: idx === 0 ? 'zuofu' : 'youbi', name: idx === 0 ? '左辅' : '右弼', type: 'secondary', isSoft: true });
    });
    const wenQuTable: Record<string, number> = { '子': 4, '丑': 5, '寅': 6, '卯': 7, '辰': 8, '巳': 9, '午': 10, '未': 11, '申': 12, '酉': 1, '戌': 2, '亥': 3 };
    const wenChangPos = wenQuTable[yearZhi] || 4;
    palaces[(wenChangPos - 1 + 12) % 12].secondaryStars.push({ id: 'wenchang', name: '文昌', type: 'secondary', isSoft: true });
    const wenQuPos = ((wenChangPos + 6) % 12) || 12;
    palaces[(wenQuPos - 1 + 12) % 12].secondaryStars.push({ id: 'wenqu', name: '文曲', type: 'secondary', isSoft: true });
    const luCunTable: Record<string, number> = { '甲': 2, '乙': 3, '丙': 4, '丁': 5, '戊': 6, '己': 7, '庚': 8, '辛': 9, '壬': 10, '癸': 11 };
    palaces[(luCunTable[yearGan] || 2) - 1].secondaryStars.push({ id: 'lucun', name: '禄存', type: 'secondary', isSoft: true });
    const tianMaTable: Record<string, number> = { '子': 9, '丑': 8, '寅': 7, '卯': 6, '辰': 5, '巳': 4, '午': 3, '未': 2, '申': 1, '酉': 12, '戌': 11, '亥': 10 };
    palaces[(tianMaTable[yearZhi] || 9) - 1].mdaStars.push({ id: 'tianma', name: '天马', type: 'mda', isSoft: true });
  }

  private calculateFourTransforms(palaces: Palace[], stemIndex: number): TransformStar[] {
    const transforms: TransformStar[] = [];
    const config = FOUR_TRANSFORMS[stemIndex] || {};
    const offsets: Record<string, Record<string, number>> = {
      '甲': { lu: 5, quan: 7, ke: 3, ji: 0 }, '乙': { lu: 3, quan: 1, ke: 5, ji: 8 },
      '丙': { lu: 2, quan: 5, ke: 10, ji: 6 }, '丁': { lu: 3, quan: 9, ke: 11, ji: 4 },
      '戊': { lu: 8, quan: 5, ke: 9, ji: 3 }, '己': { lu: 9, quan: 2, ke: 8, ji: 4 },
      '庚': { lu: 5, quan: 6, ke: 3, ji: 10 }, '辛': { lu: 9, quan: 3, ke: 2, ji: 8 },
      '壬': { lu: 3, quan: 6, ke: 10, ji: 2 }, '癸': { lu: 7, quan: 8, ke: 11, ji: 6 },
    };
    const stem = HEAVENLY_STEMS[stemIndex];
    if (config.lu) { const p = offsets[stem]?.lu ?? 0; const t: TransformStar = { id: 'hua_lu', name: '化禄', type: 'transform', isSoft: true, transformType: 'lu', originalStem: stem }; transforms.push(t); if (p >= 0 && p < 12) palaces[p].transformStars.push(t); }
    if (config.quan) { const p = offsets[stem]?.quan ?? 0; const t: TransformStar = { id: 'hua_quan', name: '化权', type: 'transform', isSoft: false, transformType: 'quan', originalStem: stem }; transforms.push(t); if (p >= 0 && p < 12) palaces[p].transformStars.push(t); }
    if (config.ke) { const p = offsets[stem]?.ke ?? 0; const t: TransformStar = { id: 'hua_ke', name: '化科', type: 'transform', isSoft: true, transformType: 'ke', originalStem: stem }; transforms.push(t); if (p >= 0 && p < 12) palaces[p].transformStars.push(t); }
    if (config.ji) { const p = HUA_JI_PALACE[this.sect][stem] - 1; const t: TransformStar = { id: 'hua_ji', name: '化忌', type: 'transform', isSoft: false, transformType: '忌', originalStem: stem }; transforms.push(t); if (p >= 0 && p < 12) palaces[p].transformStars.push(t); }
    return transforms;
  }

  calculateLiuNianTransforms(year: number): TransformStar[] {
    const stemIndex = year % 10;
    const config = FOUR_TRANSFORMS[stemIndex] || {};
    return Object.entries(config).map(([type, name]) => ({
      id: `liunian_${type}_${year}`, name, type: 'transform' as const,
      isSoft: type === 'lu' || type === 'ke', transformType: type as 'lu' | 'quan' | 'ke' | '忌',
      originalStem: HEAVENLY_STEMS[stemIndex],
    }));
  }

  calculateDaYun(startAge: number, gender: Gender, mingGong: number): DaYunInfo[] {
    const result: DaYunInfo[] = [];
    const stemIndex = this.getStemIndex(this.solarDate.getDate());
    const branchIndex = EARTHLY_BRANCHES.indexOf(this.lunarDate.getShengxiao() || '子');
    const isForward = (gender === 'male' && stemIndex % 2 === 0) || (gender === 'female' && stemIndex % 2 === 1);
    let currentPalace = mingGong, currentStemIndex = stemIndex;
    for (let i = 0; i < 10; i++) {
      const age = startAge + i;
      if (age < 0 || age > 120) continue;
      currentPalace = isForward ? (currentPalace % 12 + 1) : (currentPalace === 1 ? 12 : currentPalace - 1);
      currentStemIndex = (currentStemIndex + 1) % 10;
      result.push({ startAge: age, endAge: age + 9, ganZhi: HEAVENLY_STEMS[currentStemIndex] + EARTHLY_BRANCHES[(branchIndex + i) % 12], palace: currentPalace, stars: [], transforms: [] });
    }
    return result;
  }

  calculate(): ChartResult {
    const hour = this.solarDate.getDate().getHours();
    const yearGanIndex = this.getStemIndex(this.solarDate.getDate());
    const yearGan = HEAVENLY_STEMS[yearGanIndex];
    const wuXingJu = WU_XING_JU[yearGan];
    const mingGong = this.calculateMingGong(this.lunarDate.getMonth(), hour, wuXingJu.value);
    const palaces = this.distributePalaces(mingGong);
    this.placeMainStars(palaces, mingGong);
    this.placeSecondaryStars(palaces);
    const fourTransforms = this.calculateFourTransforms(palaces, yearGanIndex);
    const allStars: Star[] = palaces.flatMap(p => [...p.mainStars, ...p.secondaryStars, ...p.mdaStars]);
    const currentYear = new Date().getFullYear();
    const liuNian: LiuNianInfo[] = [];
    for (let y = currentYear - 5; y <= currentYear + 5; y++) {
      liuNian.push({ year: y, ganZhi: HEAVENLY_STEMS[y % 10] + EARTHLY_BRANCHES[y % 12], palace: ((y - currentYear + mingGong - 1) % 12) + 1, transforms: this.calculateLiuNianTransforms(y), stars: [] });
    }
    return { birthInfo: this.birthInfo, mingGong, shenGong: this.calculateShenGong(mingGong, hour), mingGan: yearGan, wuXingJu: wuXingJu.name, chartData: { palaces, stars: allStars, fourTransforms }, liuNian, daYun: this.calculateDaYun(0, this.birthInfo.gender, mingGong), createdAt: new Date().toISOString() };
  }
}

export async function calculateChart(birthInfo: BirthInfo): Promise<ChartResult> {
  return new ZiWeiEngine(birthInfo).calculate();
}