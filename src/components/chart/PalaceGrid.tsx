'use client';
import { Palace } from '@/types';
import { useChartStore } from '@/store/chartStore';

interface PalaceGridProps { palaces: Palace[]; }

export function PalaceGrid({ palaces }: PalaceGridProps) {
  const { theme, selectedPalace, setSelectedPalace } = useChartStore();
  const isDark = theme === 'professional';
  const accentColor = isDark ? '#c9a962' : '#6366f1';
  const bgColor = isDark ? '#151820' : '#ffffff';
  const borderColor = isDark ? '#2a2f3c' : '#e5e7eb';
  const textColor = isDark ? '#e8e8ed' : '#1f2937';
  const mutedColor = isDark ? '#7a7f8c' : '#6b7280';

  const getStarStyle = (type: string) => {
    const base = { padding: '1px 4px', borderRadius: '3px', fontWeight: 500, fontSize: '0.625rem' };
    if (type === 'main') return { ...base, backgroundColor: `${accentColor}30`, color: accentColor };
    if (type === 'secondary') return { ...base, backgroundColor: `${mutedColor}20`, color: mutedColor };
    if (type === 'transform-lu') return { ...base, backgroundColor: 'rgba(72, 187, 120, 0.2)', color: '#48bb78' };
    if (type === 'transform-quan') return { ...base, backgroundColor: 'rgba(237, 137, 54, 0.2)', color: '#ed8936' };
    if (type === 'transform-ke') return { ...base, backgroundColor: 'rgba(66, 153, 225, 0.2)', color: '#4299e1' };
    if (type === 'transform-忌') return { ...base, backgroundColor: 'rgba(229, 62, 62, 0.2)', color: '#e53e3e' };
    return base;
  };

  return (
    <div style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '0.5rem', padding: '0.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
        {palaces.map((palace) => {
          const isSelected = selectedPalace === palace.id;
          const allStars = [
            ...palace.mainStars.map(s => ({ name: s.name, type: 'main' })),
            ...palace.secondaryStars.map(s => ({ name: s.name, type: 'secondary' })),
            ...palace.transformStars.map(s => ({ name: s.name, type: `transform-${s.transformType}` })),
          ];
          return (
            <div key={palace.id} onClick={() => setSelectedPalace(isSelected ? null : palace.id)}
              style={{ backgroundColor: isSelected ? (isDark ? 'rgba(201, 169, 98, 0.15)' : 'rgba(99, 102, 241, 0.1)') : 'transparent', border: isSelected ? `2px solid ${accentColor}` : '2px solid transparent', borderRadius: '0.375rem', padding: '0.5rem', minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: textColor, marginBottom: '0.25rem' }}>{palace.name}</div>
              <div style={{ fontSize: '0.75rem', color: mutedColor, marginBottom: '0.375rem' }}>{palace.stem}{palace.branch}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px' }}>
                {allStars.slice(0, 6).map((star, idx) => <span key={idx} style={getStarStyle(star.type)}>{star.name}</span>)}
                {allStars.length > 6 && <span style={{ ...getStarStyle('secondary'), fontSize: '0.5rem' }}>+{allStars.length - 6}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}