import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Mic, 
  MicOff,
  User, 
  Ticket, 
  Link as LinkIcon, 
  BookmarkPlus, 
  Repeat, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Check, 
  PlusCircle, 
  ArrowUpRight,
  RefreshCw,
  Volume2,
  VolumeX,
  Radio,
  X,
  Play,
  Globe,
  Zap,
  Music,
  Hash
} from 'lucide-react';
import { EventDetails, SavedEventProfile, WebSocialIntelResult } from '../types';
import { 
  getSavedEventProfiles, 
  saveEventProfileToStorage, 
  deleteEventProfileFromStorage, 
  advanceDateString 
} from '../utils/savedEventProfiles';
import { 
  FIELD_VOICE_GUIDES, 
  speakFieldGuide, 
  speakAlluringVoice, 
  stopVoiceSpeech, 
  playAtmosphericChime 
} from '../utils/audioVoiceEngine';
import { SaveEventInfoModal } from './SaveEventInfoModal';
import { WebSocialIntelBanner } from './WebSocialIntelBanner';

interface EventFormProps {
  details: EventDetails;
  onChange: (updated: Partial<EventDetails>) => void;
  onEnhanceWithAI: () => void;
  isAiLoading: boolean;
  webIntel?: WebSocialIntelResult | null;
  isWebIntelLoading?: boolean;
  autoSearchIntel?: boolean;
  onToggleAutoSearchIntel?: () => void;
  onSearchWebIntel?: (detailsToSearch?: EventDetails, forceRefresh?: boolean) => void;
  onOpenWebIntelModal?: () => void;
  onApplyAllIntelInspiration?: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  details,
  onChange,
  onEnhanceWithAI,
  isAiLoading,
  webIntel = null,
  isWebIntelLoading = false,
  autoSearchIntel = true,
  onToggleAutoSearchIntel,
  onSearchWebIntel,
  onOpenWebIntelModal,
  onApplyAllIntelInspiration,
}) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [savedProfiles, setSavedProfiles] = useState<SavedEventProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Interactive Voice Guide Assistant State
  const [isVoiceGuideActive, setIsVoiceGuideActive] = useState<boolean>(false);
  const [currentGuideIndex, setCurrentGuideIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [activeDictatingField, setActiveDictatingField] = useState<string | null>(null);

  // Field input element references for auto-focus during guided walkthrough
  const fieldRefs = {
    event: useRef<HTMLInputElement>(null),
    venue: useRef<HTMLInputElement>(null),
    artist1: useRef<HTMLInputElement>(null),
    artist2: useRef<HTMLInputElement>(null),
    artist3: useRef<HTMLInputElement>(null),
    artist4: useRef<HTMLInputElement>(null),
    date: useRef<HTMLInputElement>(null),
    time: useRef<HTMLInputElement>(null),
    ticketPrice: useRef<HTMLInputElement>(null),
    ticketUrl: useRef<HTMLInputElement>(null),
  };

  // Speech Recognition setup for voice dictation
  const recognitionRef = useRef<any>(null);

  // Auto-search web & socials as user enters information with smart debounce
  const lastSearchQueryRef = useRef<string>('');
  const autoSearchTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!autoSearchIntel || !onSearchWebIntel) return;

    const currentQuery = [
      details.artist1?.trim() || '',
      details.artist2?.trim() || '',
      details.venue?.trim() || '',
      details.event?.trim() || '',
      details.location?.trim() || '',
    ].filter(Boolean).join('|');

    if (!currentQuery || currentQuery.length < 3) return;
    if (currentQuery === lastSearchQueryRef.current) return;

    if (autoSearchTimerRef.current) {
      clearTimeout(autoSearchTimerRef.current);
    }

    autoSearchTimerRef.current = setTimeout(() => {
      lastSearchQueryRef.current = currentQuery;
      onSearchWebIntel(details, false);
    }, 850);

    return () => {
      if (autoSearchTimerRef.current) {
        clearTimeout(autoSearchTimerRef.current);
      }
    };
  }, [
    autoSearchIntel,
    details.artist1,
    details.artist2,
    details.artist3,
    details.artist4,
    details.venue,
    details.event,
    details.location,
    onSearchWebIntel,
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript && activeDictatingField) {
            handleVoiceDictationResult(activeDictatingField, transcript);
          }
          setIsListening(false);
          setActiveDictatingField(null);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          setActiveDictatingField(null);
        };

        recognition.onend = () => {
          setIsListening(false);
          setActiveDictatingField(null);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      stopVoiceSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [activeDictatingField]);

  // Load saved profiles from storage
  useEffect(() => {
    setSavedProfiles(getSavedEventProfiles());
  }, []);

  const handleSaveProfile = (profile: SavedEventProfile) => {
    const updatedList = saveEventProfileToStorage(profile);
    setSavedProfiles(updatedList);
    setActiveProfileId(profile.id);
    setNoticeMessage(`Saved "${profile.name}" (${profile.recurrence}) as event template!`);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  const handleLoadProfile = (profile: SavedEventProfile) => {
    setActiveProfileId(profile.id);
    onChange({
      ...profile.details,
    });
    setNoticeMessage(`Loaded "${profile.name}" template — ready for your next round!`);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  const handleDeleteProfile = (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation();
    const updated = deleteEventProfileFromStorage(profileId);
    setSavedProfiles(updated);
    if (activeProfileId === profileId) {
      setActiveProfileId(null);
    }
  };

  const handleAdvanceDate = (interval: 'month' | 'year' | 'week') => {
    const currentDate = details.date || details.displayDate || '';
    const newDate = advanceDateString(currentDate, interval);
    onChange({
      date: newDate,
      displayDate: newDate,
    });
    setNoticeMessage(`Advanced date by +1 ${interval}: "${newDate}"`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  // Trigger speech for a single field
  const handleSpeakField = (fieldKey: string) => {
    stopVoiceSpeech();
    setIsSpeaking(true);
    speakFieldGuide(
      fieldKey,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // Start Step-by-Step Voice Guide Mode
  const handleStartVoiceGuide = () => {
    setIsVoiceGuideActive(true);
    setCurrentGuideIndex(0);
    const firstField = FIELD_VOICE_GUIDES[0];
    
    // Focus first field
    const ref = (fieldRefs as any)[firstField.fieldKey];
    if (ref && ref.current) {
      ref.current.focus();
    }

    // Play intro and first prompt
    stopVoiceSpeech();
    setIsSpeaking(true);
    speakAlluringVoice(
      "I'm here to guide you step by step. " + firstField.voicePrompt,
      true,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // Move to a specific guide step and speak
  const handleNavigateGuideStep = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= FIELD_VOICE_GUIDES.length) return;
    setCurrentGuideIndex(newIndex);
    const targetField = FIELD_VOICE_GUIDES[newIndex];

    // Focus input field
    const ref = (fieldRefs as any)[targetField.fieldKey];
    if (ref && ref.current) {
      ref.current.focus();
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Speak the field prompt
    stopVoiceSpeech();
    setIsSpeaking(true);
    speakFieldGuide(
      targetField.fieldKey,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // Replay current step prompt
  const handleReplayCurrentStep = () => {
    const targetField = FIELD_VOICE_GUIDES[currentGuideIndex];
    if (!targetField) return;
    stopVoiceSpeech();
    setIsSpeaking(true);
    speakFieldGuide(
      targetField.fieldKey,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // Exit Voice Guide Mode
  const handleCloseVoiceGuide = () => {
    stopVoiceSpeech();
    setIsSpeaking(false);
    setIsVoiceGuideActive(false);
  };

  // Handle voice dictation start/stop
  const handleToggleDictation = (fieldKey: string) => {
    if (!recognitionRef.current) {
      setNoticeMessage('Voice recognition is not supported in this browser. You can type directly!');
      setTimeout(() => setNoticeMessage(null), 4000);
      return;
    }

    if (isListening && activeDictatingField === fieldKey) {
      recognitionRef.current.stop();
      setIsListening(false);
      setActiveDictatingField(null);
    } else {
      stopVoiceSpeech();
      setIsSpeaking(false);
      setActiveDictatingField(fieldKey);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start failed:', err);
      }
    }
  };

  // Handle applied voice dictation text
  const handleVoiceDictationResult = (fieldKey: string, text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    if (fieldKey === 'event') {
      onChange({ event: cleanText, subtitle: cleanText });
    } else if (fieldKey === 'venue') {
      onChange({ venue: cleanText, location: cleanText });
    } else if (fieldKey === 'artist1') {
      onChange({ artist1: cleanText, title: cleanText });
    } else if (fieldKey === 'artist2') {
      onChange({ artist2: cleanText });
    } else if (fieldKey === 'artist3') {
      onChange({ artist3: cleanText });
    } else if (fieldKey === 'artist4') {
      onChange({ artist4: cleanText });
    } else if (fieldKey === 'date') {
      onChange({ date: cleanText, displayDate: cleanText });
    } else if (fieldKey === 'time') {
      onChange({ time: cleanText });
    } else if (fieldKey === 'ticketPrice') {
      onChange({ ticketPrice: cleanText });
    } else if (fieldKey === 'ticketUrl') {
      onChange({ ticketUrl: cleanText, qrCodeLink: cleanText });
    }

    setNoticeMessage(`Voice captured for ${fieldKey}: "${cleanText}"`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const currentGuide = FIELD_VOICE_GUIDES[currentGuideIndex];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 text-neutral-200 flex flex-col gap-4 shadow-xl">
      
      {/* Header Bar with Voice Field Guide, Save Event Info, and AI Polish Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          <h2 className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            Event Information
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Voice Field Guide Assistant Mode Button */}
          <button
            onClick={isVoiceGuideActive ? handleCloseVoiceGuide : handleStartVoiceGuide}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 transition-all ${
              isVoiceGuideActive
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/25 ring-2 ring-purple-400/40 animate-pulse'
                : 'bg-neutral-950 hover:bg-neutral-800 border border-purple-500/40 text-purple-300 hover:text-white'
            }`}
            title="Have the alluring voice guide you through filling out each poster detail step by step"
          >
            <Radio className={`w-3.5 h-3.5 ${isVoiceGuideActive ? 'text-purple-200 animate-spin' : 'text-purple-400'}`} />
            <span>{isVoiceGuideActive ? 'Voice Guide Active' : 'Voice Guide Mode'}</span>
          </button>

          {/* Save Event Info Button */}
          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-indigo-500/40 text-indigo-300 text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            title="Save this event info (venue, pricing, lineup structure) as a reusable recurring template"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Save Event Info</span>
          </button>

          {/* AI Enhance Copy Button */}
          <button
            onClick={onEnhanceWithAI}
            disabled={isAiLoading}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-pulse" />
            <span>{isAiLoading ? 'Polishing...' : 'AI Enhance'}</span>
          </button>
        </div>
      </div>

      {/* Seductive Voice Guide Ribbon Assistant Card (When Voice Guide Mode is Active) */}
      {isVoiceGuideActive && currentGuide && (
        <div className="bg-gradient-to-r from-purple-950/80 via-neutral-950 to-indigo-950/80 border border-purple-500/50 rounded-2xl p-3.5 sm:p-4 text-neutral-200 flex flex-col gap-3 shadow-lg shadow-purple-950/30 animate-fadeIn">
          
          <div className="flex items-center justify-between gap-2 border-b border-purple-500/20 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/30 ring-2 ring-purple-400/30 relative">
                <Radio className="w-4 h-4" />
                {isSpeaking && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-200">
                    Voice Assistant: Step {currentGuideIndex + 1} of {FIELD_VOICE_GUIDES.length}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {currentGuide.fieldLabel}
                  </span>
                </div>
                <p className="text-[10.5px] text-neutral-400 font-mono">
                  Alluring Voice Guidance & Interactive Dictation
                </p>
              </div>
            </div>

            {/* Sound Wave Animation & Close Guide */}
            <div className="flex items-center gap-2">
              {isSpeaking && (
                <div className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded-lg bg-purple-950/70 border border-purple-500/30">
                  <span className="w-1 h-3 bg-purple-400 rounded-full animate-pulse"></span>
                  <span className="w-1 h-5 bg-indigo-400 rounded-full animate-pulse delay-75"></span>
                  <span className="w-1 h-2 bg-purple-300 rounded-full animate-pulse delay-150"></span>
                  <span className="w-1 h-4 bg-purple-400 rounded-full animate-pulse delay-100"></span>
                  <span className="text-[9px] text-purple-300 ml-1 font-mono">Speaking</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleCloseVoiceGuide}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 transition-all"
                title="Exit Voice Guide Mode"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Spoken Script Banner */}
          <div className="bg-neutral-950/90 border border-purple-500/30 rounded-xl p-3 flex flex-col gap-1.5 relative">
            <p className="text-xs sm:text-sm text-purple-100 font-medium italic leading-relaxed">
              "{currentGuide.voicePrompt}"
            </p>
            <p className="text-[10.5px] text-neutral-400 flex items-center gap-1 font-sans not-italic">
              <span className="text-purple-400 font-bold">Tip:</span> {currentGuide.hint}
            </p>
          </div>

          {/* Guide Step Navigation Controls */}
          <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleReplayCurrentStep}
                disabled={isSpeaking}
                className="px-2.5 py-1.5 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/40 text-purple-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Replay Voice</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleDictation(currentGuide.fieldKey)}
                className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isListening && activeDictatingField === currentGuide.fieldKey
                    ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                    : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-rose-400" />
                <span>{isListening && activeDictatingField === currentGuide.fieldKey ? 'Listening...' : 'Dictate by Voice'}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={() => handleNavigateGuideStep(currentGuideIndex - 1)}
                disabled={currentGuideIndex === 0}
                className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigateGuideStep(currentGuideIndex + 1)}
                disabled={currentGuideIndex === FIELD_VOICE_GUIDES.length - 1}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1 transition-all disabled:opacity-30"
              >
                <span>Next Field</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Reusable Annual / Monthly Event Templates Carousel / Pills */}
      {savedProfiles.length > 0 && (
        <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-emerald-400" />
              Saved Recurring & Annual Event Templates:
            </span>
            <span className="text-[10px] text-neutral-500">1-Click Load for Next Round</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {savedProfiles.map((p) => {
              const isSelected = activeProfileId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleLoadProfile(p)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-1.5 relative group ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                      : 'bg-neutral-900 border-neutral-800/90 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-850'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-neutral-100 truncate">
                      {p.name}
                    </span>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold shrink-0 ${
                      p.recurrence === 'annual'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        : p.recurrence === 'monthly'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                    }`}>
                      {p.recurrence}
                    </span>
                  </div>

                  <p className="text-[10.5px] text-neutral-400 truncate">
                    {p.details.venue || 'No venue'}
                  </p>

                  <div className="flex items-center justify-between text-[9px] text-neutral-500 pt-1 border-t border-neutral-800/60">
                    <span className="text-indigo-400/90 font-medium">Click to apply</span>
                    <button
                      onClick={(e) => handleDeleteProfile(e, p.id)}
                      className="text-neutral-500 hover:text-rose-400 p-0.5 rounded transition-all opacity-0 group-hover:opacity-100"
                      title="Delete saved template"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Notice */}
      {noticeMessage && (
        <div className="py-2 px-3 rounded-xl bg-indigo-950/90 border border-indigo-500/50 text-indigo-200 text-xs flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-medium text-[11px]">{noticeMessage}</span>
          </div>
          <span className="text-[10px] text-indigo-400 font-mono">Synced</span>
        </div>
      )}

      {/* Live Web & Social Media Intelligence Banner */}
      <WebSocialIntelBanner
        intel={webIntel}
        isLoading={isWebIntelLoading}
        autoSearchEnabled={autoSearchIntel}
        onToggleAutoSearch={onToggleAutoSearchIntel || (() => {})}
        onManualSearch={() => onSearchWebIntel && onSearchWebIntel(details, true)}
        onOpenModal={onOpenWebIntelModal || (() => {})}
        onApplyAllInspiration={onApplyAllIntelInspiration || (() => {})}
        details={details}
      />

      {/* Primary Required Form Fields: Event & Venue */}
      <div className="flex flex-col gap-3">
        
        {/* Field 1: Event Name */}
        <div className={`p-1.5 rounded-2xl transition-all ${isVoiceGuideActive && currentGuide?.fieldKey === 'event' ? 'ring-2 ring-purple-500/80 bg-purple-950/20' : ''}`}>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Event:
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSpeakField('event')}
                className="p-1 rounded-lg text-neutral-400 hover:text-purple-300 hover:bg-neutral-800 transition-all"
                title="Hear sexy voice guide for Event Title"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleToggleDictation('event')}
                className={`p-1 rounded-lg transition-all ${isListening && activeDictatingField === 'event' ? 'text-rose-400 bg-rose-950 animate-pulse' : 'text-neutral-400 hover:text-rose-300 hover:bg-neutral-800'}`}
                title="Dictate event title by voice"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <input
            ref={fieldRefs.event}
            type="text"
            value={details.event || details.subtitle || ''}
            onChange={(e) => {
              const val = e.target.value;
              onChange({ 
                event: val,
                subtitle: val
              });
            }}
            placeholder="e.g. SUMMER SOLSTICE MUSIC FEST"
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-neutral-100 placeholder-neutral-600 outline-none transition-all shadow-inner"
          />

          {/* Contextual Social Tagline Suggestions */}
          {webIntel?.socialBuzz?.sampleTaglines && webIntel.socialBuzz.sampleTaglines.length > 0 && (
            <div className="mt-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-0.5 shrink-0">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Web suggestions:</span>
              </span>
              {webIntel.socialBuzz.sampleTaglines.slice(0, 2).map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange({ subtitle: tag })}
                  className="px-2 py-0.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-[10.5px] truncate max-w-[220px] transition-all flex items-center gap-1 shrink-0"
                  title="Click to apply as subtitle"
                >
                  <span className="truncate italic">"{tag}"</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Field 2: Venue */}
        <div className={`p-1.5 rounded-2xl transition-all ${isVoiceGuideActive && currentGuide?.fieldKey === 'venue' ? 'ring-2 ring-purple-500/80 bg-purple-950/20' : ''}`}>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Venue:
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSpeakField('venue')}
                className="p-1 rounded-lg text-neutral-400 hover:text-purple-300 hover:bg-neutral-800 transition-all"
                title="Hear sexy voice guide for Venue"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleToggleDictation('venue')}
                className={`p-1 rounded-lg transition-all ${isListening && activeDictatingField === 'venue' ? 'text-rose-400 bg-rose-950 animate-pulse' : 'text-neutral-400 hover:text-rose-300 hover:bg-neutral-800'}`}
                title="Dictate venue by voice"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <input
            ref={fieldRefs.venue}
            type="text"
            value={details.venue || ''}
            onChange={(e) => {
              const val = e.target.value;
              onChange({ 
                venue: val,
                location: val || details.location || 'Venue'
              });
            }}
            placeholder="e.g. Oceanside Amphitheater / Echostage"
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-neutral-100 placeholder-neutral-600 outline-none transition-all shadow-inner"
          />

          {/* Discovered Venue Atmosphere Intel */}
          {webIntel?.venue && (
            <div className="mt-1.5 flex items-center gap-1.5 text-[10.5px] text-emerald-300/90 overflow-x-auto scrollbar-none py-0.5">
              <span className="px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center gap-1 shrink-0">
                <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                <span>{webIntel.venue.city || 'Verified Location'} • {webIntel.venue.atmosphere}</span>
              </span>
            </div>
          )}
        </div>

        {/* Artists Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800/80">
          
          {/* Artist 1 (Headliner) */}
          <div className={`p-1 rounded-xl transition-all ${isVoiceGuideActive && currentGuide?.fieldKey === 'artist1' ? 'ring-2 ring-purple-500/80 bg-purple-950/20' : ''}`}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                Artist 1:
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSpeakField('artist1')}
                  className="p-0.5 rounded text-neutral-400 hover:text-purple-300 transition-all"
                  title="Hear voice guide for Headliner"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDictation('artist1')}
                  className={`p-0.5 rounded transition-all ${isListening && activeDictatingField === 'artist1' ? 'text-rose-400 animate-pulse' : 'text-neutral-400 hover:text-rose-300'}`}
                  title="Dictate Headliner"
                >
                  <Mic className="w-3 h-3" />
                </button>
              </div>
            </div>
            <input
              ref={fieldRefs.artist1}
              type="text"
              value={details.artist1 || ''}
              onChange={(e) => {
                const val = e.target.value;
                onChange({ 
                  artist1: val,
                  title: val || details.title || 'HEADLINER'
                });
              }}
              placeholder="e.g. Echo Beats (Headliner)"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2 text-sm font-semibold text-neutral-100 placeholder-neutral-600 outline-none transition-all"
            />

            {/* Discovered Artist Genre & Aesthetic */}
            {webIntel?.primaryArtist?.genre && (
              <div className="mt-1 flex items-center gap-1 text-[10px] text-indigo-300">
                <span className="px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60 font-medium">
                  {webIntel.primaryArtist.genre}
                </span>
                {webIntel.primaryArtist.signatureColors?.length > 0 && (
                  <div className="flex items-center gap-1 ml-auto">
                    {webIntel.primaryArtist.signatureColors.slice(0, 3).map((c, i) => (
                      <span key={i} className="w-2.5 h-2.5 rounded-full border border-neutral-700" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Artist 2 */}
          <div className={`p-1 rounded-xl transition-all ${isVoiceGuideActive && currentGuide?.fieldKey === 'artist2' ? 'ring-2 ring-purple-500/80 bg-purple-950/20' : ''}`}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Artist 2:
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSpeakField('artist2')}
                  className="p-0.5 rounded text-neutral-400 hover:text-purple-300 transition-all"
                  title="Hear voice guide for Artist 2"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDictation('artist2')}
                  className={`p-0.5 rounded transition-all ${isListening && activeDictatingField === 'artist2' ? 'text-rose-400 animate-pulse' : 'text-neutral-400 hover:text-rose-300'}`}
                  title="Dictate Artist 2"
                >
                  <Mic className="w-3 h-3" />
                </button>
              </div>
            </div>
            <input
              ref={fieldRefs.artist2}
              type="text"
              value={details.artist2 || ''}
              onChange={(e) => onChange({ artist2: e.target.value })}
              placeholder="e.g. The Neon Wave"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2 text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-all"
            />
          </div>

          {/* Artist 3 */}
          <div className={`p-1 rounded-xl transition-all ${isVoiceGuideActive && currentGuide?.fieldKey === 'artist3' ? 'ring-2 ring-purple-500/80 bg-purple-950/20' : ''}`}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Artist 3:
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSpeakField('artist3')}
                  className="p-0.5 rounded text-neutral-400 hover:text-purple-300 transition-all"
                  title="Hear voice guide for Artist 3"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDictation('artist3')}
                  className={`p-0.5 rounded transition-all ${isListening && activeDictatingField === 'artist3' ? 'text-rose-400 animate-pulse' : 'text-neutral-400 hover:text-rose-300'}`}
                  title="Dictate Artist 3"
                >
                  <Mic className="w-3 h-3" />
                </button>
              </div>
            </div>
            <input
              ref={fieldRefs.artist3}
              type="text"
              value={details.artist3 || ''}
              onChange={(e) => onChange({ artist3: e.target.value })}
              placeholder="e.g. Luna Rays"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2 text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-all"
            />
          </div>

          {/* Artist 4 */}
          <div className={`p-1 rounded-xl transition-all ${isVoiceGuideActive && currentGuide?.fieldKey === 'artist4' ? 'ring-2 ring-purple-500/80 bg-purple-950/20' : ''}`}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Artist 4:
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSpeakField('artist4')}
                  className="p-0.5 rounded text-neutral-400 hover:text-purple-300 transition-all"
                  title="Hear voice guide for Artist 4"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDictation('artist4')}
                  className={`p-0.5 rounded transition-all ${isListening && activeDictatingField === 'artist4' ? 'text-rose-400 animate-pulse' : 'text-neutral-400 hover:text-rose-300'}`}
                  title="Dictate Artist 4"
                >
                  <Mic className="w-3 h-3" />
                </button>
              </div>
            </div>
            <input
              ref={fieldRefs.artist4}
              type="text"
              value={details.artist4 || ''}
              onChange={(e) => onChange({ artist4: e.target.value })}
              placeholder="e.g. Solar Pulse"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2 text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-all"
            />
          </div>

        </div>

        {/* Date & Time Section with Next Round Quick Date Advancer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800/80">
          
          {/* Date Field */}
          <div className={`p-1 rounded-xl transition-all ${isVoiceGuideActive && currentGuide?.fieldKey === 'date' ? 'ring-2 ring-purple-500/80 bg-purple-950/20' : ''}`}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Date:
              </label>

              {/* Next Round Quick Advance & Voice Guide Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSpeakField('date')}
                  className="p-0.5 rounded text-neutral-400 hover:text-purple-300 transition-all mr-1"
                  title="Hear voice guide for Date"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvanceDate('month')}
                  className="px-1.5 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-medium text-emerald-400 hover:text-emerald-300 transition-all"
                  title="Advance event date by +1 month for next monthly round"
                >
                  +1 Mo
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvanceDate('year')}
                  className="px-1.5 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-medium text-amber-400 hover:text-amber-300 transition-all"
                  title="Advance event date by +1 year for next annual edition"
                >
                  +1 Yr
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvanceDate('week')}
                  className="px-1.5 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-medium text-indigo-400 hover:text-indigo-300 transition-all"
                  title="Advance event date by +1 week"
                >
                  +1 Wk
                </button>
              </div>
            </div>

            <input
              ref={fieldRefs.date}
              type="text"
              value={details.date || ''}
              onChange={(e) => {
                const val = e.target.value;
                onChange({ 
                  date: val,
                  displayDate: val || details.displayDate || '2026-09-18'
                });
              }}
              placeholder="e.g. SATURDAY, SEP 18, 2026"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2 text-sm font-medium text-neutral-100 placeholder-neutral-600 outline-none transition-all"
            />
          </div>

          {/* Time Field */}
          <div className={`p-1 rounded-xl transition-all ${isVoiceGuideActive && currentGuide?.fieldKey === 'time' ? 'ring-2 ring-purple-500/80 bg-purple-950/20' : ''}`}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                Time:
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSpeakField('time')}
                  className="p-0.5 rounded text-neutral-400 hover:text-purple-300 transition-all"
                  title="Hear voice guide for Time"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDictation('time')}
                  className={`p-0.5 rounded transition-all ${isListening && activeDictatingField === 'time' ? 'text-rose-400 animate-pulse' : 'text-neutral-400 hover:text-rose-300'}`}
                  title="Dictate Time"
                >
                  <Mic className="w-3 h-3" />
                </button>
              </div>
            </div>
            <input
              ref={fieldRefs.time}
              type="text"
              value={details.time || ''}
              onChange={(e) => onChange({ time: e.target.value })}
              placeholder="e.g. 8:00 PM - 3:00 AM"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2 text-sm font-medium text-neutral-100 placeholder-neutral-600 outline-none transition-all"
            />
          </div>
        </div>

        {/* Ticket Details (Price & URL) Section */}
        <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Ticket Price Field */}
          <div className={`p-1 rounded-xl transition-all ${isVoiceGuideActive && currentGuide?.fieldKey === 'ticketPrice' ? 'ring-2 ring-purple-500/80 bg-purple-950/20' : ''}`}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                Ticket Price (ZAR):
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSpeakField('ticketPrice')}
                  className="p-0.5 rounded text-neutral-400 hover:text-purple-300 transition-all"
                  title="Hear voice guide for Ticket Price"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDictation('ticketPrice')}
                  className={`p-0.5 rounded transition-all ${isListening && activeDictatingField === 'ticketPrice' ? 'text-rose-400 animate-pulse' : 'text-neutral-400 hover:text-rose-300'}`}
                  title="Dictate Ticket Price"
                >
                  <Mic className="w-3 h-3" />
                </button>
              </div>
            </div>
            <input
              ref={fieldRefs.ticketPrice}
              type="text"
              value={details.ticketPrice || ''}
              onChange={(e) => onChange({ ticketPrice: e.target.value })}
              placeholder="e.g. R150 EARLY BIRD / R250 DOOR"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2 text-sm font-medium text-neutral-100 placeholder-neutral-600 outline-none transition-all shadow-inner"
            />
          </div>

          {/* Ticket URL Field */}
          <div className={`p-1 rounded-xl transition-all ${isVoiceGuideActive && currentGuide?.fieldKey === 'ticketUrl' ? 'ring-2 ring-purple-500/80 bg-purple-950/20' : ''}`}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                Ticket URL:
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSpeakField('ticketUrl')}
                  className="p-0.5 rounded text-neutral-400 hover:text-purple-300 transition-all"
                  title="Hear voice guide for Ticket URL"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDictation('ticketUrl')}
                  className={`p-0.5 rounded transition-all ${isListening && activeDictatingField === 'ticketUrl' ? 'text-rose-400 animate-pulse' : 'text-neutral-400 hover:text-rose-300'}`}
                  title="Dictate Ticket URL"
                >
                  <Mic className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                ref={fieldRefs.ticketUrl}
                type="url"
                value={details.ticketUrl || details.qrCodeLink || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange({ 
                    ticketUrl: val,
                    qrCodeLink: val
                  });
                }}
                placeholder="e.g. https://howler.co.za/events/summer-fest"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl pl-3.5 pr-9 py-2 text-sm font-medium text-neutral-100 placeholder-neutral-600 outline-none transition-all shadow-inner"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                <LinkIcon className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Save Event Info Modal */}
      <SaveEventInfoModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        currentDetails={details}
        onSaveProfile={handleSaveProfile}
        existingProfiles={savedProfiles}
      />

    </div>
  );
};


