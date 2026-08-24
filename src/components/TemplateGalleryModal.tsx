import React, { useState } from 'react';
import { X, Sparkles, Layout, Check, Search, Wand2, ArrowRight, Tag } from 'lucide-react';
import { EVENT_TEMPLATES, PosterTemplate } from '../data/templates';
import { EventDetails, PosterDesignState } from '../types';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: PosterTemplate, mode: 'full' | 'style_only') => void;
  currentDetails: EventDetails;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  currentDetails,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredTemplate, setHoveredTemplate] = useState<PosterTemplate | null>(null);

  if (!isOpen) return null;

  const categories = [
    'All',
    'Music Festival',
    'Corporate Event',
    'Theatre & Gala',
    'Casual Gathering',
    'Nightlife & Rave',
    'Fitness & Wellness',
    'Food & Community',
  ];

  const filteredTemplates = EVENT_TEMPLATES.filter((tpl) => {
    const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      tpl.name.toLowerCase().includes(q) ||
      tpl.description.toLowerCase().includes(q) ||
      tpl.details.title.toLowerCase().includes(q) ||
      tpl.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between gap-4 bg-neutral-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
              <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                Event Poster Templates
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Select a professionally designed template or apply a template's font pairing & style directly to your active event details.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl border border-neutral-700 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="px-5 py-3 border-b border-neutral-800/80 bg-neutral-950/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 outline-none"
            />
          </div>
        </div>

        {/* Templates Grid Container */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onMouseEnter={() => setHoveredTemplate(tpl)}
              onMouseLeave={() => setHoveredTemplate(null)}
              className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:shadow-2xl"
            >
              {/* Visual Mini Poster Preview Header */}
              <div
                className="p-4 relative min-h-[160px] flex flex-col justify-between overflow-hidden border-b border-neutral-800"
                style={{ background: tpl.bgGradient || 'linear-gradient(135deg, #18181b, #09090b)' }}
              >
                {/* Subtle Overlay Grid */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />

                {/* Category Badge & Headline Font Badge */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white uppercase tracking-wider">
                    {tpl.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-mono text-neutral-300">
                    {tpl.fontHeaderName}
                  </span>
                </div>

                {/* Sample Headline in Template Font */}
                <div className="relative z-10 my-3">
                  <h3
                    className="text-lg sm:text-xl font-bold text-white drop-shadow-md leading-tight truncate"
                    style={{ fontFamily: tpl.fontHeader }}
                  >
                    {tpl.details.title}
                  </h3>
                  <p className="text-[11px] text-white/80 font-medium truncate mt-0.5">
                    {tpl.details.subtitle || tpl.details.venue}
                  </p>
                </div>

                {/* Promotional Badge preview */}
                <div className="relative z-10">
                  <span className="text-[9px] font-bold tracking-widest text-white/90 bg-white/15 backdrop-blur-md px-2 py-1 rounded border border-white/20 truncate block">
                    {tpl.badgeText}
                  </span>
                </div>
              </div>

              {/* Template Body Info */}
              <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                <div>
                  <h4 className="font-bold text-sm text-neutral-100">{tpl.name}</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-snug line-clamp-2">
                    {tpl.description}
                  </p>
                </div>

                {/* Fonts & Style Info */}
                <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-2 border-t border-neutral-900">
                  <span className="font-mono truncate">
                    Pairing: <strong className="text-neutral-300">{tpl.fontHeaderName}</strong> + <strong className="text-neutral-300">{tpl.fontBodyName}</strong>
                  </span>
                  <span className="shrink-0 text-indigo-400 font-semibold">
                    {tpl.presetId.replace('ig-', 'IG ').replace('fb-', 'FB ')}
                  </span>
                </div>

                {/* Dual Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  
                  {/* Action 1: Load Full Template */}
                  <button
                    onClick={() => onSelectTemplate(tpl, 'full')}
                    className="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
                    title="Load full template including sample event details"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Load All</span>
                  </button>

                  {/* Action 2: Apply Style To My Current Details */}
                  <button
                    onClick={() => onSelectTemplate(tpl, 'style_only')}
                    className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold border border-neutral-800 transition-all flex items-center justify-center gap-1.5"
                    title={`Apply font pairing and style to "${currentDetails.title || 'My Event'}"`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Style My Event</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-500">
          <span>Showing {filteredTemplates.length} Event Templates</span>
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 font-medium">Tip:</span>
            <span>"Style My Event" keeps your existing event text and applies template fonts & palette!</span>
          </div>
        </div>

      </div>
    </div>
  );
};
