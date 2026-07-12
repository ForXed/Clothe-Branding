// English-only for test run
// Expand later by adding more languages

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" }
];

export default languages;