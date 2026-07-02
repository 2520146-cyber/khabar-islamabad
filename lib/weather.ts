// ═══════════════════════════════════════════════════════════════════
// KHABAR ISLAMABAD — Weather & Prayer Utilities
// Weather: Open-Meteo (free, no key)
// Prayer: Aladhan API (free, no key)
// ═══════════════════════════════════════════════════════════════════

const LATITUDE = parseFloat(process.env.NEXT_PUBLIC_LATITUDE || '33.6844');
const LONGITUDE = parseFloat(process.env.NEXT_PUBLIC_LONGITUDE || '73.0479');

// ── Weather (Open-Meteo) ─────────────────────────────────────────

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀' },
  1: { description: 'Mainly clear', icon: '🌤' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁' },
  45: { description: 'Fog', icon: '🌫' },
  48: { description: 'Depositing rime fog', icon: '🌫' },
  51: { description: 'Light drizzle', icon: '🌦' },
  53: { description: 'Moderate drizzle', icon: '🌦' },
  55: { description: 'Dense drizzle', icon: '🌧' },
  61: { description: 'Slight rain', icon: '🌧' },
  63: { description: 'Moderate rain', icon: '🌧' },
  65: { description: 'Heavy rain', icon: '🌧' },
  71: { description: 'Slight snow', icon: '❄' },
  73: { description: 'Moderate snow', icon: '❄' },
  75: { description: 'Heavy snow', icon: '❄' },
  77: { description: 'Snow grains', icon: '❄' },
  80: { description: 'Slight rain showers', icon: '🌦' },
  81: { description: 'Moderate rain showers', icon: '🌧' },
  82: { description: 'Violent rain showers', icon: '⛈' },
  85: { description: 'Slight snow showers', icon: '🌨' },
  86: { description: 'Heavy snow showers', icon: '🌨' },
  95: { description: 'Thunderstorm', icon: '⛈' },
  96: { description: 'Thunderstorm with hail', icon: '⛈' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈' },
};

export async function fetchWeather(): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=Asia/Karachi`;

    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Revalidate every 30 minutes
    });

    if (!response.ok) {
      throw new Error('Weather fetch failed');
    }

    const data = await response.json();
    const weatherCode = data.current?.weather_code ?? 0;
    const weatherInfo = WEATHER_CODES[weatherCode] || { description: 'Unknown', icon: '🌡' };

    return {
      temperature: Math.round(data.current?.temperature_2m ?? 0),
      weatherCode,
      description: weatherInfo.description,
      icon: weatherInfo.icon,
      humidity: data.current?.relative_humidity_2m ?? 0,
      windSpeed: data.current?.wind_speed_10m ?? 0,
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return {
      temperature: 0,
      weatherCode: 0,
      description: 'N/A',
      icon: '🌡',
      humidity: 0,
      windSpeed: 0,
    };
  }
}

// ── Prayer Times (Aladhan) ───────────────────────────────────────

export interface PrayerTimes {
  fajr: string;
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export async function fetchPrayerTimes(): Promise<PrayerTimes> {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${LATITUDE}&longitude=${LONGITUDE}&method=2`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Prayer times fetch failed');
    }

    const data = await response.json();
    const timings = data.data?.timings;

    if (!timings) {
      throw new Error('No prayer times in response');
    }

    return {
      fajr: timings.Fajr?.slice(0, 5) || '—',
      zuhr: timings.Dhuhr?.slice(0, 5) || '—',
      asr: timings.Asr?.slice(0, 5) || '—',
      maghrib: timings.Maghrib?.slice(0, 5) || '—',
      isha: timings.Isha?.slice(0, 5) || '—',
    };
  } catch (error) {
    console.error('Prayer times fetch error:', error);
    return {
      fajr: '3:42',
      zuhr: '12:16',
      asr: '5:04',
      maghrib: '7:38',
      isha: '9:02',
    };
  }
}
