import React, { useState } from 'react';
import { BookmarkPlus, X, Calendar, Check, Repeat, Sparkles } from 'lucide-react';
import { EventDetails, EventRecurrenceType, SavedEventProfile } from '../types';

interface SaveEventInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDetails: EventDetails;
  onSaveProfile: (profile: SavedEventProfile) => void;
  existingProfiles: SavedEventProfile[];
}

export const SaveEventInfoModal: React.FC<SaveEventInfoModalProps> = ({
  isOpen,
  onClose,
  currentDetails,
  onSaveProfile,
  existingProfiles,
}) => {
  const defaultTitle = currentDetails.event || currentDetails.title || 'My Recurring Event';
  const [profileName, setProfileName] = useState<string>(defaultTitle);
  const [recurrence, setRecurrence] = useState<EventRecurrenceType>('monthly');
  const [selectedOverwriteId, setSelectedOverwriteId] = useState<string>('new');
  const [editionCount, setEditionCount] = useState<number>(1);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    const id = selectedOverwriteId === 'new' 
      ? `profile-${Date.now()}`
      : selectedOverwriteId;

    const newProfile: SavedEventProfile = {
      id,
      name: profileName.trim(),
      recurrence,
      editionCount,
      createdAt: new Date().toISOString(),
      lastUsedDate: new Date().toISOString(),
      details: { ...currentDetails },
    };

    onSaveProfile(newProfile);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-neutral-200 flex flex-col gap-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800/60 hover:bg-neutral-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
            <BookmarkPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-100">
              Save Event Info Template
            </h2>
            <p className="text-xs text-neutral-400">
              Save this event's venue, lineup format & pricing for future rounds
            </p>
          </div>
        </div>

        {savedSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-2 text-emerald-400">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <p className="font-bold text-sm">Event Info Saved Successfully!</p>
            <p className="text-xs text-neutral-400">Ready to recall anytime for next rounds.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Overwrite or New */}
            {existingProfiles.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Save Mode:
                </label>
                <select
                  value={selectedOverwriteId}
                  onChange={(e) => {
                    setSelectedOverwriteId(e.target.value);
                    if (e.target.value !== 'new') {
                      const match = existingProfiles.find(p => p.id === e.target.value);
                      if (match) {
                        setProfileName(match.name);
                        setRecurrence(match.recurrence);
                        setEditionCount((match.editionCount || 1) + 1);
                      }
                    }
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-neutral-200 outline-none focus:border-indigo-500/50"
                >
                  <option value="new">+ Create New Saved Event Template</option>
                  {existingProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      Update Existing: {p.name} ({p.recurrence})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Profile Nickname */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Event Profile Name:
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g. Monthly Deep House Lounge"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-neutral-100 placeholder-neutral-600 outline-none transition-all"
              />
            </div>

            {/* Recurrence Frequency */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                Event Recurrence Frequency:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'Monthly', value: 'monthly' as EventRecurrenceType },
                  { label: 'Annual', value: 'annual' as EventRecurrenceType },
                  { label: 'Weekly', value: 'weekly' as EventRecurrenceType },
                  { label: 'Custom', value: 'custom' as EventRecurrenceType },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => setRecurrence(item.value)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      recurrence === item.value
                        ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Snapshot Summary of Details to be saved */}
            <div className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-2xl flex flex-col gap-1.5 text-xs text-neutral-400">
              <span className="font-bold text-neutral-300 text-[11px] uppercase tracking-wider">
                Captured Event Blueprint:
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <p className="truncate"><span className="text-neutral-500">Event:</span> {currentDetails.event || currentDetails.title || 'Untitled'}</p>
                <p className="truncate"><span className="text-neutral-500">Venue:</span> {currentDetails.venue || 'No venue'}</p>
                <p className="truncate"><span className="text-neutral-500">Time:</span> {currentDetails.time || 'Not set'}</p>
                <p className="truncate"><span className="text-neutral-500">Price:</span> {currentDetails.ticketPrice || 'Not set'}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Save Event Template</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
