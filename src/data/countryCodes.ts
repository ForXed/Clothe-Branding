// Nigeria-only for test run
// Expand later by adding more countries

export interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

export const countryCodes: CountryCode[] = [
  { code: "+234", country: "Nigeria", flag: "🇳🇬" }
];

export const searchCountryCodes = (query: string): CountryCode[] => {
  const lowerQuery = query.toLowerCase();
  return countryCodes.filter(
    c => 
      c.country.toLowerCase().includes(lowerQuery) ||
      c.code.includes(query)
  );
};

export default countryCodes;