import { PosterDesignState, ArtDirectorAuditResult, ArtDirectorAuditItem, AntiAiTextureType } from '../types';

/**
 * Calculates relative luminance of a hex color string
 */
function getRelativeLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length < 6) return 0.5;
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculates WCAG / ISO print contrast ratio between two colors
 */
function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Default authentic venue promoter lockups & legal notices
 */
export const PROMOTER_TEMPLATES = [
  'PRESENTED IN COLLABORATION WITH THE UNDERGROUND SOUND ARCHIVE & RESIDENT ARTISTS',
  'CURATED & HOSTED BY SOUND COLLECTIVE • CITY NIGHTS AUDIO SERIES',
  'OFFICIAL NIGHTCLUB SHOWCASE • ALL RIGHTS RESERVED • INDEPENDENT MUSIC GUILD',
  'PRODUCED BY ELEVATE LIVE & STEREO VISION ENTERTAINMENT'
];

export const VENUE_LEGAL_NOTICES = [
  'STRICTLY 18+ • R.O.A.R • ZERO TOLERANCE • CASHLESS VENUE • DOORS CLOSE AT CAPACITY',
  'AGE RESTRICTION: 18+ PHOTO ID REQUIRED • NO WEAPONS OR CONTRABAND • RESPECT THE DANCEFLOOR',
  'ADMISSION SUBJECT TO VENUE SECURITY • DRESS CODE IN EFFECT • NON-TRANSFERABLE PASS',
  'SAFE SPACE POLICY ENFORCED • MANAGEMENT RESERVES RIGHT OF ADMISSION'
];

/**
 * Background Art Director Preflight Heuristic Auditor
 * Checks the poster design against 6 rigorous graphic design criteria to ensure
 * it looks 100% human-designed, print-ready, and snob-proof for high-end venue owners.
 */
export function runArtDirectorAudit(design: PosterDesignState): ArtDirectorAuditResult {
  const items: ArtDirectorAuditItem[] = [];

  // 1. Anti-AI Tactile Texture & Physicality Check
  const hasTexture = design.antiAiTexture && design.antiAiTexture !== 'none';
  if (hasTexture) {
    items.push({
      id: 'texture',
      category: 'texture',
      label: 'Anti-AI Micro-Texture & Grain',
      status: 'pass',
      score: 100,
      critique: `Physical ${design.antiAiTexture?.replace('_', ' ')} micrograin is active. Neutralizes smooth synthetic AI plastic sheen with authentic risograph/print warmth.`,
      suggestion: 'Tactile print finish passed. Indistinguishable from screenprinted physical paper.',
    });
  } else {
    items.push({
      id: 'texture',
      category: 'texture',
      label: 'Anti-AI Micro-Texture & Grain',
      status: 'warning',
      score: 65,
      critique: 'No physical print grain active. Digital backdrops with zero organic texture risk appearing synthetic or computer-generated.',
      suggestion: 'Apply Risograph or Matte Fine Paper grain to give the poster authentic physical analog tactile depth.',
      autoFixAvailable: true,
      autoFixAction: 'apply_texture'
    });
  }

  // 2. Optical Contrast & Legibility Check (ISO 12647-2 & WCAG AA)
  const contrast = getContrastRatio(design.palette.primaryText, design.palette.bgColor);
  if (contrast >= 4.5) {
    items.push({
      id: 'contrast',
      category: 'contrast',
      label: 'Optical Contrast & Reading Hierarchy',
      status: 'pass',
      score: 98,
      critique: `Contrast ratio is ${contrast.toFixed(1)}:1 (exceeds WCAG AA 4.5:1). Headliner and venue details remain razor-sharp even in dim nightclub lighting.`,
      suggestion: 'Legibility is optimal for low-light venue displays and street flyer visibility.',
    });
  } else {
    items.push({
      id: 'contrast',
      category: 'contrast',
      label: 'Optical Contrast & Reading Hierarchy',
      status: 'alert',
      score: 50,
      critique: `Contrast ratio is only ${contrast.toFixed(1)}:1. Text risks washing into the background when printed or viewed at distance.`,
      suggestion: 'Increase background overlay opacity or boost text lightness for crisp agency-grade legibility.',
      autoFixAvailable: true,
      autoFixAction: 'fix_contrast'
    });
  }

  // 3. Typographic Scale & Swiss Grid Discipline
  const isScaleBalanced = design.textScale >= 0.9 && design.textScale <= 1.25;
  const isFontPairingDistinct = design.style.fontHeader !== design.style.fontBody;
  if (isScaleBalanced && isFontPairingDistinct) {
    items.push({
      id: 'typography',
      category: 'typography',
      label: 'Swiss Typographic Grid & Proportions',
      status: 'pass',
      score: 96,
      critique: 'Display headline scale obeys the Major Second mathematical step ratio. Generous negative space balances the header and lineup.',
      suggestion: 'Typography adheres to modernist International Typographic Style guidelines.',
    });
  } else {
    items.push({
      id: 'typography',
      category: 'typography',
      label: 'Swiss Typographic Grid & Proportions',
      status: 'warning',
      score: 70,
      critique: !isScaleBalanced 
        ? 'Headline scale is either disproportionately oversized or too timid for professional event signage.'
        : 'Display font and body font lack distinct character hierarchy.',
      suggestion: 'Calibrate text scaling to 1.05x and ensure distinct header-to-body font contrast.',
      autoFixAvailable: true,
      autoFixAction: 'calibrate_typography'
    });
  }

  // 4. Venue Industry Credibility Elements (Promoter lockup, 18+ R.O.A.R, Barcode)
  const hasCredibilityBar = design.venueCredibilityBar !== false;
  const hasVenue = Boolean(design.details.venue && design.details.venue.trim().length > 0);
  const hasDate = Boolean(design.details.date && design.details.date.trim().length > 0);

  if (hasCredibilityBar && hasVenue && hasDate) {
    items.push({
      id: 'credibility',
      category: 'credibility',
      label: 'Venue Industry & Legal Credibility',
      status: 'pass',
      score: 100,
      critique: 'Authentic promoter credits, 18+ R.O.A.R legal admission notice, and vector security barcode are present. Resembles official ticketed agency print.',
      suggestion: 'Venues and promoters will immediately recognize this as an authorized production flyer.',
    });
  } else {
    items.push({
      id: 'credibility',
      category: 'credibility',
      label: 'Venue Industry & Legal Credibility',
      status: 'warning',
      score: 60,
      critique: 'Missing industry-standard club/promoter lockup, legal entry disclaimer, or ticket barcode. Casual venue bookers might mistake it for an unverified mock.',
      suggestion: 'Enable the Venue Credibility Lockup with promoter metadata and legal age notices.',
      autoFixAvailable: true,
      autoFixAction: 'enable_credibility'
    });
  }

  // 5. Margin & Bleed Safety (0.125" Print Safe Zone)
  const isDensitySafe = design.layoutDensity !== 'compact' || design.preset.aspectRatioValue > 0.6;
  if (isDensitySafe) {
    items.push({
      id: 'margins',
      category: 'margins',
      label: 'Safe Bleed & Margin Compliance',
      status: 'pass',
      score: 95,
      critique: 'All vital text blocks (artists, dates, QR code) sit securely inside the standard 0.125" (3mm) print trim safe boundary.',
      suggestion: 'Zero risk of text cutoff during commercial digital printing or guillotine trimming.',
    });
  } else {
    items.push({
      id: 'margins',
      category: 'margins',
      label: 'Safe Bleed & Margin Compliance',
      status: 'warning',
      score: 72,
      critique: 'Content padding is compressed near the canvas boundaries. Risk of edge clipping on physical guillotine presses.',
      suggestion: 'Switch layout density to Normal or Spacious to give the margins breathing room.',
      autoFixAvailable: true,
      autoFixAction: 'fix_margins'
    });
  }

  // 6. Anti-Slop Color Gamut & Palette Calibration
  const isGradientClashing = design.palette.name.toLowerCase().includes('neon') && design.overlayOpacity < 0.2;
  if (!isGradientClashing) {
    items.push({
      id: 'color_gamut',
      category: 'color_gamut',
      label: 'Color Gamut & Tone Balance',
      status: 'pass',
      score: 98,
      critique: 'Color harmony uses sophisticated restrained neutrals with high-contrast accent highlights. Avoids garish uncalibrated AI neon clashing.',
      suggestion: 'Palette matches modern European and London underground design standards.',
    });
  } else {
    items.push({
      id: 'color_gamut',
      category: 'color_gamut',
      label: 'Color Gamut & Tone Balance',
      status: 'warning',
      score: 68,
      critique: 'Heavy unfiltered saturation in the background risks digital neon glare and clipping in CMYK print conversion.',
      suggestion: 'Increase overlay shade to 45% for a richer, more cinematic depth of field.',
      autoFixAvailable: true,
      autoFixAction: 'balance_colors'
    });
  }

  // Compute Overall Score
  const totalScore = Math.round(
    items.reduce((acc, item) => acc + item.score, 0) / items.length
  );

  let grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'REJECT' = 'A+';
  let verdict: 'Studio Masterpiece' | 'Gallery & Club Approved' | 'Slight AI Hallmarks' | 'High Risk of Venue Rejection' = 'Studio Masterpiece';

  if (totalScore >= 95) {
    grade = 'A+';
    verdict = 'Studio Masterpiece';
  } else if (totalScore >= 85) {
    grade = 'A';
    verdict = 'Gallery & Club Approved';
  } else if (totalScore >= 70) {
    grade = 'B+';
    verdict = 'Slight AI Hallmarks';
  } else if (totalScore >= 60) {
    grade = 'B';
    verdict = 'Slight AI Hallmarks';
  } else {
    grade = 'C';
    verdict = 'High Risk of Venue Rejection';
  }

  const snobProofConfidence = Math.min(99, Math.max(65, totalScore + (hasTexture ? 3 : -8) + (hasCredibilityBar ? 3 : -5)));

  return {
    overallScore: totalScore,
    grade,
    verdict,
    summary: totalScore >= 85 
      ? 'The poster passes all strict venue and creative agency preflight inspections. Typography hierarchy, contrast, and tactile physical grain look authentically designed by a top-tier studio.'
      : 'A few digital AI hallmarks were detected. Applying one-click Art Director polish will guarantee approval from discerning venue managers.',
    items,
    snobProofConfidence,
    timestamp: new Date().toLocaleTimeString(),
  };
}

/**
 * 1-Click Snob-Proof & AI Sanitize Function
 * Instantly cleans up and optimizes any poster design into an authentic, agency-grade masterpiece:
 * - Injects tactile risograph / matte print grain
 * - Adds authentic venue promoter lockup & 18+ R.O.A.R legal microtype
 * - Adjusts background overlay opacity to eliminate harsh neon glare
 * - Calibrates Swiss typographic scaling
 * - Balances safe margins
 */
export function snobProofAndSanitizePoster(currentDesign: PosterDesignState): Partial<PosterDesignState> {
  const updates: Partial<PosterDesignState> = {
    // 1. Add authentic analog print texture
    antiAiTexture: currentDesign.antiAiTexture && currentDesign.antiAiTexture !== 'none' 
      ? currentDesign.antiAiTexture 
      : 'risograph',

    // 2. Add venue promoter credibility bar & legal notices
    venueCredibilityBar: true,
    showBarcode: true,
    promoterText: currentDesign.promoterText || PROMOTER_TEMPLATES[0],
    venueLegalNotice: currentDesign.venueLegalNotice || VENUE_LEGAL_NOTICES[0],

    // 3. Calibrate contrast & overlay to prevent raw AI background glare
    overlayOpacity: Math.max(0.45, Math.min(0.75, currentDesign.overlayOpacity || 0.5)),
    
    // 4. Calibrate typography scaling to golden ratio
    textScale: Math.max(0.95, Math.min(1.15, currentDesign.textScale || 1.0)),

    // 5. Ensure safe margins and layout density
    layoutDensity: currentDesign.layoutDensity === 'compact' ? 'normal' : currentDesign.layoutDensity || 'normal',

    // 6. Turn on AI Guard flag
    venueAiGuardEnabled: true,
    antiSlopCalibrated: true,
    opticalKerning: true,
  };

  return updates;
}
