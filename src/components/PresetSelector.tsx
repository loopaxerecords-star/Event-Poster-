import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Instagram, 
  Facebook, 
  Printer, 
  Share2, 
  Sparkles, 
  Sliders, 
  Check, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import { PosterPreset, PosterDesignState } from '../types';
import { POSTER_PRESETS } from '../data/presets';
import { 
  getLayoutSuggestionForPreset, 
  LayoutAdjustmentSuggestion, 
  BadgePosition, 
  LayoutDensity,
  applyLayoutAdjustments 
} from '../utils/layoutOptimizationEngine';
import { getSavedCustomPresets } from '../utils/customSizeManager';

interface PresetSelectorProps {
  currentPreset: PosterPreset;
  design?: PosterDesignState;
  onSelectPreset: (preset: PosterPreset, autoApplyLayout?: boolean) => void;
  onUpdateDesign?: (updates: Partial<PosterDesignState>) => void;
  onOpenCustomSizeModal?: () => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPreset,
  design,
  onSelectPreset,
  onUpdateDesign,
  onOpenCustomSizeModal,
}) => {
  const [autoAdapt, setAutoAdapt] = useState<boolean>(design?.autoAdaptLayout ?? true);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [justAppliedNotice, setJustAppliedNotice] = useState<string | null>(null);
  const [savedCustomPresets, setSavedCustomPresets] = useState<PosterPreset[]>([]);

  useEffect(() => {
    setSavedCustomPresets(getSavedCustomPresets());
  }, [currentPreset]);

  // Get current recommendation for the active preset
  const suggestion = getLayoutSuggestionForPreset(currentPreset);

  const currentTextScale = design?.textScale ?? 1.0;
  const currentBadgePos = design?.badgePosition ?? 'top_split';
  const currentDensity = design?.layoutDensity ?? 'normal';

  // Check if current design matches the suggested values
  const isCurrentlyOptimal = 
    Math.abs(currentTextScale - suggestion.suggestedTextScale) < 0.04 &&
    (design?.badgePosition ? currentBadgePos === suggestion.suggestedBadgePosition : true) &&
    (design?.layoutDensity ? currentDensity === suggestion.suggestedDensity : true);

  const handleSelect = (preset: PosterPreset) => {
    if (autoAdapt) {
      const nextSuggestion = getLayoutSuggestionForPreset(preset);
      onSelectPreset(preset, true);
      if (onUpdateDesign) {
        onUpdateDesign({
          textScale: nextSuggestion.suggestedTextScale,
          badgePosition: nextSuggestion.suggestedBadgePosition,
          layoutDensity: nextSuggestion.suggestedDensity,
          autoAdaptLayout: true,
        });
      }
      setJustAppliedNotice(`Applied ${nextSuggestion.suggestedTextScale}x text scale & ${nextSuggestion.badgePositionName} badges for ${preset.name}`);
      setTimeout(() => setJustAppliedNotice(null), 3500);
    } else {
      onSelectPreset(preset, false);
    }
  };

  const handleApplySuggestion = () => {
    if (onUpdateDesign) {
      onUpdateDesign({
        textScale: suggestion.suggestedTextScale,
        badgePosition: suggestion.suggestedBadgePosition,
        layoutDensity: suggestion.suggestedDensity,
      });
      setJustAppliedNotice(`Optimized layout applied: ${suggestion.suggestedTextScale}x text scale, ${suggestion.badgePositionName}`);
      setTimeout(() => setJustAppliedNotice(null), 3500);
    }
  };

  const handleResetStandard = () => {
    if (onUpdateDesign) {
      onUpdateDesign({
        textScale: 1.0,
        badgePosition: 'top_split',
        layoutDensity: 'normal',
      });
      setJustAppliedNotice('Reset to 1.0x standard text scale and default layout');
      setTimeout(() => setJustAppliedNotice(null), 3000);
    }
  };

  const handleToggleAutoAdapt = () => {
    const nextState = !autoAdapt;
    setAutoAdapt(nextState);
    if (onUpdateDesign) {
      onUpdateDesign({ autoAdaptLayout: nextState });
    }
    if (nextState) {
      handleApplySuggestion();
    }
  };

  const badgePositionOptions: { label: string; value: BadgePosition }[] = [
    { label: 'Split Corners', value: 'top_split' },
    { label: 'Top Centered', value: 'top_center' },
    { label: 'Stacked Left', value: 'top_left_stacked' },
    { label: 'Inline Compact', value: 'inline_compact' },
  ];

  const densityOptions: { label: string; value: LayoutDensity }[] = [
    { label: 'Compact', value: 'compact' },
    { label: 'Balanced', value: 'normal' },
    { label: 'Spacious', value: 'spacious' },
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 text-neutral-200 flex flex-col gap-3.5 shadow-xl transition-all">
      
      {/* Header Bar with Auto-Adapt Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
          <h2 className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            Social Media & Aspect Ratios
          </h2>
        </div>

        {/* Auto-Adjust Switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleAutoAdapt}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              autoAdapt
                ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300 shadow-sm shadow-indigo-500/20'
                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="Automatically adapts text scaling and badge placement when switching formats"
          >
            <Sparkles className={`w-3.5 h-3.5 ${autoAdapt ? 'text-indigo-400 animate-pulse' : 'text-neutral-500'}`} />
            <span>Auto-Adjust Layout:</span>
            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${autoAdapt ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
              {autoAdapt ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs"
            title="Toggle layout adjustment details"
          >
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Preset Dimension Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        
        {/* Custom Size & Style Creator Action Button */}
        {onOpenCustomSizeModal && (
          <button
            type="button"
            onClick={onOpenCustomSizeModal}
            className="p-2.5 rounded-xl border border-dashed border-indigo-500/60 bg-indigo-950/30 hover:bg-indigo-900/40 text-left transition-all flex flex-col justify-between h-22 relative group hover:border-indigo-400"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200">
                CUSTOM
              </span>
            </div>

            <div className="mt-1">
              <span className="font-bold text-[11px] text-indigo-200 block truncate leading-tight flex items-center gap-1">
                <Plus className="w-3 h-3 text-indigo-400" />
                Custom Size
              </span>
              <span className="text-[9px] text-indigo-300/80 block mt-0.5 truncate">
                Set size & style
              </span>
            </div>
          </button>
        )}

        {/* User Saved Custom Presets (if any) */}
        {savedCustomPresets.map((preset) => {
          const isSelected = preset.id === currentPreset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelect(preset)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-22 relative group ${
                isSelected
                  ? 'bg-neutral-950 border-2 border-amber-500 shadow-md shadow-amber-500/15 ring-1 ring-amber-500/30'
                  : 'bg-neutral-950 border-amber-500/40 hover:border-amber-400/70 text-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Maximize2 className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-amber-500/70'}`} />
                <span className={`text-[9px] font-mono font-bold px-1 rounded ${
                  isSelected ? 'bg-amber-500/20 text-amber-300' : 'text-amber-400/80'
                }`}>
                  {preset.aspectRatioLabel}
                </span>
              </div>

              <div className="mt-1">
                <span className="font-bold text-[11px] text-neutral-200 block truncate leading-tight">
                  {preset.name}
                </span>
                <div className="flex items-center justify-between text-[9px] text-neutral-400 mt-0.5">
                  <span>{preset.unit ? `${preset.rawWidth}×${preset.rawHeight}${preset.unit}` : `${preset.width}×${preset.height}`}</span>
                  <span className="font-mono text-amber-400/80 text-[8px]">Custom</span>
                </div>
              </div>

              {isSelected && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-neutral-900 shadow"></span>
              )}
            </button>
          );
        })}

        {POSTER_PRESETS.map((preset) => {
          const isSelected = preset.id === currentPreset.id;
          const presetSuggestion = getLayoutSuggestionForPreset(preset);

          return (
            <button
              key={preset.id}
              onClick={() => handleSelect(preset)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-22 relative group ${
                isSelected
                  ? 'bg-neutral-950 border-2 border-indigo-500 shadow-md shadow-indigo-500/15 ring-1 ring-indigo-500/30'
                  : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {/* Top Row: Icon & Ratio */}
              <div className="flex items-center justify-between w-full">
                {preset.platform === 'Instagram' ? (
                  <Instagram className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-neutral-500'}`} />
                ) : preset.platform === 'Facebook' ? (
                  <Facebook className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-neutral-500'}`} />
                ) : preset.platform === 'Print' ? (
                  <Printer className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-neutral-500'}`} />
                ) : (
                  <Smartphone className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-neutral-500'}`} />
                )}
                
                <span className={`text-[10px] font-mono font-bold px-1 rounded ${
                  isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'text-neutral-500'
                }`}>
                  {preset.aspectRatioLabel}
                </span>
              </div>

              {/* Title & Suggested Text Scale hint */}
              <div className="mt-1">
                <span className="font-bold text-[11px] text-neutral-200 block truncate leading-tight">
                  {preset.name.replace('Instagram ', '').replace('Facebook ', '').replace(' / Poster', '')}
                </span>
                <div className="flex items-center justify-between text-[9px] text-neutral-500 mt-0.5">
                  <span>{preset.width}x{preset.height}</span>
                  <span className="font-mono text-indigo-400/80 text-[8.5px]">
                    {presetSuggestion.suggestedTextScale}x
                  </span>
                </div>
              </div>

              {/* Active Indicator Pin */}
              {isSelected && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-neutral-900 shadow"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Floating Instant Applied Feedback Notice */}
      {justAppliedNotice && (
        <div className="py-1.5 px-3 rounded-xl bg-indigo-950/90 border border-indigo-500/50 text-indigo-200 text-xs flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-medium text-[11px]">{justAppliedNotice}</span>
          </div>
          <span className="text-[10px] text-indigo-400 font-mono">Auto-Adjusted</span>
        </div>
      )}

      {/* Detailed Layout Adjustment & Suggestion Panel */}
      {showDetails && (
        <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-col gap-3">
          
          {/* Status & Summary Line */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-indigo-950/70 border border-indigo-500/30 text-indigo-400">
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-200">
                    {currentPreset.name} Layout Strategy
                  </span>
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                    isCurrentlyOptimal 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {isCurrentlyOptimal ? 'Optimized' : 'Custom / Unoptimized'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                  {suggestion.summary}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              {!isCurrentlyOptimal && (
                <button
                  onClick={handleApplySuggestion}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1 transition-all"
                  title="Apply recommended layout adjustments for this format"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Apply Recommended</span>
                </button>
              )}

              <button
                onClick={handleResetStandard}
                className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all"
                title="Reset text scale to 1.0x and default split layout"
              >
                <RotateCcw className="w-3 h-3 text-neutral-400" />
                <span>Reset 1.0x</span>
              </button>
            </div>
          </div>

          {/* Interactive Adjustment Controls (Text Scale, Badge Position, Density) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2.5 border-t border-neutral-800/80">
            
            {/* 1. Text Scale Control */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-medium flex items-center gap-1">
                  Headline Text Scale
                  {Math.abs(currentTextScale - suggestion.suggestedTextScale) < 0.02 && (
                    <span className="text-[9px] text-emerald-400 font-bold px-1 bg-emerald-950/60 rounded">Opt</span>
                  )}
                </span>
                <span className="font-mono text-indigo-400 font-bold">{currentTextScale.toFixed(2)}x</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateDesign && onUpdateDesign({ textScale: Math.max(0.7, +(currentTextScale - 0.05).toFixed(2)) })}
                  className="w-6 h-6 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 flex items-center justify-center text-xs font-bold"
                  title="Decrease text scale"
                >
                  -
                </button>

                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.05"
                  value={currentTextScale}
                  onChange={(e) => onUpdateDesign && onUpdateDesign({ textScale: parseFloat(e.target.value) })}
                  className="flex-1 accent-indigo-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />

                <button
                  onClick={() => onUpdateDesign && onUpdateDesign({ textScale: Math.min(1.5, +(currentTextScale + 0.05).toFixed(2)) })}
                  className="w-6 h-6 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 flex items-center justify-center text-xs font-bold"
                  title="Increase text scale"
                >
                  +
                </button>
              </div>

              <div className="flex items-center justify-between text-[9px] text-neutral-500">
                <span>0.7x (Compact)</span>
                <span className="text-indigo-400/80">Rec: {suggestion.suggestedTextScale}x</span>
                <span>1.5x (Giant)</span>
              </div>
            </div>

            {/* 2. Badge Position Selector */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-medium">Badge Position</span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {badgePositionOptions.find(b => b.value === currentBadgePos)?.label || 'Split'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1">
                {badgePositionOptions.map((opt) => {
                  const isOptSelected = currentBadgePos === opt.value;
                  const isSuggested = suggestion.suggestedBadgePosition === opt.value;

                  return (
                    <button
                      key={opt.value}
                      onClick={() => onUpdateDesign && onUpdateDesign({ badgePosition: opt.value })}
                      className={`px-2 py-1 rounded-lg text-[10.5px] font-medium border text-center transition-all truncate ${
                        isOptSelected
                          ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-sm'
                          : isSuggested
                          ? 'bg-neutral-900 border-indigo-500/40 text-indigo-300 hover:bg-neutral-800'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Layout Density Selector */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-medium">Layout Density</span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {densityOptions.find(d => d.value === currentDensity)?.label || 'Balanced'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                {densityOptions.map((opt) => {
                  const isDensitySelected = currentDensity === opt.value;
                  const isSuggested = suggestion.suggestedDensity === opt.value;

                  return (
                    <button
                      key={opt.value}
                      onClick={() => onUpdateDesign && onUpdateDesign({ layoutDensity: opt.value })}
                      className={`px-1.5 py-1 rounded-lg text-[10.5px] font-medium border text-center transition-all ${
                        isDensitySelected
                          ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-sm'
                          : isSuggested
                          ? 'bg-neutral-900 border-indigo-500/40 text-indigo-300 hover:bg-neutral-800'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
