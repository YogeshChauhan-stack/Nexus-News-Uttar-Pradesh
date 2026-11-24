'use client';

import React, { useState, useEffect } from 'react';
import { CloudSun, Sun, Cloud, CloudRain, CloudSnow, Wind, TrendingUp, Wheat, Thermometer, Droplets } from 'lucide-react';

interface WeatherDay {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitationSum: number;
}

// WMO weather interpretation codes → icon + label
function weatherIcon(code: number) {
  if (code === 0) return { icon: Sun, label: 'धूप', color: 'text-yellow-500' };
  if (code <= 3) return { icon: CloudSun, label: 'आंशिक बादल', color: 'text-yellow-400' };
  if (code <= 48) return { icon: Cloud, label: 'बादल', color: 'text-neutral-400' };
  if (code <= 67) return { icon: CloudRain, label: 'बारिश', color: 'text-blue-500' };
  if (code <= 77) return { icon: CloudSnow, label: 'बर्फ', color: 'text-sky-300' };
  if (code <= 82) return { icon: CloudRain, label: 'भारी बारिश', color: 'text-blue-700' };
  return { icon: Wind, label: 'तूफान', color: 'text-purple-600' };
}

// Hindi short day names
function hindiDay(dateStr: string): string {
  const days = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
  const d = new Date(dateStr);
  return days[d.getDay()];
}

export default function MandiWeatherStrip() {
  const [weather, setWeather] = useState<WeatherDay[]>([]);
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [currentCode, setCurrentCode] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ghazipur lat/lon: 25.58, 83.57
    const url =
      'https://api.open-meteo.com/v1/forecast?latitude=25.58&longitude=83.57' +
      '&current=temperature_2m,weathercode' +
      '&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum' +
      '&timezone=Asia%2FKolkata&forecast_days=3';

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data?.current) {
          setCurrentTemp(Math.round(data.current.temperature_2m));
          setCurrentCode(data.current.weathercode ?? 0);
        }
        if (data?.daily) {
          const { time, temperature_2m_max, temperature_2m_min, weathercode, precipitation_sum } = data.daily;
          const days: WeatherDay[] = time.map((d: string, i: number) => ({
            date: d,
            tempMax: Math.round(temperature_2m_max[i]),
            tempMin: Math.round(temperature_2m_min[i]),
            weatherCode: weathercode[i],
            precipitationSum: precipitation_sum[i],
          }));
          setWeather(days);
        }
      })
      .catch(() => {
        // silently fail — show static fallback
        setCurrentTemp(26);
        setCurrentCode(1);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentDate = new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' });
  const { icon: CurrentIcon, label: currentLabel, color: currentColor } = weatherIcon(currentCode);

  return (
    <div className="bg-amber-50/70 border-b border-amber-200/80 text-xs py-1.5 px-4 sm:px-6 lg:px-8 text-neutral-800 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-4 overflow-x-auto no-scrollbar font-sans">

        {/* Left: Current Weather — Ghazipur */}
        <div className="flex items-center gap-2 shrink-0 font-bold text-amber-950 bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-200">
          <CurrentIcon className={`w-3.5 h-3.5 ${currentColor} shrink-0`} />
          <span className="hidden sm:inline text-[11px]">गाजीपुर:</span>
          {loading ? (
            <span className="text-neutral-400 text-[11px]">लोड हो रहा है...</span>
          ) : (
            <span className="text-red-700 font-black">{currentTemp}°C {currentLabel}</span>
          )}
        </div>

        {/* 3-Day Forecast Pills */}
        {weather.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:block text-neutral-400 text-[10px] font-bold uppercase tracking-wider">3 दिन:</span>
            {weather.map((day, i) => {
              const { icon: DayIcon, color } = weatherIcon(day.weatherCode);
              return (
                <div
                  key={day.date}
                  className="flex items-center gap-1 bg-white/70 border border-amber-200/80 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                >
                  <DayIcon className={`w-3 h-3 ${color} shrink-0`} />
                  <span className="text-neutral-500">{i === 0 ? 'आज' : hindiDay(day.date)}</span>
                  <span className="font-black text-neutral-800">{day.tempMax}°</span>
                  <span className="text-neutral-400">{day.tempMin}°</span>
                  {day.precipitationSum > 0 && (
                    <span className="text-blue-500 font-bold">{day.precipitationSum}mm</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <span className="text-neutral-300 shrink-0">|</span>

        {/* Mandi Bhav Tag */}
        <div className="flex items-center gap-1 text-[11px] font-black text-amber-900 uppercase tracking-wide shrink-0">
          <Wheat className="w-3.5 h-3.5 text-amber-700" />
          <span>मंडी भाव ({currentDate}):</span>
        </div>

        {/* Mandi Prices */}
        <div className="flex items-center gap-3.5 shrink-0 text-xs font-medium">
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">धान:</span>
            <span className="font-bold text-neutral-900">₹2,320/क्विं.</span>
          </div>
          <span className="text-neutral-300">•</span>
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">गेहूं:</span>
            <span className="font-bold text-neutral-900">₹2,450/क्विं.</span>
          </div>
          <span className="text-neutral-300">•</span>
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">सरसों:</span>
            <span className="font-bold text-neutral-900">₹5,400/क्विं.</span>
          </div>
          <span className="text-neutral-300 hidden md:inline">•</span>
          <div className="hidden md:flex items-center gap-1">
            <span className="text-neutral-500">सोना (24K):</span>
            <span className="font-bold text-neutral-900">₹78,450/10g</span>
          </div>
          <span className="text-neutral-300 hidden lg:inline">•</span>
          <div className="hidden lg:flex items-center gap-1 text-emerald-700 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Sensex: 84,210 (+320)</span>
          </div>
        </div>

        {/* Right Badge */}
        <div className="shrink-0 hidden sm:block ml-auto">
          <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
            मरदह • गाजीपुर मंडी
          </span>
        </div>
      </div>
    </div>
  );
}
