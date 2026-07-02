import { NextResponse } from 'next/server';
import { fetchPrayerTimes } from '@/lib/weather';

export async function GET() {
  try {
    const times = await fetchPrayerTimes();
    return NextResponse.json(times);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prayer times' }, { status: 500 });
  }
}
