import { NextRequest, NextResponse } from 'next/server';
import { calculateChart } from '@/lib/engine';
import { BirthInfo } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const birthInfo: BirthInfo = body;
    if (!birthInfo.birthDate || !birthInfo.birthTime || !birthInfo.gender) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    const chart = await calculateChart(birthInfo);
    return NextResponse.json({ success: true, data: chart });
  } catch (error) {
    console.error('Chart calculation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to calculate chart' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: 'Zi Wei Dou Shu API is running', version: '1.0.0' });
}