import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        comic: ['Comic Sans MS', 'cursive', 'sans-serif'],
      },
      colors: {
        gold: '#FFD700',
        'gold-light': '#FFF8DC',
        'dreamy-yellow': '#FFF9C4',
        'dreamy-pink': '#FFB3E6',
        'dreamy-blue': '#B3E5FC',
        'magical-purple': '#E1BEE7',
        'sunset-orange': '#FFB74D',
        'mint-green': '#A5D6A7',
        'coral-red': '#FF8A65',
        'sky-blue': '#81D4FA',
      },
    },
  },
  plugins: [],
};
export default config;
