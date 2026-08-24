import React, { useState } from 'react';
import { Sparkles, Download, Bookmark, Sun, Smartphone, Instagram, Facebook, Printer, LayoutTemplate, CloudSun, Volume2 } from 'lucide-react';
import { PosterPreset, WeatherCondition } from '../types';
import { POSTER_PRESETS } from '../data/presets';
import { speakWelcomeGreeting } from '../utils/audioVoiceEngine';

interface NavbarProps {
  currentPreset: PosterPreset;
  onSelectPreset: (preset: PosterPreset) => void;
  weather: WeatherCondition | null;
  onOpenQuickPrompt?: () => void;
  onOpenSavedPosters: () => void;
  onOpenExport: () => void;
  onOpenTemplates: () => void;
  onOpenWeatherWelcome?: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPreset,
  onSelectPreset,
  weather,
  onOpenQuickPrompt,
  onOpenSavedPosters,
  onOpenExport,
  onOpenTemplates,
  onOpenWeatherWelcome,
  savedCount,
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handleSpeak = () => {
    setIsPlayingVoice(true);
    speakWelcomeGreeting(
      "Welcome, let's create the poster for your event",
      () => setIsPlayingVoice(true),
      () => setIsPlayingVoice(false)
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 text-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            P
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-neutral-100 leading-tight">
              PosterGen <span className="text-indigo-400 font-normal">Studio</span>
            </h1>
            <p className="text-[11px] text-neutral-500 hidden sm:block">
              Atmospheric Event Poster Designer
            </p>
          </div>
        </div>

        {/* Center: Social Preset Selector */}
        <div className="hidden lg:flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          {POSTER_PRESETS.slice(0, 5).map((preset) => {
            const isActive = preset.id === currentPreset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                {preset.platform === 'Instagram' ? (
                  <Instagram className="w-3.5 h-3.5" />
                ) : preset.platform === 'Facebook' ? (
                  <Facebook className="w-3.5 h-3.5" />
                ) : preset.platform === 'Print' ? (
                  <Printer className="w-3.5 h-3.5" />
                ) : (
                  <Smartphone className="w-3.5 h-3.5" />
                )}
                <span>{preset.name.split(' ')[0]}</span>
                <span className="opacity-60 text-[10px]">({preset.aspectRatioLabel})</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Weather Intro Screen Replay Button */}
          {onOpenWeatherWelcome && (
            <button
              onClick={onOpenWeatherWelcome}
              className="px-2.5 py-2 bg-neutral-900 hover:bg-neutral-850 text-amber-300 rounded-xl text-xs font-semibold border border-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm"
              title="Open Weather Atmosphere & Voice Welcome Screen"
            >
              <CloudSun className="w-4 h-4 text-amber-400" />
              <span className="hidden xl:inline">Weather Intro</span>
            </button>
          )}

          {/* Quick Voice Greeting Replay */}
          <button
            onClick={handleSpeak}
            className={`p-2 bg-neutral-900 hover:bg-neutral-850 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isPlayingVoice ? 'border-rose-500/60 text-rose-300 animate-pulse' : 'border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="Play Voice Greeting: 'Welcome, let's create the poster for your event'"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingVoice ? 'text-rose-400' : 'text-indigo-400'}`} />
            <span className="hidden md:inline">{isPlayingVoice ? 'Speaking...' : 'Voice'}</span>
          </button>

          {/* Templates Gallery Trigger */}
          <button
            onClick={onOpenTemplates}
            className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded-xl text-xs sm:text-sm font-semibold border border-neutral-800 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <LayoutTemplate className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Templates</span>
          </button>

          {/* Saved Posters */}
          <button
            onClick={onOpenSavedPosters}
            className="p-2 sm:px-3 sm:py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-medium border border-neutral-800 transition-all flex items-center gap-1.5"
            title="Saved Designs"
          >
            <Bookmark className="w-4 h-4 text-neutral-400" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {/* Export PNG */}
          <button
            onClick={onOpenExport}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl text-xs sm:text-sm border border-neutral-700 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export PNG</span>
          </button>

        </div>

      </div>
    </header>
  );
};
