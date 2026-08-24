import React from 'react';
import { 
  X, 
  Globe, 
  Sparkles, 
  ExternalLink, 
  Check, 
  Copy, 
  Music, 
  MapPin, 
  Hash, 
  Zap, 
  Palette, 
  Type, 
  Layers, 
  Image as ImageIcon,
  Share2,
  Calendar,
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import { WebSocialIntelResult, PosterDesignState } from '../types';

interface WebSocialIntelModalProps {
  isOpen: boolean;
  onClose: () => void;
  intel: WebSocialIntelResult | null;
  isLoading: boolean;
  onRefresh: () => void;
  onApplyAll: (intel: WebSocialIntelResult) => void;
  onApplyPalette: (intel: WebSocialIntelResult) => void;
  onApplyBackdropPrompt: (prompt: string) => void;
  onApplyTagline: (tagline: string) => void;
  onGenerateBackdropWithPrompt?: (prompt: string) => void;
}

export const WebSocialIntelModal: React.FC<WebSocialIntelModalProps> = ({
  isOpen,
  onClose,
  intel,
  isLoading,
  onRefresh,
  onApplyAll,
  onApplyPalette,
  onApplyBackdropPrompt,
  onApplyTagline,
  onGenerateBackdropWithPrompt,
}) => {
  const [copiedHashtags, setCopiedHashtags] = React.useState(false);
  const [appliedSection, setAppliedSection] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyHashtags = () => {
    if (!intel?.socialBuzz?.trendingHashtags) return;
    const text = intel.socialBuzz.trendingHashtags.join(' ');
    navigator.clipboard.writeText(text);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleSectionApply = (section: string, action: () => void) => {
    action();
    setAppliedSection(section);
    setTimeout(() => setAppliedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-md">
              <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Web & Social Media Intelligence Deep Dive
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  Google Search Grounded
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Live research on artist branding, tour lighting, venue ambiance & viral social buzz.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all disabled:opacity-40"
              title="Refresh live web research"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <Globe className="w-7 h-7 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Scanning Live Web & Socials...</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                  Analyzing Spotify discographies, Instagram tour aesthetics, Resident Advisor club archives, and trending hashtags.
                </p>
              </div>
            </div>
          ) : !intel ? (
            <div className="py-16 text-center text-neutral-400">
              <p className="text-sm">No research data available yet. Please enter artist or venue names and trigger a scan.</p>
            </div>
          ) : (
            <>
              {/* Executive Summary Card */}
              <div className="bg-gradient-to-br from-neutral-900/90 to-cyan-950/40 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Aesthetic Intelligence Synthesis</span>
                  </div>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    {intel.summary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSectionApply('all', () => onApplyAll(intel))}
                  className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-950 flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95"
                >
                  {appliedSection === 'all' ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Applied to Poster!</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-cyan-200" />
                      <span>Apply Full Inspiration to Poster</span>
                    </>
                  )}
                </button>
              </div>

              {/* 2-Column Grid: Artist Intel + Venue Intel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Primary Artist Card */}
                {intel.primaryArtist && (
                  <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                          <Music className="w-4 h-4" />
                          <span>Artist & Lineup Profile</span>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-semibold">
                          {intel.primaryArtist.genre}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">
                          {intel.primaryArtist.name}
                        </h3>
                        {intel.primaryArtist.recentWork && (
                          <p className="text-xs text-neutral-400 mt-0.5">
                            Recent Work: <span className="text-neutral-300">{intel.primaryArtist.recentWork}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800/80">
                          <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Visual Brand & Aesthetic:</span>
                          <p className="text-neutral-300 leading-snug">{intel.primaryArtist.aesthetic}</p>
                        </div>
                        <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800/80">
                          <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Social & Fan Community Vibe:</span>
                          <p className="text-neutral-300 leading-snug">{intel.primaryArtist.socialVibe}</p>
                        </div>
                      </div>
                    </div>

                    {/* Signature Color Swatches */}
                    {intel.primaryArtist.signatureColors?.length > 0 && (
                      <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-mono text-neutral-400">Signature Colors:</span>
                        <div className="flex items-center gap-1.5">
                          {intel.primaryArtist.signatureColors.map((col, idx) => (
                            <span
                              key={idx}
                              className="w-5 h-5 rounded-lg border border-white/20 shadow-sm"
                              style={{ backgroundColor: col }}
                              title={col}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Venue & Location Profile */}
                {intel.venue && (
                  <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          <MapPin className="w-4 h-4" />
                          <span>Venue & Setting Profile</span>
                        </div>
                        {intel.venue.city && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold">
                            {intel.venue.city}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">
                          {intel.venue.name}
                        </h3>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800/80">
                          <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Architectural Atmosphere:</span>
                          <p className="text-neutral-300 leading-snug">{intel.venue.atmosphere}</p>
                        </div>
                        <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800/80">
                          <span className="text-[10px] uppercase font-mono text-neutral-400 block mb-1">Crowd & Nightlife Culture:</span>
                          <p className="text-neutral-300 leading-snug">{intel.venue.crowdCulture}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-800 text-[11px] text-emerald-300/90 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{intel.venue.recommendedVisualMood}</span>
                    </div>
                  </div>
                )}

              </div>

              {/* Social Buzz & Trending Taglines */}
              {intel.socialBuzz && (
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <Hash className="w-4 h-4" />
                      <span>Social Media Buzz & Hashtag Radar</span>
                    </div>

                    {intel.socialBuzz.trendingHashtags?.length > 0 && (
                      <button
                        type="button"
                        onClick={handleCopyHashtags}
                        className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800 transition-all"
                      >
                        {copiedHashtags ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedHashtags ? 'Copied Tags!' : 'Copy Hashtags'}</span>
                      </button>
                    )}
                  </div>

                  {/* Hashtag Chips */}
                  {intel.socialBuzz.trendingHashtags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {intel.socialBuzz.trendingHashtags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-neutral-950 text-cyan-300 border border-neutral-800 text-xs font-mono"
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Sample Taglines to Apply */}
                  {intel.socialBuzz.sampleTaglines?.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-neutral-400">Verified Press & Social Taglines (Click to Apply as Subtitle):</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {intel.socialBuzz.sampleTaglines.map((tagline, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSectionApply(`tagline-${idx}`, () => onApplyTagline(tagline))}
                            className="p-2.5 text-left bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 rounded-xl text-xs text-neutral-200 transition-all flex items-center justify-between group"
                          >
                            <span className="line-clamp-1 italic">"{tagline}"</span>
                            {appliedSection === `tagline-${idx}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Zap className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 shrink-0 transition-colors" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Curated Design Inspiration & Custom Palette */}
              {intel.inspiration && (
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      <Palette className="w-4 h-4" />
                      <span>Poster Design Directives Grounded in Web Intel</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSectionApply('palette', () => onApplyPalette(intel))}
                      className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-900 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      {appliedSection === 'palette' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Palette className="w-3.5 h-3.5" />}
                      <span>Apply Extracted Palette Only</span>
                    </button>
                  </div>

                  {/* Palette Swatch Bar */}
                  {intel.inspiration.customPalette && (
                    <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{intel.inspiration.customPalette.name}</span>
                          <span className="text-[10px] text-neutral-400 font-normal">({intel.inspiration.styleName})</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {intel.inspiration.customPalette.description || intel.inspiration.reasoning}
                        </p>
                      </div>

                      {/* Swatches */}
                      <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        <div className="flex items-center -space-x-1">
                          <span className="w-6 h-6 rounded-full border-2 border-neutral-950 shadow-sm" style={{ backgroundColor: intel.inspiration.customPalette.bgColor }} title={`Background: ${intel.inspiration.customPalette.bgColor}`} />
                          <span className="w-6 h-6 rounded-full border-2 border-neutral-950 shadow-sm" style={{ backgroundColor: intel.inspiration.customPalette.cardBg }} title={`Card: ${intel.inspiration.customPalette.cardBg}`} />
                          <span className="w-6 h-6 rounded-full border-2 border-neutral-950 shadow-sm" style={{ backgroundColor: intel.inspiration.customPalette.accentColor }} title={`Accent: ${intel.inspiration.customPalette.accentColor}`} />
                          <span className="w-6 h-6 rounded-full border-2 border-neutral-950 shadow-sm" style={{ backgroundColor: intel.inspiration.customPalette.primaryText }} title={`Primary Text: ${intel.inspiration.customPalette.primaryText}`} />
                          <span className="w-6 h-6 rounded-full border-2 border-neutral-950 shadow-sm" style={{ backgroundColor: intel.inspiration.customPalette.badgeBg }} title={`Badge: ${intel.inspiration.customPalette.badgeBg}`} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Backdrop Art Prompt */}
                  {intel.inspiration.backdropArtPrompt && (
                    <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase font-mono text-neutral-400 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-cyan-400" />
                          <span>Researched Backdrop Image Prompt:</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSectionApply('prompt', () => onApplyBackdropPrompt(intel.inspiration.backdropArtPrompt))}
                            className="text-[11px] text-neutral-300 hover:text-white bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-800 transition-all flex items-center gap-1"
                          >
                            {appliedSection === 'prompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>Use Prompt</span>
                          </button>

                          {onGenerateBackdropWithPrompt && (
                            <button
                              type="button"
                              onClick={() => {
                                onApplyBackdropPrompt(intel.inspiration.backdropArtPrompt);
                                onGenerateBackdropWithPrompt(intel.inspiration.backdropArtPrompt);
                                onClose();
                              }}
                              className="text-[11px] text-cyan-300 hover:text-white bg-cyan-950/80 hover:bg-cyan-900 px-2.5 py-1 rounded-lg border border-cyan-500/40 transition-all font-semibold flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                              <span>Generate Background Image Now</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 italic bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80">
                        "{intel.inspiration.backdropArtPrompt}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Verified Web Grounding Sources & Citations */}
              {intel.sources?.length > 0 && (
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Verified Web Sources & Grounding Citations ({intel.sources.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {intel.sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-cyan-500/40 rounded-xl flex items-center justify-between gap-2 group transition-all text-xs"
                      >
                        <div className="truncate">
                          <span className="text-white font-medium block truncate group-hover:text-cyan-300 transition-colors">
                            {src.title}
                          </span>
                          <span className="text-[10px] text-neutral-500 block truncate">
                            {src.domain}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400 shrink-0 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-[11px] text-neutral-400">
            {intel ? `Researched at ${new Date(intel.researchedAt).toLocaleTimeString()}` : ''}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold transition-all"
            >
              Close
            </button>
            {intel && (
              <button
                type="button"
                onClick={() => {
                  onApplyAll(intel);
                  onClose();
                }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-200" />
                <span>Apply All Inspiration & Close</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
