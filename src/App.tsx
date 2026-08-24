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

import { PosterDesignState, PosterPreset, EventDetails, ColorPalette, SavedPoster } from './types';
import { POSTER_PRESETS } from './data/presets';
import { POSTER_STYLES } from './data/styles';
import { PosterTemplate } from './data/templates';
import { getWeatherConditionByLocationAndDate, generateWeatherPalettes } from './utils/weatherPaletteEngine';

const INITIAL_DETAILS: EventDetails = {
  event: 'SUMMER SOLSTICE FESTIVAL',
  venue: 'Oceanside Amphitheater',
  artist1: 'ECHO BEATS',
  artist2: 'THE NEON WAVE',
  artist3: 'LUNA RAYS',
  artist4: 'SOLAR PULSE',
  date: 'SATURDAY, SEP 18, 2026',
  time: '8:00 PM - 4:00 AM',
  // Secondary compatibility fields
  title: 'ECHO BEATS',
  subtitle: 'LIVE ELECTRONIC DJ SET & BEACH PARTY',
  category: 'MUSIC FESTIVAL',
  displayDate: 'SATURDAY, SEP 18, 2026',
  location: 'Oceanside Amphitheater',
  address: '1200 Ocean Drive, South Beach',
  ticketPrice: '$25 EARLY / FREE BEFORE 10PM',
  organizer: 'Hosted by Echo Events & Solstice Club',
  callToAction: 'GET TICKETS @ SOLSTICE FEST.COM',
  qrCodeLink: 'https://eventbrite.com/e/summer-solstice-fest',
  contactInfo: 'vip@solsticefest.com',
  description: 'Experience an unforgettable night under the starry tropical skies with top international electronic DJs.',
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

  // Loading states
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isBgGenerating, setIsBgGenerating] = useState<boolean>(false);

  // Saved posters in local memory
  const [savedPosters, setSavedPosters] = useState<SavedPoster[]>(() => {
    try {
      const stored = localStorage.getItem('ai_poster_saved_designs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage when savedPosters change
  useEffect(() => {
    try {
      localStorage.setItem('ai_poster_saved_designs', JSON.stringify(savedPosters));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
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
      const thumbUrl = await exportPosterToPng(1);
      const newSavedItem: SavedPoster = {
        id: `poster-${Date.now()}`,
        title: design.details.title || 'Untitled Poster',
        dateCreated: new Date().toISOString(),
        thumbnailUrl: thumbUrl,
        designState: design,
      };

      setSavedPosters((prev) => [newSavedItem, ...prev]);
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

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentPreset={design.preset}
        onSelectPreset={(preset) => setDesign((prev) => ({ ...prev, preset }))}
        weather={design.weather}
        onOpenQuickPrompt={() => setIsQuickPromptOpen(true)}
        onOpenSavedPosters={() => setIsSavedModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
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
            />

            {/* Format Ratio Selector Bar */}
            <PresetSelector
              currentPreset={design.preset}
              onSelectPreset={(preset) => setDesign((prev) => ({ ...prev, preset }))}
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

      {/* PNG Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        design={design}
        onSaveToLibrary={handleSaveToLibrary}
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

    </div>
  );
}
