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
  platform: 'Instagram' | 'Facebook' | 'Print' | 'Universal' | 'TikTok';
  width: number;
  height: number;
  aspectRatioLabel: string;
  aspectRatioValue: number; // width / height
  iconName: string;
  description: string;
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
  customFontHeader: string;
  customFontBody: string;
  textScale: number; // 0.8 to 1.4
  titleUppercase: boolean;
  badgeText: string;
}

export interface SavedPoster {
  id: string;
  title: string;
  dateCreated: string;
  thumbnailUrl: string;
  designState: PosterDesignState;
}
