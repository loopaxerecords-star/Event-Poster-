import React from 'react';
import { Bookmark, X, Trash2, ArrowRight, Download, Calendar } from 'lucide-react';
import { SavedPoster } from '../types';

interface SavedPostersModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPosters: SavedPoster[];
  onLoadPoster: (poster: SavedPoster) => void;
  onDeletePoster: (id: string) => void;
}

export const SavedPostersModal: React.FC<SavedPostersModalProps> = ({
  isOpen,
  onClose,
  savedPosters,
  onLoadPoster,
  onDeletePoster,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-white flex flex-col gap-4 max-h-[85vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-fuchsia-500/20 border border-fuchsia-500/30 rounded-xl text-fuchsia-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">
              Your Saved Poster Gallery
            </h2>
            <p className="text-xs text-slate-400">
              {savedPosters.length} saved designs in local memory
            </p>
          </div>
        </div>

        {/* Empty State */}
        {savedPosters.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-3 text-slate-400 bg-slate-950/50 rounded-2xl border border-slate-800">
            <Bookmark className="w-10 h-10 text-slate-600" />
            <p className="font-semibold text-sm">No saved posters yet</p>
            <p className="text-xs text-slate-500 max-w-sm">
              Click 'Export PNG' or 'Save Design' while creating a poster to save it here for future editing!
            </p>
          </div>
        ) : (
          /* List of Saved Posters */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 max-h-96">
            {savedPosters.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3 group transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-12 h-16 object-cover rounded-lg border border-slate-800 shadow"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                      <Bookmark className="w-5 h-5" />
                    </div>
                  )}

                  <div className="truncate">
                    <h4 className="font-bold text-xs text-white truncate">
                      {item.title || 'Untitled Event'}
                    </h4>
                    <p className="text-[10px] text-fuchsia-400 font-semibold truncate">
                      {item.designState.preset.name} ({item.designState.preset.aspectRatioLabel})
                    </p>
                    <span className="text-[9px] text-slate-500 block mt-1">
                      {new Date(item.dateCreated).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      onLoadPoster(item);
                      onClose();
                    }}
                    className="p-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg text-xs font-semibold shadow transition-all flex items-center gap-1"
                    title="Load to Editor"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeletePoster(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-all"
                    title="Delete Saved Design"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
