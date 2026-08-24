import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Music, Mic, User } from 'lucide-react';
import { EventDetails } from '../types';

interface EventFormProps {
  details: EventDetails;
  onChange: (updated: Partial<EventDetails>) => void;
  onEnhanceWithAI: () => void;
  isAiLoading: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  details,
  onChange,
  onEnhanceWithAI,
  isAiLoading,
}) => {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-neutral-200 flex flex-col gap-4 shadow-xl">
      
      {/* Header & AI Polish Button */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          <h2 className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            Event Information Form
          </h2>
        </div>
        <button
          onClick={onEnhanceWithAI}
          disabled={isAiLoading}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-pulse" />
          <span>{isAiLoading ? 'Polishing...' : 'AI Enhance Copy'}</span>
        </button>
      </div>

      {/* Primary Required Form Fields: Event & Venue */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Event:
          </label>
          <input
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
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            Venue:
          </label>
          <input
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
        </div>

        {/* Artists Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800/80">
          
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              Artist 1:
            </label>
            <input
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
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Artist 2:
            </label>
            <input
              type="text"
              value={details.artist2 || ''}
              onChange={(e) => onChange({ artist2: e.target.value })}
              placeholder="e.g. The Neon Wave"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2 text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Artist 3:
            </label>
            <input
              type="text"
              value={details.artist3 || ''}
              onChange={(e) => onChange({ artist3: e.target.value })}
              placeholder="e.g. Luna Rays"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2 text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Artist 4:
            </label>
            <input
              type="text"
              value={details.artist4 || ''}
              onChange={(e) => onChange({ artist4: e.target.value })}
              placeholder="e.g. Solar Pulse"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2 text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-all"
            />
          </div>

        </div>

        {/* Date & Time Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800/80">
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Date:
            </label>
            <input
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

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              Time:
            </label>
            <input
              type="text"
              value={details.time || ''}
              onChange={(e) => onChange({ time: e.target.value })}
              placeholder="e.g. 8:00 PM - 3:00 AM"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2 text-sm font-medium text-neutral-100 placeholder-neutral-600 outline-none transition-all"
            />
          </div>
        </div>

      </div>

    </div>
  );
};

