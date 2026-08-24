export interface FontPairing {
  id: string;
  name: string;
  category: 'Music Festival' | 'Corporate' | 'Theatre & Gala' | 'Casual & Community' | 'Nightlife' | 'Fitness & Sports' | 'Universal';
  headlineFont: string;
  headlineFontLabel: string;
  bodyFont: string;
  bodyFontLabel: string;
  rationale: string;
  tag: string;
  sampleHeadline: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: 'cinema-bebas-inter',
    name: 'Festival Block & Geometric Sans',
    category: 'Music Festival',
    headlineFont: "'Bebas Neue', sans-serif",
    headlineFontLabel: 'Bebas Neue',
    bodyFont: "'Inter', sans-serif",
    bodyFontLabel: 'Inter Sans',
    rationale: 'Tall, condensed uppercase header creates high visual impact for event names, balanced by ultra-clean, legible body typography for schedule details.',
    tag: 'Best for Outdoor Festivals & Live Concerts',
    sampleHeadline: 'SUMMER SOLSTICE FEST'
  },
  {
    id: 'theatre-cinzel-cormorant',
    name: 'Imperial Cinzel & Royal Serif',
    category: 'Theatre & Gala',
    headlineFont: "'Cinzel', serif",
    headlineFontLabel: 'Cinzel Decorative',
    bodyFont: "'Cormorant Garamond', serif",
    bodyFontLabel: 'Cormorant Garamond',
    rationale: 'Classical proportions with sharp serifs evoke grandeur, drama, and high culture. Ideal for opera, gala premieres, and luxury classical performances.',
    tag: 'Ideal for Theatre, Symphony & Opera',
    sampleHeadline: 'BROADWAY PREMIERE GALA'
  },
  {
    id: 'cyber-anton-jetbrains',
    name: 'Cyber Heavy & Tech Monospace',
    category: 'Nightlife',
    headlineFont: "'Anton', sans-serif",
    headlineFontLabel: 'Anton Heavy',
    bodyFont: "'JetBrains Mono', monospace",
    bodyFontLabel: 'JetBrains Mono',
    rationale: 'Maximum visual weight display font commands immediate attention in dark club environments, paired with precise technical code font for DJ lineups.',
    tag: 'Recommended for Underground EDM & Techno Raves',
    sampleHeadline: 'CYBERPUNK WAREHOUSE RAVE'
  },
  {
    id: 'editorial-playfair-jakarta',
    name: 'Editorial Playfair & Modern Sans',
    category: 'Casual & Community',
    headlineFont: "'Playfair Display', serif",
    headlineFontLabel: 'Playfair Display',
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    bodyFontLabel: 'Plus Jakarta',
    rationale: 'Warm, high-contrast serif headline paired with humanist sans-serif body delivers an inviting, artisanal aesthetic with pristine readability.',
    tag: 'Perfect for Coffee Sessions, Folk & Local Markets',
    sampleHeadline: 'COZY ACOUSTIC SESSIONS'
  },
  {
    id: 'tech-spacegrotesk-inter',
    name: 'Tech Grotesk & Neutral Sans',
    category: 'Corporate',
    headlineFont: "'Space Grotesk', sans-serif",
    headlineFontLabel: 'Space Grotesk',
    bodyFont: "'Inter', sans-serif",
    bodyFontLabel: 'Inter',
    rationale: 'Proportional geometric display with distinct character angles conveys innovation and authority, complemented by highly structured neutral body text.',
    tag: 'Top Pick for AI Conferences & Tech Keynotes',
    sampleHeadline: 'GLOBAL AI INNOVATORS SUMMIT'
  },
  {
    id: 'fitness-syne-oswald',
    name: 'High-Octane Syne & Condensed Oswald',
    category: 'Fitness & Sports',
    headlineFont: "'Syne', sans-serif",
    headlineFontLabel: 'Syne Extra Bold',
    bodyFont: "'Oswald', sans-serif",
    bodyFontLabel: 'Oswald Condensed',
    rationale: 'Ultra-wide expressive display headers paired with athletic condensed body font create motion, energy, and physical dynamism.',
    tag: 'Designed for Fitness Expos & Sports Championships',
    sampleHeadline: 'CROSSFIT CHAMPIONSHIP 2026'
  },
  {
    id: 'lounge-cormorant-lora',
    name: 'Velvet Cormorant & Soft Lora',
    category: 'Casual & Community',
    headlineFont: "'Cormorant Garamond', serif",
    headlineFontLabel: 'Cormorant Garamond',
    bodyFont: "'Lora', serif",
    bodyFontLabel: 'Lora Soft Serif',
    rationale: 'Graceful contrast ratio and subtle italic flourishes set an intimate, relaxing mood for wine tastings, jazz lounges, and VIP dining.',
    tag: 'Great for Jazz Lounges & Wine Tastings',
    sampleHeadline: 'PINOT NOIR & JAZZ NIGHT'
  },
  {
    id: 'urban-montserrat-outfit',
    name: 'Urban Outfit & Geometric Montserrat',
    category: 'Universal',
    headlineFont: "'Outfit', sans-serif",
    headlineFontLabel: 'Outfit Heavy',
    bodyFont: "'Montserrat', sans-serif",
    bodyFontLabel: 'Montserrat',
    rationale: 'Modern geometric curves paired with structured grotesque body create a versatile, contemporary look suitable for diverse event types.',
    tag: 'Versatile All-Rounder for Modern Events',
    sampleHeadline: 'NEIGHBORHOOD BLOCK PARTY'
  }
];
