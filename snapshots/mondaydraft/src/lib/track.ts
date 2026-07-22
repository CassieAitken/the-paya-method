import type { DogData } from '../App';
import type { RitualFrequencies } from '../pages/Audit';
import { frequencyWeights, type FrequencyLevel } from '../data/foundations';

export type Track = 'ascent' | 'master' | 'legacy' | 'growth';

const LEGACY_SIGNAL_RITUALS = [
  'bf3',  // Smooth, Balanced Movement
  'bf6',  // Free Running Time
  'bf7',  // Comfortable with Stairs & Jumps
  'bf8',  // Getting Up Easily
  'bf10', // Good Muscle Tone
  's4',   // Morning Fluidity
  's7',   // Respiratory Recovery
  's10',  // Sleep Soundness
  'v2',   // Bright, Clear Eyes
  'v9',   // Easy, Quiet Breathing
  'v10',  // Right Energy for Their Age
  'n12',  // Stool Integrity
  'n13',  // Feeding Posture
  'e5',   // Structural Traction
  'pb10', // Initiated Engagement
  'pb11', // Relational Softness
  'c8',   // Knows Their People
  'c10',  // Sticks With It
];

const LEGACY_THRESHOLD = 0.35;
const MASTER_AGE_THRESHOLD = 10;

export function getTrack(dogData: DogData, selectedRituals: RitualFrequencies): Track {
  const ageYears = (parseInt(dogData.age) || 0) + (parseInt(dogData.ageMonths) || 0) / 12;

  if (ageYears < 1.5) return 'growth';

  let totalWeight = 0;
  let answeredCount = 0;

  for (const id of LEGACY_SIGNAL_RITUALS) {
    const freq = selectedRituals[id] as FrequencyLevel | undefined;
    if (freq) {
      totalWeight += frequencyWeights[freq];
      answeredCount++;
    }
  }

  if (answeredCount > 0 && totalWeight / answeredCount <= LEGACY_THRESHOLD) {
    return 'legacy';
  }

  if (ageYears >= MASTER_AGE_THRESHOLD) return 'master';

  return 'ascent';
}
