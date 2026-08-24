import React from 'react';
import { Sparkles, Download, Bookmark, Sun, Smartphone, Instagram, Facebook, Printer, LayoutTemplate } from 'lucide-react';
import { PosterPreset, WeatherCondition } from '../types';
import { POSTER_PRESETS } from '../data/presets';

interface NavbarProps {
  currentPreset: PosterPreset;
  onSelectPreset: (preset: PosterPreset) => void;
  weather: WeatherCondition | null;
  onOpenQuickPrompt: () => void;
  onOpenSavedPosters: () => void;
  onOpenExport: () => void;
  onOpenTemplates: () => void;
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
  savedCount,
}) => {
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
              PosterGen <span className="text-indigo-400 font-normal">AI</span>
            </h1>
            <p className="text-[11px] text-neutral-500 hidden sm:block">
              Bento Grid Event Poster Designer
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
          
          {/* Templates Gallery Trigger */}
          <button
            onClick={onOpenTemplates}
            className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded-xl text-xs sm:text-sm font-semibold border border-neutral-800 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <LayoutTemplate className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Templates</span>
          </button>

          {/* Quick AI Wizard */}
          <button
            onClick={onOpenQuickPrompt}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span className="hidden sm:inline">AI Magic Wizard</span>
            <span className="sm:hidden">AI Prompt</span>
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
