import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Wand2, 
  Layers, 
  FileText, 
  Type, 
  Sliders, 
  Eye, 
  EyeOff, 
  Info,
  RefreshCw,
  Award,
  Maximize2,
  X
} from 'lucide-react';
import { PosterDesignState, ArtDirectorAuditResult, AntiAiTextureType } from '../types';
import { runArtDirectorAudit, snobProofAndSanitizePoster, PROMOTER_TEMPLATES, VENUE_LEGAL_NOTICES } from '../utils/artDirectorEngine';

interface ArtDirectorInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: PosterDesignState;
  onDesignChange: (updated: Partial<PosterDesignState>) => void;
}

export const ArtDirectorInspectorModal: React.FC<ArtDirectorInspectorModalProps> = ({
  isOpen,
  onClose,
  design,
  onDesignChange,
}) => {
  const [audit, setAudit] = useState<ArtDirectorAuditResult>(() => runArtDirectorAudit(design));
  const [isCritiquing, setIsCritiquing] = useState(false);
  const [aiCritique, setAiCritique] = useState<{
    verdict?: string;
    critiqueSummary?: string;
    highlights?: string[];
    recommendations?: string[];
    promoterTagline?: string;
    snobProofRating?: number;
  } | null>(null);

  // Recalculate audit whenever design changes
  useEffect(() => {
    setAudit(runArtDirectorAudit(design));
  }, [design]);

  if (!isOpen) return null;

  const handleApplySanitize = () => {
    const fixed = snobProofAndSanitizePoster(design);
    onDesignChange(fixed);
  };

  const handleRunAiCritique = async () => {
    setIsCritiquing(true);
    try {
      const res = await fetch('/api/ai/art-director-critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventDetails: design.details,
          styleName: design.style.name,
          paletteName: design.palette.name,
          texture: design.antiAiTexture || 'none',
          layoutDensity: design.layoutDensity || 'normal',
          score: audit.overallScore,
        }),
      });

      const data = await res.json();
      if (data && data.data) {
        setAiCritique(data.data);
      }
    } catch (err) {
      console.warn('AI critique failed, using fallback:', err);
    } finally {
      setIsCritiquing(false);
    }
  };

  const textures: { id: AntiAiTextureType; label: string; desc: string }[] = [
    { id: 'none', label: 'Raw Digital', desc: 'No analog grain' },
    { id: 'risograph', label: 'Risograph Print', desc: 'Warm stippled indie ink finish' },
    { id: 'matte_grain', label: 'Matte Fine Art Paper', desc: 'Subtle high-end studio press texture' },
    { id: 'analog_film', label: '35mm Film Grain', desc: 'Classic organic cinematic grain' },
    { id: 'halftone', label: 'CMYK Halftone', desc: 'Retro screenprint dot matrix' },
    { id: 'recycled_paper', label: 'Heavy Artboard', desc: 'Natural fiber tactile substrate' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-700 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Background Art Director AI
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Snob-Proof Engine
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Preflight guard ensuring your poster meets strict gallery, venue & club curation standards.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Top Score Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-neutral-800"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="currentColor"
                    strokeWidth="6"
                    className={
                      audit.overallScore >= 90
                        ? 'text-emerald-400'
                        : audit.overallScore >= 75
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }
                    strokeDasharray={213}
                    strokeDashoffset={213 - (213 * audit.overallScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-white">{audit.overallScore}</span>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase">SCORE</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-white">{audit.verdict}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase ${
                    audit.grade === 'A+' ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    GRADE {audit.grade}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-1 max-w-md">
                  {audit.summary}
                </p>
              </div>
            </div>

            {/* Quick 1-Click Polish Button */}
            <button
              onClick={handleApplySanitize}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95 shrink-0"
            >
              <Wand2 className="w-4 h-4" />
              <span>1-Click Snob-Proof Polish</span>
            </button>
          </div>

          {/* Heuristic Checklist Cards */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preflight Audit Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {audit.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {item.status === 'pass' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        {item.status === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        {item.status === 'alert' && <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                        {item.label}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-neutral-400">
                        {item.score}%
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 leading-relaxed mb-2">
                      {item.critique}
                    </p>
                  </div>

                  <div className="text-[10px] font-medium text-emerald-300/90 pt-2 border-t border-neutral-800/50 flex items-center justify-between">
                    <span>💡 {item.suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tactile Texture & Anti-AI Plastic Sheen Neutralizer */}
          <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Anti-AI Tactile Grain & Micro-Texture
                </h4>
              </div>
              <span className="text-[10px] text-neutral-400">Neutralizes synthetic smoothness</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {textures.map((t) => {
                const isSelected = (design.antiAiTexture || 'none') === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onDesignChange({ antiAiTexture: t.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-sm'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white block">{t.label}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Venue Credibility & Promoter Lockup Settings */}
          <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Venue Industry Credibility Bar & Microtype
                </h4>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-300">
                <input
                  type="checkbox"
                  checked={design.venueCredibilityBar !== false}
                  onChange={(e) => onDesignChange({ venueCredibilityBar: e.target.checked })}
                  className="rounded border-neutral-700 text-emerald-500 focus:ring-0"
                />
                <span>Enable Credibility Footer</span>
              </label>
            </div>

            {design.venueCredibilityBar !== false && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Promoter / Presenter Lockup
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={design.promoterText || PROMOTER_TEMPLATES[0]}
                      onChange={(e) => onDesignChange({ promoterText: e.target.value })}
                      className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. PRESENTED IN COLLABORATION WITH..."
                    />
                    <button
                      onClick={() => {
                        const randomTemplate = PROMOTER_TEMPLATES[Math.floor(Math.random() * PROMOTER_TEMPLATES.length)];
                        onDesignChange({ promoterText: randomTemplate });
                      }}
                      className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-[11px] font-bold text-neutral-300 transition-colors"
                      title="Cycle standard promoter lockup"
                    >
                      Cycle
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Club Legal Admission / Age Policy Notice
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={design.venueLegalNotice || VENUE_LEGAL_NOTICES[0]}
                      onChange={(e) => onDesignChange({ venueLegalNotice: e.target.value })}
                      className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. STRICTLY 18+ • R.O.A.R • CASHLESS VENUE"
                    />
                    <button
                      onClick={() => {
                        const randomNotice = VENUE_LEGAL_NOTICES[Math.floor(Math.random() * VENUE_LEGAL_NOTICES.length)];
                        onDesignChange({ venueLegalNotice: randomNotice });
                      }}
                      className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-[11px] font-bold text-neutral-300 transition-colors"
                      title="Cycle legal notice"
                    >
                      Cycle
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                    <input
                      type="checkbox"
                      checked={design.showBarcode !== false}
                      onChange={(e) => onDesignChange({ showBarcode: e.target.checked })}
                      className="rounded border-neutral-700 text-emerald-500 focus:ring-0"
                    />
                    <span>Show Vector Security Barcode</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                    <input
                      type="checkbox"
                      checked={design.printBleedGuideVisible === true}
                      onChange={(e) => onDesignChange({ printBleedGuideVisible: e.target.checked })}
                      className="rounded border-neutral-700 text-emerald-500 focus:ring-0"
                    />
                    <span>Show 0.125" Print Bleed Safe Guide</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Deep AI Creative Director Review */}
          <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Deep AI Creative Director Review (Gemini 3.7)</span>
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Get a personalized critique from an agency design director.
                </p>
              </div>

              <button
                onClick={handleRunAiCritique}
                disabled={isCritiquing}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isCritiquing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                <span>{isCritiquing ? 'Analyzing...' : 'Run Agency Critique'}</span>
              </button>
            </div>

            {aiCritique && (
              <div className="mt-4 p-4 rounded-xl bg-neutral-900/80 border border-purple-500/30 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">
                    Verdict: {aiCritique.verdict}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 text-[10px] font-mono font-bold">
                    {aiCritique.snobProofRating}% SNOB-PROOF
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  "{aiCritique.critiqueSummary}"
                </p>

                {aiCritique.highlights && aiCritique.highlights.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">
                      Agency Craft Highlights:
                    </span>
                    <ul className="text-xs text-neutral-300 space-y-1 pl-4 list-disc">
                      {aiCritique.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiCritique.recommendations && aiCritique.recommendations.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-400 block mb-1">
                      Final Human-Touch Recommendations:
                    </span>
                    <ul className="text-xs text-neutral-300 space-y-1 pl-4 list-disc">
                      {aiCritique.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed rejection-free for print & social distribution.</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
