import React, { useState, useEffect } from 'react';
import { Eye, Sliders } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { PosterCanvas, exportPosterToPng } from './components/PosterCanvas';
import { EditorTabs } from './components/EditorTabs';
import { PresetSelector } from './components/PresetSelector';
import { QuickPromptModal } from './components/QuickPromptModal';
import { ExportModal } from './components/ExportModal';
import { SavedPostersModal } from './components/SavedPostersModal';
import { TemplateGalleryModal } from './components/TemplateGalleryModal';
import { WeatherWelcomeScreen } from './components/WeatherWelcomeScreen';
import { CustomSizeModal } from './components/CustomSizeModal';
import { ArtDirectorInspectorModal } from './components/ArtDirectorInspectorModal';
import { WebSocialIntelModal } from './components/WebSocialIntelModal';

import { PosterDesignState, PosterPreset, EventDetails, ColorPalette, SavedPoster, WebSocialIntelResult } from './types';
import { POSTER_PRESETS } from './data/presets';
import { POSTER_STYLES } from './data/styles';
import { PosterTemplate } from './data/templates';
import { getWeatherConditionByLocationAndDate, generateWeatherPalettes } from './utils/weatherPaletteEngine';
import { applyLayoutAdjustments } from './utils/layoutOptimizationEngine';
import { fetchWebSocialIntelligence, applyFullInspirationToDesign } from './utils/webSocialIntelligence';

const INITIAL_DETAILS: EventDetails = {
  event: '',
  venue: '',
  artist1: '',
  artist2: '',
  artist3: '',
  artist4: '',
  date: '',
  time: '',
  ticketUrl: '',
  // Secondary compatibility fields
  title: '',
  subtitle: '',
  category: '',
  displayDate: '',
  location: '',
  address: '',
  ticketPrice: '',
  organizer: '',
  callToAction: '',
  qrCodeLink: '',
  contactInfo: '',
  description: '',
};

export default function App() {
  // Compute initial weather
  const initialWeather = getWeatherConditionByLocationAndDate(INITIAL_DETAILS.location, INITIAL_DETAILS.displayDate);
  const initialPalettes = generateWeatherPalettes(initialWeather);

  // Core Poster Design State
  const [design, setDesign] = useState<PosterDesignState>({
    preset: POSTER_PRESETS[0], // IG Square
    details: INITIAL_DETAILS,
    weather: initialWeather,
    palette: initialPalettes[0],
    style: POSTER_STYLES[0], // Cyberpunk
    bgType: 'gradient',
    bgImageUrl: '',
    bgPrompt: 'Miami Beach sunset neon electronic festival aesthetic backdrop',
    overlayOpacity: 0.25,
    blurAmount: 0,
    showQrCode: true,
    showWeatherBadge: true,
    showCategoryBadge: true,
    showGridOverlay: false,
    borderStyle: 'thin',
    badgePosition: 'top_split',
    layoutDensity: 'normal',
    autoAdaptLayout: true,
    customFontHeader: "'Bebas Neue', sans-serif",
    customFontBody: "'Inter', sans-serif",
    textScale: 1.0,
    titleUppercase: true,
    badgeText: 'VIP LIMITED EDITION',
  });

  // Mobile view tab state ('canvas' | 'editor')
  const [mobileTab, setMobileTab] = useState<'canvas' | 'editor'>('editor');

  // Modal states
  const [isQuickPromptOpen, setIsQuickPromptOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [isCustomSizeModalOpen, setIsCustomSizeModalOpen] = useState<boolean>(false);
  const [isArtDirectorModalOpen, setIsArtDirectorModalOpen] = useState<boolean>(false);
  const [isWebIntelModalOpen, setIsWebIntelModalOpen] = useState<boolean>(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);

  // Loading states
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isBgGenerating, setIsBgGenerating] = useState<boolean>(false);

  // Web & Social Media Live Intelligence State
  const [webIntel, setWebIntel] = useState<WebSocialIntelResult | null>(null);
  const [isWebIntelLoading, setIsWebIntelLoading] = useState<boolean>(false);
  const [autoSearchIntel, setAutoSearchIntel] = useState<boolean>(true);

  // Saved posters in local memory
  const [savedPosters, setSavedPosters] = useState<SavedPoster[]>(() => {
    try {
      const stored = localStorage.getItem('ai_poster_saved_designs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage when savedPosters change with quota safety
  useEffect(() => {
    try {
      localStorage.setItem('ai_poster_saved_designs', JSON.stringify(savedPosters));
    } catch (e: any) {
      console.warn('Failed to save full designs to localStorage, attempting quota recovery:', e);
      try {
        // If quota exceeded, retain recent 10 items with lightweight thumbnails
        const compacted = savedPosters.slice(0, 10).map(item => ({
          ...item,
          thumbnailUrl: item.thumbnailUrl && item.thumbnailUrl.length > 50000 
            ? '' // omit oversize thumbnail string to preserve critical design data
            : item.thumbnailUrl
        }));
        localStorage.setItem('ai_poster_saved_designs', JSON.stringify(compacted));
      } catch (innerErr) {
        console.error('Critical localStorage error:', innerErr);
      }
    }
  }, [savedPosters]);

  // Update weather whenever location or date changes
  useEffect(() => {
    if (design.details.location) {
      const updatedWeather = getWeatherConditionByLocationAndDate(
        design.details.location,
        design.details.displayDate || design.details.date
      );
      const updatedPalettes = generateWeatherPalettes(updatedWeather);
      
      setDesign((prev) => ({
        ...prev,
        weather: updatedWeather,
        // Update palette if current palette is from weather defaults
        palette: prev.palette.id.includes(updatedWeather.condition) ? prev.palette : updatedPalettes[0],
      }));
    }
  }, [design.details.location, design.details.displayDate, design.details.date]);

  // Update design handler
  const handleUpdateDesign = (updated: Partial<PosterDesignState>) => {
    setDesign((prev) => ({ ...prev, ...updated }));
  };

  // Select Preset handler (with smart layout adaptation support)
  const handleSelectPreset = (newPreset: PosterPreset, forceAutoAdapt?: boolean) => {
    setDesign((prev) => {
      const shouldAdapt = forceAutoAdapt !== undefined ? forceAutoAdapt : (prev.autoAdaptLayout ?? true);
      if (shouldAdapt) {
        return applyLayoutAdjustments(prev, newPreset);
      }
      return { ...prev, preset: newPreset };
    });
  };

  // Update event details handler
  const handleUpdateDetails = (updatedDetails: Partial<EventDetails>) => {
    setDesign((prev) => ({
      ...prev,
      details: { ...prev.details, ...updatedDetails },
    }));
  };

  // AI Enhance & One-Click Poster Generator
  const handleAiEnhance = async (customPrompt?: string) => {
    try {
      setIsAiLoading(true);
      const promptToUse = customPrompt || `${design.details.title} ${design.details.description} in ${design.details.location}`;

      const response = await fetch('/api/ai/enhance-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          location: design.details.location,
          date: design.details.displayDate,
          category: design.details.category,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const data = resData.data;

        // Find style by recommended ID
        const matchedStyle = POSTER_STYLES.find((s) => s.id === data.recommendedStyleId) || design.style;

        // Update details
        const newDetails: EventDetails = {
          ...design.details,
          venue: data.venue || design.details.venue,
          artist1: data.artist1 || data.title || design.details.artist1,
          artist2: data.artist2 || design.details.artist2,
          artist3: data.artist3 || design.details.artist3,
          artist4: data.artist4 || design.details.artist4,
          date: data.date || data.displayDate || design.details.date,
          time: data.time || design.details.time,
          title: data.title || data.artist1 || design.details.title,
          subtitle: data.subtitle || design.details.subtitle,
          category: data.category || design.details.category,
          displayDate: data.displayDate || data.date || design.details.displayDate,
          address: data.address || design.details.address,
          ticketPrice: data.ticketPrice || design.details.ticketPrice,
          organizer: data.organizer || design.details.organizer,
          callToAction: data.callToAction || design.details.callToAction,
        };

        // Weather update
        const updatedWeather = getWeatherConditionByLocationAndDate(newDetails.location, newDetails.displayDate);
        const updatedPalettes = generateWeatherPalettes(updatedWeather);

        setDesign((prev) => ({
          ...prev,
          details: newDetails,
          style: matchedStyle,
          badgeText: data.badgeText || prev.badgeText,
          bgPrompt: data.bgPrompt || prev.bgPrompt,
          weather: updatedWeather,
          palette: updatedPalettes[0],
        }));

        // Generate background image if prompt provided
        if (data.bgPrompt) {
          handleGenerateAiBg(data.bgPrompt);
        }
      }
    } catch (err) {
      console.error('Failed to enhance with AI:', err);
    } finally {
      setIsAiLoading(false);
      setIsQuickPromptOpen(false);
    }
  };

  // AI Background Image Generation Handler
  const handleGenerateAiBg = async (bgPromptToUse: string) => {
    try {
      setIsBgGenerating(true);
      const response = await fetch('/api/ai/generate-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: bgPromptToUse,
          aspectRatio: design.preset.aspectRatioLabel,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.imageUrl) {
        setDesign((prev) => ({
          ...prev,
          bgType: 'ai_image',
          bgImageUrl: resData.imageUrl,
          bgPrompt: bgPromptToUse,
        }));
      }
    } catch (err) {
      console.error('Failed to generate AI background:', err);
    } finally {
      setIsBgGenerating(false);
    }
  };

  // Save poster to local library
  const handleSaveToLibrary = async () => {
    try {
      let thumbUrl = '';
      try {
        thumbUrl = await exportPosterToPng(0.75);
      } catch (thumbErr) {
        console.warn('Thumbnail export failed, saving state without thumbnail:', thumbErr);
      }

      const newSavedItem: SavedPoster = {
        id: `poster-${Date.now()}`,
        title: design.details.title || design.details.event || 'Untitled Poster',
        dateCreated: new Date().toISOString(),
        thumbnailUrl: thumbUrl,
        designState: { ...design },
      };

      setSavedPosters((prev) => [newSavedItem, ...prev.filter(item => item.id !== newSavedItem.id)]);
    } catch (err) {
      console.error('Failed to save poster:', err);
    }
  };

  // Delete poster from library
  const handleDeletePoster = (id: string) => {
    setSavedPosters((prev) => prev.filter((item) => item.id !== id));
  };

  // Load saved poster
  const handleLoadPoster = (item: SavedPoster) => {
    setDesign(item.designState);
  };

  // Web & Social Media Live Research Handler
  const handleSearchWebIntel = async (detailsToSearch?: EventDetails, forceRefresh: boolean = false) => {
    const targetDetails = detailsToSearch || design.details;
    if (!targetDetails.event && !targetDetails.title && !targetDetails.artist1 && !targetDetails.venue) {
      return;
    }

    try {
      setIsWebIntelLoading(true);
      const result = await fetchWebSocialIntelligence(targetDetails, forceRefresh);
      if (result) {
        setWebIntel(result);
      }
    } catch (err) {
      console.error('Failed to search web & social intelligence:', err);
    } finally {
      setIsWebIntelLoading(false);
    }
  };

  // Apply all inspiration from web intelligence
  const handleApplyAllIntelInspiration = (intelToApply?: WebSocialIntelResult) => {
    const intel = intelToApply || webIntel;
    if (!intel) return;

    setDesign((prev) => applyFullInspirationToDesign(prev, intel));
  };

  // Apply specific components from web intelligence
  const handleApplyIntelPalette = (intel: WebSocialIntelResult) => {
    if (intel.inspiration?.customPalette) {
      setDesign((prev) => ({
        ...prev,
        palette: intel.inspiration!.customPalette!,
      }));
    }
  };

  const handleApplyIntelBackdropPrompt = (prompt: string) => {
    setDesign((prev) => ({
      ...prev,
      bgPrompt: prompt,
      bgType: 'ai_image',
    }));
  };

  const handleApplyIntelTagline = (tagline: string) => {
    setDesign((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        subtitle: tagline,
      },
    }));
  };

  // Template Selection Handler
  const handleSelectTemplate = (template: PosterTemplate, mode: 'full' | 'style_only') => {
    // Match preset & style
    const matchedPreset = POSTER_PRESETS.find(p => p.id === template.presetId) || design.preset;
    const matchedStyle = POSTER_STYLES.find(s => s.id === template.styleId) || design.style;

    if (mode === 'full') {
      // Load sample details + template styling
      const updatedWeather = getWeatherConditionByLocationAndDate(template.details.location, template.details.displayDate);
      const updatedPalettes = generateWeatherPalettes(updatedWeather);

      setDesign((prev) => ({
        ...prev,
        preset: matchedPreset,
        details: template.details,
        style: matchedStyle,
        weather: updatedWeather,
        palette: updatedPalettes[0],
        bgType: template.bgType,
        customFontHeader: template.fontHeader,
        customFontBody: template.fontBody,
        borderStyle: template.borderStyle,
        overlayOpacity: template.overlayOpacity,
        textScale: template.textScale,
        titleUppercase: template.titleUppercase,
        badgeText: template.badgeText,
      }));
    } else {
      // Style My Event: preserve current details, apply template fonts & aesthetics
      setDesign((prev) => ({
        ...prev,
        preset: matchedPreset,
        style: matchedStyle,
        bgType: template.bgType,
        customFontHeader: template.fontHeader,
        customFontBody: template.fontBody,
        borderStyle: template.borderStyle,
        overlayOpacity: template.overlayOpacity,
        textScale: template.textScale,
        titleUppercase: template.titleUppercase,
        badgeText: template.badgeText,
      }));
    }

    setIsTemplateModalOpen(false);
  };

  // Handle applying custom dimensions & pre-render style
  const handleApplyCustomSizeAndStyle = (
    preset: PosterPreset,
    styleUpdates?: Partial<PosterDesignState>,
    immediateExport: boolean = false
  ) => {
    setDesign((prev) => ({
      ...prev,
      preset,
      ...(styleUpdates || {}),
    }));
    setIsCustomSizeModalOpen(false);
    if (immediateExport) {
      setIsExportModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentPreset={design.preset}
        onSelectPreset={handleSelectPreset}
        weather={design.weather}
        onOpenQuickPrompt={() => setIsQuickPromptOpen(true)}
        onOpenSavedPosters={() => setIsSavedModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onOpenWeatherWelcome={() => setShowWelcomeScreen(true)}
        savedCount={savedPosters.length}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-5">
        
        {/* Mobile Screen View Switcher (Visible on < lg screens) */}
        <div className="lg:hidden flex items-center p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg">
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mobileTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sliders className="w-4 h-4 text-indigo-300" />
            <span>Design Editor Tabs</span>
          </button>

          <button
            onClick={() => setMobileTab('canvas')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mobileTab === 'canvas'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-300" />
            <span>Canvas Preview</span>
          </button>
        </div>

        {/* Bento Grid Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Poster Canvas Stage (Visible always on lg, or on mobile when mobileTab === 'canvas') */}
          <div className={`lg:col-span-6 flex flex-col gap-4 sticky top-20 ${mobileTab === 'canvas' ? 'block' : 'hidden lg:flex'}`}>
            
            {/* Interactive Poster Canvas */}
            <PosterCanvas
              design={design}
              onDesignChange={handleUpdateDesign}
              onOpenArtDirector={() => setIsArtDirectorModalOpen(true)}
            />

            {/* Format Ratio Selector Bar */}
            <PresetSelector
              currentPreset={design.preset}
              design={design}
              onSelectPreset={handleSelectPreset}
              onUpdateDesign={handleUpdateDesign}
              onOpenCustomSizeModal={() => setIsCustomSizeModalOpen(true)}
            />

          </div>

          {/* RIGHT COLUMN: Tabbed Editor Hub (Visible always on lg, or on mobile when mobileTab === 'editor') */}
          <div className={`lg:col-span-6 flex flex-col gap-5 ${mobileTab === 'editor' ? 'block' : 'hidden lg:flex'}`}>
            
            <EditorTabs
              design={design}
              onDesignChange={handleUpdateDesign}
              onDetailsChange={handleUpdateDetails}
              onEnhanceWithAI={() => handleAiEnhance()}
              isAiLoading={isAiLoading}
              onGenerateAiBg={handleGenerateAiBg}
              isBgGenerating={isBgGenerating}
              onRefreshWeather={() => {
                if (design.details.location) {
                  const w = getWeatherConditionByLocationAndDate(design.details.location, design.details.displayDate);
                  const pals = generateWeatherPalettes(w);
                  setDesign((prev) => ({ ...prev, weather: w, palette: pals[0] }));
                }
              }}
              onOpenTemplates={() => setIsTemplateModalOpen(true)}
              onOpenSavedPosters={() => setIsSavedModalOpen(true)}
              savedCount={savedPosters.length}
              onOpenArtDirectorModal={() => setIsArtDirectorModalOpen(true)}
              webIntel={webIntel}
              isWebIntelLoading={isWebIntelLoading}
              autoSearchIntel={autoSearchIntel}
              onToggleAutoSearchIntel={() => setAutoSearchIntel((prev) => !prev)}
              onSearchWebIntel={handleSearchWebIntel}
              onOpenWebIntelModal={() => setIsWebIntelModalOpen(true)}
              onApplyAllIntelInspiration={handleApplyAllIntelInspiration}
            />

          </div>

        </div>

      </main>

      {/* Quick AI Prompt Modal */}
      <QuickPromptModal
        isOpen={isQuickPromptOpen}
        onClose={() => setIsQuickPromptOpen(false)}
        onSubmitPrompt={(promptText) => handleAiEnhance(promptText)}
        isLoading={isAiLoading}
      />

      {/* Live Web & Social Media Intelligence Deep-Dive Modal */}
      <WebSocialIntelModal
        isOpen={isWebIntelModalOpen}
        onClose={() => setIsWebIntelModalOpen(false)}
        intel={webIntel}
        isLoading={isWebIntelLoading}
        onRefreshSearch={() => handleSearchWebIntel(design.details, true)}
        onApplyAllInspiration={handleApplyAllIntelInspiration}
        onApplyPalette={handleApplyIntelPalette}
        onApplyBackdropPrompt={handleApplyIntelBackdropPrompt}
        onApplyTagline={handleApplyIntelTagline}
      />

      {/* PNG Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        design={design}
        onSaveToLibrary={handleSaveToLibrary}
        onUpdateDesign={handleUpdateDesign}
        onOpenCustomSizeModal={() => setIsCustomSizeModalOpen(true)}
      />

      {/* Custom Size & Style Pre-Render Studio Modal */}
      <CustomSizeModal
        isOpen={isCustomSizeModalOpen}
        onClose={() => setIsCustomSizeModalOpen(false)}
        currentDesign={design}
        onApplyCustomSizeAndStyle={handleApplyCustomSizeAndStyle}
      />

      {/* Saved Posters Gallery Modal */}
      <SavedPostersModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedPosters={savedPosters}
        onLoadPoster={handleLoadPoster}
        onDeletePoster={handleDeletePoster}
      />

      {/* Event Templates Gallery Modal */}
      <TemplateGalleryModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        currentDetails={design.details}
      />

      {/* Art Director AI & Snob-Proof Inspector Modal */}
      <ArtDirectorInspectorModal
        isOpen={isArtDirectorModalOpen}
        onClose={() => setIsArtDirectorModalOpen(false)}
        design={design}
        onDesignChange={handleUpdateDesign}
      />

      {/* Atmospheric Weather-Inspired Loading & Voice Welcome Screen */}
      {showWelcomeScreen && (
        <WeatherWelcomeScreen
          onEnterApp={() => setShowWelcomeScreen(false)}
          defaultCity={design.details.location || 'Global Vibes'}
        />
      )}

    </div>
  );
}
