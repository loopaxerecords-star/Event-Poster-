import React from 'react';
import { 
  Globe, 
  Sparkles, 
  Radio, 
  ExternalLink, 
  RotateCw, 
  Check, 
  Compass, 
  Hash, 
  Music, 
  MapPin,
  ChevronRight,
  Zap,
  Palette
} from 'lucide-react';
import { WebSocialIntelResult, EventDetails } from '../types';

interface WebSocialIntelBannerProps {
  intel: WebSocialIntelResult | null;
  isLoading: boolean;
  autoSearchEnabled: boolean;
  onToggleAutoSearch: () => void;
  onManualSearch: () => void;
  onOpenModal: () => void;
  onApplyAllInspiration: () => void;
  details: EventDetails;
}

export const WebSocialIntelBanner: React.FC<WebSocialIntelBannerProps> = ({
  intel,
  isLoading,
  autoSearchEnabled,
  onToggleAutoSearch,
  onManualSearch,
  onOpenModal,
  onApplyAllInspiration,
  details,
}) => {
  const hasQuery = Boolean(
    details.artist1?.trim() || 
    details.venue?.trim() || 
    details.event?.trim()
  );

  return (
    <div className="bg-gradient-to-r from-cyan-950/60 via-neutral-950 to-indigo-950/60 border border-cyan-500/30 rounded-2xl p-3.5 sm:p-4 text-neutral-200 flex flex-col gap-3 shadow-lg shadow-cyan-950/20 transition-all">
      
      {/* Top Status Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 relative shadow-sm">
            {isLoading ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            ) : intel ? (
              <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            ) : (
              <Compass className="w-3.5 h-3.5 text-neutral-400" />
            )}
            {intel && !isLoading && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                Live Web & Social Media Intel
              </span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                Google Grounded
              </span>
            </div>
            <p className="text-[10px] text-neutral-400">
              {isLoading
                ? 'Scanning Spotify, Instagram, TikTok & venue archives...'
                : intel
                ? `Discovered aesthetic for "${intel.primaryArtist?.name || details.artist1 || details.venue}"`
                : 'Auto-researches artist genres, tour visual aesthetics & venue vibes'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Auto Search Toggle */}
          <button
            type="button"
            onClick={onToggleAutoSearch}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border flex items-center gap-1.5 transition-all ${
              autoSearchEnabled
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="Automatically query web & social platforms when you fill in fields"
          >
            <Radio className={`w-3 h-3 ${autoSearchEnabled ? 'text-cyan-400 animate-pulse' : 'text-neutral-500'}`} />
            <span>{autoSearchEnabled ? 'Auto-Scan On' : 'Auto-Scan Off'}</span>
          </button>

          {/* Re-scan / Search Button */}
          <button
            type="button"
            onClick={onManualSearch}
            disabled={isLoading || !hasQuery}
            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-500/40 text-neutral-200 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-all disabled:opacity-40"
            title="Scan live web for entered artists and venue"
          >
            <RotateCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-cyan-400' : 'text-neutral-400'}`} />
            <span>{isLoading ? 'Scanning...' : 'Scan Now'}</span>
          </button>
        </div>
      </div>

      {/* Intel Summary Strip (When data is available) */}
      {intel ? (
        <div className="bg-neutral-950/90 border border-cyan-500/20 rounded-xl p-3 flex flex-col gap-2.5">
          
          {/* Main takeaway & artist pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {intel.primaryArtist?.genre && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-medium flex items-center gap-1 text-[10.5px]">
                  <Music className="w-3 h-3 text-indigo-400" />
                  {intel.primaryArtist.genre}
                </span>
              )}
              {intel.venue?.atmosphere && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-medium flex items-center gap-1 text-[10.5px] truncate max-w-[240px]">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{intel.venue.atmosphere}</span>
                </span>
              )}
              {intel.socialBuzz?.trendingHashtags?.[0] && (
                <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono text-[10px]">
                  {intel.socialBuzz.trendingHashtags[0]}
                </span>
              )}
            </div>

            {/* Signature Palette Preview Dots */}
            {intel.inspiration?.customPalette && (
              <div className="flex items-center gap-1.5 self-start sm:self-auto bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-800">
                <span className="text-[9px] text-neutral-400 uppercase font-mono">Palette:</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: intel.inspiration.customPalette.bgColor }} />
                  <span className="w-3 h-3 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: intel.inspiration.customPalette.accentColor }} />
                  <span className="w-3 h-3 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: intel.inspiration.customPalette.badgeBg }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick Summary Line */}
          <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
            {intel.summary}
          </p>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800/80 flex-wrap">
            <button
              type="button"
              onClick={onApplyAllInspiration}
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-950 flex items-center gap-1.5 transition-all group"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-200 group-hover:scale-110 transition-transform" />
              <span>Apply Researched Inspiration to Poster</span>
            </button>

            <button
              type="button"
              onClick={onOpenModal}
              className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-500/40 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <span>Explore Sources & Trends ({intel.sources?.length || 0})</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

        </div>
      ) : hasQuery ? (
        <div className="flex items-center justify-between text-xs text-neutral-400 py-1">
          <span>Ready to search social buzz & aesthetics for entered acts.</span>
          <button
            type="button"
            onClick={onManualSearch}
            className="text-cyan-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1"
          >
            <span>Scan Web & Socials Now</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-neutral-400">
          Type an artist name (e.g. <em>Peggy Gou, Rufus Du Sol</em>) or venue (e.g. <em>Red Rocks, Printworks</em>) to automatically extract aesthetic inspiration from web and socials.
        </p>
      )}

    </div>
  );
};
