import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        professional: { bg: '#0d0f14', card: '#151820', border: '#2a2f3c', text: '#e8e8ed', muted: '#7a7f8c', accent: '#c9a962' },
        modern: { bg: '#f5f6f8', card: '#ffffff', border: '#e5e7eb', text: '#1f2937', muted: '#6b7280', accent: '#6366f1' },
      },
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'], mono: ['var(--font-roboto-mono)', 'monospace'] },
    },
  },
  plugins: [],
};
export default config;