import React, { useState, useEffect, useRef } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Wind, 
  Sun, 
  Moon, 
  Zap, 
  Thermometer, 
  Check, 
  Play, 
  RotateCcw,
  Compass,
  Radio
} from 'lucide-react';
import { speakWelcomeGreeting, playAtmosphericChime } from '../utils/audioVoiceEngine';

interface WeatherWelcomeScreenProps {
  onEnterApp: () => void;
  defaultCity?: string;
}

type WeatherTheme = 'sunset' | 'aurora' | 'storm' | 'golden' | 'mist';

interface WeatherThemeConfig {
  id: WeatherTheme;
  title: string;
  condition: string;
  temp: string;
  tagline: string;
  gradient: string;
  accentColor: string;
  glowColor: string;
  particleType: 'fireflies' | 'stars' | 'rain' | 'sunbeams' | 'fog';
}

const WEATHER_THEMES: WeatherThemeConfig[] = [
  {
    id: 'sunset',
    title: 'Sunset Solstice',
    condition: 'Golden Hour Dusk • Clear Skies',
    temp: '26°C',
    tagline: 'Warm amber tones & glowing twilight horizons',
    gradient: 'from-amber-950/90 via-purple-950/80 to-neutral-950',
    accentColor: 'text-amber-400',
    glowColor: 'bg-amber-500/20',
    particleType: 'fireflies',
  },
  {
    id: 'aurora',
    title: 'Midnight Aurora',
    condition: 'Cosmic Borealis • Electric Night',
    temp: '14°C',
    tagline: 'Deep indigo, emerald shimmer & starlight resonance',
    gradient: 'from-emerald-950/80 via-teal-950/80 to-neutral-950',
    accentColor: 'text-emerald-400',
    glowColor: 'bg-emerald-500/20',
    particleType: 'stars',
  },
  {
    id: 'storm',
    title: 'Electric Storm',
    condition: 'Thunder Neon • Rain Mist',
    temp: '19°C',
    tagline: 'High contrast electric violet & moody club atmosphere',
    gradient: 'from-indigo-950/90 via-violet-950/90 to-neutral-950',
    accentColor: 'text-indigo-400',
    glowColor: 'bg-indigo-500/25',
    particleType: 'rain',
  },
  {
    id: 'golden',
    title: 'Sahara Sunbeam',
    condition: 'Bright Radiant • Festival Heat',
    temp: '31°C',
    tagline: 'Vibrant golden radiance for outdoor celebrations',
    gradient: 'from-orange-950/90 via-amber-950/80 to-neutral-950',
    accentColor: 'text-orange-400',
    glowColor: 'bg-orange-500/20',
    particleType: 'sunbeams',
  },
  {
    id: 'mist',
    title: 'Ethereal Mist',
    condition: 'Overcast Chill • Velvet Fog',
    temp: '16°C',
    tagline: 'Minimalist sleek grayscale with subtle neon strikes',
    gradient: 'from-slate-950 via-zinc-900 to-neutral-950',
    accentColor: 'text-cyan-400',
    glowColor: 'bg-cyan-500/20',
    particleType: 'fog',
  },
];

export const WeatherWelcomeScreen: React.FC<WeatherWelcomeScreenProps> = ({
  onEnterApp,
  defaultCity = 'Global Vibes',
}) => {
  const [selectedTheme, setSelectedTheme] = useState<WeatherTheme>('sunset');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hasTriggeredVoice, setHasTriggeredVoice] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [voiceVolumeEnabled, setVoiceVolumeEnabled] = useState<boolean>(true);

  const currentConfig = WEATHER_THEMES.find(t => t.id === selectedTheme) || WEATHER_THEMES[0];

  // Progressive loading simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsReady(true);
          return 100;
        }
        const increment = Math.floor(Math.random() * 14) + 8;
        return Math.min(100, prev + increment);
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  // Voice play function
  const handlePlayVoice = () => {
    if (!voiceVolumeEnabled) return;
    setIsSpeaking(true);
    setHasTriggeredVoice(true);

    speakWelcomeGreeting(
      "Welcome, let's create the poster for your event",
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // Attempt initial voice greeting on mount / user interaction
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      if (!hasTriggeredVoice && voiceVolumeEnabled) {
        handlePlayVoice();
      }
    }, 600);

    return () => clearTimeout(initialTimer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col justify-between p-4 sm:p-8 bg-neutral-950 text-neutral-100 overflow-hidden select-none transition-all duration-700`}>
      
      {/* Dynamic Animated Ambient Backdrop */}
      <div className={`absolute inset-0 bg-gradient-to-b ${currentConfig.gradient} opacity-90 transition-all duration-1000 pointer-events-none`} />

      {/* Floating Animated Weather Atmosphere Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-32 -left-32 w-96 h-96 ${currentConfig.glowColor} rounded-full blur-3xl animate-pulse transition-all duration-1000`} />
        <div className={`absolute top-1/3 -right-32 w-96 h-96 ${currentConfig.glowColor} rounded-full blur-3xl opacity-70 transition-all duration-1000`} />
        <div className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-3xl" />
        
        {/* Subtle Shimmer Dust / Rain particles */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-900/80 border border-neutral-700/60 backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/40">
            <CloudSun className="w-5 h-5 text-amber-400 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Atmospheric Poster Studio
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                Weather Edition
              </span>
            </h1>
            <p className="text-xs text-neutral-400 flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-neutral-500" />
              Dynamic Weather Lighting & Voice Intelligence
            </p>
          </div>
        </div>

        {/* Audio Voice Toggle & Skip */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (voiceVolumeEnabled) {
                window.speechSynthesis?.cancel();
                setIsSpeaking(false);
                setVoiceVolumeEnabled(false);
              } else {
                setVoiceVolumeEnabled(true);
                handlePlayVoice();
              }
            }}
            className={`p-2.5 rounded-2xl border backdrop-blur-md transition-all flex items-center gap-2 text-xs font-semibold ${
              voiceVolumeEnabled 
                ? 'bg-neutral-900/90 border-neutral-700 text-indigo-300 hover:bg-neutral-800' 
                : 'bg-neutral-900/50 border-neutral-800 text-neutral-500 hover:text-neutral-300'
            }`}
            title={voiceVolumeEnabled ? 'Mute Voice' : 'Enable Voice'}
          >
            {voiceVolumeEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{voiceVolumeEnabled ? 'Voice Active' : 'Muted'}</span>
          </button>

          <button
            onClick={onEnterApp}
            className="px-3.5 py-2 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 backdrop-blur-md text-xs font-semibold text-neutral-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>Skip to Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Center Welcome Card */}
      <main className="relative z-10 w-full max-w-3xl mx-auto my-auto py-6 flex flex-col items-center text-center">
        
        {/* Live Weather Badge & Current Temperature */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/80 backdrop-blur-xl shadow-2xl mb-5 animate-fadeIn">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-neutral-200">
            {currentConfig.condition}
          </span>
          <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
            {currentConfig.temp}
          </span>
        </div>

        {/* Big Hero Greeting Heading */}
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl leading-[1.15] mb-4">
          Atmospheric Poster Creator
        </h2>

        {/* Spoken Quote Banner with Equalizer Audio Visualizer */}
        <div className="w-full max-w-xl bg-neutral-900/90 border border-neutral-700/80 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl flex flex-col gap-3 my-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${isSpeaking ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                <Radio className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Voice Assistant Greeting:
              </span>
            </div>

            <button
              onClick={handlePlayVoice}
              className="px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-200 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isSpeaking ? 'Speaking...' : 'Play Voice'}</span>
            </button>
          </div>

          {/* Spoken Quote Text */}
          <div className="p-3 bg-neutral-950/80 rounded-2xl border border-neutral-800 text-left flex items-center justify-between gap-3">
            <p className="text-sm sm:text-base font-medium text-neutral-100 italic">
              “Welcome, let's create the poster for your event”
            </p>
            
            {/* Pulsing Audio Waves Visualizer */}
            <div className="flex items-center gap-1 h-6 shrink-0 px-2">
              {[40, 90, 60, 100, 70, 85, 45, 95].map((height, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isSpeaking 
                      ? 'bg-gradient-to-t from-indigo-500 to-rose-400' 
                      : 'bg-neutral-700'
                  }`}
                  style={{
                    height: isSpeaking ? `${Math.max(20, (height * (0.4 + Math.sin(Date.now() / 150 + i) * 0.6)))}%` : '20%',
                  }}
                />
              ))}
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 text-left">
            Tuned with velvety voice cadence, harmonic audio synthesizer, and real-time weather palette adaptation.
          </p>
        </div>

        {/* Weather Atmospheric Theme Selector */}
        <div className="w-full max-w-xl mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Select Weather Atmosphere:</span>
            <span className="text-[10px] text-neutral-500">Live preview lighting</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {WEATHER_THEMES.map((theme) => {
              const active = selectedTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme.id);
                    playAtmosphericChime();
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    active
                      ? 'bg-neutral-800 border-neutral-500 text-white shadow-lg scale-102'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <span className={`text-xs font-bold ${active ? theme.accentColor : 'text-neutral-300'}`}>
                    {theme.title.split(' ')[0]}
                  </span>
                  <span className="text-[9.5px] text-neutral-500 font-mono">
                    {theme.temp}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-full max-w-md mt-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-medium">
              {loadingProgress < 100 ? 'Initializing Weather Design Engine...' : 'Atmospheric Canvas Ready'}
            </span>
            <span className="font-mono text-indigo-400 font-bold">{loadingProgress}%</span>
          </div>

          <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-300 rounded-full shadow-md shadow-indigo-500/50"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>

        {/* Big Launch Studio Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <button
            onClick={() => {
              if (window.speechSynthesis && isSpeaking) {
                window.speechSynthesis.cancel();
              }
              onEnterApp();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all group"
          >
            <Sparkles className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
            <span>Enter Poster Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between text-[11px] text-neutral-500 pt-3 border-t border-neutral-900">
        <span className="flex items-center gap-1.5">
          <Wind className="w-3 h-3 text-neutral-400" />
          Live Weather Intelligence • Responsive High-DPI Poster Engine
        </span>
        <span className="font-mono">v2.4 Weather Edition</span>
      </footer>

    </div>
  );
};
