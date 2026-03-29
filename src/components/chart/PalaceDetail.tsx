'use client';
import { Palace } from '@/types';
import { useChartStore } from '@/store/chartStore';

interface PalaceDetailProps { palace: Palace | null; }

export function PalaceDetail({ palace }: PalaceDetailProps) {
  const { theme } = useChartStore();
  const isDark = theme === 'professional';
  const accentColor = isDark ? '#c9a962' : '#6366f1';
  const bgColor = isDark ? '#151820' : '#ffffff';
  const borderColor = isDark ? '#2a2f3c' : '#e5e7eb';
  const textColor = isDark ? '#e8e8ed' : '#1f2937';
  const mutedColor = isDark ? '#7a7f8c' : '#6b7280';

  if (!palace) return <div style={{ minHeight: '300px', backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: mutedColor }}>点击宫位查看详情</p></div>;

  const getStarStyle = (type: string) => {
    const base = { padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 500 };
    if (type === 'main') return { ...base, backgroundColor: `${accentColor}20`, color: accentColor };
    if (type === 'secondary') return { ...base, backgroundColor: `${mutedColor}15`, color: mutedColor };
    if (type === 'transform-lu') return { ...base, backgroundColor: 'rgba(72, 187, 120, 0.2)', color: '#48bb78' };
    if (type === 'transform-quan') return { ...base, backgroundColor: 'rgba(237, 137, 54, 0.2)', color: '#ed8936' };
    if (type === 'transform-ke') return { ...base, backgroundColor: 'rgba(66, 153, 225, 0.2)', color: '#4299e1' };
    if (type === 'transform-忌') return { ...base, backgroundColor: 'rgba(229, 62, 62, 0.2)', color: '#e53e3e' };
    return base;
  };

  const getDescription = (id: number) => {
    const desc: Record<number, string> = { 1: '代表先天运势、个人能力与性格特质', 2: '代表父母缘分、学历资质', 3: '代表精神追求、享乐运势', 4: '代表固定资产、不动产', 5: '代表事业宫', 6: '代表交友人脉', 7: '代表外出运势', 8: '代表健康体质', 9: '代表财富运势', 10: '代表子女缘分', 11: '代表兄弟姐妹', 12: '代表配偶缘分' };
    return desc[id] || '';
  };

  return (
    <div style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '0.5rem', padding: '1.5rem', height: '100%', overflow: 'auto' }}>
      <div style={{ borderBottom: `1px solid ${borderColor}`, paddingBottom: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: textColor, margin: 0 }}>{palace.name}</h2>
        <p style={{ fontSize: '0.875rem', color: mutedColor, marginTop: '0.25rem' }}>{palace.stem}宫 · {palace.branch}宫 · 对宫: {palace.oppositePalace}宫</p>
      </div>
      {palace.mainStars.length > 0 && <div style={{ marginBottom: '1.25rem' }}><h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>主星</h3><div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>{palace.mainStars.map((s, i) => <span key={i} style={getStarStyle('main')}>{s.name}</span>)}</div></div>}
      {palace.secondaryStars.length > 0 && <div style={{ marginBottom: '1.25rem' }}><h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>辅星</h3><div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>{palace.secondaryStars.map((s, i) => <span key={i} style={getStarStyle('secondary')}>{s.name}</span>)}</div></div>}
      {palace.transformStars.length > 0 && <div style={{ marginBottom: '1.25rem' }}><h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>四化</h3><div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>{palace.transformStars.map((s, i) => <span key={i} style={getStarStyle(`transform-${s.transformType}`)}>{s.name}</span>)}</div></div>}
      <div style={{ marginBottom: '1.25rem' }}><h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>三方四正</h3><div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>{palace.angularPalaces.map((id, i) => <span key={i} style={{ padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.8125rem', backgroundColor: borderColor, color: textColor }}>{id}宫</span>)}</div></div>
      <div style={{ marginBottom: '1.25rem' }}><h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>命理解读</h3><p style={{ fontSize: '0.875rem', color: mutedColor, lineHeight: 1.6 }}>{palace.name}主{getDescription(palace.id)}. 此宫{ palace.mainStars.length > 0 ? `坐拥${palace.mainStars.map(s => s.name).join('、')}` : '无主星入驻'}.</p></div>
    </div>
  );
}