import { PosterPreset, PosterDesignState } from '../types';

export type BadgePosition = 'top_split' | 'top_center' | 'top_left_stacked' | 'bottom_bar' | 'inline_compact';
export type LayoutDensity = 'compact' | 'normal' | 'spacious';

export interface LayoutAdjustmentSuggestion {
  presetId: string;
  presetName: string;
  aspectRatioLabel: string;
  orientation: 'tall_story' | 'portrait' | 'square' | 'landscape' | 'panoramic';
  suggestedTextScale: number;
  suggestedBadgePosition: BadgePosition;
  suggestedDensity: LayoutDensity;
  badgePositionName: string;
  summary: string;
  keyAdjustments: string[];
  appliedDescription: string;
}

/**
 * Computes the recommended layout and typography adjustments for a given poster aspect ratio preset.
 */
export function getLayoutSuggestionForPreset(preset: PosterPreset): LayoutAdjustmentSuggestion {
  const ratio = preset.aspectRatioValue;

  if (ratio <= 0.65) {
    // 9:16 Story / TikTok
    return {
      presetId: preset.id,
      presetName: preset.name,
      aspectRatioLabel: preset.aspectRatioLabel,
      orientation: 'tall_story',
      suggestedTextScale: 1.2,
      suggestedBadgePosition: 'top_center',
      suggestedDensity: 'spacious',
      badgePositionName: 'Top Centered',
      summary: 'Vertical 9:16 Story: Headroom allows larger text scale (+20%) and centered badges.',
      keyAdjustments: [
        'Text Scale: 1.20x (+20% headline punch)',
        'Badges: Centered top grouping',
        'Spacing: Spacious vertical breathing room',
      ],
      appliedDescription: 'Auto-scaled headline text to 1.2x and centered top badges for full-screen mobile stories.',
    };
  }

  if (ratio > 0.65 && ratio <= 0.85) {
    // 4:5 Instagram Portrait / A4 Flyer
    return {
      presetId: preset.id,
      presetName: preset.name,
      aspectRatioLabel: preset.aspectRatioLabel,
      orientation: 'portrait',
      suggestedTextScale: preset.id === 'a4-flyer' ? 1.1 : 1.05,
      suggestedBadgePosition: 'top_split',
      suggestedDensity: preset.id === 'a4-flyer' ? 'spacious' : 'normal',
      badgePositionName: 'Top Split Corners',
      summary: 'Portrait Format: Balanced text scale (+5%) with split top badges for feed prominence.',
      keyAdjustments: [
        `Text Scale: ${(preset.id === 'a4-flyer' ? 1.1 : 1.05).toFixed(2)}x`,
        'Badges: Top split corners (Category left, Weather right)',
        'Spacing: Balanced feed layout',
      ],
      appliedDescription: `Optimized layout for ${preset.name} with ${(preset.id === 'a4-flyer' ? 1.1 : 1.05).toFixed(2)}x text scale and split corner badges.`,
    };
  }

  if (ratio > 0.85 && ratio <= 1.2) {
    // 1:1 Square
    return {
      presetId: preset.id,
      presetName: preset.name,
      aspectRatioLabel: preset.aspectRatioLabel,
      orientation: 'square',
      suggestedTextScale: 1.0,
      suggestedBadgePosition: 'top_split',
      suggestedDensity: 'normal',
      badgePositionName: 'Top Split Corners',
      summary: 'Square 1:1: Standard 1.0x text scale with balanced symmetric proportions.',
      keyAdjustments: [
        'Text Scale: 1.00x (Standard baseline)',
        'Badges: Top split corners',
        'Spacing: Standard balanced margins',
      ],
      appliedDescription: 'Reset text scale to 1.0x with balanced symmetrical spacing for square grid feeds.',
    };
  }

  if (ratio > 1.2 && ratio <= 2.2) {
    // 16:9 Landscape / Facebook Event
    return {
      presetId: preset.id,
      presetName: preset.name,
      aspectRatioLabel: preset.aspectRatioLabel,
      orientation: 'landscape',
      suggestedTextScale: 0.85,
      suggestedBadgePosition: 'inline_compact',
      suggestedDensity: 'compact',
      badgePositionName: 'Inline Compact',
      summary: 'Wide Landscape: Reduced text scale (0.85x) & inline badges prevent vertical clipping.',
      keyAdjustments: [
        'Text Scale: 0.85x (Prevents vertical overflow)',
        'Badges: Inline compact horizontal row',
        'Spacing: Compact vertical padding',
      ],
      appliedDescription: 'Compacted headline to 0.85x and shifted badges to inline layout to fit wide landscape frames.',
    };
  }

  // Extreme Panoramic (> 2.2, e.g. 3:1 Twitter Header)
  return {
    presetId: preset.id,
    presetName: preset.name,
    aspectRatioLabel: preset.aspectRatioLabel,
    orientation: 'panoramic',
    suggestedTextScale: 0.75,
    suggestedBadgePosition: 'inline_compact',
    suggestedDensity: 'compact',
    badgePositionName: 'Inline Compact',
    summary: 'Panoramic 3:1: Ultra-compact text scale (0.75x) with horizontal info alignment.',
    keyAdjustments: [
      'Text Scale: 0.75x (Ultra-compact for narrow height)',
      'Badges: Streamlined inline pill badge',
      'Spacing: Ultra-compact horizontal flow',
    ],
    appliedDescription: 'Adjusted text scale to 0.75x with condensed horizontal layout for wide banner dimensions.',
  };
}

/**
 * Returns a new design state with the optimal layout adjustments applied for a preset.
 */
export function applyLayoutAdjustments(
  currentDesign: PosterDesignState,
  targetPreset: PosterPreset
): PosterDesignState {
  const suggestion = getLayoutSuggestionForPreset(targetPreset);

  return {
    ...currentDesign,
    preset: targetPreset,
    textScale: suggestion.suggestedTextScale,
    badgePosition: suggestion.suggestedBadgePosition,
    layoutDensity: suggestion.suggestedDensity,
  };
}
