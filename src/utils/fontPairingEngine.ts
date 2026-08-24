import { FontPairing, FONT_PAIRINGS } from '../data/fontPairings';
import { EventDetails, PosterStyleConfig } from '../types';

export interface FontRecommendation {
  recommendedPairing: FontPairing;
  reasoning: string;
  matchScore: number;
  alternativePairings: FontPairing[];
}

/**
 * Suggests the optimal font pairing based on active Poster Style & Event Details
 */
export function recommendFontPairing(
  style: PosterStyleConfig,
  details: EventDetails
): FontRecommendation {
  const categoryLower = (details.category || '').toLowerCase();
  const titleLower = (details.title || '').toLowerCase();
  const descLower = (details.description || '').toLowerCase();
  const styleId = style.id;

  let bestMatch: FontPairing = FONT_PAIRINGS[0];
  let reasoning = 'Selected for high headline contrast and clean body legibility.';

  // 1. Check for Theatre & Gala / Classical
  if (
    categoryLower.includes('theatre') ||
    categoryLower.includes('theater') ||
    categoryLower.includes('opera') ||
    categoryLower.includes('gala') ||
    categoryLower.includes('symphony') ||
    categoryLower.includes('classical') ||
    styleId === 'elegant-luxury'
  ) {
    bestMatch = FONT_PAIRINGS.find(f => f.id === 'theatre-cinzel-cormorant') || FONT_PAIRINGS[1];
    reasoning = 'Cinzel & Cormorant Garamond evoke classical drama, elegance, and stage artistry for gala and theatre productions.';
  }
  // 2. Check for Cyberpunk / Rave / Nightlife
  else if (
    categoryLower.includes('cyber') ||
    categoryLower.includes('rave') ||
    categoryLower.includes('techno') ||
    categoryLower.includes('dj') ||
    categoryLower.includes('club') ||
    categoryLower.includes('night') ||
    styleId === 'cyberpunk-neon' ||
    styleId === 'bold-underground'
  ) {
    bestMatch = FONT_PAIRINGS.find(f => f.id === 'cyber-anton-jetbrains') || FONT_PAIRINGS[2];
    reasoning = 'Anton Heavy & JetBrains Monospace provide ultra-bold headline impact with precise code-like line details for nightlife & EDM events.';
  }
  // 3. Check for Corporate / Tech / Summit
  else if (
    categoryLower.includes('tech') ||
    categoryLower.includes('corporate') ||
    categoryLower.includes('summit') ||
    categoryLower.includes('conference') ||
    categoryLower.includes('ai') ||
    categoryLower.includes('business') ||
    styleId === 'corporate-tech'
  ) {
    bestMatch = FONT_PAIRINGS.find(f => f.id === 'tech-spacegrotesk-inter') || FONT_PAIRINGS[4];
    reasoning = 'Space Grotesk & Inter deliver a trustworthy, forward-looking tech conference presentation with immaculate body readability.';
  }
  // 4. Check for Acoustic / Casual / Coffee / Farmers Market
  else if (
    categoryLower.includes('acoustic') ||
    categoryLower.includes('coffee') ||
    categoryLower.includes('folk') ||
    categoryLower.includes('market') ||
    categoryLower.includes('casual') ||
    categoryLower.includes('community') ||
    styleId === 'organic-nature'
  ) {
    bestMatch = FONT_PAIRINGS.find(f => f.id === 'editorial-playfair-jakarta') || FONT_PAIRINGS[3];
    reasoning = 'Playfair Display & Plus Jakarta Sans pair artisanal serif warmth with clean geometric body text for casual & community gatherings.';
  }
  // 5. Check for Fitness / Sports / Wellness
  else if (
    categoryLower.includes('fitness') ||
    categoryLower.includes('crossfit') ||
    categoryLower.includes('sport') ||
    categoryLower.includes('expo') ||
    categoryLower.includes('run')
  ) {
    bestMatch = FONT_PAIRINGS.find(f => f.id === 'fitness-syne-oswald') || FONT_PAIRINGS[5];
    reasoning = 'Syne & Oswald Condensed convey explosive athletic energy and bold physical presence.';
  }
  // 6. Check for Jazz / Wine / Lounge
  else if (
    categoryLower.includes('jazz') ||
    categoryLower.includes('wine') ||
    categoryLower.includes('lounge') ||
    categoryLower.includes('tasting')
  ) {
    bestMatch = FONT_PAIRINGS.find(f => f.id === 'lounge-cormorant-lora') || FONT_PAIRINGS[6];
    reasoning = 'Cormorant & Lora offer an intimate, relaxing serif aesthetic perfect for acoustic jazz and wine evenings.';
  }
  // 7. Default Music Festival / Concert
  else {
    bestMatch = FONT_PAIRINGS.find(f => f.id === 'cinema-bebas-inter') || FONT_PAIRINGS[0];
    reasoning = 'Bebas Neue & Inter deliver classic festival poster grandeur with high-contrast, condensed headlines for maximum crowd visibility.';
  }

  const alternativePairings = FONT_PAIRINGS.filter(f => f.id !== bestMatch.id);

  return {
    recommendedPairing: bestMatch,
    reasoning,
    matchScore: 98,
    alternativePairings,
  };
}
