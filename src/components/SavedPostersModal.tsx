import React from 'react';
import { Bookmark, X, Trash2, ArrowRight, Download, Calendar, Sparkles } from 'lucide-react';
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

  const handleDownloadSavedThumb = (item: SavedPoster) => {
    if (!item.thumbnailUrl) return;
    const a = document.createElement('a');
    a.href = item.thumbnailUrl;
    const sanitizedTitle = (item.title || 'saved-poster').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.download = `${sanitizedTitle}.png`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) document.body.removeChild(a);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-neutral-200 flex flex-col gap-4 max-h-[85vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800/60 hover:bg-neutral-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-100">
              Saved Poster Gallery
            </h2>
            <p className="text-xs text-neutral-400">
              {savedPosters.length} {savedPosters.length === 1 ? 'design' : 'designs'} stored locally in your workspace
            </p>
          </div>
        </div>

        {/* Empty State */}
        {savedPosters.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-3 text-neutral-400 bg-neutral-950/50 rounded-2xl border border-neutral-800/80">
            <Bookmark className="w-10 h-10 text-neutral-600" />
            <p className="font-semibold text-sm text-neutral-300">No saved posters yet</p>
            <p className="text-xs text-neutral-500 max-w-sm">
              Click 'Export PNG' or 'Save to Gallery' while creating a poster to store it here for one-click reload!
            </p>
          </div>
        ) : (
          /* List of Saved Posters */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 max-h-96">
            {savedPosters.map((item) => (
              <div
                key={item.id}
                className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-3 flex items-center justify-between gap-3 group transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-12 h-16 object-cover rounded-lg border border-neutral-800 shadow"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-neutral-900 rounded-lg flex items-center justify-center text-neutral-600 border border-neutral-800">
                      <Bookmark className="w-5 h-5" />
                    </div>
                  )}

                  <div className="truncate">
                    <h4 className="font-bold text-xs text-neutral-100 truncate">
                      {item.title || 'Untitled Event'}
                    </h4>
                    <p className="text-[10px] text-indigo-400 font-semibold truncate">
                      {item.designState.preset.name} ({item.designState.preset.aspectRatioLabel})
                    </p>
                    <span className="text-[9px] text-neutral-500 block mt-1">
                      {new Date(item.dateCreated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.thumbnailUrl && (
                    <button
                      onClick={() => handleDownloadSavedThumb(item)}
                      className="p-2 text-neutral-400 hover:text-emerald-400 rounded-lg hover:bg-neutral-900 transition-all"
                      title="Download Thumbnail PNG"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onLoadPoster(item);
                      onClose();
                    }}
                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-all flex items-center gap-1"
                    title="Load into Poster Canvas"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeletePoster(item.id)}
                    className="p-2 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-900 transition-all"
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
