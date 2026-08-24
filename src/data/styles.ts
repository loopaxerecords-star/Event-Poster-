import { PosterStyleConfig } from '../types';

export const POSTER_STYLES: PosterStyleConfig[] = [
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk & Neon Night',
    description: 'High-contrast glowing neon aesthetic, futuristic condensed headers & dark cyber backdrop',
    fontHeader: "'Impact', 'Arial Black', sans-serif",
    fontBody: "'Courier New', monospace",
    layoutStyle: 'neon_badge',
    defaultBgType: 'gradient',
    themeMood: 'Futuristic, Energetic, Club Night, Tech & Music'
  },
  {
    id: 'modern-minimalist',
    name: 'Modern Swiss Minimalist',
    description: 'Ultra-clean grid layout, bold typography, high negative space, editorial look',
    fontHeader: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontBody: "system-ui, -apple-system, sans-serif",
    layoutStyle: 'magazine_minimal',
    defaultBgType: 'solid',
    themeMood: 'Sophisticated, Design, Art Exhibition, Workshop, Business'
  },
  {
    id: 'retro-synthwave',
    name: '80s Retro Synthwave',
    description: 'Chroma gradients, vintage grid overlays, sunset glows and nostalgia vibes',
    fontHeader: "'Trebuchet MS', 'Arial Black', sans-serif",
    fontBody: "'Courier New', monospace",
    layoutStyle: 'retro_flyer',
    defaultBgType: 'gradient',
    themeMood: 'Nostalgic, Party, Arcade, Vinyl & 80s Disco'
  },
  {
    id: 'elegant-luxury',
    name: 'Elegant Gold & Velvet',
    description: 'Classy serif typography, rich dark navy/charcoal backgrounds with gold/bronze highlights',
    fontHeader: "'Georgia', 'Times New Roman', serif",
    fontBody: "'Georgia', serif",
    layoutStyle: 'centered_bold',
    defaultBgType: 'gradient',
    themeMood: 'Gala, Wine Tasting, Jazz Lounge, VIP Premiere, Classical'
  },
  {
    id: 'vibrant-summer',
    name: 'Vibrant Festival Sunburst',
    description: 'Bright tropical hues, energetic expressive typography, festive beach and summer spirit',
    fontHeader: "'Arial Black', 'Impact', sans-serif",
    fontBody: "system-ui, sans-serif",
    layoutStyle: 'poster_headline',
    defaultBgType: 'gradient',
    themeMood: 'Beach Party, Summer Fest, Carnival, Live Concert'
  },
  {
    id: 'bold-underground',
    name: 'Bold Underground Techno',
    description: 'Raw high-contrast industrial style, heavy mono typography, dark texture grunge',
    fontHeader: "'Courier New', 'Consolas', monospace",
    fontBody: "'Courier New', monospace",
    layoutStyle: 'modern_grid',
    defaultBgType: 'gradient',
    themeMood: 'Warehouse Rave, Underground DJ, Punk, Alternative'
  },
  {
    id: 'corporate-tech',
    name: 'Corporate & Tech Summit',
    description: 'Trustworthy deep blue and cyan accents, clean structured layout, professional badges',
    fontHeader: "system-ui, -apple-system, sans-serif",
    fontBody: "system-ui, sans-serif",
    layoutStyle: 'split_photo',
    defaultBgType: 'pattern',
    themeMood: 'Conference, Hackathon, AI Keynote, Business Network'
  },
  {
    id: 'organic-nature',
    name: 'Organic Earth & Boho',
    description: 'Earthy terracotta, sage green, warm cream backdrop, rounded botanical feel',
    fontHeader: "'Georgia', serif",
    fontBody: "system-ui, sans-serif",
    layoutStyle: 'magazine_minimal',
    defaultBgType: 'solid',
    themeMood: 'Wellness, Yoga Retreat, Farmers Market, Acoustic'
  }
];
