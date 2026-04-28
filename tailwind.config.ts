import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#FF0000',
          dark: '#121212',
          light: '#f9fafb'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(0, 0, 0, 0.2)'
      }
    }
  },
  plugins: []
};

export default config;
