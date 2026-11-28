// Africa/Lagos only for test run
// Expand later by adding more timezones

export interface Timezone {
  value: string;
  label: string;
  offset: string;
}

export const timezones: Timezone[] = [
  { value: "Africa/Lagos", label: "Lagos (WAT)", offset: "+01:00" }
];

export default timezones;