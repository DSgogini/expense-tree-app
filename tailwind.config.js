/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

export default {
  content: [
    './index.html',
    './src/**/*.{html,js,tsx,ts,jsx}',
  ],
  theme: {},
  plugins: [
    forms,
  ],
};

