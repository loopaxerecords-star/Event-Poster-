import React, { useState } from 'react';
import { 
  MapPin, 
  Layout, 
  Type, 
  Palette, 
  Image, 
  Wand2, 
  Sliders, 
  Sparkles, 
  Upload, 
  LayoutTemplate, 
  Bookmark,
  Sun,
  Shirt,
  RefreshCw,
  Check
} from 'lucide-react';
import { PosterDesignState, EventDetails, ColorPalette, PosterPreset } from '../types';
import { EventForm } from './EventForm';
import { WeatherPaletteBar } from './WeatherPaletteBar';
import { FontPairingSection } from './FontPairingSection';
import { POSTER_STYLES } from '../data/styles';
import { POSTER_PRESETS } from '../data/presets';

interface EditorTabsProps {
  design: PosterDesignState;
  onDesignChange: (updated: Partial<PosterDesignState>) => void;
  onDetailsChange: (updated: Partial<EventDetails>) => void;
  onEnhanceWithAI: () => void;
  isAiLoading: boolean;
  onGenerateAiBg: (prompt: string) => void;
  isBgGenerating: boolean;
  onRefreshWeather?: () => void;
  onOpenTemplates: () => void;
  onOpenSavedPosters: () => void;
  savedCount: number;
}

export type EditorTabType = 'details' | 'styles' | 'fonts' | 'colors' | 'backdrop' | 'templates';

export const EditorTabs: React.FC<EditorTabsProps> = ({
  design,
  onDesignChange,
  onDetailsChange,
  onEnhanceWithAI,
  isAiLoading,
  onGenerateAiBg,
  isBgGenerating,
  onRefreshWeather,
  onOpenTemplates,
  onOpenSavedPosters,
  savedCount,
}) => {
  const [activeTab, setActiveTab] = useState<EditorTabType>('details');
  const [bgPromptInput, setBgPromptInput] = useState(
    design.bgPrompt || `${design.details.artist1 || design.details.title || 'Event'} ${design.details.category || 'music'} abstract artistic background`
  );

  const FONT_OPTIONS = [
    { label: 'Festival Condensed (Bebas Neue)', value: "'Bebas Neue', sans-serif" },
    { label: 'Cyber Heavy (Anton)', value: "'Anton', sans-serif" },
    { label: 'Imperial Serif (Cinzel Decorative)', value: "'Cinzel', serif" },
    { label: 'Editorial Serif (Playfair Display)', value: "'Playfair Display', serif" },
    { label: 'Tech Grotesk (Space Grotesk)', value: "'Space Grotesk', sans-serif" },
    { label: 'High-Octane (Syne)', value: "'Syne', sans-serif" },
    { label: 'Artisan Outfit (Outfit)', value: "'Outfit', sans-serif" },
    { label: 'Display Heavy (Impact)', value: "'Impact', 'Arial Black', sans-serif" },
    { label: 'Modern Sans (Inter/System)', value: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
    { label: 'Classy Serif (Georgia)', value: "'Georgia', 'Times New Roman', serif" },
    { label: 'Retro Monospace (Courier)', value: "'Courier New', 'Consolas', monospace" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Main Tab Switcher Bar */}
      <div className="bg-neutral-900 border border-neutral-800 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none shadow-xl">
        
        {/* Tab 1: Event Details */}
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'details'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-indigo-300" />
          <span>Details</span>
        </button>

        {/* Tab 2: Visual Styles & Presets */}
        <button
          onClick={() => setActiveTab('styles')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'styles'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <Layout className="w-3.5 h-3.5 text-emerald-400" />
          <span>Styles</span>
        </button>

        {/* Tab 3: Smart Fonts */}
        <button
          onClick={() => setActiveTab('fonts')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'fonts'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Fonts</span>
        </button>

        {/* Tab 4: Weather & Palette */}
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'colors'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-rose-400" />
          <span>Colors</span>
        </button>

        {/* Tab 5: Backdrop & Frame */}
        <button
          onClick={() => setActiveTab('backdrop')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'backdrop'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <Image className="w-3.5 h-3.5 text-cyan-400" />
          <span>Backdrop</span>
        </button>

        {/* Tab 6: Templates & Library */}
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'templates'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-purple-300" />
          <span>Gallery</span>
        </button>

      </div>

      {/* TAB CONTENT PANELS */}
      
      {/* 1. EVENT DETAILS TAB */}
      {activeTab === 'details' && (
        <EventForm
          details={design.details}
          onChange={onDetailsChange}
          onEnhanceWithAI={onEnhanceWithAI}
          isAiLoading={isAiLoading}
        />
      )}

      {/* 2. VISUAL STYLES & ASPECT RATIOS TAB */}
      {activeTab === 'styles' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-neutral-200 flex flex-col gap-5 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <h2 className="text-xs uppercase tracking-widest font-bold text-neutral-400">
                Aesthetic Style Presets
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {POSTER_STYLES.map((style) => {
                const isSelected = design.style.id === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => onDesignChange({ style })}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-neutral-950 border-2 border-indigo-500 shadow-lg shadow-indigo-500/10'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{style.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                        {style.themeMood.split(',')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                      {style.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratios & Formats */}
          <div className="pt-3 border-t border-neutral-800">
            <h3 className="text-xs uppercase tracking-widest font-bold text-neutral-400 mb-2.5">
              Poster Canvas Formats & Ratios
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POSTER_PRESETS.map((preset) => {
                const isSelected = design.preset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onDesignChange({ preset })}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="truncate">{preset.name.split(' ')[0]}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{preset.aspectRatioLabel}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. SMART FONTS & TYPOGRAPHY TAB */}
      {activeTab === 'fonts' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-neutral-200 flex flex-col gap-5 shadow-xl">
          
          {/* Smart Font Pairing Section */}
          <FontPairingSection
            style={design.style}
            details={design.details}
            currentFontHeader={design.customFontHeader || design.style.fontHeader}
            currentFontBody={design.customFontBody || design.style.fontBody}
            onApplyFontPairing={(pairing) => onDesignChange({
              customFontHeader: pairing.fontHeader,
              customFontBody: pairing.fontBody,
            })}
          />

          {/* Manual Typography Selectors */}
          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Manual Font Overrides
            </h3>
            
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Headline Font Family
              </label>
              <select
                value={design.customFontHeader || design.style.fontHeader}
                onChange={(e) => onDesignChange({ customFontHeader: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-200 outline-none focus:border-indigo-500/50"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400 font-medium">Text Scale</span>
                  <span className="text-indigo-400 font-mono">{design.textScale.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.05"
                  value={design.textScale}
                  onChange={(e) => onDesignChange({ textScale: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="uppercase-toggle-tab"
                  checked={design.titleUppercase}
                  onChange={(e) => onDesignChange({ titleUppercase: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <label htmlFor="uppercase-toggle-tab" className="text-xs text-neutral-300 font-medium cursor-pointer">
                  FORCE UPPERCASE
                </label>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 4. WEATHER & COLORS TAB */}
      {activeTab === 'colors' && (
        <div className="flex flex-col gap-4">
          <WeatherPaletteBar
            weather={design.weather}
            currentPalette={design.palette}
            onSelectPalette={(palette) => onDesignChange({ palette })}
            onRefreshWeather={onRefreshWeather}
          />
        </div>
      )}

      {/* 5. BACKDROP & FRAME TAB */}
      {activeTab === 'backdrop' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-neutral-200 flex flex-col gap-5 shadow-xl">
          
          {/* Backdrop Mode Selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Backdrop Source:</span>
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              {(['gradient', 'ai_image', 'solid', 'upload'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onDesignChange({ bgType: mode })}
                  className={`px-3 py-1 rounded-lg text-xs capitalize transition-all ${
                    design.bgType === mode ? 'bg-indigo-600 font-bold text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {mode === 'ai_image' ? 'AI Art' : mode}
                </button>
              ))}
            </div>
          </div>

          {/* AI Image Generation */}
          {design.bgType === 'ai_image' && (
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col gap-2.5 shadow-inner">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                  AI Art Background Generator
                </label>
              </div>
              <p className="text-[11px] text-neutral-400">
                Generates a high-resolution wallpaper backdrop matching your event theme ({design.details.title || design.details.event || 'Music Event'}).
              </p>
              <button
                onClick={() => onGenerateAiBg(bgPromptInput || `${design.details.title || design.details.event || 'Music Event'} ${design.details.location || ''}`)}
                disabled={isBgGenerating}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>{isBgGenerating ? 'Generating AI Backdrop...' : 'Generate AI Backdrop'}</span>
              </button>
            </div>
          )}

          {/* Upload Custom Image */}
          {design.bgType === 'upload' && (
            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col gap-2">
              <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-indigo-400" />
                Image URL
              </label>
              <input
                type="text"
                value={design.bgImageUrl}
                onChange={(e) => onDesignChange({ bgImageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-indigo-500/50 rounded-lg p-2.5 text-xs text-neutral-200 placeholder-neutral-600 outline-none"
              />
            </div>
          )}

          {/* Overlay Opacity & Blur Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-400 font-medium">Dark Overlay Opacity</span>
                <span className="text-indigo-400 font-mono">{Math.round(design.overlayOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.9"
                step="0.05"
                value={design.overlayOpacity}
                onChange={(e) => onDesignChange({ overlayOpacity: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-400 font-medium">Background Blur</span>
                <span className="text-indigo-400 font-mono">{design.blurAmount}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={design.blurAmount}
                onChange={(e) => onDesignChange({ blurAmount: parseInt(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>

          {/* Border Frame & Badges */}
          <div className="pt-3 border-t border-neutral-800 flex flex-col gap-3">
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Border & Frame Styling
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'None', value: 'none' },
                { label: 'Thin Line', value: 'thin' },
                { label: 'Double Line', value: 'double' },
                { label: 'Bold Frame', value: 'bold_frame' },
              ].map((b) => (
                <button
                  key={b.value}
                  onClick={() => onDesignChange({ borderStyle: b.value as any })}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    design.borderStyle === b.value ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <label className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 cursor-pointer text-xs font-medium text-neutral-300">
                <input
                  type="checkbox"
                  checked={design.showWeatherBadge}
                  onChange={(e) => onDesignChange({ showWeatherBadge: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <span>Weather Badge</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 cursor-pointer text-xs font-medium text-neutral-300">
                <input
                  type="checkbox"
                  checked={design.showGridOverlay}
                  onChange={(e) => onDesignChange({ showGridOverlay: e.target.checked })}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <span>Grid Texture</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Custom Promotional Badge Text
              </label>
              <input
                type="text"
                value={design.badgeText}
                onChange={(e) => onDesignChange({ badgeText: e.target.value })}
                placeholder="e.g. SPECIAL GUEST / VIP EDITION"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-200 placeholder-neutral-600 outline-none"
              />
            </div>
          </div>

        </div>
      )}

      {/* 6. TEMPLATES & GALLERY TAB */}
      {activeTab === 'templates' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-neutral-200 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-purple-400" />
              Event Templates & Saved Gallery
            </h3>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Browse professionally curated templates for Music Festivals, Corporate Summits, Theatre Galas, Raves, and Sports Events, or access your saved designs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={onOpenTemplates}
              className="p-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 hover:border-purple-500/60 rounded-xl text-left transition-all flex flex-col gap-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
                  Open Templates Gallery
                </span>
                <LayoutTemplate className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-[11px] text-neutral-400">
                Choose from 8+ crafted templates or apply style only
              </span>
            </button>

            <button
              onClick={onOpenSavedPosters}
              className="p-4 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-xl text-left transition-all flex flex-col gap-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                  Saved Library ({savedCount})
                </span>
                <Bookmark className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-[11px] text-neutral-400">
                Manage and reload your previously saved posters
              </span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
