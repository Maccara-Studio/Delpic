import { en } from "./locales/en";

// Only English exists for now — Milestone 11 adds real locale files here plus device-locale
// detection/selection. Every UI string still goes through this hook so that milestone won't
// need to touch call sites, just this file.
export type Locale = "en";
export const DEFAULT_LOCALE: Locale = "en";

const translations: Record<Locale, typeof en> = { en };

export function useTranslations() {
  return translations[DEFAULT_LOCALE];
}
