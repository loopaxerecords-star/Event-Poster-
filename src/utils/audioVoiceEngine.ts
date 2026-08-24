// Ambient Audio & Silky Voice Greeting Engine for Weather Poster Creator

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('AudioContext not available:', e);
    return null;
  }
}

/**
 * Play a cinematic warm ambient chime (soft atmospheric chords with slow decay)
 */
export function playAtmosphericChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // Warm harmonic chord notes: F3, C4, Eb4, G4, Bb4 (F9/Ebmaj7 feel)
    const frequencies = [174.61, 261.63, 311.13, 392.00, 466.16];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      // Lowpass filter for velvety, warm atmosphere
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200 - idx * 100, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 3.5);

      // Gentle attack and slow, lush release
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.045 / frequencies.length, now + 0.3 + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 3.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + 3.5);
    });
  } catch (err) {
    console.warn('Chime playback error:', err);
  }
}

/**
 * Play a soft gentle transition ping for field guidance navigation
 */
export function playGentleFieldPing() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.03, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  } catch (e) {
    // ignore
  }
}

export interface FieldVoiceGuide {
  fieldKey: string;
  fieldLabel: string;
  voicePrompt: string;
  hint: string;
}

export const FIELD_VOICE_GUIDES: FieldVoiceGuide[] = [
  {
    fieldKey: 'event',
    fieldLabel: 'Event Title',
    voicePrompt: "Let's begin with the name of your event. What title should take center stage on your poster?",
    hint: 'e.g. Summer Solstice Music Fest, Sunset Sessions, Neon Horizon',
  },
  {
    fieldKey: 'venue',
    fieldLabel: 'Venue & Location',
    voicePrompt: "Fabulous. Where is this magic happening? Enter your venue, club, or city.",
    hint: 'e.g. Oceanside Amphitheater, Club Mirage, Cape Town Waterfront',
  },
  {
    fieldKey: 'artist1',
    fieldLabel: 'Headliner (Artist 1)',
    voicePrompt: "Who is headlining the night? Tell me your main artist or featured performer.",
    hint: 'e.g. Echo Beats, Black Coffee, DJ Solstice (Main Act)',
  },
  {
    fieldKey: 'artist2',
    fieldLabel: 'Supporting Artist 2',
    voicePrompt: "Now, who will be joining them? Add your second artist or special guest.",
    hint: 'e.g. The Neon Wave, Luna Rays',
  },
  {
    fieldKey: 'artist3',
    fieldLabel: 'Supporting Artist 3',
    voicePrompt: "Let's expand the lineup. Who else is taking the stage?",
    hint: 'e.g. Solar Pulse, Midnight Vibe',
  },
  {
    fieldKey: 'artist4',
    fieldLabel: 'Supporting Artist 4',
    voicePrompt: "And who rounds out the night? Add your fourth performer.",
    hint: 'e.g. Sonic Dream, DJ Velvet',
  },
  {
    fieldKey: 'date',
    fieldLabel: 'Event Date',
    voicePrompt: "When is the big night? Set the date for your celebration.",
    hint: 'e.g. Saturday, Sep 18, 2026',
  },
  {
    fieldKey: 'time',
    fieldLabel: 'Doors & Showtime',
    voicePrompt: "What time do the doors open and the music start?",
    hint: 'e.g. 8:00 PM - 3:00 AM / Sunset Till Late',
  },
  {
    fieldKey: 'ticketPrice',
    fieldLabel: 'Ticket Price',
    voicePrompt: "What are the ticket prices, VIP passes, or door cover?",
    hint: 'e.g. R150 Early Bird / R250 VIP / Free Before 9PM',
  },
  {
    fieldKey: 'ticketUrl',
    fieldLabel: 'Ticket URL & QR Code',
    voicePrompt: "Where can your fans grab tickets? Enter your ticket link or website for the QR code.",
    hint: 'e.g. https://howler.co.za/events/solstice',
  },
];

/**
 * Speaks any phrase using the alluring, seductive female voice
 */
export function speakAlluringVoice(
  phrase: string,
  playChimeFirst: boolean = false,
  onStart?: () => void,
  onEnd?: () => void
): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve(false);
      return;
    }

    try {
      if (playChimeFirst) {
        playAtmosphericChime();
      }

      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(phrase);

      // Seductive, warm voice tuning: slightly relaxed cadence and gentle warm pitch
      utterance.rate = 0.88; // Smooth, alluring pacing
      utterance.pitch = 0.95; // Warm, resonant, sultry tone
      utterance.volume = 1.0;

      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        
        // Priority list of premium natural sounding female voices
        const femaleVoiceNames = [
          'Samantha',
          'Victoria',
          'Karen',
          'Moira',
          'Tessa',
          'Google UK English Female',
          'Google US English',
          'Microsoft Zira',
          'Microsoft Jenny',
          'Microsoft Aria',
          'en-US-Neural2-F',
          'Fiona',
          'Siri',
          'Serena'
        ];

        let selectedVoice: SpeechSynthesisVoice | null = null;

        // Try exact name match
        for (const name of femaleVoiceNames) {
          const match = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
          if (match) {
            selectedVoice = match;
            break;
          }
        }

        // Fallback to any English female voice or en-US voice
        if (!selectedVoice) {
          selectedVoice = voices.find(v => 
            (v.lang.startsWith('en') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'))) ||
            (v.lang.startsWith('en-US') && !v.name.toLowerCase().includes('male'))
          ) || voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onstart = () => {
          if (onStart) onStart();
        };

        utterance.onend = () => {
          if (onEnd) onEnd();
          resolve(true);
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error:', e);
          if (onEnd) onEnd();
          resolve(false);
        };

        // Small delay to let audio settle
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 100);
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoiceAndSpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          setVoiceAndSpeak();
        };
        setTimeout(() => {
          setVoiceAndSpeak();
        }, 250);
      }
    } catch (err) {
      console.warn('Voice speech error:', err);
      resolve(false);
    }
  });
}

/**
 * Stop any ongoing speech immediately
 */
export function stopVoiceSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speaks the requested welcome phrase using an alluring, sultry female voice
 * Text: "Welcome, let's create the poster for your event"
 */
export function speakWelcomeGreeting(
  customPhrase = "Welcome, let's create the poster for your event",
  onStart?: () => void,
  onEnd?: () => void
): Promise<boolean> {
  return speakAlluringVoice(customPhrase, true, onStart, onEnd);
}

/**
 * Speaks guidance for a specific entry field
 */
export function speakFieldGuide(
  fieldKey: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<boolean> {
  const guide = FIELD_VOICE_GUIDES.find(g => g.fieldKey === fieldKey);
  const phrase = guide ? guide.voicePrompt : "Please enter the details for this field.";
  playGentleFieldPing();
  return speakAlluringVoice(phrase, false, onStart, onEnd);
}

