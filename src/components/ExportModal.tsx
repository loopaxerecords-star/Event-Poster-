import React, { useState } from 'react';
import { Download, Copy, Check, X, Image as ImageIcon, Sparkles, Share2, Instagram, Facebook } from 'lucide-react';
import { exportPosterToPng } from './PosterCanvas';
import { PosterDesignState } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: PosterDesignState;
  onSaveToLibrary: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  design,
  onSaveToLibrary,
}) => {
  const [isRendering, setIsRendering] = useState(false);
  const [renderedPngUrl, setRenderedPngUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [dpiScale, setDpiScale] = useState<number>(2); // 2x default crisp resolution

  if (!isOpen) return null;

  // Generate PNG preview
  const handleGeneratePng = async (scale: number = dpiScale) => {
    try {
      setIsRendering(true);
      const pngUrl = await exportPosterToPng(scale);
      setRenderedPngUrl(pngUrl);
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setIsRendering(false);
    }
  };

  // Trigger download as .png file
  const handleDownloadPng = async () => {
    let url = renderedPngUrl;
    if (!url) {
      setIsRendering(true);
      url = await exportPosterToPng(dpiScale);
      setRenderedPngUrl(url);
      setIsRendering(false);
    }

    const sanitizedTitle = (design.details.title || 'event-poster')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const fileName = `${sanitizedTitle}-${design.preset.id}-${Date.now()}.png`;

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    onSaveToLibrary();
  };

  // Copy PNG image to clipboard
  const handleCopyToClipboard = async () => {
    try {
      let url = renderedPngUrl;
      if (!url) {
        setIsRendering(true);
        url = await exportPosterToPng(dpiScale);
        setRenderedPngUrl(url);
        setIsRendering(false);
      }

      const res = await fetch(url);
      const blob = await res.blob();
      
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        alert('Clipboard image copy not supported in this browser mode. Please download the PNG directly.');
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-white flex flex-col gap-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Export High-Res .PNG Poster
            </h2>
            <p className="text-xs text-slate-400">
              Preset: <span className="text-emerald-400 font-semibold">{design.preset.name}</span> ({design.preset.aspectRatioLabel})
            </p>
          </div>
        </div>

        {/* Resolution Quality Scale Picker */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">PNG Image Resolution:</span>
          <div className="flex items-center gap-1.5">
            {[
              { label: 'Standard (1x)', scale: 1 },
              { label: 'Ultra HD (2x)', scale: 2 },
              { label: '4K Print (3x)', scale: 3 },
            ].map((opt) => (
              <button
                key={opt.scale}
                onClick={() => {
                  setDpiScale(opt.scale);
                  handleGeneratePng(opt.scale);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  dpiScale === opt.scale
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Social Media Sharing Tips */}
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-300 flex items-center gap-3">
          <Share2 className="w-5 h-5 text-fuchsia-400 shrink-0" />
          <div>
            <p className="font-bold text-white">Ready for Seamless Social Media Sharing</p>
            <p className="text-[11px] text-slate-400">
              Downloaded .png file is formatted for {design.preset.platform} ({design.preset.aspectRatioLabel}). You can also copy directly to clipboard for web publishing!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          
          <button
            onClick={handleDownloadPng}
            disabled={isRendering}
            className="w-full sm:flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            <span>{isRendering ? 'Rendering PNG...' : 'Download .PNG File'}</span>
          </button>

          <button
            onClick={handleCopyToClipboard}
            disabled={isRendering}
            className="w-full sm:w-auto py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-slate-300" />}
            <span>{copied ? 'Copied PNG!' : 'Copy PNG'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
