import { 
  EventDetails, 
  PosterDesignState, 
  WebSocialIntelResult, 
  ColorPalette, 
  PosterStyleConfig 
} from '../types';
import { POSTER_STYLES } from '../data/styles';

const intelCache = new Map<string, WebSocialIntelResult>();

export function getIntelCacheKey(details: EventDetails): string {
  const parts = [
    details.artist1?.trim().toLowerCase() || '',
    details.artist2?.trim().toLowerCase() || '',
    details.venue?.trim().toLowerCase() || '',
    details.event?.trim().toLowerCase() || '',
    details.location?.trim().toLowerCase() || '',
  ];
  return parts.filter(Boolean).join('|');
}

/**
 * Fetch real-world web and social media intelligence grounded via Google Search
 */
export async function fetchWebSocialIntelligence(
  details: EventDetails,
  forceRefresh: boolean = false
): Promise<WebSocialIntelResult> {
  const cacheKey = getIntelCacheKey(details);
  if (!cacheKey) {
    throw new Error('Please enter at least an artist, venue, or event name to search.');
  }

  if (!forceRefresh && intelCache.has(cacheKey)) {
    return intelCache.get(cacheKey)!;
  }

  const response = await fetch('/api/ai/web-social-intel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ details }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to research web & social data (${response.status})`);
  }

  const result = await response.json();
  if (!result.success || !result.data) {
    throw new Error('Invalid response structure received from research API.');
  }

  const intelData: WebSocialIntelResult = result.data;
  intelCache.set(cacheKey, intelData);
  return intelData;
}

/**
 * Apply full researched inspiration (palette, typography, backdrop prompt, promoter credits, badge)
 * to current poster design state.
 */
export function applyFullInspirationToDesign(
  currentDesign: PosterDesignState,
  intel: WebSocialIntelResult
): PosterDesignState {
  const inspiration = intel.inspiration;
  if (!inspiration) return currentDesign;

  // Find matching style preset if available
  const matchingStyle = POSTER_STYLES.find((s) => s.id === inspiration.recommendedStyleId) || currentDesign.style;

  const updated: PosterDesignState = {
    ...currentDesign,
    palette: inspiration.customPalette || currentDesign.palette,
    style: matchingStyle,
    customFontHeader: inspiration.recommendedFonts?.headerFont || currentDesign.customFontHeader,
    customFontBody: inspiration.recommendedFonts?.bodyFont || currentDesign.customFontBody,
    bgPrompt: inspiration.backdropArtPrompt || currentDesign.bgPrompt,
    badgeText: inspiration.badgeSuggestion || currentDesign.badgeText,
    antiAiTexture: inspiration.antiAiTextureSuggestion || currentDesign.antiAiTexture || 'matte_grain',
    promoterText: inspiration.suggestedPromoterCredit || currentDesign.promoterText,
    venueLegalNotice: inspiration.suggestedLegalLine || currentDesign.venueLegalNotice,
    venueCredibilityBar: true,
  };

  // If subtitle or taglines exist and event subtitle is empty or generic, insert first sample tagline
  if (
    intel.socialBuzz?.sampleTaglines?.length > 0 &&
    (!currentDesign.details.subtitle || currentDesign.details.subtitle === currentDesign.details.event)
  ) {
    updated.details = {
      ...currentDesign.details,
      subtitle: intel.socialBuzz.sampleTaglines[0],
    };
  }

  return updated;
}
