import { ColorPalette, WeatherCondition } from '../types';

export const WEATHER_CONDITIONS = [
  { id: 'sunny', name: 'Sunny & Clear Skies', icon: 'Sun', mood: 'Vibrant, Warm, Energetic' },
  { id: 'sunset', name: 'Golden Hour Sunset', icon: 'Sunset', mood: 'Warm Amber, Romantic, Glowing' },
  { id: 'rainy', name: 'Rainy & Atmospheric', icon: 'CloudRain', mood: 'Cozy, Moody, Teal & Slate' },
  { id: 'starry_night', name: 'Clear Starlight Night', icon: 'Moon', mood: 'Deep Cosmic Blue, Electric Purple' },
  { id: 'snowy', name: 'Crisp Snow & Winter', icon: 'Snowflake', mood: 'Frost White, Ice Blue, Silver' },
  { id: 'stormy', name: 'Electrifying Storm', icon: 'Zap', mood: 'Neon Yellow, Obsidian, High Energy' },
  { id: 'cloudy', name: 'Soft Overcast Breeze', icon: 'Cloud', mood: 'Muted Pastel, Soft Neutral, Minimal' },
];

export function getWeatherConditionByLocationAndDate(location: string, dateStr: string): WeatherCondition {
  const locLower = location.toLowerCase();
  
  // Hash location & date string to get deterministic seed for fallback predictions
  let hash = 0;
  const seed = (location + dateStr).toLowerCase();
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // Weather condition determination logic
  let condition: WeatherCondition['condition'] = 'sunny';
  let tempC = 22;
  let conditionName = 'Sunny & Clear';
  let description = 'Bright sunny conditions with warm pleasant breeze.';
  let clothingTip = 'Light summer attire, sunglasses recommended.';
  let colorThemeMood = 'Vibrant Golden Sun & Sky Blue Palette';

  if (locLower.includes('beach') || locLower.includes('miami') || locLower.includes('barcelona') || locLower.includes('hawaii') || locLower.includes('ibiza') || locLower.includes('cancun')) {
    const isNight = positiveHash % 3 === 0;
    if (isNight) {
      condition = 'sunset';
      tempC = 27;
      conditionName = 'Tropical Golden Sunset';
      description = 'Warm horizon glow with calm coastal breezes.';
      clothingTip = 'Stylish casual evening wear, light jackets for sunset.';
      colorThemeMood = 'Fiery Coral & Deep Indigo Dusk';
    } else {
      condition = 'sunny';
      tempC = 30;
      conditionName = 'Blazing Sun & Azure Sky';
      description = 'High UV, crystal clear skies, warm tropical warmth.';
      clothingTip = 'Stay hydrated, light breathable fabrics.';
      colorThemeMood = 'Cyan Sky & Sunburst Yellow';
    }
  } else if (locLower.includes('london') || locLower.includes('seattle') || locLower.includes('rain') || locLower.includes('dublin') || locLower.includes('vancouver')) {
    condition = 'rainy';
    tempC = 16;
    conditionName = 'Atmospheric Rain & Mist';
    description = 'Passing rain showers with glossy city light reflections.';
    clothingTip = 'Bring an umbrella, water-resistant coat.';
    colorThemeMood = 'Reflective Slate, Deep Teal & Neon Accents';
  } else if (locLower.includes('tokyo') || locLower.includes('berlin') || locLower.includes('club') || locLower.includes('night') || locLower.includes('rave')) {
    condition = 'starry_night';
    tempC = 19;
    conditionName = 'Starlight Night Skies';
    description = 'Crisp clear evening sky with vibrant neon urban glow.';
    clothingTip = 'Sleek night-out fashion, layered outfit.';
    colorThemeMood = 'Midnight Blue & Electric Violet';
  } else if (locLower.includes('aspen') || locLower.includes('iceland') || locLower.includes('alps') || locLower.includes('winter') || locLower.includes('oslo') || locLower.includes('snow')) {
    condition = 'snowy';
    tempC = -2;
    conditionName = 'Crisp Winter Alpine Snow';
    description = 'Fresh snow cover with sparkling frost atmospheric air.';
    clothingTip = 'Thermal coats, boots, cozy scarves.';
    colorThemeMood = 'Frost Platinum, Ice Cyan & Silver';
  } else {
    // Modular hash pick
    const types: WeatherCondition['condition'][] = ['sunny', 'sunset', 'starry_night', 'cloudy', 'stormy'];
    condition = types[positiveHash % types.length];
    
    if (condition === 'sunny') {
      tempC = 24 + (positiveHash % 6);
      conditionName = 'Clear & Sunlit';
      description = 'Pleasant clear weather with great outdoor visibility.';
      clothingTip = 'Comfortable daytime wear.';
      colorThemeMood = 'Sunburst Yellow & Soft Azure';
    } else if (condition === 'sunset') {
      tempC = 21 + (positiveHash % 5);
      conditionName = 'Golden Hour Sky';
      description = 'Warm dramatic lighting as dusk approaches.';
      clothingTip = 'Layered evening wear.';
      colorThemeMood = 'Amber Gold & Rose Dusk';
    } else if (condition === 'starry_night') {
      tempC = 17 + (positiveHash % 5);
      conditionName = 'Starlight Night';
      description = 'Clear night sky with sparkling stars.';
      clothingTip = 'Stylish evening coat.';
      colorThemeMood = 'Cosmic Blue & Neon Purple';
    } else if (condition === 'stormy') {
      tempC = 20 + (positiveHash % 4);
      conditionName = 'Electric Thunderstorm';
      description = 'Electrifying atmosphere with dramatic lightning skies.';
      clothingTip = 'Rainproof gear recommended.';
      colorThemeMood = 'Obsidian Black & Electric Yellow';
    } else {
      tempC = 18 + (positiveHash % 4);
      conditionName = 'Soft Overcast Breeze';
      description = 'Soft diffused natural light, mild pleasant temperature.';
      clothingTip = 'Casual cardigan or jacket.';
      colorThemeMood = 'Slate Gray & Warm Cream';
    }
  }

  const tempF = Math.round((tempC * 9/5) + 32);

  return {
    location: location || 'Event Location',
    date: dateStr || 'Event Date',
    condition,
    conditionName,
    tempC,
    tempF,
    iconName: condition === 'sunny' ? 'Sun' : condition === 'sunset' ? 'Sunset' : condition === 'rainy' ? 'CloudRain' : condition === 'snowy' ? 'Snowflake' : condition === 'stormy' ? 'Zap' : 'Moon',
    description,
    colorThemeMood,
    clothingTip
  };
}

export function generateWeatherPalettes(weather: WeatherCondition): ColorPalette[] {
  const { condition, tempC } = weather;

  // Generate 4 tailored weather palettes
  if (condition === 'sunny' || tempC > 25) {
    return [
      {
        id: 'sunny-gold',
        name: '☀️ Sunburst Gold & Sky Azure',
        description: 'Vibrant golden hour sun paired with electric cyan sky',
        bgGradient: 'linear-gradient(135deg, #FF9900 0%, #FF1E56 50%, #0A1128 100%)',
        bgColor: '#FF9900',
        primaryText: '#FFFFFF',
        secondaryText: '#FFEAA7',
        accentColor: '#00F2FE',
        cardBg: 'rgba(10, 17, 40, 0.75)',
        borderColor: 'rgba(255, 234, 167, 0.4)',
        badgeBg: '#FF1E56',
        badgeText: '#FFFFFF'
      },
      {
        id: 'tropical-teal',
        name: '🌴 Tropical Lagoon & Coral',
        description: 'Bright ocean aquamarine with punchy coral highlights',
        bgGradient: 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 50%, #00223E 100%)',
        bgColor: '#00F2FE',
        primaryText: '#FFFFFF',
        secondaryText: '#E0F7FA',
        accentColor: '#FF6B6B',
        cardBg: 'rgba(0, 34, 62, 0.8)',
        borderColor: 'rgba(79, 172, 254, 0.5)',
        badgeBg: '#FF6B6B',
        badgeText: '#FFFFFF'
      },
      {
        id: 'warm-cream',
        name: '🏖️ Daylight Beach & Terracotta',
        description: 'Sophisticated warm cream canvas with burnt orange accents',
        bgGradient: 'linear-gradient(135deg, #FFF5EB 0%, #FDE2E4 50%, #FFCAD4 100%)',
        bgColor: '#FFF5EB',
        primaryText: '#2B2D42',
        secondaryText: '#8D99AE',
        accentColor: '#D90429',
        cardBg: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(217, 4, 41, 0.25)',
        badgeBg: '#D90429',
        badgeText: '#FFFFFF'
      },
      {
        id: 'neon-summer',
        name: '⚡ Electric Solstice Cyber',
        description: 'High-visibility summer party neon pop',
        bgGradient: 'linear-gradient(135deg, #FFE600 0%, #FF007A 50%, #1A0033 100%)',
        bgColor: '#1A0033',
        primaryText: '#FFFFFF',
        secondaryText: '#FFE600',
        accentColor: '#00FFCC',
        cardBg: 'rgba(26, 0, 51, 0.85)',
        borderColor: 'rgba(0, 255, 204, 0.4)',
        badgeBg: '#00FFCC',
        badgeText: '#000000'
      }
    ];
  } else if (condition === 'sunset') {
    return [
      {
        id: 'sunset-dusk',
        name: '🌅 Horizon Dusk Amber & Magenta',
        description: 'Rich sunset gradient transition from deep orange to twilight violet',
        bgGradient: 'linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)',
        bgColor: '#FC466B',
        primaryText: '#FFFFFF',
        secondaryText: '#FFD369',
        accentColor: '#00FFF0',
        cardBg: 'rgba(15, 12, 41, 0.8)',
        borderColor: 'rgba(255, 211, 105, 0.4)',
        badgeBg: '#FFD369',
        badgeText: '#111111'
      },
      {
        id: 'copper-velvet',
        name: '🍸 Copper Sunset & Velvet Navy',
        description: 'Luxe metallic copper accents on dark starry twilight blue',
        bgGradient: 'linear-gradient(135deg, #1D2671 0%, #C33764 100%)',
        bgColor: '#1D2671',
        primaryText: '#FFFFFF',
        secondaryText: '#F8B500',
        accentColor: '#00E5FF',
        cardBg: 'rgba(18, 18, 36, 0.85)',
        borderColor: 'rgba(248, 181, 0, 0.35)',
        badgeBg: '#F8B500',
        badgeText: '#000000'
      },
      {
        id: 'rose-gold',
        name: '✨ Rose Gold Sunset Glow',
        description: 'Gentle blush pink, rose metallic and twilight mauve',
        bgGradient: 'linear-gradient(135deg, #F8A5C2 0%, #632C65 100%)',
        bgColor: '#632C65',
        primaryText: '#FFFFFF',
        secondaryText: '#F8A5C2',
        accentColor: '#FFEAA7',
        cardBg: 'rgba(40, 15, 45, 0.8)',
        borderColor: 'rgba(248, 165, 194, 0.4)',
        badgeBg: '#FFEAA7',
        badgeText: '#2D132C'
      },
      {
        id: 'cyber-sunset',
        name: '🌇 Cyberpunk City Sunset',
        description: 'High energy neon sunset grid styling',
        bgGradient: 'linear-gradient(135deg, #FF0844 0%, #FFB199 100%)',
        bgColor: '#FF0844',
        primaryText: '#FFFFFF',
        secondaryText: '#FFF',
        accentColor: '#00E5FF',
        cardBg: 'rgba(20, 0, 20, 0.85)',
        borderColor: 'rgba(0, 229, 255, 0.4)',
        badgeBg: '#00E5FF',
        badgeText: '#000000'
      }
    ];
  } else if (condition === 'rainy' || condition === 'cloudy') {
    return [
      {
        id: 'rainy-slate',
        name: '🌧️ City Rain Teal & Obsidian',
        description: 'Reflective wet pavement slate blue with vibrant neon highlights',
        bgGradient: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
        bgColor: '#0F2027',
        primaryText: '#FFFFFF',
        secondaryText: '#80E0FF',
        accentColor: '#00FFCC',
        cardBg: 'rgba(15, 32, 39, 0.85)',
        borderColor: 'rgba(128, 224, 255, 0.35)',
        badgeBg: '#00FFCC',
        badgeText: '#000000'
      },
      {
        id: 'misty-lavender',
        name: '🌫️ Misty Overcast & Lavender',
        description: 'Ethereal pastel fog with soft purple and clean monochrome text',
        bgGradient: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)',
        bgColor: '#E0C3FC',
        primaryText: '#1E1B4B',
        secondaryText: '#4338CA',
        accentColor: '#312E81',
        cardBg: 'rgba(255, 255, 255, 0.85)',
        borderColor: 'rgba(67, 56, 202, 0.25)',
        badgeBg: '#312E81',
        badgeText: '#FFFFFF'
      },
      {
        id: 'neon-rain',
        name: '☔ Cyber Rain & Neon Magenta',
        description: 'Glossy dark rain backdrop with vibrant pink and cyan neon sign look',
        bgGradient: 'linear-gradient(135deg, #000000 0%, #1A1C20 50%, #0D2137 100%)',
        bgColor: '#000000',
        primaryText: '#FFFFFF',
        secondaryText: '#FF007F',
        accentColor: '#00F0FF',
        cardBg: 'rgba(10, 10, 15, 0.9)',
        borderColor: 'rgba(255, 0, 127, 0.5)',
        badgeBg: '#FF007F',
        badgeText: '#FFFFFF'
      },
      {
        id: 'cozy-espresso',
        name: '☕ Cozy Rain & Dark Espresso',
        description: 'Warm cafe acoustics and rainy lounge vibes',
        bgGradient: 'linear-gradient(135deg, #2C1810 0%, #3D2314 50%, #1A0D08 100%)',
        bgColor: '#2C1810',
        primaryText: '#FFFFFF',
        secondaryText: '#E6CCB2',
        accentColor: '#D4A373',
        cardBg: 'rgba(26, 13, 8, 0.85)',
        borderColor: 'rgba(212, 163, 115, 0.35)',
        badgeBg: '#D4A373',
        badgeText: '#1A0D08'
      }
    ];
  } else if (condition === 'starry_night') {
    return [
      {
        id: 'cosmic-purple',
        name: '🌌 Starlight Indigo & Galactic Violet',
        description: 'Deep space night sky with brilliant purple aurora shimmer',
        bgGradient: 'linear-gradient(135deg, #050515 0%, #1A0B2E 50%, #311150 100%)',
        bgColor: '#050515',
        primaryText: '#FFFFFF',
        secondaryText: '#D8B4FE',
        accentColor: '#22D3EE',
        cardBg: 'rgba(15, 8, 30, 0.85)',
        borderColor: 'rgba(216, 180, 254, 0.4)',
        badgeBg: '#A855F7',
        badgeText: '#FFFFFF'
      },
      {
        id: 'midnight-gold',
        name: '🌌 Midnight Velvet & Gold Stars',
        description: 'Premium dark blue velvet with glowing gold constellations',
        bgGradient: 'linear-gradient(135deg, #0B132B 0%, #1C2541 100%)',
        bgColor: '#0B132B',
        primaryText: '#FFFFFF',
        secondaryText: '#F4D03F',
        accentColor: '#F5B041',
        cardBg: 'rgba(11, 19, 43, 0.85)',
        borderColor: 'rgba(244, 208, 63, 0.4)',
        badgeBg: '#F4D03F',
        badgeText: '#0B132B'
      },
      {
        id: 'neon-tokyo-night',
        name: '🗼 Tokyo Midnight Neon',
        description: 'Ultra dark night backdrop with cyan and electric pink glow',
        bgGradient: 'linear-gradient(135deg, #020208 0%, #0A0A1A 100%)',
        bgColor: '#020208',
        primaryText: '#FFFFFF',
        secondaryText: '#38BDF8',
        accentColor: '#F43F5E',
        cardBg: 'rgba(10, 10, 26, 0.9)',
        borderColor: 'rgba(56, 189, 248, 0.5)',
        badgeBg: '#F43F5E',
        badgeText: '#FFFFFF'
      },
      {
        id: 'cyber-underground',
        name: '🎧 Dark Rave & Lime Electric',
        description: 'High voltage club rave night style',
        bgGradient: 'linear-gradient(135deg, #0A0A0A 0%, #171717 100%)',
        bgColor: '#0A0A0A',
        primaryText: '#FFFFFF',
        secondaryText: '#A3E635',
        accentColor: '#22D3EE',
        cardBg: 'rgba(23, 23, 23, 0.9)',
        borderColor: 'rgba(163, 230, 53, 0.5)',
        badgeBg: '#A3E635',
        badgeText: '#000000'
      }
    ];
  } else {
    // Snowy / Stormy
    return [
      {
        id: 'frost-cyan',
        name: '❄️ Frost Cyan & Glacier White',
        description: 'Crisp ice blue with sparkling frost highlights',
        bgGradient: 'linear-gradient(135deg, #00223E 0%, #1D976C 100%)',
        bgColor: '#00223E',
        primaryText: '#FFFFFF',
        secondaryText: '#E0F7FA',
        accentColor: '#00E5FF',
        cardBg: 'rgba(0, 34, 62, 0.85)',
        borderColor: 'rgba(0, 229, 255, 0.4)',
        badgeBg: '#00E5FF',
        badgeText: '#00223E'
      },
      {
        id: 'storm-lightning',
        name: '⚡ Stormy Obsidian & Electric Lightning',
        description: 'Dark storm clouds with flash yellow power accent',
        bgGradient: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A24 100%)',
        bgColor: '#0F0F0F',
        primaryText: '#FFFFFF',
        secondaryText: '#FACC15',
        accentColor: '#38BDF8',
        cardBg: 'rgba(20, 20, 30, 0.9)',
        borderColor: 'rgba(250, 204, 21, 0.5)',
        badgeBg: '#FACC15',
        badgeText: '#000000'
      },
      {
        id: 'silver-alpine',
        name: '🏔️ Silver Alpine & Midnight Steel',
        description: 'Clean high contrast metallic winter look',
        bgGradient: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        bgColor: '#1E293B',
        primaryText: '#FFFFFF',
        secondaryText: '#94A3B8',
        accentColor: '#38BDF8',
        cardBg: 'rgba(30, 41, 59, 0.85)',
        borderColor: 'rgba(148, 163, 184, 0.3)',
        badgeBg: '#38BDF8',
        badgeText: '#0F172A'
      },
      {
        id: 'polar-aurora',
        name: '🌌 Polar Aurora Borealis',
        description: 'Stunning green and cyan sky glow',
        bgGradient: 'linear-gradient(135deg, #052A24 0%, #031815 100%)',
        bgColor: '#052A24',
        primaryText: '#FFFFFF',
        secondaryText: '#34D399',
        accentColor: '#22D3EE',
        cardBg: 'rgba(3, 24, 21, 0.85)',
        borderColor: 'rgba(52, 211, 153, 0.4)',
        badgeBg: '#34D399',
        badgeText: '#031815'
      }
    ];
  }
}
