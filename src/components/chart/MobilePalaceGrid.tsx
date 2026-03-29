'use client';
import { Palace } from '@/types';
import { useChartStore } from '@/store/chartStore';

interface MobilePalaceGridProps { palaces: Palace[]; onPalaceClick?: (palace: Palace) => void; }

export function MobilePalaceGrid({ palaces, onPalaceClick }: MobilePalaceGridProps) {
  const { theme, selectedPalace, setSelectedPalace } = useChartStore();
  const isDark = theme === 'professional';
  const accentColor = isDark ? '#c9a962' : '#6366f1';
  const bgColor = isDark ? '#151820' : '#ffffff';
  const borderColor = isDark ? '#2a2f3c' : '#e5e7eb';
  const textColor = isDark ? '#e8e8ed' : '#1f2937';
  const mutedColor = isDark ? '#7a7f8c' : '#6b7280';

  const getStarStyle = (type: string) => {
    const base = { padding: '1px 3px', borderRadius: '2px', fontWeight: 500, fontSize: '0.5rem', lineHeight: 1.2 };
    if (type === 'main') return { ...base, backgroundColor: `${accentColor}30`, color: accentColor };
    if (type === 'secondary') return { ...base, backgroundColor: `${mutedColor}20`, color: mutedColor };
    if (type === 'transform-lu') return { ...base, backgroundColor: 'rgba(72, 187, 120, 0.3)', color: '#48bb78' };
    if (type === 'transform-quan') return { ...base, backgroundColor: 'rgba(237, 137, 54, 0.3)', color: '#ed8936' };
    if (type === 'transform-ke') return { ...base, backgroundColor: 'rgba(66, 153, 225, 0.3)', color: '#4299e1' };
    if (type === 'transform-忌') return { ...base, backgroundColor: 'rgba(229, 62, 62, 0.3)', color: '#e53e3e' };
    return base;
  };

  return (
    <div style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '0.75rem', padding: '0.5rem', maxWidth: '360px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
        {palaces.map((palace) => {
          const isSelected = selectedPalace === palace.id;
          const allStars = [...palace.mainStars.map(s => ({ name: s.name, type: 'main' })), ...palace.secondaryStars.slice(0, 3).map(s => ({ name: s.name, type: 'secondary' })), ...palace.transformStars.map(s => ({ name: s.name, type: `transform-${s.transformType}` }))];
          return (
            <div key={palace.id} onClick={() => { setSelectedPalace(isSelected ? null : palace.id); onPalaceClick?.(palace); }}
              style={{ backgroundColor: isSelected ? (isDark ? 'rgba(201, 169, 98, 0.2)' : 'rgba(99, 102, 241, 0.15)') : 'transparent', border: isSelected ? `2px solid ${accentColor}` : `1px solid ${borderColor}`, borderRadius: '0.5rem', padding: '0.375rem', minHeight: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: textColor, marginBottom: '2px' }}>{palace.name}</div>
              <div style={{ fontSize: '0.625rem', color: mutedColor, marginBottom: '2px' }}>{palace.stem}{palace.branch}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1px' }}>
                {allStars.slice(0, 4).map((star, idx) => <span key={idx} style={getStarStyle(star.type)}>{star.name}</span>)}
                {allStars.length > 4 && <span style={{ ...getStarStyle('secondary'), fontSize: '0.4rem' }}>+{allStars.length - 4}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}