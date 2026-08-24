import React, { useState } from 'react';
import { Sliders, Sparkles, Image, Type, Layout, ShieldAlert, Upload, Grid, Eye, Wand2 } from 'lucide-react';
import { PosterDesignState, PosterStyleConfig } from '../types';
import { POSTER_STYLES } from '../data/styles';
import { FontPairingSection } from './FontPairingSection';

interface StyleControlsProps {
  design: PosterDesignState;
  onChange: (updated: Partial<PosterDesignState>) => void;
  onGenerateAiBg: (prompt: string) => void;
  isBgGenerating: boolean;
}

export const StyleControls: React.FC<StyleControlsProps> = ({
  design,
  onChange,
  onGenerateAiBg,
  isBgGenerating,
}) => {
  const [bgPromptInput, setBgPromptInput] = useState(
    design.bgPrompt || `${design.details.title} ${design.details.category} abstract artistic background`
  );
  const [activeTab, setActiveTab] = useState<'styles' | 'font_pairings' | 'background' | 'typography' | 'frame'>('styles');

  const FONT_OPTIONS = [
    { label: 'Display Heavy (Impact)', value: "'Impact', 'Arial Black', sans-serif" },
    { label: 'Festival Condensed (Bebas Neue)', value: "'Bebas Neue', sans-serif" },
    { label: 'Cyber Heavy (Anton)', value: "'Anton', sans-serif" },
    { label: 'Imperial Serif (Cinzel)', value: "'Cinzel', serif" },
    { label: 'Editorial Serif (Playfair)', value: "'Playfair Display', serif" },
    { label: 'Tech Grotesk (Space Grotesk)', value: "'Space Grotesk', sans-serif" },
    { label: 'High-Octane (Syne)', value: "'Syne', sans-serif" },
    { label: 'Artisan Outfit', value: "'Outfit', sans-serif" },
    { label: 'Modern Sans (Inter/System)', value: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
    { label: 'Classy Serif (Georgia)', value: "'Georgia', 'Times New Roman', serif" },
    { label: 'Retro Monospace (Courier)', value: "'Courier New', 'Consolas', monospace" },
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-neutral-200 flex flex-col gap-4 shadow-xl">
      
      {/* Control Tabs */}
      <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('styles')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeTab === 'styles' ? 'bg-indigo-600 text-white shadow shadow-indigo-600/30' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Styles</span>
        </button>

        <button
          onClick={() => setActiveTab('font_pairings')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeTab === 'font_pairings' ? 'bg-indigo-600 text-white shadow shadow-indigo-600/30' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5 text-indigo-300" />
          <span>Font Pairings</span>
        </button>

        <button
          onClick={() => setActiveTab('background')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeTab === 'background' ? 'bg-indigo-600 text-white shadow shadow-indigo-600/30' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>Backdrop</span>
        </button>

        <button
          onClick={() => setActiveTab('typography')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeTab === 'typography' ? 'bg-indigo-600 text-white shadow shadow-indigo-600/30' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Type</span>
        </button>

        <button
          onClick={() => setActiveTab('frame')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeTab === 'frame' ? 'bg-indigo-600 text-white shadow shadow-indigo-600/30' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Frame</span>
        </button>
      </div>

      {/* TAB 1: VISUAL STYLES */}
      {activeTab === 'styles' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <h2 className="text-xs uppercase tracking-widest font-bold text-neutral-500">Style Presets</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {POSTER_STYLES.map((style) => {
              const isSelected = design.style.id === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => onChange({ style })}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-neutral-950 border-2 border-indigo-500 shadow-md shadow-indigo-500/10'
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
      )}

      {/* TAB 2: FONT PAIRING RECOMMENDATIONS */}
      {activeTab === 'font_pairings' && (
        <FontPairingSection
          style={design.style}
          details={design.details}
          currentFontHeader={design.customFontHeader || design.style.fontHeader}
          currentFontBody={design.customFontBody || design.style.fontBody}
          onApplyFontPairing={(pairing) => onChange({
            customFontHeader: pairing.fontHeader,
            customFontBody: pairing.fontBody,
          })}
        />
      )}

      {/* TAB 2: BACKDROP & AI IMAGE ARTIST */}
      {activeTab === 'background' && (
        <div className="flex flex-col gap-4">
          
          {/* Background Mode Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-400">Backdrop Type:</span>
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
              {(['gradient', 'ai_image', 'solid', 'upload'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onChange({ bgType: mode })}
                  className={`px-2.5 py-1 rounded text-xs capitalize transition-all ${
                    design.bgType === mode ? 'bg-indigo-600 font-bold text-white' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {mode === 'ai_image' ? 'AI Art' : mode}
                </button>
              ))}
            </div>
          </div>

          {/* AI Image Generation Prompt Box */}
          {design.bgType === 'ai_image' && (
            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col gap-2.5">
              <label className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                AI Art Prompt Generator
              </label>
              <textarea
                rows={2}
                value={bgPromptInput}
                onChange={(e) => setBgPromptInput(e.target.value)}
                placeholder="e.g. Cyberpunk Tokyo street at night with glowing neon reflections and mist"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-indigo-500/50 rounded-lg p-2.5 text-xs text-neutral-200 placeholder-neutral-600 outline-none resize-none"
              />
              <button
                onClick={() => onGenerateAiBg(bgPromptInput)}
                disabled={isBgGenerating}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>{isBgGenerating ? 'Generating AI Background...' : 'Generate AI Art Backdrop'}</span>
              </button>
            </div>
          )}

          {/* Upload Custom Image */}
          {design.bgType === 'upload' && (
            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col gap-2">
              <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-indigo-400" />
                Image URL or Upload
              </label>
              <input
                type="text"
                value={design.bgImageUrl}
                onChange={(e) => onChange({ bgImageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-indigo-500/50 rounded-lg p-2 text-xs text-neutral-200 placeholder-neutral-600 outline-none"
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
                onChange={(e) => onChange({ overlayOpacity: parseFloat(e.target.value) })}
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
                onChange={(e) => onChange({ blurAmount: parseInt(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: TYPOGRAPHY CONTROLS */}
      {activeTab === 'typography' && (
        <div className="flex flex-col gap-3">
          
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Main Headline Font Family
            </label>
            <select
              value={design.customFontHeader || design.style.fontHeader}
              onChange={(e) => onChange({ customFontHeader: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 outline-none focus:border-indigo-500/50"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-400 font-medium">Headline Text Size</span>
                <span className="text-indigo-400 font-mono">{design.textScale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={design.textScale}
                onChange={(e) => onChange({ textScale: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="uppercase-toggle"
                checked={design.titleUppercase}
                onChange={(e) => onChange({ titleUppercase: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
              <label htmlFor="uppercase-toggle" className="text-xs text-neutral-300 font-medium cursor-pointer">
                FORCE UPPERCASE
              </label>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: FRAME & DECORATORS */}
      {activeTab === 'frame' && (
        <div className="flex flex-col gap-3">
          
          {/* Border Frame Selector */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
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
                  onClick={() => onChange({ borderStyle: b.value as any })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    design.borderStyle === b.value ? 'bg-indigo-600 border-indigo-500 text-white font-bold' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
            <label className="flex items-center gap-2 p-2 bg-neutral-950 rounded-lg border border-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={design.showWeatherBadge}
                onChange={(e) => onChange({ showWeatherBadge: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
              <span className="text-xs text-neutral-300 font-medium">Weather Forecast Badge</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-neutral-950 rounded-lg border border-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={design.showQrCode}
                onChange={(e) => onChange({ showQrCode: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
              <span className="text-xs text-neutral-300 font-medium">Ticket QR Code</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-neutral-950 rounded-lg border border-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={design.showCategoryBadge}
                onChange={(e) => onChange({ showCategoryBadge: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
              <span className="text-xs text-neutral-300 font-medium">Category Tag</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-neutral-950 rounded-lg border border-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={design.showGridOverlay}
                onChange={(e) => onChange({ showGridOverlay: e.target.checked })}
                className="w-4 h-4 accent-indigo-500 rounded"
              />
              <span className="text-xs text-neutral-300 font-medium">Grid Texture Overlay</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Custom Promotional Badge Text
            </label>
            <input
              type="text"
              value={design.badgeText}
              onChange={(e) => onChange({ badgeText: e.target.value })}
              placeholder="e.g. SPECIAL GUEST DJ / VIP EDITION"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 outline-none"
            />
          </div>

        </div>
      )}

    </div>
  );
};
