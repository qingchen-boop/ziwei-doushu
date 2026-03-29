'use client';
import { useState } from 'react';
import { useChartStore } from '@/store/chartStore';
import { BirthInfo } from '@/types';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { BirthForm } from '@/components/ui/BirthForm';
import { PalaceGrid } from '@/components/chart/PalaceGrid';
import { PalaceDetail } from '@/components/chart/PalaceDetail';
import { MobilePalaceGrid } from '@/components/chart/MobilePalaceGrid';
import { PeriodSelector } from '@/components/chart/PeriodSelector';
import { calculateChart } from '@/lib/engine';

export default function HomePage() {
  const { chart, theme, setChart, selectedPalace, isLoading, setLoading } = useChartStore();
  const [isMobile, setIsMobile] = useState(false);
  const isDark = theme === 'professional';
  const bgClass = isDark ? 'theme-professional' : 'theme-modern';

  const handleCalculate = async (birthInfo: BirthInfo) => {
    setLoading(true);
    try {
      const result = await calculateChart(birthInfo);
      setChart(result);
    } catch (error) {
      console.error('Calculation error:', error);
      alert('排盘计算失败');
    } finally {
      setLoading(false);
    }
  };

  const selectedPalaceData = chart?.chartData.palaces.find((p) => p.id === selectedPalace) || null;

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <header className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ borderColor: isDark ? '#2a2f3c' : '#e5e7eb', backgroundColor: isDark ? 'rgba(13,15,20,0.8)' : 'rgba(245,246,248,0.8)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold" style={{ color: isDark ? '#c9a962' : '#6366f1' }}>紫微斗数</h1>
            <span className="text-sm muted" style={{ color: isDark ? '#7a7f8c' : '#6b7280' }}>排盘系统</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobile(!isMobile)} className="text-sm px-3 py-1 rounded-md border" style={{ borderColor: isDark ? '#2a2f3c' : '#e5e7eb' }}>{isMobile ? 'PC视图' : '手机视图'}</button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">
        {!chart ? (
          <div className="max-w-md mx-auto mt-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: isDark ? '#e8e8ed' : '#1f2937' }}>输入命主信息</h2>
              <p style={{ color: isDark ? '#7a7f8c' : '#6b7280' }}>出生日期和时间将用于排盘计算</p>
            </div>
            <div className="card p-6"><BirthForm onSubmit={handleCalculate} isLoading={isLoading} /></div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold" style={{ color: isDark ? '#e8e8ed' : '#1f2937' }}>{chart.birthInfo.name} · {chart.birthInfo.gender === 'male' ? '男' : '女'}</h2>
                <p className="text-sm muted" style={{ color: isDark ? '#7a7f8c' : '#6b7280' }}>{chart.birthInfo.birthDate} {chart.birthInfo.birthTime} · 命宫{chart.mingGong}宫 · {chart.wuXingJu}</p>
              </div>
              <button onClick={() => setChart(null)} className="text-sm px-3 py-1 rounded-md border" style={{ borderColor: isDark ? '#2a2f3c' : '#e5e7eb' }}>重新排盘</button>
            </div>
            {isMobile ? (
              <div className="space-y-4">
                <MobilePalaceGrid palaces={chart.chartData.palaces} />
                <PeriodSelector liuNianYears={chart.liuNian.map(l => l.year)} currentYear={new Date().getFullYear()} />
                {selectedPalaceData && <div className="animate-fadeIn"><PalaceDetail palace={selectedPalaceData} /></div>}
              </div>
            ) : (
              <div className="layout-three-columns">
                <div className="animate-fadeIn"><PalaceGrid palaces={chart.chartData.palaces} /></div>
                <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}><PalaceDetail palace={selectedPalaceData} /></div>
                <div className="space-y-4 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  <div className="card p-4"><h3 className="text-sm font-semibold mb-3" style={{ color: isDark ? '#e8e8ed' : '#1f2937' }}>运限选择</h3><PeriodSelector liuNianYears={chart.liuNian.map(l => l.year)} currentYear={new Date().getFullYear()} /></div>
                  {chart.daYun.length > 0 && <div className="card p-4"><h3 className="text-sm font-semibold mb-3" style={{ color: isDark ? '#e8e8ed' : '#1f2937' }}>大运一览</h3><div className="space-y-2 max-h-64 overflow-y-auto">{chart.daYun.slice(0, 5).map((dayun, idx) => <div key={idx} className="flex justify-between items-center text-sm p-2 rounded" style={{ backgroundColor: isDark ? '#1a1d24' : '#f5f6f8' }}><span style={{ color: isDark ? '#e8e8ed' : '#1f2937' }}>{dayun.startAge}-{dayun.endAge}岁</span><span className="accent" style={{ color: isDark ? '#c9a962' : '#6366f1' }}>{dayun.ganZhi}</span></div>)}</div></div>}
                  {chart.liuNian.length > 0 && <div className="card p-4"><h3 className="text-sm font-semibold mb-3" style={{ color: isDark ? '#e8e8ed' : '#1f2937' }}>流年概要</h3><div className="space-y-2 max-h-64 overflow-y-auto">{chart.liuNian.slice(0, 5).map((liunian, idx) => <div key={idx} className="flex justify-between items-center text-sm p-2 rounded" style={{ backgroundColor: isDark ? '#1a1d24' : '#f5f6f8' }}><span style={{ color: isDark ? '#e8e8ed' : '#1f2937' }}>{liunian.year}年</span><span className="accent" style={{ color: isDark ? '#c9a962' : '#6366f1' }}>{liunian.ganZhi}</span></div>)}</div></div>}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <footer className="mt-8 py-4 text-center text-sm" style={{ color: isDark ? '#7a7f8c' : '#6b7280' }}>
        <p>紫微斗数排盘系统 · 支持真太阳时 · 南北派算法 · 四化联动</p>
      </footer>
    </div>
  );
}