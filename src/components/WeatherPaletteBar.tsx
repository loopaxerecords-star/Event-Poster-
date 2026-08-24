import React from 'react';
import { Sun, CloudRain, Sunset, Snowflake, Zap, Moon, Palette, Check, RefreshCw, Shirt } from 'lucide-react';
import { ColorPalette, WeatherCondition } from '../types';
import { generateWeatherPalettes } from '../utils/weatherPaletteEngine';

interface WeatherPaletteBarProps {
  weather: WeatherCondition | null;
  currentPalette: ColorPalette;
  onSelectPalette: (palette: ColorPalette) => void;
  onRefreshWeather?: () => void;
}

export const WeatherPaletteBar: React.FC<WeatherPaletteBarProps> = ({
  weather,
  currentPalette,
  onSelectPalette,
  onRefreshWeather,
}) => {
  if (!weather) return null;

  const weatherPalettes = generateWeatherPalettes(weather);

  const renderWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'sunset': return <Sunset className="w-5 h-5 text-orange-400" />;
      case 'rainy': return <CloudRain className="w-5 h-5 text-cyan-400" />;
      case 'snowy': return <Snowflake className="w-5 h-5 text-sky-200" />;
      case 'stormy': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'starry_night': return <Moon className="w-5 h-5 text-purple-400" />;
      default: return <Sun className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-neutral-200 flex flex-col gap-4 shadow-xl">
      
      {/* Top Bar: Weather Forecast Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-inner">
            {renderWeatherIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <h2 className="text-xs uppercase tracking-widest font-bold text-neutral-500">
                Weather Intelligence
              </h2>
              <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md border border-amber-500/20 font-medium ml-1">
                Auto-Synced
              </span>
            </div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2 mt-1">
              <span>{weather.location}</span>
              <span className="text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                {weather.tempC}°C / {weather.tempF}°F • {weather.conditionName}
              </span>
            </h3>
          </div>
        </div>

        {/* Refresh & Tip */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-neutral-950 rounded-lg text-xs text-neutral-400 border border-neutral-800">
            <Shirt className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-[11px] truncate max-w-[200px]">{weather.clothingTip}</span>
          </div>

          {onRefreshWeather && (
            <button
              onClick={onRefreshWeather}
              className="p-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 rounded-lg border border-neutral-800 transition-all text-xs"
              title="Refresh Forecast"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Weather Color Palettes Suggestion */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Suggested Palettes: "{weather.conditionName}"
            </span>
          </div>
          <span className="text-[11px] text-neutral-500">Click to apply</span>
        </div>

        {/* 4 Weather Palettes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {weatherPalettes.map((pal) => {
            const isSelected = currentPalette.id === pal.id;
            return (
              <button
                key={pal.id}
                onClick={() => onSelectPalette(pal)}
                className={`group relative text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between h-24 overflow-hidden ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                    : 'border-neutral-800 hover:border-neutral-700 hover:scale-[1.01]'
                }`}
                style={{
                  background: pal.bgGradient
                }}
              >
                {/* Palette Info */}
                <div className="relative z-10 flex items-start justify-between w-full">
                  <span className="text-xs font-bold text-white drop-shadow-md truncate max-w-[85%]">
                    {pal.name}
                  </span>
                  {isSelected && (
                    <span className="p-1 bg-indigo-500 text-white rounded-full shadow-md">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Color Swatch Preview Bars */}
                <div className="relative z-10 flex gap-1 h-6 mt-auto pt-1">
                  <div className="flex-1 rounded-sm shadow" style={{ backgroundColor: pal.bgColor }} title="Background" />
                  <div className="flex-1 rounded-sm shadow" style={{ backgroundColor: pal.accentColor }} title="Accent" />
                  <div className="flex-1 rounded-sm shadow" style={{ backgroundColor: pal.primaryText }} title="Text" />
                  <div className="flex-1 rounded-sm shadow" style={{ backgroundColor: pal.badgeBg }} title="Badge" />
                </div>

                {/* Glass Blur overlay */}
                <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-all pointer-events-none" />
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
