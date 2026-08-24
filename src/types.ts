export interface EventDetails {
  event?: string;
  venue: string;
  artist1?: string;
  artist2?: string;
  artist3?: string;
  artist4?: string;
  date: string;
  time: string;
  ticketUrl?: string;
  // Secondary / Optional compatibility fields
  title?: string;
  subtitle?: string;
  category?: string;
  displayDate?: string;
  location?: string;
  address?: string;
  ticketPrice?: string;
  organizer?: string;
  callToAction?: string;
  qrCodeLink?: string;
  contactInfo?: string;
  description?: string;
}

export interface WeatherCondition {
  location: string;
  date: string;
  condition: 'sunny' | 'rainy' | 'cloudy' | 'sunset' | 'snowy' | 'stormy' | 'starry_night' | 'foggy';
  conditionName: string;
  tempC: number;
  tempF: number;
  iconName: string;
  description: string;
  colorThemeMood: string;
  clothingTip: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  bgGradient: string; // CSS gradient string
  bgColor: string; // solid hex
  primaryText: string;
  secondaryText: string;
  accentColor: string;
  cardBg: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}

export interface PosterPreset {
  id: string;
  name: string;
  platform: 'Instagram' | 'Facebook' | 'Print' | 'Universal' | 'TikTok' | 'Custom';
  width: number;
  height: number;
  aspectRatioLabel: string;
  aspectRatioValue: number; // width / height
  iconName: string;
  description: string;
  isCustom?: boolean;
  unit?: 'px' | 'in' | 'cm' | 'mm';
  rawWidth?: number;
  rawHeight?: number;
  dpi?: number;
  styleSnapshot?: {
    styleId?: string;
    textScale?: number;
    badgePosition?: 'top_split' | 'top_center' | 'top_left_stacked' | 'bottom_bar' | 'inline_compact';
    layoutDensity?: 'compact' | 'normal' | 'spacious';
    borderStyle?: 'none' | 'thin' | 'double' | 'bold_frame' | 'accent_corners';
  };
}

export type LayoutStyle = 'centered_bold' | 'split_photo' | 'magazine_minimal' | 'neon_badge' | 'modern_grid' | 'retro_flyer' | 'poster_headline';

export interface PosterStyleConfig {
  id: string;
  name: string;
  description: string;
  fontHeader: string; // CSS font family
  fontBody: string;
  layoutStyle: LayoutStyle;
  defaultBgType: 'gradient' | 'ai_image' | 'solid' | 'pattern';
  themeMood: string;
}

export type AntiAiTextureType = 'none' | 'risograph' | 'matte_grain' | 'analog_film' | 'halftone' | 'recycled_paper';

export interface PosterDesignState {
  preset: PosterPreset;
  details: EventDetails;
  weather: WeatherCondition | null;
  palette: ColorPalette;
  style: PosterStyleConfig;
  bgType: 'gradient' | 'ai_image' | 'solid' | 'pattern' | 'upload';
  bgImageUrl: string;
  bgPrompt: string;
  overlayOpacity: number; // 0 to 1
  blurAmount: number; // 0 to 20px
  showQrCode: boolean;
  showWeatherBadge: boolean;
  showCategoryBadge: boolean;
  showGridOverlay: boolean;
  borderStyle: 'none' | 'thin' | 'double' | 'bold_frame' | 'accent_corners';
  badgePosition?: 'top_split' | 'top_center' | 'top_left_stacked' | 'bottom_bar' | 'inline_compact';
  layoutDensity?: 'compact' | 'normal' | 'spacious';
  autoAdaptLayout?: boolean;
  customFontHeader: string;
  customFontBody: string;
  textScale: number; // 0.8 to 1.4
  titleUppercase: boolean;
  badgeText: string;

  // Background Hidden Professional Graphic Designer AI (Venue Art Director & Snob-Proof Engine)
  venueAiGuardEnabled?: boolean;
  antiAiTexture?: AntiAiTextureType;
  venueCredibilityBar?: boolean;
  promoterText?: string;
  venueLegalNotice?: string;
  showBarcode?: boolean;
  printBleedGuideVisible?: boolean;
  opticalKerning?: boolean;
  antiSlopCalibrated?: boolean;
}

export interface ArtDirectorAuditItem {
  id: string;
  category: 'texture' | 'typography' | 'contrast' | 'margins' | 'credibility' | 'color_gamut';
  label: string;
  status: 'pass' | 'warning' | 'alert';
  score: number; // 0 - 100
  critique: string;
  suggestion: string;
  autoFixAvailable?: boolean;
  autoFixAction?: string;
}

export interface ArtDirectorAuditResult {
  overallScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'REJECT';
  verdict: 'Studio Masterpiece' | 'Gallery & Club Approved' | 'Slight AI Hallmarks' | 'High Risk of Venue Rejection';
  summary: string;
  items: ArtDirectorAuditItem[];
  snobProofConfidence: number; // e.g. 98%
  timestamp: string;
}

export interface SavedPoster {
  id: string;
  title: string;
  dateCreated: string;
  thumbnailUrl: string;
  designState: PosterDesignState;
}

export type EventRecurrenceType = 'monthly' | 'annual' | 'weekly' | 'biweekly' | 'custom';

export interface SavedEventProfile {
  id: string;
  name: string; // e.g. "Monthly Deep House Lounge" or "Annual Summer Solstice Fest"
  recurrence: EventRecurrenceType;
  details: EventDetails;
  createdAt: string;
  lastUsedDate?: string;
  editionCount?: number; // e.g. Vol. 4 or 2026 Edition
}

export interface WebGroundingSource {
  title: string;
  url: string;
  domain: string;
  type?: 'social' | 'music' | 'venue' | 'news' | 'web';
}

export interface ArtistIntel {
  name: string;
  genre: string;
  aesthetic: string;
  recentWork?: string;
  socialVibe: string;
  signatureColors: string[];
}

export interface VenueIntel {
  name: string;
  city?: string;
  atmosphere: string;
  crowdCulture: string;
  recommendedVisualMood: string;
}

export interface SocialBuzzIntel {
  trendingHashtags: string[];
  communityVibe: string;
  sampleTaglines: string[];
}

export interface PosterDesignInspiration {
  recommendedStyleId: string;
  styleName: string;
  reasoning: string;
  recommendedFonts: {
    headerFont: string;
    bodyFont: string;
    reasoning: string;
  };
  customPalette: ColorPalette;
  backdropArtPrompt: string;
  badgeSuggestion: string;
  antiAiTextureSuggestion: AntiAiTextureType;
  suggestedPromoterCredit: string;
  suggestedLegalLine: string;
}

export interface WebSocialIntelResult {
  query: string;
  researchedAt: string;
  primaryArtist?: ArtistIntel;
  supportingArtists?: ArtistIntel[];
  venue?: VenueIntel;
  socialBuzz: SocialBuzzIntel;
  inspiration: PosterDesignInspiration;
  sources: WebGroundingSource[];
  summary: string;
}
