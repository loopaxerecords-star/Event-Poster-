import React from 'react';
import { Smartphone, Instagram, Facebook, Printer, Share2, Layers } from 'lucide-react';
import { PosterPreset } from '../types';
import { POSTER_PRESETS } from '../data/presets';

interface PresetSelectorProps {
  currentPreset: PosterPreset;
  onSelectPreset: (preset: PosterPreset) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPreset,
  onSelectPreset,
}) => {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-neutral-200 flex flex-col gap-3 shadow-xl">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
          <h2 className="text-xs uppercase tracking-widest font-bold text-neutral-500">
            Social Media & Preset Dimensions
          </h2>
        </div>
        <span className="text-[11px] text-neutral-500">
          Selected: <strong className="text-indigo-400">{currentPreset.name} ({currentPreset.aspectRatioLabel})</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {POSTER_PRESETS.map((preset) => {
          const isSelected = preset.id === currentPreset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                isSelected
                  ? 'bg-neutral-950 border-2 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between">
                {preset.platform === 'Instagram' ? (
                  <Instagram className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-neutral-500'}`} />
                ) : preset.platform === 'Facebook' ? (
                  <Facebook className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-neutral-500'}`} />
                ) : preset.platform === 'Print' ? (
                  <Printer className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-neutral-500'}`} />
                ) : (
                  <Smartphone className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-neutral-500'}`} />
                )}
                <span className="text-[10px] font-mono font-bold text-neutral-500">
                  {preset.aspectRatioLabel}
                </span>
              </div>

              <div>
                <span className="font-bold text-[11px] text-neutral-200 block truncate leading-tight">
                  {preset.name.replace('Instagram ', '').replace('Facebook ', '')}
                </span>
                <span className="text-[9px] text-neutral-500 block truncate">
                  {preset.width}x{preset.height}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
