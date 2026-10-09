export interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: 'EN' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', flag: 'KN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: 'HI' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: 'TA' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', flag: 'TE' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', flag: 'ML' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: 'MR' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', flag: 'BN' },
];

export function getLanguageByCode(code: string): LanguageOption {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

export const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  en: 'Respond in English.',
  kn: 'Respond in Kannada (ಕನ್ನಡ). Use Kannada script for your response.',
  hi: 'Respond in Hindi (हिन्दी). Use Devanagari script for your response.',
  ta: 'Respond in Tamil (தமிழ்). Use Tamil script for your response.',
  te: 'Respond in Telugu (తెలుగు). Use Telugu script for your response.',
  ml: 'Respond in Malayalam (മലയാളം). Use Malayalam script for your response.',
  mr: 'Respond in Marathi (मराठी). Use Devanagari script for your response.',
  bn: 'Respond in Bengali (বাংলা). Use Bengali script for your response.',
};
