export interface MockOnboardingCard {
  id: string;
  emoji: string;
  caption: string;
  color: string;
}

// Illustrative only — drawn with emoji + flat color rather than bundled photos, so onboarding
// needs no media permission and ships no extra binary assets.
export const MOCK_ONBOARDING_CARDS: MockOnboardingCard[] = [
  { id: "mock-1", emoji: "🏖️", caption: "Beach day", color: "#38bdf8" },
  { id: "mock-2", emoji: "🐶", caption: "Good boy", color: "#f97316" },
  { id: "mock-3", emoji: "🍕", caption: "Friday night", color: "#a855f7" },
];
