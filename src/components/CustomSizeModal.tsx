import React, { useState, useEffect } from 'react';
import { 
  X, 
  Maximize2, 
  Sparkles, 
  Lock, 
  Unlock, 
  Layers, 
  Sliders, 
  Check, 
  ArrowRight, 
  Download, 
  BookmarkPlus, 
  RotateCw, 
  Type, 
  Palette, 
  Layout, 
  Eye, 
  Trash2,
  Tv,
  Film,
  Ticket,
  Disc,
  Smartphone,
  Shield,
  Frame
} from 'lucide-react';
import { PosterPreset, PosterDesignState, PosterStyleConfig, LayoutStyle } from '../types';
import { POSTER_STYLES } from '../data/styles';
import { 
  SizeUnit, 
  STARTER_CUSTOM_SIZE_TEMPLATES, 
  convertToPixels, 
  computeAspectRatioLabel, 
  createCustomPosterPreset, 
  saveCustomPresetToStorage, 
  getSavedCustomPresets, 
  deleteCustomPresetFromStorage 
} from '../utils/customSizeManager';
import { getLayoutSuggestionForPreset, BadgePosition, LayoutDensity } from '../utils/layoutOptimizationEngine';

interface CustomSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDesign: PosterDesignState;
  onApplyCustomSizeAndStyle: (preset: PosterPreset, styleUpdates?: Partial<PosterDesignState>, immediateExport?: boolean) => void;
}

export const CustomSizeModal: React.FC<CustomSizeModalProps> = ({
  isOpen,
  onClose,
  currentDesign,
  onApplyCustomSizeAndStyle,
}) => {
  // Dimension state
  const [unit, setUnit] = useState<SizeUnit>('in');
  const [width, setWidth] = useState<number>(27);
  const [height, setHeight] = useState<number>(40);
  const [dpi, setDpi] = useState<number>(300);
  const [lockRatio, setLockRatio] = useState<boolean>(false);
  const [lockedRatioValue, setLockedRatioValue] = useState<number>(27 / 40);
  const [presetName, setPresetName] = useState<string>('Cinema 27"×40" One-Sheet');

  // Style customization state
  const [selectedStyleId, setSelectedStyleId] = useState<string>(currentDesign.style.id || 'cyberpunk-neon');
  const [textScale, setTextScale] = useState<number>(currentDesign.textScale || 1.0);
  const [badgePosition, setBadgePosition] = useState<BadgePosition>(currentDesign.badgePosition || 'top_split');
  const [layoutDensity, setLayoutDensity] = useState<LayoutDensity>(currentDesign.layoutDensity || 'normal');
  const [borderStyle, setBorderStyle] = useState<PosterDesignState['borderStyle']>(currentDesign.borderStyle || 'none');

  // Saved presets list
  const [savedCustomPresets, setSavedCustomPresets] = useState<PosterPreset[]>([]);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Load custom presets on open
  useEffect(() => {
    if (isOpen) {
      setSavedCustomPresets(getSavedCustomPresets());
      
      // Initialize with current preset if custom, or cinema defaults
      if (currentDesign.preset.isCustom) {
        setUnit(currentDesign.preset.unit || 'px');
        setWidth(currentDesign.preset.rawWidth || currentDesign.preset.width);
        setHeight(currentDesign.preset.rawHeight || currentDesign.preset.height);
        setDpi(currentDesign.preset.dpi || 300);
        setPresetName(currentDesign.preset.name);
      }
    }
  }, [isOpen, currentDesign]);

  if (!isOpen) return null;

  // Calculate live pixel dimensions
  const pixelWidth = convertToPixels(width, unit, dpi);
  const pixelHeight = convertToPixels(height, unit, dpi);
  const ratioValue = pixelWidth / (pixelHeight || 1);
  const ratioLabel = computeAspectRatioLabel(pixelWidth, pixelHeight);
  const megapixels = ((pixelWidth * pixelHeight) / 1000000).toFixed(1);

  // Handle Dimension Width Changes
  const handleWidthChange = (val: number) => {
    const positiveVal = Math.max(0.1, val);
    setWidth(positiveVal);
    if (lockRatio && lockedRatioValue > 0) {
      setHeight(Number((positiveVal / lockedRatioValue).toFixed(2)));
    }
  };

  // Handle Dimension Height Changes
  const handleHeightChange = (val: number) => {
    const positiveVal = Math.max(0.1, val);
    setHeight(positiveVal);
    if (lockRatio && lockedRatioValue > 0) {
      setWidth(Number((positiveVal * lockedRatioValue).toFixed(2)));
    }
  };

  // Toggle Lock Ratio
  const handleToggleLock = () => {
    if (!lockRatio) {
      setLockedRatioValue(width / (height || 1));
      setLockRatio(true);
    } else {
      setLockRatio(false);
    }
  };

  // Swap Orientation (Portrait <-> Landscape)
  const handleSwapOrientation = () => {
    const prevW = width;
    const prevH = height;
    setWidth(prevH);
    setHeight(prevW);
    if (lockRatio) {
      setLockedRatioValue(prevH / (prevW || 1));
    }
  };

  // Quick Starter Preset Selector
  const handleSelectStarter = (starter: typeof STARTER_CUSTOM_SIZE_TEMPLATES[0]) => {
    setUnit(starter.unit);
    setWidth(starter.width);
    setHeight(starter.height);
    setDpi(starter.dpi);
    setPresetName(starter.name);
    if (starter.recommendedStyleId) {
      setSelectedStyleId(starter.recommendedStyleId);
    }

    // Auto calculate ideal suggested layout for this ratio
    const tempPreset = createCustomPosterPreset(starter.name, starter.width, starter.height, starter.unit, starter.dpi);
    const suggestion = getLayoutSuggestionForPreset(tempPreset);
    setTextScale(suggestion.suggestedTextScale);
    setBadgePosition(suggestion.suggestedBadgePosition);
    setLayoutDensity(suggestion.suggestedDensity);

    setStatusNotice(`Loaded preset: ${starter.name} (${starter.description})`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  // Handle Loading Saved Custom Preset
  const handleLoadSavedPreset = (preset: PosterPreset) => {
    setUnit(preset.unit || 'px');
    setWidth(preset.rawWidth || preset.width);
    setHeight(preset.rawHeight || preset.height);
    setDpi(preset.dpi || 300);
    setPresetName(preset.name);

    if (preset.styleSnapshot) {
      if (preset.styleSnapshot.styleId) setSelectedStyleId(preset.styleSnapshot.styleId);
      if (preset.styleSnapshot.textScale) setTextScale(preset.styleSnapshot.textScale);
      if (preset.styleSnapshot.badgePosition) setBadgePosition(preset.styleSnapshot.badgePosition);
      if (preset.styleSnapshot.layoutDensity) setLayoutDensity(preset.styleSnapshot.layoutDensity);
      if (preset.styleSnapshot.borderStyle) setBorderStyle(preset.styleSnapshot.borderStyle);
    }

    setStatusNotice(`Loaded custom size: ${preset.name}`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  // Delete Saved Preset
  const handleDeleteSavedPreset = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteCustomPresetFromStorage(id);
    setSavedCustomPresets(updated);
  };

  // Build the complete preset & style snapshot object
  const buildCurrentSetup = (): { preset: PosterPreset; styleUpdates: Partial<PosterDesignState> } => {
    const styleObj = POSTER_STYLES.find(s => s.id === selectedStyleId) || currentDesign.style;

    const preset = createCustomPosterPreset(
      presetName,
      width,
      height,
      unit,
      dpi,
      {
        styleId: selectedStyleId,
        textScale,
        badgePosition,
        layoutDensity,
        borderStyle,
      }
    );

    const styleUpdates: Partial<PosterDesignState> = {
      style: styleObj,
      textScale,
      badgePosition,
      layoutDensity,
      borderStyle,
      autoAdaptLayout: false,
    };

    return { preset, styleUpdates };
  };

  // Action: Apply To Canvas
  const handleApplyToCanvas = () => {
    const { preset, styleUpdates } = buildCurrentSetup();
    onApplyCustomSizeAndStyle(preset, styleUpdates, false);
    onClose();
  };

  // Action: Save Preset & Apply
  const handleSaveAndApply = () => {
    const { preset, styleUpdates } = buildCurrentSetup();
    saveCustomPresetToStorage(preset);
    onApplyCustomSizeAndStyle(preset, styleUpdates, false);
    onClose();
  };

  // Action: Render & Export Directly
  const handleDirectRenderExport = () => {
    const { preset, styleUpdates } = buildCurrentSetup();
    onApplyCustomSizeAndStyle(preset, styleUpdates, true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-7 text-neutral-200 flex flex-col gap-5 my-6 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800/60 hover:bg-neutral-800 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pb-3 border-b border-neutral-800">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
            <Maximize2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-100 flex items-center gap-2">
              Custom Size & Style Studio
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                Pre-Render Studio
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              Configure arbitrary physical or pixel dimensions with tailored typography & style before rendering
            </p>
          </div>
        </div>

        {/* Floating status notice */}
        {statusNotice && (
          <div className="py-2 px-3 rounded-xl bg-indigo-950/80 border border-indigo-500/50 text-indigo-200 text-xs flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Main 2-Column Grid: Left: Dimension & Starter Sizes, Right: Style & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT COLUMN: Dimension Inputs & Starter Templates (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Custom Preset Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Custom Size Preset Name:
              </label>
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="e.g. Festival Cinema Poster or VIP Lanyard"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-neutral-100 placeholder-neutral-600 outline-none focus:border-indigo-500/60"
              />
            </div>

            {/* Dimension Units & Inputs Card */}
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex flex-col gap-3.5">
              
              {/* Unit Switcher & DPI Switcher */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                
                {/* Unit Switcher */}
                <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                  {(['in', 'px', 'cm', 'mm'] as SizeUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all uppercase ${
                        unit === u
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {u === 'in' ? 'Inches (")' : u}
                    </button>
                  ))}
                </div>

                {/* Target Print DPI */}
                <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs">
                  <span className="text-[10px] text-neutral-500 px-1 font-semibold">DPI:</span>
                  {[72, 150, 300].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDpi(d)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                        dpi === d
                          ? 'bg-neutral-750 text-amber-300 font-bold border border-amber-500/40'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

              </div>

              {/* Width & Height Number Inputs + Aspect Lock & Orientation */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                
                {/* Width Input */}
                <div className="sm:col-span-5 flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Width ({unit}):</span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {unit !== 'px' ? `${pixelWidth}px` : ''}
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step={unit === 'px' ? '1' : '0.1'}
                    value={width}
                    onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 1)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm font-bold text-neutral-100 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Middle Quick Actions: Lock Ratio & Swap Orientation */}
                <div className="sm:col-span-2 flex sm:flex-col items-center justify-center gap-1.5 pt-4 sm:pt-4">
                  <button
                    type="button"
                    onClick={handleToggleLock}
                    className={`p-2 rounded-xl border transition-all ${
                      lockRatio 
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                    }`}
                    title={lockRatio ? 'Ratio is Locked' : 'Lock Aspect Ratio'}
                  >
                    {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleSwapOrientation}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 transition-all"
                    title="Swap Orientation (Rotate 90°)"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Height Input */}
                <div className="sm:col-span-5 flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Height ({unit}):</span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {unit !== 'px' ? `${pixelHeight}px` : ''}
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step={unit === 'px' ? '1' : '0.1'}
                    value={height}
                    onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 1)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm font-bold text-neutral-100 outline-none focus:border-indigo-500"
                  />
                </div>

              </div>

              {/* Computed Geometry Badge Summary */}
              <div className="flex items-center justify-between bg-neutral-900/80 px-3 py-2 rounded-xl border border-neutral-800/80 text-[11px]">
                <span className="text-neutral-400">
                  Calculated Canvas: <strong className="text-neutral-200">{pixelWidth} × {pixelHeight} px</strong>
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-amber-400 font-bold">{ratioLabel} Ratio</span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-indigo-400">{megapixels} MP</span>
                </div>
              </div>

            </div>

            {/* Quick Starter Templates */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Popular Custom Size Templates:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STARTER_CUSTOM_SIZE_TEMPLATES.map((starter) => (
                  <button
                    key={starter.id}
                    type="button"
                    onClick={() => handleSelectStarter(starter)}
                    className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800/80 text-left transition-all group flex flex-col justify-between gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-neutral-200 group-hover:text-indigo-300 truncate">
                        {starter.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate">
                      {starter.description}
                    </p>
                    <span className="text-[9.5px] font-mono text-amber-400/90 font-bold">
                      {starter.width}×{starter.height}{starter.unit}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* User Saved Custom Presets List */}
            {savedCustomPresets.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800/80">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Your Saved Custom Presets ({savedCustomPresets.length}):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {savedCustomPresets.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleLoadSavedPreset(p)}
                      className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-left cursor-pointer hover:border-indigo-500/60 transition-all flex items-center justify-between gap-2 group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-neutral-200 truncate">{p.name}</p>
                        <p className="text-[10px] text-neutral-500 font-mono">
                          {p.width}×{p.height}px ({p.aspectRatioLabel})
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSavedPreset(e, p.id)}
                        className="text-neutral-500 hover:text-rose-400 p-1 rounded transition-all opacity-0 group-hover:opacity-100"
                        title="Delete custom preset"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Style Before Rendering & Live Visual Proportion Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Live Interactive Scale & Shape Preview Box */}
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex flex-col items-center justify-center gap-3">
              <div className="w-full flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  Live Proportion Preview:
                </span>
                <span className="text-[10px] font-mono text-neutral-500">{ratioLabel}</span>
              </div>

              {/* Aspect Ratio Box Simulator */}
              <div className="w-full h-44 bg-neutral-900/60 rounded-xl border border-dashed border-neutral-800 flex items-center justify-center p-3 relative overflow-hidden">
                <div
                  className="bg-gradient-to-br from-indigo-950 via-purple-950 to-neutral-900 border-2 border-indigo-500/80 rounded-lg shadow-lg flex flex-col items-center justify-between p-2 text-center transition-all duration-300 max-w-full max-h-full"
                  style={{
                    aspectRatio: `${Math.max(0.2, Math.min(5, ratioValue))}`,
                    width: ratioValue > 1 ? '100%' : 'auto',
                    height: ratioValue <= 1 ? '100%' : 'auto',
                  }}
                >
                  <span className="text-[9px] font-mono font-bold text-indigo-300 uppercase truncate">
                    {presetName || 'Custom'}
                  </span>
                  <div className="my-auto">
                    <p className="text-xs font-extrabold text-white tracking-wide truncate max-w-[120px]">
                      {currentDesign.details.title || currentDesign.details.event || 'EVENT TITLE'}
                    </p>
                    <p className="text-[9px] text-amber-300 font-mono">{ratioLabel}</p>
                  </div>
                  <span className="text-[8.5px] text-neutral-400 font-mono">
                    {pixelWidth}×{pixelHeight}px
                  </span>
                </div>
              </div>
            </div>

            {/* Style Customization Before Rendering */}
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex flex-col gap-3.5">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  Style Before Rendering:
                </span>
                <span className="text-[10px] text-neutral-500">Aesthetic Preset</span>
              </div>

              {/* Style Preset Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                  Design & Typography Mood:
                </label>
                <select
                  value={selectedStyleId}
                  onChange={(e) => setSelectedStyleId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-200 outline-none focus:border-indigo-500"
                >
                  {POSTER_STYLES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.layoutStyle})
                    </option>
                  ))}
                </select>
              </div>

              {/* Text Scale Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-neutral-400">Headline Text Scale:</span>
                  <span className="font-mono text-indigo-400 font-bold">{textScale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.05"
                  value={textScale}
                  onChange={(e) => setTextScale(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Badge Position & Density Selection */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-neutral-400 mb-1">
                    Badge Placement:
                  </label>
                  <select
                    value={badgePosition}
                    onChange={(e) => setBadgePosition(e.target.value as BadgePosition)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-neutral-200 outline-none"
                  >
                    <option value="top_split">Split Corners</option>
                    <option value="top_center">Top Centered</option>
                    <option value="top_left_stacked">Stacked Left</option>
                    <option value="inline_compact">Inline Compact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-semibold text-neutral-400 mb-1">
                    Frame Border:
                  </label>
                  <select
                    value={borderStyle}
                    onChange={(e) => setBorderStyle(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-neutral-200 outline-none"
                  >
                    <option value="none">None</option>
                    <option value="thin">Thin Minimal</option>
                    <option value="double">Double Luxury</option>
                    <option value="bold_frame">Bold Frame</option>
                    <option value="accent_corners">Accent Corners</option>
                  </select>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-800">
          
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium transition-all"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-end">
            
            {/* Save As Preset & Apply */}
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="flex-1 sm:flex-none px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-750 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              title="Save to preset library and apply to canvas"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Save & Apply</span>
            </button>

            {/* Apply To Canvas */}
            <button
              type="button"
              onClick={handleApplyToCanvas}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Apply Size & Style</span>
            </button>

            {/* Direct Render Export */}
            <button
              type="button"
              onClick={handleDirectRenderExport}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/25 flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Render & Export Now</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
