import React, { useState } from 'react';
import { Sparkles, Check, Type, Layers, Info } from 'lucide-react';
import { FontPairing, FONT_PAIRINGS } from '../data/fontPairings';
import { EventDetails, PosterStyleConfig } from '../types';
import { recommendFontPairing } from '../utils/fontPairingEngine';

interface FontPairingSectionProps {
  style: PosterStyleConfig;
  details: EventDetails;
  currentFontHeader: string;
  currentFontBody: string;
  onApplyFontPairing: (pairing: { fontHeader: string; fontBody: string; name: string }) => void;
}

export const FontPairingSection: React.FC<FontPairingSectionProps> = ({
  style,
  details,
  currentFontHeader,
  currentFontBody,
  onApplyFontPairing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Compute AI Recommendation
  const recommendation = recommendFontPairing(style, details);
  const { recommendedPairing, reasoning } = recommendation;

  const categories = ['All', 'Music Festival', 'Corporate', 'Theatre & Gala', 'Casual & Community', 'Nightlife', 'Fitness & Sports'];

  const filteredPairings = selectedCategory === 'All'
    ? FONT_PAIRINGS
    : FONT_PAIRINGS.filter(p => p.category === selectedCategory || p.category === 'Universal');

  return (
    <div className="flex flex-col gap-4">
      
      {/* Top AI Smart Recommendation Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-neutral-900 to-neutral-900 border border-indigo-500/30 rounded-2xl p-4 flex flex-col gap-3 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              AI Recommended Font Pairing
            </span>
          </div>
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
            98% Aesthetic Match
          </span>
        </div>

        {/* Pairing Name & Typography Preview Box */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-200">{recommendedPairing.name}</span>
            <span className="text-[10px] font-mono text-neutral-400">
              {recommendedPairing.headlineFontLabel} + {recommendedPairing.bodyFontLabel}
            </span>
          </div>

          {/* Mini Live Preview */}
          <div className="py-2 border-y border-neutral-800/60 my-1">
            <h4 
              className="text-lg font-bold text-neutral-100 truncate leading-tight tracking-tight"
              style={{ fontFamily: recommendedPairing.headlineFont }}
            >
              {details.title || recommendedPairing.sampleHeadline}
            </h4>
            <p 
              className="text-xs text-neutral-400 truncate mt-0.5"
              style={{ fontFamily: recommendedPairing.bodyFont }}
            >
              {details.subtitle || details.location || 'Aesthetic Primary Headline & Clean Readable Body Pair'}
            </p>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed flex items-start gap-1.5 mt-0.5">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <span>{reasoning}</span>
          </p>
        </div>

        {/* One-Click Apply Button */}
        <button
          onClick={() => onApplyFontPairing({
            fontHeader: recommendedPairing.headlineFont,
            fontBody: recommendedPairing.bodyFont,
            name: recommendedPairing.name,
          })}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span>Apply Recommended Font Pairing</span>
        </button>
      </div>

      {/* Category Filters for Font Library */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Curated Font Pairings Library
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500">
            {filteredPairings.length} Options
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-neutral-800 text-indigo-300 border border-indigo-500/50 font-semibold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Font Pairing Cards */}
      <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredPairings.map((pairing) => {
          const isApplied = currentFontHeader === pairing.headlineFont && currentFontBody === pairing.bodyFont;

          return (
            <button
              key={pairing.id}
              onClick={() => onApplyFontPairing({
                fontHeader: pairing.headlineFont,
                fontBody: pairing.bodyFont,
                name: pairing.name,
              })}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col gap-2 ${
                isApplied
                  ? 'bg-neutral-950 border-2 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-950'
              }`}
            >
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-200">{pairing.name}</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] text-neutral-400">
                    {pairing.category}
                  </span>
                </div>
                {isApplied ? (
                  <span className="flex items-center gap-1 text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-md border border-indigo-500/30">
                    <Check className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="text-[10px] text-neutral-500 hover:text-indigo-400">
                    Apply Pair
                  </span>
                )}
              </div>

              {/* Sample Typography Preview */}
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-2.5 flex flex-col gap-0.5">
                <div 
                  className="text-base font-bold text-neutral-100 truncate leading-tight"
                  style={{ fontFamily: pairing.headlineFont }}
                >
                  {details.title || pairing.sampleHeadline}
                </div>
                <div 
                  className="text-xs text-neutral-400 truncate"
                  style={{ fontFamily: pairing.bodyFont }}
                >
                  {details.subtitle || 'Primary headline & secondary body text typography harmony'}
                </div>
              </div>

              {/* Fonts metadata & tag */}
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span className="font-mono bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  Header: {pairing.headlineFontLabel}
                </span>
                <span className="font-mono bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  Body: {pairing.bodyFontLabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
