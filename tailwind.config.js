import gluestackPlugin from '@gluestack-ui/nativewind-utils/tailwind-plugin';
import { Platform } from 'react-native';
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : 'media',
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.{js,jsx,ts,tsx}",
    "./global.css"
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'inter-light': ['Inter-Light', 'Inter', 'system-ui', 'sans-serif'],
        'inter-regular': ['Inter-Regular', 'Inter', 'system-ui', 'sans-serif'],
        'inter-medium': ['Inter-Medium', 'Inter', 'system-ui', 'sans-serif'],
        'inter-semibold': ['Inter-SemiBold', 'Inter', 'system-ui', 'sans-serif'],
        'inter-bold': ['Inter-Bold', 'Inter', 'system-ui', 'sans-serif'],
        'inter-extrabold': ['Inter-ExtraBold', 'Inter', 'system-ui', 'sans-serif'],
        'inter-black': ['Inter-Black', 'Inter', 'system-ui', 'sans-serif'],

        'montserrat': ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        'montserrat-thin': ['Montserrat-Thin', 'Inter-Light', 'system-ui', 'sans-serif'],
        'montserrat-extralight': ['Montserrat-ExtraLight', 'Inter-Light', 'system-ui', 'sans-serif'],
        'montserrat-light': ['Montserrat-Light', 'Inter-Light', 'system-ui', 'sans-serif'],
        'montserrat-regular': ['Montserrat-Regular', 'Inter-Regular', 'system-ui', 'sans-serif'],
        'montserrat-medium': ['Montserrat-Medium', 'Inter-Medium', 'system-ui', 'sans-serif'],
        'montserrat-semibold': ['Montserrat-SemiBold', 'Inter-SemiBold', 'system-ui', 'sans-serif'],
        'montserrat-bold': ['Montserrat-Bold', 'Inter-Bold', 'system-ui', 'sans-serif'],
        'montserrat-extrabold': ['Montserrat-ExtraBold', 'Inter-ExtraBold', 'system-ui', 'sans-serif'],
        'montserrat-black': ['Montserrat-Black', 'Inter-Black', 'system-ui', 'sans-serif'],

        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },

      fontWeight: {
        extrablack: '950',
      },
      fontSize: {
        '2xs': '10px',
      },
      boxShadow: {
        'hard-1': '-2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-2': '0px 3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-3': '2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-4': '0px -3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-5': '0px 2px 10px 0px rgba(38, 38, 38, 0.10)',
        'soft-1': '0px 0px 10px rgba(38, 38, 38, 0.1)',
        'soft-2': '0px 0px 20px rgba(38, 38, 38, 0.2)',
        'soft-3': '0px 0px 30px rgba(38, 38, 38, 0.1)',
        'soft-4': '0px 0px 40px rgba(38, 38, 38, 0.1)',
      },
    },
  },
  plugins: [gluestackPlugin],
};
