import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const lat = 33.6844;
    const lon = 73.0479;

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=Asia/Karachi`,
      { next: { revalidate: 1800 } }
    );

    if (!response.ok) {
      throw new Error('Weather fetch failed');
    }

    const data = await response.json();
    const temp = Math.round(data.current?.temperature_2m ?? 0);
    const code = data.current?.weather_code ?? 0;

    const icons: Record<number, string> = {
      0: '☀', 1: '🌤', 2: '⛅', 3: '☁',
      45: '🌫', 48: '🌫', 51: '🌦', 53: '🌦', 55: '🌧',
      61: '🌧', 63: '🌧', 65: '🌧', 71: '❄', 73: '❄', 75: '❄',
      80: '🌦', 81: '🌧', 82: '⛈', 95: '⛈', 96: '⛈', 99: '⛈',
    };

    return NextResponse.json({
      temperature: temp,
      weatherCode: code,
      icon: icons[code] || '🌡',
      description: 'N/A',
      humidity: 0,
      windSpeed: 0,
    });
  } catch (error) {
    console.error('Weather error:', error);
    return NextResponse.json({
      temperature: 34,
      weatherCode: 0,
      icon: '☀',
      description: 'Clear',
      humidity: 0,
      windSpeed: 0,
    });
  }
}
