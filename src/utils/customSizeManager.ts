import { PosterPreset } from '../types';

export type SizeUnit = 'px' | 'in' | 'cm' | 'mm';

export interface CustomSizeTemplate {
  id: string;
  name: string;
  category: 'Event Prints' | 'Outdoor & Merch' | 'Digital & Stream' | 'Specialty';
  width: number;
  height: number;
  unit: SizeUnit;
  dpi: number;
  description: string;
  recommendedStyleId?: string;
}

export const STARTER_CUSTOM_SIZE_TEMPLATES: CustomSizeTemplate[] = [
  {
    id: 'cinema-bus-stop',
    name: 'Cinema 27"×40" One-Sheet',
    category: 'Event Prints',
    width: 27,
    height: 40,
    unit: 'in',
    dpi: 300,
    description: 'Standard theatrical movie poster & festival premiere size (27" × 40")',
    recommendedStyleId: 'cyberpunk-neon',
  },
  {
    id: 'vinyl-sleeve',
    name: '12" Vinyl Album Sleeve',
    category: 'Outdoor & Merch',
    width: 12,
    height: 12,
    unit: 'in',
    dpi: 300,
    description: 'Square 12" × 12" LP record jacket & DJ vinyl release artwork',
    recommendedStyleId: 'retro-synthwave',
  },
  {
    id: 'vip-lanyard',
    name: 'VIP Lanyard Pass (4"×6")',
    category: 'Event Prints',
    width: 4,
    height: 6,
    unit: 'in',
    dpi: 300,
    description: 'All-Access Pass, backstage credential & badge laminate',
    recommendedStyleId: 'bold-underground',
  },
  {
    id: 'event-ticket',
    name: 'Concert Ticket / Wristband',
    category: 'Outdoor & Merch',
    width: 8,
    height: 3.2,
    unit: 'in',
    dpi: 300,
    description: 'Numbered stub pass, souvenir festival ticket & bar wristband',
    recommendedStyleId: 'cyberpunk-neon',
  },
  {
    id: 'ultrawide-billboard',
    name: 'Highway Billboard (21:9)',
    category: 'Outdoor & Merch',
    width: 3840,
    height: 1645,
    unit: 'px',
    dpi: 72,
    description: 'Ultra-wide electronic billboard & city LED display screen',
    recommendedStyleId: 'modern-minimalist',
  },
  {
    id: 'stream-banner',
    name: 'Twitch / YouTube Banner',
    category: 'Digital & Stream',
    width: 2560,
    height: 1440,
    unit: 'px',
    dpi: 72,
    description: 'High-res channel header for YouTube, Twitch & Kick stream broadcasts',
    recommendedStyleId: 'cyberpunk-neon',
  },
  {
    id: 'table-tent',
    name: 'Club Table Tent Card (4"×8")',
    category: 'Outdoor & Merch',
    width: 4,
    height: 8,
    unit: 'in',
    dpi: 300,
    description: 'Vertical drinks table card, VIP bottle service menu & lounge display',
    recommendedStyleId: 'elegant-luxury',
  },
  {
    id: 'tabloid-flyer',
    name: 'Tabloid Ledger Flyer (11"×17")',
    category: 'Event Prints',
    width: 11,
    height: 17,
    unit: 'in',
    dpi: 300,
    description: 'Large street pole flyer & bulletin board staple size',
    recommendedStyleId: 'vibrant-summer',
  },
  {
    id: 'mobile-wallpaper',
    name: 'Mobile Lockscreen (9:20)',
    category: 'Digital & Stream',
    width: 1080,
    height: 2400,
    unit: 'px',
    dpi: 72,
    description: 'Tall AMOLED smartphone wallpaper & event attendee lockscreen saver',
    recommendedStyleId: 'cyberpunk-neon',
  }
];

const CUSTOM_PRESETS_STORAGE_KEY = 'ai_poster_saved_custom_presets_v1';

/**
 * Converts any dimension from inches, cm, mm to target pixels based on DPI
 */
export function convertToPixels(value: number, unit: SizeUnit, dpi: number = 300): number {
  if (value <= 0) return 1080;
  switch (unit) {
    case 'px':
      return Math.round(value);
    case 'in':
      return Math.round(value * dpi);
    case 'cm':
      return Math.round((value / 2.54) * dpi);
    case 'mm':
      return Math.round((value / 25.4) * dpi);
    default:
      return Math.round(value);
  }
}

/**
 * Converts pixels to target unit based on DPI
 */
export function convertFromPixels(pixels: number, targetUnit: SizeUnit, dpi: number = 300): number {
  if (pixels <= 0) return 0;
  switch (targetUnit) {
    case 'px':
      return Math.round(pixels);
    case 'in':
      return Number((pixels / dpi).toFixed(2));
    case 'cm':
      return Number(((pixels / dpi) * 2.54).toFixed(2));
    case 'mm':
      return Number(((pixels / dpi) * 25.4).toFixed(1));
    default:
      return pixels;
  }
}

/**
 * Computes a human-readable aspect ratio label (e.g., "16:9", "4:5", "1:1", "2.35:1")
 */
export function computeAspectRatioLabel(width: number, height: number): string {
  if (width <= 0 || height <= 0) return '1:1';
  
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(Math.round(width), Math.round(height));
  
  const simW = Math.round(width) / divisor;
  const simH = Math.round(height) / divisor;

  // Common nice ratios
  if (simW <= 21 && simH <= 21) {
    return `${simW}:${simH}`;
  }

  const ratio = width / height;
  if (Math.abs(ratio - 1) < 0.02) return '1:1';
  if (Math.abs(ratio - 16 / 9) < 0.03) return '16:9';
  if (Math.abs(ratio - 9 / 16) < 0.03) return '9:16';
  if (Math.abs(ratio - 4 / 5) < 0.03) return '4:5';
  if (Math.abs(ratio - 5 / 4) < 0.03) return '5:4';
  if (Math.abs(ratio - 3 / 2) < 0.03) return '3:2';
  if (Math.abs(ratio - 2 / 3) < 0.03) return '2:3';
  if (Math.abs(ratio - 21 / 9) < 0.05) return '21:9';

  return `${ratio.toFixed(2)}:1`;
}

/**
 * Creates a valid PosterPreset object from custom inputs
 */
export function createCustomPosterPreset(
  name: string,
  rawWidth: number,
  rawHeight: number,
  unit: SizeUnit = 'px',
  dpi: number = 300,
  styleSnapshot?: PosterPreset['styleSnapshot']
): PosterPreset {
  const pixelWidth = convertToPixels(rawWidth, unit, dpi);
  const pixelHeight = convertToPixels(rawHeight, unit, dpi);
  const aspectRatioValue = pixelWidth / pixelHeight;
  const ratioLabel = computeAspectRatioLabel(pixelWidth, pixelHeight);

  const id = `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  let dimStr = `${rawWidth} × ${rawHeight} ${unit}`;
  if (unit !== 'px') {
    dimStr += ` (${pixelWidth}×${pixelHeight}px @ ${dpi}DPI)`;
  }

  return {
    id,
    name: name.trim() || `Custom (${ratioLabel})`,
    platform: 'Custom',
    width: pixelWidth,
    height: pixelHeight,
    aspectRatioLabel: ratioLabel,
    aspectRatioValue,
    iconName: 'Maximize2',
    description: `Custom format: ${dimStr}`,
    isCustom: true,
    unit,
    rawWidth,
    rawHeight,
    dpi,
    styleSnapshot,
  };
}

/**
 * Load user's saved custom presets from localStorage
 */
export function getSavedCustomPresets(): PosterPreset[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (err) {
    console.warn('Failed to load custom presets from localStorage:', err);
    return [];
  }
}

/**
 * Save a custom preset to localStorage
 */
export function saveCustomPresetToStorage(preset: PosterPreset): PosterPreset[] {
  try {
    const current = getSavedCustomPresets();
    const existingIdx = current.findIndex(p => p.id === preset.id);
    let updated: PosterPreset[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = preset;
    } else {
      updated = [preset, ...current];
    }
    localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save custom preset to storage:', err);
    return getSavedCustomPresets();
  }
}

/**
 * Delete a custom preset from localStorage
 */
export function deleteCustomPresetFromStorage(presetId: string): PosterPreset[] {
  try {
    const current = getSavedCustomPresets();
    const updated = current.filter(p => p.id !== presetId);
    localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete custom preset from storage:', err);
    return getSavedCustomPresets();
  }
}
