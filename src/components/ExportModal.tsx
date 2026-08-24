import React, { useState } from 'react';
import { Download, Copy, Check, X, Image as ImageIcon, Sparkles, Share2, Instagram } from 'lucide-react';
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
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [dpiScale, setDpiScale] = useState<number>(2); // 2x default crisp resolution

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
      .replace(/(^-|-$)/g, '');
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
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setIsRendering(false);
    }
  };

  // Trigger download as .png file
  const handleDownloadPng = async () => {
    const { url } = await getPosterFile();

    const sanitizedTitle = (design.details.title || design.details.event || 'event-poster')
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
      const { blob } = await getPosterFile();
      
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        alert('Clipboard image copy not supported in this browser. Please download the PNG directly.');
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Share directly to Instagram
  const handleShareInstagram = async () => {
    try {
      setShareStatus('Preparing poster for Instagram...');
      const { file, blob, url } = await getPosterFile();

      // Native mobile file share (Instagram Feed / Stories appear in share sheet on iOS/Android)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: design.details.event || design.details.title || 'Event Poster',
          text: `🎉 ${design.details.event || design.details.title} at ${design.details.venue}!`,
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
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Open Instagram in new tab
      window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');

      setShareStatus(
        copiedImage
          ? 'Poster downloaded & copied to clipboard! Paste directly into your Instagram story or feed.'
          : 'Poster downloaded! Upload directly to your Instagram story or feed.'
      );
      setTimeout(() => setShareStatus(null), 5000);
    } catch (err) {
      console.error('Instagram share error:', err);
      setShareStatus('Failed to prepare Instagram share.');
      setTimeout(() => setShareStatus(null), 3000);
    }
  };

  // Share directly to Twitter / X
  const handleShareTwitter = async () => {
    try {
      setShareStatus('Preparing tweet composer...');
      const { file, blob } = await getPosterFile();

      const lineup = [design.details.artist1, design.details.artist2, design.details.artist3, design.details.artist4]
        .filter(Boolean)
        .join(', ');

      const tweetText = `🎉 ${design.details.event || design.details.title || 'Live Event'} at ${design.details.venue || 'the venue'}${design.details.date ? ` on ${design.details.date}` : ''}! 🚀${lineup ? `\n\nFeatured Lineup: ${lineup}` : ''}\n\n#LiveEvent #${(design.details.venue || 'Music').replace(/\s+/g, '')}`;

      // Native mobile file share (X/Twitter appears in native share sheet)
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

      // Copy image to clipboard for desktop pasting
      if (navigator.clipboard && navigator.clipboard.write) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        } catch {
          // ignore
        }
      }

      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');

      setShareStatus('Opened Twitter composer! Poster image copied to clipboard — press Ctrl+V / Cmd+V to attach.');
      setTimeout(() => setShareStatus(null), 5000);
    } catch (err) {
      console.error('Twitter share error:', err);
      setShareStatus('Failed to prepare Twitter share.');
      setTimeout(() => setShareStatus(null), 3000);
    }
  };

  // Universal System Share
  const handleSystemShare = async () => {
    try {
      setShareStatus('Opening system share menu...');
      const { file } = await getPosterFile();
      if (navigator.share) {
        const text = `🎉 ${design.details.event || design.details.title || 'Live Event'} at ${design.details.venue || 'the venue'}!`;
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
              Export & Share Event Poster
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

        {/* Direct Social Media Sharing Buttons */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-fuchsia-400" />
              Direct Social Media Share
            </span>
            <span className="text-[10px] text-slate-400">Formatted for {design.preset.platform}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* Instagram Share */}
            <button
              onClick={handleShareInstagram}
              disabled={isRendering}
              className="py-2.5 px-3 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram</span>
            </button>

            {/* Twitter / X Share */}
            <button
              onClick={handleShareTwitter}
              disabled={isRendering}
              className="py-2.5 px-3 bg-neutral-900 hover:bg-black border border-slate-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Twitter / X</span>
            </button>

            {/* Universal / Native Share */}
            <button
              onClick={handleSystemShare}
              disabled={isRendering}
              className="col-span-2 sm:col-span-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share App...</span>
            </button>
          </div>

          {/* Share Feedback Toast / Status Notice */}
          {shareStatus && (
            <div className="p-2.5 bg-indigo-950/60 border border-indigo-500/40 rounded-lg text-xs text-indigo-200 animate-fadeIn flex items-center gap-2">
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

