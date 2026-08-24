import React, { useState } from 'react';
import { Sparkles, X, Wand2, ArrowRight } from 'lucide-react';

interface QuickPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPrompt: (promptText: string) => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = [
  '🌴 Summer Solstice Beach Rave in Miami Beach with DJ Neon & Sunset Cocktail Bar on Saturday night',
  '🤖 AI & Tech Innovators Summit 2026 in San Francisco - Keynotes, Networking & Demos',
  '🎷 VIP Jazz & Pinot Noir Evening in Paris - Live Quartet at Le Grand Lounge',
  '⚡ Cyberpunk Underground Warehouse Rave in Berlin - Industrial Techno & Laser Show',
  '☕ Cozy Acoustic Folk & Coffee Sessions in London on a rainy Sunday afternoon',
  '🏋️ Annual CrossFit Championship & Wellness Expo in Austin, TX'
];

export const QuickPromptModal: React.FC<QuickPromptModalProps> = ({
  isOpen,
  onClose,
  onSubmitPrompt,
  isLoading,
}) => {
  const [promptText, setPromptText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    onSubmitPrompt(promptText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-xl shadow-lg shadow-fuchsia-500/25">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              One-Click AI Poster Generator
            </h2>
            <p className="text-xs text-slate-400">
              Describe your event in plain words. AI will craft the copy, weather forecast, color palette & layout instantly!
            </p>
          </div>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. Cyberpunk EDM DJ Night in Tokyo at Club Shibuya on Oct 30, free entry before 11 PM..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 outline-none resize-none transition-all"
              autoFocus
            />
          </div>

          {/* Sample Prompts */}
          <div>
            <span className="text-xs font-semibold text-slate-400 mb-2 block">
              Or click a sample prompt to try:
            </span>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPromptText(sample)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700/80 rounded-lg text-xs text-slate-300 hover:text-white transition-all text-left truncate max-w-full"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !promptText.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-fuchsia-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-fuchsia-200 animate-spin-slow" />
              <span>{isLoading ? 'Generating Poster with AI...' : 'Generate Magic Poster'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
