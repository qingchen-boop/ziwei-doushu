'use client';
import { PeriodType } from '@/types';
import { useChartStore } from '@/store/chartStore';

interface PeriodSelectorProps { liuNianYears?: number[]; currentYear?: number; }

export function PeriodSelector({ liuNianYears, currentYear = new Date().getFullYear() }: PeriodSelectorProps) {
  const { selectedPeriod, setSelectedPeriod, fortuneYear, setFortuneYear } = useChartStore();
  const periods: { type: PeriodType; label: string }[] = [{ type: 'dayun', label: '大运' }, { type: 'liunian', label: '流年' }, { type: 'liuyue', label: '流月' }, { type: 'liuri', label: '流日' }, { type: 'liushi', label: '流时' }];
  const years = liuNianYears || Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex flex-col gap-3">
      <div className="period-tabs">
        {periods.map(({ type, label }) => <button key={type} onClick={() => setSelectedPeriod(type)} className={`period-tab ${selectedPeriod === type ? 'active' : ''}`}>{label}</button>)}
      </div>
      {(selectedPeriod === 'liunian' || selectedPeriod === 'dayun') && (
        <div className="flex items-center gap-2">
          <label className="text-sm muted">选择年份:</label>
          <select value={fortuneYear} onChange={(e) => setFortuneYear(parseInt(e.target.value))} className="flex-1">
            {years.map((year) => <option key={year} value={year}>{year}年</option>)}
          </select>
        </div>
      )}
    </div>
  );
}