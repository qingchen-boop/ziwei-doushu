'use client';
import { useState } from 'react';
import { BirthInfo, Gender, Sect } from '@/types';

interface BirthFormProps { onSubmit: (birthInfo: BirthInfo) => void; isLoading: boolean; }

export function BirthForm({ onSubmit, isLoading }: BirthFormProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [sect, setSect] = useState<Sect>('nan');
  const [isEarlyZiShi, setIsEarlyZiShi] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate || !birthTime) { alert('请输入出生日期和时间'); return; }
    onSubmit({ name: name || '匿名', gender, birthDate, birthTime, longitude: longitude ? parseFloat(longitude) : undefined, latitude: latitude ? parseFloat(latitude) : undefined, sect, isEarlyZiShi });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">姓名（可选）</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入姓名" className="w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">性别 *</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2"><input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value as Gender)} />男</label>
          <label className="flex items-center gap-2"><input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value as Gender)} />女</label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1">出生日期 *</label><input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full" required /></div>
        <div><label className="block text-sm font-medium mb-1">出生时间 *</label><input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} className="w-full" required /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1">经度（可选）</label><input type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="如: 116.40" step="0.000001" className="w-full" /></div>
        <div><label className="block text-sm font-medium mb-1">纬度（可选）</label><input type="number" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="如: 39.90" step="0.000001" className="w-full" /></div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">派别</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2"><input type="radio" name="sect" value="nan" checked={sect === 'nan'} onChange={(e) => setSect(e.target.value as Sect)} />南派</label>
          <label className="flex items-center gap-2"><input type="radio" name="sect" value="bei" checked={sect === 'bei'} onChange={(e) => setSect(e.target.value as Sect)} />北派</label>
        </div>
      </div>
      <div><label className="flex items-center gap-2"><input type="checkbox" checked={isEarlyZiShi} onChange={(e) => setIsEarlyZiShi(e.target.checked)} /><span className="text-sm">早子时</span></label></div>
      <button type="submit" disabled={isLoading} className="btn btn-primary w-full disabled:opacity-50">{isLoading ? '排盘中...' : '开始排盘'}</button>
    </form>
  );
}