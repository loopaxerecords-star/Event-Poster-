import React, { useEffect, useRef, useState, useMemo } from 'react';
import QRCode from 'qrcode';
import { toPng, toBlob } from 'html-to-image';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  Sun, 
  CloudRain, 
  Sunset, 
  Snowflake, 
  Zap, 
  Moon, 
  Sparkles, 
  QrCode, 
  ShieldCheck, 
  Wand2, 
  Layers, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { PosterDesignState } from '../types';
import { runArtDirectorAudit, snobProofAndSanitizePoster } from '../utils/artDirectorEngine';

interface PosterCanvasProps {
  design: PosterDesignState;
  onDesignChange?: (updated: Partial<PosterDesignState>) => void;
  isExporting?: boolean;
  onOpenArtDirector?: () => void;
}

export const PosterCanvas: React.FC<PosterCanvasProps> = ({ 
  design, 
  onDesignChange, 
  onOpenArtDirector 
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Live background Art Director audit
  const audit = useMemo(() => runArtDirectorAudit(design), [design]);

  // Generate QR Code data URL when link changes
  useEffect(() => {
    const qrLink = design.details.ticketUrl || design.details.qrCodeLink;
    if (qrLink && design.showQrCode) {
      QRCode.toDataURL(qrLink, {
        width: 180,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    } else {
      setQrCodeDataUrl('');
    }
  }, [design.details.ticketUrl, design.details.qrCodeLink, design.showQrCode]);

  // Weather Icon renderer
  const renderWeatherIcon = () => {
    if (!design.weather) return <Sun className="w-4 h-4" />;
    switch (design.weather.condition) {
      case 'sunny': return <Sun className="w-4 h-4 text-amber-300" />;
      case 'sunset': return <Sunset className="w-4 h-4 text-orange-300" />;
      case 'rainy': return <CloudRain className="w-4 h-4 text-cyan-300" />;
      case 'snowy': return <Snowflake className="w-4 h-4 text-sky-200" />;
      case 'stormy': return <Zap className="w-4 h-4 text-yellow-300" />;
      case 'starry_night': return <Moon className="w-4 h-4 text-purple-300" />;
      default: return <Sun className="w-4 h-4 text-amber-300" />;
    }
  };

  const { palette, details, style, preset } = design;

  // Compute container aspect ratio class or style
  const aspectRatioValue = preset.aspectRatioValue;

  // Header font styling
  const headerFontFamily = design.customFontHeader || style.fontHeader;
  const bodyFontFamily = design.customFontBody || style.fontBody;

  // Frame border styles
  let borderClass = '';
  let borderInlineStyle: React.CSSProperties = {};

  if (design.borderStyle === 'thin') {
    borderInlineStyle = { border: `2px solid ${palette.borderColor}` };
  } else if (design.borderStyle === 'double') {
    borderInlineStyle = { border: `6px double ${palette.accentColor}` };
  } else if (design.borderStyle === 'bold_frame') {
    borderInlineStyle = { border: `12px solid ${palette.cardBg}`, boxShadow: `0 0 0 2px ${palette.accentColor}` };
  } else if (design.borderStyle === 'accent_corners') {
    borderClass = 'relative before:absolute before:inset-2 before:border-2 before:border-dashed before:border-amber-400/50';
  }

  // Quick 1-click polish trigger
  const handleQuickPolish = () => {
    if (onDesignChange) {
      onDesignChange(snobProofAndSanitizePoster(design));
    }
  };

  return (
    <div className="w-full bg-neutral-900 rounded-3xl border border-neutral-800 p-4 sm:p-6 relative flex flex-col items-center justify-center shadow-2xl overflow-hidden">
      
      {/* Top Status & Art Director AI HUD Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4 px-1">
        
        {/* Discreet Art Director Guard Badge */}
        <button
          onClick={onOpenArtDirector}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950/90 hover:bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 transition-all shadow-md"
          title="Open Background Art Director Inspection & Snob-Proof Engine"
        >
          <div className={`w-2 h-2 rounded-full ${
            audit.overallScore >= 90 
              ? 'bg-emerald-400 animate-pulse' 
              : audit.overallScore >= 75 
              ? 'bg-amber-400' 
              : 'bg-rose-400 animate-ping'
          }`} />
          <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Art Director:</span>
            <span className={audit.overallScore >= 85 ? 'text-emerald-400 font-extrabold' : 'text-amber-400 font-extrabold'}>
              {audit.snobProofConfidence}% Snob-Proof
            </span>
          </span>
        </button>

        {/* Action Controls & Preset Pill */}
        <div className="flex items-center gap-2">
          {audit.overallScore < 95 && (
            <button
              onClick={handleQuickPolish}
              className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 transition-all"
              title="1-Click AI Sanitize & Snob-Proof Polish"
            >
              <Wand2 className="w-3 h-3" />
              <span>Polish</span>
            </button>
          )}

          <div className="bg-neutral-950/80 backdrop-blur-md text-[10px] text-neutral-400 px-3 py-1 rounded-full border border-neutral-800 uppercase tracking-widest font-mono">
            {preset.name} ({preset.aspectRatioLabel})
          </div>
        </div>
      </div>
      
      {/* Outer Scaled Container preserving target aspect ratio */}
      <div 
        className="relative w-full max-w-[500px] shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 border border-neutral-800 group"
        style={{ aspectRatio: `${aspectRatioValue}` }}
      >
        {/* Printable/Exportable Canvas Root */}
        <div
          ref={canvasRef}
          id="poster-render-canvas"
          className={`w-full h-full relative flex flex-col justify-between select-none overflow-hidden ${borderClass}`}
          style={{
            fontFamily: bodyFontFamily,
            color: palette.primaryText,
            background: palette.bgGradient,
            letterSpacing: design.opticalKerning ? '0.02em' : 'normal',
            ...borderInlineStyle
          }}
        >
          {/* Background Image Layer if present */}
          {design.bgImageUrl && (design.bgType === 'ai_image' || design.bgType === 'upload') && (
            <img
              src={design.bgImageUrl}
              alt="Poster background"
              crossOrigin="anonymous"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
              style={{
                filter: design.blurAmount > 0 ? `blur(${design.blurAmount}px)` : 'none'
              }}
            />
          )}

          {/* Background Overlay Layer for Contrast */}
          <div
            className="absolute inset-0 pointer-events-none z-0 transition-opacity"
            style={{
              backgroundColor: palette.bgColor,
              opacity: design.overlayOpacity,
              backdropFilter: design.blurAmount > 0 && !design.bgImageUrl ? `blur(${design.blurAmount}px)` : 'none'
            }}
          />

          {/* ANTI-AI TACTILE MICROTEXTURE GRAIN OVERLAYS (Eliminates synthetic plastic glow) */}
          {design.antiAiTexture === 'risograph' && (
            <div 
              className="absolute inset-0 pointer-events-none z-1 opacity-25 mix-blend-overlay"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0), radial-gradient(circle at 3px 3px, #000000 1px, transparent 0)`,
                backgroundSize: '4px 4px, 6px 6px'
              }}
            />
          )}

          {design.antiAiTexture === 'matte_grain' && (
            <div 
              className="absolute inset-0 pointer-events-none z-1 opacity-20 mix-blend-multiply"
              style={{
                backgroundImage: `radial-gradient(#111 0.75px, transparent 0.75px), radial-gradient(#eee 0.75px, transparent 0.75px)`,
                backgroundPosition: '0 0, 2px 2px',
                backgroundSize: '3px 3px'
              }}
            />
          )}

          {design.antiAiTexture === 'analog_film' && (
            <div 
              className="absolute inset-0 pointer-events-none z-1 opacity-15 mix-blend-overlay"
              style={{
                backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`,
                backgroundSize: '2px 2px'
              }}
            />
          )}

          {design.antiAiTexture === 'halftone' && (
            <div 
              className="absolute inset-0 pointer-events-none z-1 opacity-10 mix-blend-color-burn"
              style={{
                backgroundImage: `radial-gradient(#000000 1.5px, transparent 1.5px)`,
                backgroundSize: '8px 8px'
              }}
            />
          )}

          {design.antiAiTexture === 'recycled_paper' && (
            <div 
              className="absolute inset-0 pointer-events-none z-1 opacity-20 mix-blend-soft-light"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 0, transparent 50%)`,
                backgroundSize: '6px 6px'
              }}
            />
          )}

          {/* Interactive 0.125" Bleed Safe Margin Guide Overlay */}
          {design.printBleedGuideVisible && (
            <div className="absolute inset-3 border-2 border-dashed border-cyan-400/70 pointer-events-none z-30 flex items-start justify-end p-1">
              <span className="bg-cyan-500 text-black font-mono font-black text-[7px] px-1 rounded uppercase tracking-tighter">
                0.125" SAFE PRINT MARGIN
              </span>
            </div>
          )}

          {/* Decorative Background Noise / Gradients */}
          {design.showGridOverlay && (
            <div 
              className="absolute inset-0 pointer-events-none z-0 opacity-15"
              style={{
                backgroundImage: `radial-gradient(${palette.accentColor} 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            />
          )}

          {/* TOP BAR: Promoter microtype, Badges, Category, Weather Forecast */}
          <div className={`relative z-10 w-full transition-all ${
            design.layoutDensity === 'compact' 
              ? 'p-3 sm:p-4' 
              : design.layoutDensity === 'spacious' 
              ? 'p-6 sm:p-8' 
              : 'p-4 sm:p-6'
          } ${
            design.badgePosition === 'top_center'
              ? 'flex flex-col items-center justify-center gap-2'
              : design.badgePosition === 'top_left_stacked'
              ? 'flex flex-col items-start gap-2'
              : design.badgePosition === 'inline_compact'
              ? 'flex flex-row items-center justify-between gap-2'
              : 'flex items-start justify-between gap-3'
          }`}>
            
            {/* Category / Custom Badge */}
            <div className={`flex flex-wrap items-center gap-2 ${
              design.badgePosition === 'top_center' ? 'justify-center' : 'items-start'
            }`}>
              {design.showCategoryBadge && details.category && (
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase shadow-md transition-transform"
                  style={{
                    backgroundColor: palette.badgeBg,
                    color: palette.badgeText,
                    boxShadow: `0 4px 12px ${palette.badgeBg}40`
                  }}
                >
                  {details.category}
                </span>
              )}

              {design.badgeText && (
                <span
                  className="px-2.5 py-0.8 rounded-md text-[10px] font-bold tracking-wider uppercase border"
                  style={{
                    borderColor: palette.borderColor,
                    color: palette.secondaryText,
                    backgroundColor: 'rgba(0,0,0,0.4)'
                  }}
                >
                  {design.badgeText}
                </span>
              )}
            </div>

            {/* Weather Adaptive Forecast Badge */}
            {design.showWeatherBadge && design.weather && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-all shadow-lg"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderColor: palette.borderColor,
                  color: palette.primaryText
                }}
              >
                {renderWeatherIcon()}
                <div className="flex flex-col text-[11px] leading-tight">
                  <span className="font-extrabold uppercase text-[10px] tracking-wider" style={{ color: palette.accentColor }}>
                    {design.weather.tempC}°C • {design.weather.conditionName}
                  </span>
                  <span className="opacity-80 text-[9px]">{design.weather.location}</span>
                </div>
              </div>
            )}

          </div>

          {/* CENTER SECTION: Featured Artist Lineup & Headline */}
          <div className="relative z-10 px-6 sm:px-8 py-2 flex flex-col items-center text-center my-auto w-full">
            
            {/* Event Name Tagline / Title */}
            {(details.event || details.subtitle) && (
              <p
                className="text-xs sm:text-sm font-extrabold tracking-widest uppercase mb-1.5 max-w-md drop-shadow"
                style={{ color: palette.accentColor }}
              >
                {details.event || details.subtitle}
              </p>
            )}

            {/* Headline Artist (Artist 1) */}
            <h1
              className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none mb-2 transition-all"
              style={{
                fontFamily: headerFontFamily,
                textTransform: design.titleUppercase ? 'uppercase' : 'none',
                color: palette.primaryText,
                fontSize: `calc(${preset.aspectRatioValue < 0.7 ? '2.5rem' : '2.1rem'} * ${design.textScale})`,
                textShadow: style.layoutStyle === 'neon_badge' 
                  ? `0 0 20px ${palette.accentColor}, 0 0 40px ${palette.accentColor}80` 
                  : `0 4px 16px rgba(0,0,0,0.6)`
              }}
            >
              {details.artist1 || details.title || 'ARTIST 1 (HEADLINER)'}
            </h1>

            {/* Supporting Artists (Artist 2, Artist 3, Artist 4) */}
            {([details.artist2, details.artist3, details.artist4].filter(Boolean).length > 0) && (
              <div className="flex flex-wrap items-center justify-center gap-2 my-2 max-w-md">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70" style={{ color: palette.accentColor }}>
                  WITH SUPPORT FROM
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: palette.primaryText }}>
                  {[details.artist2, details.artist3, details.artist4].filter(Boolean).map((artist, idx, arr) => (
                    <React.Fragment key={idx}>
                      <span className="px-2 py-0.5 rounded bg-black/30 backdrop-blur-sm border border-white/10" style={{ color: palette.secondaryText }}>
                        {artist}
                      </span>
                      {idx < arr.length - 1 && <span className="opacity-40" style={{ color: palette.accentColor }}>•</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Decorative Accent Divider */}
            <div
              className="w-16 h-1 rounded-full my-2"
              style={{ backgroundColor: palette.accentColor }}
            />

          </div>

          {/* BOTTOM SECTION: Date, Time, Venue & Venue Credibility Footer */}
          <div className={`relative z-10 w-full flex flex-col transition-all ${
            design.layoutDensity === 'compact'
              ? 'p-3 sm:p-4 gap-2'
              : design.layoutDensity === 'spacious'
              ? 'p-6 sm:p-8 gap-3'
              : 'p-4 sm:p-6 gap-2.5'
          }`}>
            
            {/* Main Info Card Container */}
            <div
              className={`rounded-2xl border backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-center justify-between transition-all ${
                design.layoutDensity === 'compact'
                  ? 'p-3 gap-2 sm:gap-3'
                  : design.layoutDensity === 'spacious'
                  ? 'p-5 sm:p-6 gap-4'
                  : 'p-4 sm:p-5 gap-4'
              }`}
              style={{
                backgroundColor: palette.cardBg,
                borderColor: palette.borderColor
              }}
            >
              
              {/* Event Schedule & Venue */}
              <div className="flex flex-col gap-2 text-left w-full sm:w-auto">
                
                {/* Venue Name */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="p-1.5 rounded-lg shrink-0"
                    style={{ backgroundColor: `${palette.accentColor}25`, color: palette.accentColor }}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase opacity-70 block" style={{ color: palette.secondaryText }}>
                      VENUE
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold block" style={{ color: palette.primaryText }}>
                      {details.venue || 'VENUE / LOCATION'}
                    </span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-2.5 mt-1">
                  <div
                    className="p-1.5 rounded-lg shrink-0"
                    style={{ backgroundColor: `${palette.accentColor}25`, color: palette.accentColor }}
                  >
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wider uppercase block" style={{ color: palette.accentColor }}>
                      {details.date || details.displayDate || 'DATE TBA'}
                    </span>
                    <span className="text-[11px] font-medium opacity-80 block" style={{ color: palette.secondaryText }}>
                      {details.time || 'TIME TBA'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Price & QR Code */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                {details.ticketPrice && (
                  <div className="text-right">
                    <span className="text-[10px] font-bold tracking-wider uppercase opacity-70 block" style={{ color: palette.secondaryText }}>
                      ADMISSION
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold" style={{ color: palette.accentColor }}>
                      {details.ticketPrice}
                    </span>
                  </div>
                )}

                {/* QR Code */}
                {design.showQrCode && qrCodeDataUrl && (
                  <div className="p-1 bg-white rounded-lg shadow-md flex flex-col items-center">
                    <img src={qrCodeDataUrl} alt="Event QR" className="w-12 h-12 object-contain" />
                    <span className="text-[8px] font-bold text-slate-800 uppercase tracking-tighter mt-0.5">SCAN TIX</span>
                  </div>
                )}
              </div>

            </div>

            {/* CALL TO ACTION BAR */}
            {details.callToAction && (
              <div
                className="w-full py-2.5 px-4 rounded-xl text-center font-black text-xs sm:text-sm tracking-widest uppercase shadow-md flex items-center justify-center gap-2"
                style={{
                  backgroundColor: palette.accentColor,
                  color: '#000000'
                }}
              >
                <Ticket className="w-4 h-4" />
                <span>{details.callToAction}</span>
              </div>
            )}

            {/* VENUE INDUSTRY CREDIBILITY BAR (Authentic Promoter Lockup, 18+ R.O.A.R & Security Barcode) */}
            {design.venueCredibilityBar !== false && (
              <div 
                className="w-full pt-1 pb-0.5 px-2 flex flex-col sm:flex-row items-center justify-between gap-1.5 border-t text-[8px] tracking-tight opacity-75 font-mono"
                style={{ borderColor: `${palette.borderColor}40`, color: palette.secondaryText }}
              >
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                  <span className="font-bold uppercase tracking-wider text-[8px]" style={{ color: palette.primaryText }}>
                    {design.promoterText || 'PRESENTED IN COLLABORATION WITH THE UNDERGROUND SOUND ARCHIVE'}
                  </span>
                  <span className="opacity-70 text-[7px] uppercase tracking-tighter">
                    {design.venueLegalNotice || 'STRICTLY 18+ • R.O.A.R • ZERO TOLERANCE • CASHLESS VENUE'}
                  </span>
                </div>

                {design.showBarcode !== false && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Authentic Vector Barcode */}
                    <div className="flex items-end gap-[1.5px] h-3.5 px-1 py-0.5 bg-black/40 rounded border border-white/10">
                      <div className="w-[1.5px] h-full bg-white"></div>
                      <div className="w-[1px] h-2.5 bg-white"></div>
                      <div className="w-[2px] h-full bg-white"></div>
                      <div className="w-[1px] h-2 bg-white"></div>
                      <div className="w-[1.5px] h-full bg-white"></div>
                      <div className="w-[1px] h-2.5 bg-white"></div>
                      <div className="w-[2px] h-full bg-white"></div>
                      <div className="w-[1.5px] h-2 bg-white"></div>
                      <div className="w-[1px] h-full bg-white"></div>
                    </div>
                    <span className="text-[7px] font-mono tracking-widest text-neutral-400">#AUTH-PASS</span>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

// Helper function to export canvas to PNG high-res Data URL using html-to-image
export async function exportPosterToPng(dpiScale: number = 2): Promise<string> {
  const canvasElement = document.getElementById('poster-render-canvas');
  if (!canvasElement) {
    throw new Error('Poster canvas element not found');
  }

  // Ensure all web fonts are fully loaded before capturing
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch (fontErr) {
    console.warn('Font loading check skipped:', fontErr);
  }

  try {
    const dataUrl = await toPng(canvasElement, {
      pixelRatio: dpiScale,
      cacheBust: true,
      quality: 1.0,
      skipAutoScale: false,
    });
    return dataUrl;
  } catch (err: any) {
    console.warn('html-to-image toPng initial attempt failed, trying fallback:', err);
    try {
      const dataUrl = await toPng(canvasElement, {
        pixelRatio: Math.max(1, dpiScale * 0.75),
        cacheBust: false,
      });
      return dataUrl;
    } catch (fallbackErr) {
      return await toPng(canvasElement, {
        pixelRatio: 1,
        cacheBust: false,
      });
    }
  }
}

// Helper function to export canvas to PNG high-res Blob directly
export async function exportPosterToBlob(dpiScale: number = 2): Promise<Blob> {
  const canvasElement = document.getElementById('poster-render-canvas');
  if (!canvasElement) {
    throw new Error('Poster canvas element not found');
  }

  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch (fontErr) {
    console.warn('Font loading check skipped:', fontErr);
  }

  try {
    const blob = await toBlob(canvasElement, {
      pixelRatio: dpiScale,
      cacheBust: true,
      quality: 1.0,
    });
    if (blob) return blob;
    throw new Error('Blob generation returned null');
  } catch (err: any) {
    console.warn('html-to-image toBlob failed, falling back to dataUrl conversion:', err);
    const dataUrl = await exportPosterToPng(dpiScale);
    const res = await fetch(dataUrl);
    return await res.blob();
  }
}

