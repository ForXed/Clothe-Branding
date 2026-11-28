// This tells TypeScript that any CSS Module file exports an object of strings
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// This tells TypeScript how to handle regular CSS files
declare module '*.css' {
  const content: string;
  export default content;
}

// This tells TypeScript how to handle images (just in case)
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

// Tells TypeScript to ignore all JavaScript files and treat them as 'any'
// This is a lifesaver when migrating a project from JS to TS!
declare module '*.js';