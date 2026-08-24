import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  X, 
  Image as ImageIcon, 
  Sparkles, 
  Share2, 
  Instagram, 
  BookmarkCheck, 
  ExternalLink, 
  MessageCircle,
  Maximize2,
  Sliders,
  Palette,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';
import { exportPosterToPng } from './PosterCanvas';
import { PosterDesignState, PosterPreset } from '../types';
import { POSTER_STYLES } from '../data/styles';
import { 
  SizeUnit, 
  STARTER_CUSTOM_SIZE_TEMPLATES, 
  convertToPixels, 
  createCustomPosterPreset, 
  computeAspectRatioLabel 
} from '../utils/customSizeManager';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: PosterDesignState;
  onSaveToLibrary: () => void;
  onUpdateDesign?: (updates: Partial<PosterDesignState>) => void;
  onOpenCustomSizeModal?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  design,
  onSaveToLibrary,
  onUpdateDesign,
  onOpenCustomSizeModal,
}) => {
  const [isRendering, setIsRendering] = useState(false);
  const [renderedPngUrl, setRenderedPngUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [savedToLib, setSavedToLib] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [dpiScale, setDpiScale] = useState<number>(2); // 2x default crisp resolution
  const [showCustomControls, setShowCustomControls] = useState<boolean>(false);

  // Custom pre-render size state
  const [customUnit, setCustomUnit] = useState<SizeUnit>(design.preset.unit || 'in');
  const [customWidth, setCustomWidth] = useState<number>(design.preset.rawWidth || (design.preset.unit === 'in' ? 27 : design.preset.width));
  const [customHeight, setCustomHeight] = useState<number>(design.preset.rawHeight || (design.preset.unit === 'in' ? 40 : design.preset.height));
  const [customDpi, setCustomDpi] = useState<number>(design.preset.dpi || 300);

  // Auto-generate PNG preview when modal opens or resolution scale changes
  useEffect(() => {
    if (isOpen) {
      handleGeneratePng(dpiScale);
    } else {
      setRenderedPngUrl('');
      setShareStatus(null);
      setSavedToLib(false);
    }
  }, [isOpen, dpiScale, design.preset.id, design.style.id, design.textScale, design.borderStyle]);

  if (!isOpen) return null;

  // Generate or retrieve current PNG blob / File object
  const getPosterFile = async (scale = dpiScale): Promise<{ url: string; file: File; blob: Blob }> => {
    let url = renderedPngUrl;
    if (!url) {
      setIsRendering(true);
      url = await exportPosterToPng(scale);
      setRenderedPngUrl(url);
      setIsRendering(false);
    }
    const res = await fetch(url);
    const blob = await res.blob();
    const sanitizedTitle = (design.details.title || design.details.event || 'event-poster')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'poster';
    const fileName = `${sanitizedTitle}-${design.preset.id}.png`;
    const file = new File([blob], fileName, { type: 'image/png' });
    return { url, file, blob };
  };

  // Generate PNG preview
  const handleGeneratePng = async (scale: number = dpiScale) => {
    try {
      setIsRendering(true);
      const pngUrl = await exportPosterToPng(scale);
      setRenderedPngUrl(pngUrl);
    } catch (err: any) {
      console.error('Failed to export PNG:', err);
      setShareStatus(`Rendering note: ${err?.message || 'Could not render poster preview'}`);
    } finally {
      setIsRendering(false);
    }
  };

  // Apply quick custom size before render
  const handleApplyQuickCustomSize = (starter: typeof STARTER_CUSTOM_SIZE_TEMPLATES[0]) => {
    setCustomUnit(starter.unit);
    setCustomWidth(starter.width);
    setCustomHeight(starter.height);
    setCustomDpi(starter.dpi);

    if (onUpdateDesign) {
      const customPreset = createCustomPosterPreset(starter.name, starter.width, starter.height, starter.unit, starter.dpi);
      const styleObj = starter.recommendedStyleId 
        ? POSTER_STYLES.find(s => s.id === starter.recommendedStyleId) || design.style 
        : design.style;

      onUpdateDesign({
        preset: customPreset,
        style: styleObj,
      });

      setShareStatus(`Updated size to ${starter.name} (${starter.width}×${starter.height}${starter.unit})`);
      setTimeout(() => setShareStatus(null), 3000);
    }
  };

  // Apply custom manual dimensions
  const handleApplyManualDimensions = () => {
    if (onUpdateDesign) {
      const customPreset = createCustomPosterPreset(
        `Custom ${customWidth}×${customHeight}${customUnit}`,
        customWidth,
        customHeight,
        customUnit,
        customDpi
      );
      onUpdateDesign({ preset: customPreset });
      setShareStatus(`Applied custom size: ${customPreset.width}×${customPreset.height}px`);
      setTimeout(() => setShareStatus(null), 3000);
    }
  };

  // Trigger download as .png file
  const handleDownloadPng = async () => {
    try {
      setIsRendering(true);
      setShareStatus('Preparing high-resolution poster file...');
      const { file, blob } = await getPosterFile(dpiScale);

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(blobUrl);
      }, 2000);

      setShareStatus(`Poster saved to downloads as "${file.name}"!`);
      onSaveToLibrary();
      setSavedToLib(true);
      setTimeout(() => setShareStatus(null), 5000);
    } catch (err: any) {
      console.error('Download error:', err);
      setShareStatus(`Download error: ${err?.message || 'Could not generate PNG file'}`);
    } finally {
      setIsRendering(false);
    }
  };

  // Manual save to library
  const handleManualSaveLibrary = () => {
    onSaveToLibrary();
    setSavedToLib(true);
    setShareStatus('Saved poster design to your in-app library!');
    setTimeout(() => {
      setSavedToLib(false);
      setShareStatus(null);
    }, 3500);
  };

  // Copy PNG image to clipboard
  const handleCopyToClipboard = async () => {
    try {
      setIsRendering(true);
      const { blob } = await getPosterFile(dpiScale);
      
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setShareStatus('Copied poster image directly to your clipboard!');
        setTimeout(() => {
          setCopied(false);
          setShareStatus(null);
        }, 3000);
      } else {
        setShareStatus('Clipboard image copy not supported in this browser. Please download PNG.');
      }
    } catch (err: any) {
      console.error('Failed to copy to clipboard:', err);
      setShareStatus(`Clipboard copy: ${err?.message || 'Unsupported in current view'}`);
    } finally {
      setIsRendering(false);
    }
  };

  // Share directly to Instagram
  const handleShareInstagram = async () => {
    try {
      setShareStatus('Preparing poster for Instagram...');
      const { file, blob } = await getPosterFile(dpiScale);

      // Native mobile file share (Instagram Feed / Stories appear in share sheet on iOS/Android)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: design.details.event || design.details.title || 'Event Poster',
          text: `${design.details.event || design.details.title || 'Live Event'} at ${design.details.venue || 'the venue'}!`,
          files: [file],
        });
        setShareStatus('Shared to Instagram via native share!');
        setTimeout(() => setShareStatus(null), 3000);
        return;
      }

      // Desktop / Web Fallback: copy image to clipboard + download image + open Instagram
      let copiedImage = false;
      if (navigator.clipboard && navigator.clipboard.write) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          copiedImage = true;
        } catch {
          // ignore clipboard errors
        }
      }

      // Auto download poster file
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(blobUrl);
      }, 2000);

      window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');

      setShareStatus(
        copiedImage
          ? 'Poster downloaded & copied to clipboard! Paste directly into your Instagram story or feed.'
          : 'Poster downloaded! Upload directly to your Instagram story or feed.'
      );
      setTimeout(() => setShareStatus(null), 5000);
    } catch (err: any) {
      console.error('Instagram share error:', err);
      setShareStatus('Failed to prepare Instagram share.');
      setTimeout(() => setShareStatus(null), 3000);
    }
  };

  // Share directly to Twitter / X
  const handleShareTwitter = async () => {
    try {
      setShareStatus('Preparing tweet composer...');
      const { file, blob } = await getPosterFile(dpiScale);

      const lineup = [design.details.artist1, design.details.artist2, design.details.artist3, design.details.artist4]
        .filter(Boolean)
        .join(', ');

      const tweetText = `${design.details.event || design.details.title || 'Live Event'} at ${design.details.venue || 'the venue'}${design.details.date ? ` on ${design.details.date}` : ''}! ${lineup ? `\n\nLineup: ${lineup}` : ''}\n\n#LiveEvent #${(design.details.venue || 'Event').replace(/\s+/g, '')}`;

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: design.details.event || design.details.title || 'Event Poster',
          text: tweetText,
          files: [file],
        });
        setShareStatus('Shared to Twitter/X via native share!');
        setTimeout(() => setShareStatus(null), 3000);
        return;
      }

      if (navigator.clipboard && navigator.clipboard.write) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        } catch {
          // ignore
        }
      }

      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');

      setShareStatus('Opened Twitter composer! Poster image copied to clipboard — press Ctrl+V to attach.');
      setTimeout(() => setShareStatus(null), 5000);
    } catch (err: any) {
      console.error('Twitter share error:', err);
      setShareStatus('Failed to prepare Twitter share.');
      setTimeout(() => setShareStatus(null), 3000);
    }
  };

  // Share to WhatsApp
  const handleShareWhatsApp = async () => {
    try {
      setShareStatus('Preparing WhatsApp share...');
      const { file, blob } = await getPosterFile(dpiScale);

      const text = `${design.details.event || design.details.title || 'Event'} at ${design.details.venue || 'Venue'} on ${design.details.date || 'upcoming date'}! Check out the details: ${design.details.ticketUrl || ''}`;

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: design.details.event || design.details.title || 'Event Poster',
          text,
          files: [file],
        });
        setShareStatus('Shared via WhatsApp!');
        setTimeout(() => setShareStatus(null), 3000);
        return;
      }

      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      setShareStatus('Opened WhatsApp! Download poster to send image.');
      setTimeout(() => setShareStatus(null), 4000);
    } catch (err) {
      console.error('WhatsApp share error:', err);
    }
  };

  // Universal System Share
  const handleSystemShare = async () => {
    try {
      setShareStatus('Opening system share menu...');
      const { file } = await getPosterFile(dpiScale);
      if (navigator.share) {
        const text = `${design.details.event || design.details.title || 'Live Event'} at ${design.details.venue || 'the venue'}!`;
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: design.details.event || design.details.title || 'Event Poster',
            text,
            files: [file],
          });
        } else {
          await navigator.share({
            title: design.details.event || design.details.title || 'Event Poster',
            text,
          });
        }
        setShareStatus('Shared successfully!');
        setTimeout(() => setShareStatus(null), 3000);
      } else {
        handleCopyToClipboard();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('System share error:', err);
      }
      setShareStatus(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-neutral-200 flex flex-col gap-5 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800/60 hover:bg-neutral-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-100">
              Export & Share Poster
            </h2>
            <p className="text-xs text-neutral-400">
              Target Preset: <span className="text-indigo-400 font-semibold">{design.preset.name}</span> ({design.preset.aspectRatioLabel})
            </p>
          </div>
        </div>

        {/* Pre-Render Custom Size & Style Adjustment Accordion */}
        <div className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowCustomControls(!showCustomControls)}
            className="w-full p-3 flex items-center justify-between hover:bg-neutral-900/60 transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-200 block">
                  Customize Size & Style Before Rendering
                </span>
                <span className="text-[10px] text-neutral-400">
                  Current: {design.preset.name} ({design.preset.width}×{design.preset.height}px) • {design.style.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                {showCustomControls ? 'Hide Controls' : 'Edit Pre-Render'}
              </span>
            </div>
          </button>

          {showCustomControls && (
            <div className="p-3.5 pt-0 border-t border-neutral-800/80 flex flex-col gap-3.5 mt-2 animate-fadeIn">
              
              {/* Quick Custom Starters */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Quick Format Switcher:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {STARTER_CUSTOM_SIZE_TEMPLATES.slice(0, 6).map((starter) => (
                    <button
                      key={starter.id}
                      type="button"
                      onClick={() => handleApplyQuickCustomSize(starter)}
                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left text-[10.5px] text-neutral-300 hover:text-white transition-all flex items-center justify-between"
                    >
                      <span className="truncate font-medium">{starter.name.split(' ')[0]} {starter.name.split(' ')[1]}</span>
                      <span className="text-[9px] font-mono text-amber-400/90">{starter.width}x{starter.height}{starter.unit}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimension Number Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                
                {/* Unit Switcher */}
                <div className="sm:col-span-3 flex items-center gap-1">
                  {(['in', 'px', 'cm'] as SizeUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setCustomUnit(u)}
                      className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                        customUnit === u ? 'bg-indigo-600 text-white' : 'text-neutral-400 bg-neutral-950 hover:text-neutral-200'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>

                {/* Width */}
                <div className="sm:col-span-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-neutral-400">W:</span>
                  <input
                    type="number"
                    min="1"
                    step={customUnit === 'px' ? '1' : '0.1'}
                    value={customWidth}
                    onChange={(e) => setCustomWidth(parseFloat(e.target.value) || 1)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1 text-xs font-bold text-neutral-100 outline-none"
                  />
                </div>

                {/* Height */}
                <div className="sm:col-span-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-neutral-400">H:</span>
                  <input
                    type="number"
                    min="1"
                    step={customUnit === 'px' ? '1' : '0.1'}
                    value={customHeight}
                    onChange={(e) => setCustomHeight(parseFloat(e.target.value) || 1)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1 text-xs font-bold text-neutral-100 outline-none"
                  />
                </div>

                {/* Apply Dimensions */}
                <div className="sm:col-span-3 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleApplyManualDimensions}
                    className="w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10.5px] font-bold shadow transition-all flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Apply Size</span>
                  </button>
                </div>

              </div>

              {/* Style & Text Scale Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800">
                
                {/* Style Selector */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-neutral-400 flex items-center gap-1">
                    <Palette className="w-3 h-3 text-purple-400" />
                    Design Style:
                  </label>
                  <select
                    value={design.style.id}
                    onChange={(e) => {
                      const selected = POSTER_STYLES.find(s => s.id === e.target.value);
                      if (selected && onUpdateDesign) {
                        onUpdateDesign({ style: selected });
                      }
                    }}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1 text-[11px] font-medium text-neutral-200 outline-none"
                  >
                    {POSTER_STYLES.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>

                {/* Text Scale Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-neutral-400 flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-indigo-400" />
                      Text Scaling:
                    </span>
                    <span className="font-mono text-indigo-300 font-bold">{design.textScale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.5"
                    step="0.05"
                    value={design.textScale}
                    onChange={(e) => onUpdateDesign && onUpdateDesign({ textScale: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-1"
                  />
                </div>

              </div>

              {/* Advanced Custom Size Studio Trigger */}
              {onOpenCustomSizeModal && (
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCustomSizeModal();
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold underline underline-offset-2"
                  >
                    <Sliders className="w-3 h-3" />
                    Open full Custom Size & Style Studio dialog →
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Resolution Quality Scale Picker */}
        <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-semibold text-neutral-300">Export Resolution:</span>
          <div className="flex items-center gap-1.5">
            {[
              { label: 'Standard (1x)', scale: 1 },
              { label: 'Ultra HD (2x)', scale: 2 },
              { label: '4K Print (3x)', scale: 3 },
            ].map((opt) => (
              <button
                key={opt.scale}
                onClick={() => setDpiScale(opt.scale)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  dpiScale === opt.scale
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rendered Preview & Direct Image View */}
        {renderedPngUrl && (
          <div className="p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-2xl flex items-center gap-3.5">
            <img
              src={renderedPngUrl}
              alt="Rendered Poster Preview"
              className="w-14 h-18 object-contain rounded-lg border border-neutral-700 bg-black/50 shrink-0 shadow"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-neutral-100 truncate">
                {design.details.title || design.details.event || 'Event Poster'}
              </p>
              <p className="text-[11px] text-neutral-400">
                Ready for high-res download • {dpiScale}x resolution scale
              </p>
              <a
                href={renderedPngUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 mt-1 font-medium underline underline-offset-2"
              >
                <ExternalLink className="w-3 h-3" />
                View full image in new tab
              </a>
            </div>
          </div>
        )}

        {/* Direct Social Media Sharing Buttons */}
        <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              Social Media & Sharing
            </span>
            <span className="text-[10px] text-neutral-500">Formatted for {design.preset.platform}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Instagram Share */}
            <button
              onClick={handleShareInstagram}
              disabled={isRendering}
              className="py-2 px-3 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Instagram className="w-4 h-4 shrink-0" />
              <span>Instagram</span>
            </button>

            {/* Twitter / X Share */}
            <button
              onClick={handleShareTwitter}
              disabled={isRendering}
              className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Twitter / X</span>
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={handleShareWhatsApp}
              disabled={isRendering}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>WhatsApp</span>
            </button>

            {/* Universal / Native Share */}
            <button
              onClick={handleSystemShare}
              disabled={isRendering}
              className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Share2 className="w-3.5 h-3.5 shrink-0" />
              <span>Share...</span>
            </button>
          </div>

          {/* Share Feedback Toast / Status Notice */}
          {shareStatus && (
            <div className="p-2.5 bg-indigo-950/80 border border-indigo-500/50 rounded-xl text-xs text-indigo-200 animate-fadeIn flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
              <span>{shareStatus}</span>
            </div>
          )}
        </div>

        {/* Action Buttons: Download & Copy PNG */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          
          <button
            onClick={handleDownloadPng}
            disabled={isRendering}
            className="w-full sm:flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-98"
          >
            <Download className="w-5 h-5" />
            <span>{isRendering ? 'Rendering PNG...' : 'Download .PNG'}</span>
          </button>

          <button
            onClick={handleCopyToClipboard}
            disabled={isRendering}
            className="w-full sm:w-auto py-3 px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-semibold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-neutral-300" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleManualSaveLibrary}
            className="w-full sm:w-auto py-3 px-3.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white rounded-2xl text-sm flex items-center justify-center gap-1.5 transition-all"
            title="Save to in-app gallery"
          >
            <BookmarkCheck className={`w-4 h-4 ${savedToLib ? 'text-emerald-400' : 'text-neutral-400'}`} />
            <span>{savedToLib ? 'Saved' : 'Save'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};


