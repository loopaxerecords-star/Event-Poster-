import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { Calendar, Clock, MapPin, Ticket, Sun, CloudRain, Sunset, Snowflake, Zap, Moon, Sparkles, QrCode } from 'lucide-react';
import { PosterDesignState } from '../types';

interface PosterCanvasProps {
  design: PosterDesignState;
  onDesignChange?: (updated: Partial<PosterDesignState>) => void;
  isExporting?: boolean;
}

export const PosterCanvas: React.FC<PosterCanvasProps> = ({ design }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

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

  return (
    <div className="w-full bg-neutral-900 rounded-3xl border border-neutral-800 p-4 sm:p-6 relative flex flex-col items-center justify-center shadow-2xl overflow-hidden">
      
      {/* Top Status Badge */}
      <div className="w-full flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-500">
            Live Canvas Preview
          </span>
        </div>
        <div className="bg-neutral-950/80 backdrop-blur-md text-[10px] text-neutral-400 px-3 py-1 rounded-full border border-neutral-800 uppercase tracking-widest font-mono">
          {preset.name} ({preset.aspectRatioLabel})
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
            background: design.bgType === 'ai_image' && design.bgImageUrl
              ? `url(${design.bgImageUrl}) center/cover no-repeat`
              : design.bgType === 'upload' && design.bgImageUrl
              ? `url(${design.bgImageUrl}) center/cover no-repeat`
              : palette.bgGradient,
            ...borderInlineStyle
          }}
        >
          
          {/* Background Overlay Layer for Contrast */}
          <div
            className="absolute inset-0 pointer-events-none z-0 transition-opacity"
            style={{
              backgroundColor: palette.bgColor,
              opacity: design.overlayOpacity,
              backdropFilter: design.blurAmount > 0 ? `blur(${design.blurAmount}px)` : 'none'
            }}
          />

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

          {/* TOP BAR: Badges, Category, Weather Forecast */}
          <div className="relative z-10 p-5 sm:p-7 flex items-start justify-between gap-3 w-full">
            
            {/* Left Badges */}
            <div className="flex flex-col gap-2 items-start">
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

          {/* BOTTOM SECTION: Date, Time, Venue */}
          <div className="relative z-10 p-5 sm:p-7 w-full flex flex-col gap-3 sm:gap-4">
            
            {/* Main Info Card Container */}
            <div
              className="p-4 sm:p-5 rounded-2xl border backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4"
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

          </div>

        </div>

      </div>

    </div>
  );
};

// Helper OKLCH/modern color to sRGB converter for html2canvas compatibility
function convertOklchToRgb(colorStr: string, ctx?: CanvasRenderingContext2D | null): string {
  if (ctx) {
    try {
      ctx.fillStyle = '#010203';
      ctx.fillStyle = colorStr;
      if (ctx.fillStyle && ctx.fillStyle !== '#010203') {
        return ctx.fillStyle;
      }
    } catch {
      // fallback to math parser
    }
  }

  try {
    const match = colorStr.match(/oklch\(\s*([\d.%]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\s*\)/i);
    if (match) {
      const lStr = match[1];
      const cStr = match[2];
      const hStr = match[3];
      const aStr = match[4];

      const l = lStr.endsWith('%') ? parseFloat(lStr) / 100 : parseFloat(lStr);
      const c = parseFloat(cStr);
      const h = parseFloat(hStr);
      const a = aStr ? (aStr.endsWith('%') ? parseFloat(aStr) / 100 : parseFloat(aStr)) : 1;

      const hRad = (h * Math.PI) / 180;
      const a_lab = c * Math.cos(hRad);
      const b_lab = c * Math.sin(hRad);

      const l_ = l + 0.3963377774 * a_lab + 0.2158037573 * b_lab;
      const m_ = l - 0.1055613458 * a_lab - 0.0638541728 * b_lab;
      const s_ = l - 0.0894841775 * a_lab - 1.291485548 * b_lab;

      const l3 = l_ * l_ * l_;
      const m3 = m_ * m_ * m_;
      const s3 = s_ * s_ * s_;

      const rLinear = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
      const gLinear = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
      const bLinear = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

      const gamma = (v: number) => {
        v = Math.max(0, Math.min(1, v));
        return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
      };

      const r8 = Math.round(gamma(rLinear) * 255);
      const g8 = Math.round(gamma(gLinear) * 255);
      const b8 = Math.round(gamma(bLinear) * 255);

      if (a < 1) {
        return `rgba(${r8}, ${g8}, ${b8}, ${a.toFixed(2)})`;
      }
      return `rgb(${r8}, ${g8}, ${b8})`;
    }
  } catch {
    // ignore
  }

  return 'rgb(128, 128, 128)';
}

// Helper function to export canvas to PNG high-res Blob or Data URL
export async function exportPosterToPng(dpiScale: number = 2): Promise<string> {
  const canvasElement = document.getElementById('poster-render-canvas');
  if (!canvasElement) {
    throw new Error('Poster canvas element not found');
  }

  const dummyCanvas = document.createElement('canvas');
  const ctx = dummyCanvas.getContext('2d');

  const convertColorMatch = (colorStr: string): string => {
    return convertOklchToRgb(colorStr, ctx);
  };

  const canvas = await html2canvas(canvasElement, {
    scale: dpiScale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    onclone: (clonedDoc) => {
      // 1. Process all <style> elements in clonedDoc
      const styleElements = clonedDoc.querySelectorAll('style');
      styleElements.forEach((styleEl) => {
        if (styleEl.textContent && /oklch|oklab|color-mix|lab|lch/i.test(styleEl.textContent)) {
          styleEl.textContent = styleEl.textContent.replace(
            /(oklch|oklab|color-mix|lab|lch)\([^)]+\)/gi,
            (match) => convertColorMatch(match)
          );
        }
      });

      // 2. Process all element inline styles or style attributes
      const allElements = clonedDoc.querySelectorAll('*');
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.style && htmlEl.style.cssText && /oklch|oklab|color-mix|lab|lch/i.test(htmlEl.style.cssText)) {
          htmlEl.style.cssText = htmlEl.style.cssText.replace(
            /(oklch|oklab|color-mix|lab|lch)\([^)]+\)/gi,
            (match) => convertColorMatch(match)
          );
        }
      });
    }
  });

  return canvas.toDataURL('image/png', 1.0);
}
