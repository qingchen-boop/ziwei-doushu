'use client';
import { useChartStore } from '@/store/chartStore';

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useChartStore();
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button onClick={() => setTheme('professional')} className={`px-3 py-1.5 rounded-md text-sm transition-all ${theme === 'professional' ? 'bg-professional-accent text-professional-bg' : 'text-professional-muted'}`}>专业深色</button>
      <button onClick={() => setTheme('modern')} className={`px-3 py-1.5 rounded-md text-sm transition-all ${theme === 'modern' ? 'bg-modern-accent text-white' : 'text-modern-muted'}`}>现代清新</button>
    </div>
  );
}
interface ThemeToggleProps { className?: string; }