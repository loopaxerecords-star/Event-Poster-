import { SavedEventProfile, EventDetails, EventRecurrenceType } from '../types';

export const DEFAULT_SAVED_EVENT_PROFILES: SavedEventProfile[] = [
  {
    id: 'profile-monthly-rooftop',
    name: 'Monthly Sunset Sessions',
    recurrence: 'monthly',
    editionCount: 12,
    createdAt: '2026-01-15T12:00:00.000Z',
    details: {
      event: 'SUNSET ROOFTOP SESSIONS',
      subtitle: 'SUNSET ROOFTOP SESSIONS',
      venue: 'The Highline Sky Lounge, Cape Town',
      location: 'The Highline Sky Lounge, Cape Town',
      artist1: 'DEEP SOUL COLLECTIVE',
      artist2: 'Nora En Pure (Guest)',
      artist3: 'DJ Solar',
      artist4: 'Acoustic Groove',
      date: 'SATURDAY, OCT 17, 2026',
      displayDate: 'SATURDAY, OCT 17, 2026',
      time: '4:00 PM - 11:30 PM',
      ticketPrice: 'R180 PRESALE / R250 DOOR',
      ticketUrl: 'https://howler.co.za/events/sunset-sessions',
      category: 'MUSIC FESTIVAL / LOUNGE',
    }
  },
  {
    id: 'profile-annual-solstice',
    name: 'Annual Summer Solstice Fest',
    recurrence: 'annual',
    editionCount: 5,
    createdAt: '2026-01-10T10:00:00.000Z',
    details: {
      event: 'ANNUAL SUMMER SOLSTICE FESTIVAL',
      subtitle: 'ANNUAL SUMMER SOLSTICE FESTIVAL',
      venue: 'Wilderness Valley Amphitheater',
      location: 'Wilderness Valley Amphitheater',
      artist1: 'THE ASTRAL ECHOES',
      artist2: 'Cosmic Resonance',
      artist3: 'Horizon Waves',
      artist4: 'Midnight Sound',
      date: 'DECEMBER 21, 2026',
      displayDate: 'DECEMBER 21, 2026',
      time: '12:00 PM - 2:00 AM',
      ticketPrice: 'R450 GENERAL / R850 VIP',
      ticketUrl: 'https://quicket.co.za/events/summer-solstice',
      category: 'ANNUAL FESTIVAL',
    }
  },
  {
    id: 'profile-weekly-jazz',
    name: 'Weekly First Friday Jazz',
    recurrence: 'monthly',
    editionCount: 24,
    createdAt: '2026-02-01T08:00:00.000Z',
    details: {
      event: 'FIRST FRIDAY JAZZ & COCKTAILS',
      subtitle: 'FIRST FRIDAY JAZZ & COCKTAILS',
      venue: 'The Blue Note Speakeasy',
      location: 'The Blue Note Speakeasy',
      artist1: 'MILES BEYOND QUARTET',
      artist2: 'Elena & The Brass Keys',
      artist3: 'Smooth Velvet Trio',
      artist4: 'DJ Vinyl Lounge',
      date: 'FRIDAY, NOV 6, 2026',
      displayDate: 'FRIDAY, NOV 6, 2026',
      time: '7:30 PM - 12:00 AM',
      ticketPrice: 'FREE ENTRY / TABLE BOOKINGS R120',
      ticketUrl: 'https://bluenote.club/reservations',
      category: 'LIVE JAZZ',
    }
  }
];

const STORAGE_KEY = 'ai_poster_saved_event_profiles_v1';

export function getSavedEventProfiles(): SavedEventProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAVED_EVENT_PROFILES));
      return DEFAULT_SAVED_EVENT_PROFILES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_SAVED_EVENT_PROFILES;
  } catch (err) {
    console.warn('Failed to load saved event profiles from localStorage:', err);
    return DEFAULT_SAVED_EVENT_PROFILES;
  }
}

export function saveEventProfileToStorage(profile: SavedEventProfile): SavedEventProfile[] {
  try {
    const current = getSavedEventProfiles();
    const existingIndex = current.findIndex(p => p.id === profile.id);
    let updated: SavedEventProfile[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...profile, lastUsedDate: new Date().toISOString() };
    } else {
      updated = [{ ...profile, lastUsedDate: new Date().toISOString() }, ...current];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save event profile to storage:', err);
    return getSavedEventProfiles();
  }
}

export function deleteEventProfileFromStorage(profileId: string): SavedEventProfile[] {
  try {
    const current = getSavedEventProfiles();
    const updated = current.filter(p => p.id !== profileId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete event profile from storage:', err);
    return getSavedEventProfiles();
  }
}

/**
 * Smart date calculation: takes any date string and increments by 1 month, 1 year, or 1 week
 */
export function advanceDateString(dateStr: string, interval: 'month' | 'year' | 'week'): string {
  if (!dateStr || !dateStr.trim()) {
    const now = new Date();
    if (interval === 'month') now.setMonth(now.getMonth() + 1);
    else if (interval === 'year') now.setFullYear(now.getFullYear() + 1);
    else if (interval === 'week') now.setDate(now.getDate() + 7);
    return formatDateNicely(now);
  }

  // Try parsing directly
  let parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    // Try cleaning common prefix strings like "SATURDAY, ", "FRIDAY, "
    const cleaned = dateStr.replace(/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)[,\s]+/i, '');
    parsed = new Date(cleaned);
  }

  if (isNaN(parsed.getTime())) {
    // If still unparseable, return current date advanced
    const fallback = new Date();
    if (interval === 'month') fallback.setMonth(fallback.getMonth() + 1);
    else if (interval === 'year') fallback.setFullYear(fallback.getFullYear() + 1);
    else if (interval === 'week') fallback.setDate(fallback.getDate() + 7);
    return formatDateNicely(fallback);
  }

  const nextDate = new Date(parsed);
  if (interval === 'month') {
    nextDate.setMonth(nextDate.getMonth() + 1);
  } else if (interval === 'year') {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  } else if (interval === 'week') {
    nextDate.setDate(nextDate.getDate() + 7);
  }

  return formatDateNicely(nextDate);
}

function formatDateNicely(d: Date): string {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  const dayName = days[d.getDay()];
  const monthName = months[d.getMonth()];
  const dayNum = d.getDate();
  const year = d.getFullYear();

  return `${dayName}, ${monthName} ${dayNum}, ${year}`;
}
