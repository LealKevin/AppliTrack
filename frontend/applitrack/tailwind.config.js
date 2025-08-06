/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        // Light mode neumorphic shadows
        neumorphic: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
        'neumorphic-inset': "4px 4px 4px #d1d9e6 inset, -4px -4px 4px #ffffff inset",
        'neumorphic-toggle': "-8px -4px 8px #ffffff, 8px 4px 12px #d1d9e6, 4px 4px 4px #d1d9e6 inset, -4px -4px 4px #ffffff inset",
        'neumorphic-indicator': "-8px -4px 8px #ffffff, 8px 4px 12px #d1d9e6",

        // Dark mode neumorphic shadows
        'neumorphic-dark': "15px 15px 30px rgb(25, 25, 25), -15px -15px 30px rgb(60, 60, 60)",
        'neumorphic-dark-inset': "4px 4px 4px rgb(25, 25, 25) inset, -4px -4px 4px rgb(60, 60, 60) inset",
        'neumorphic-toggle-dark': "15px 15px 30px rgb(25, 25, 25), -15px -15px 30px rgb(60, 60, 60), 4px 4px 4px rgb(25, 25, 25) inset, -4px -4px 4px rgb(60, 60, 60) inset",
        'neumorphic-indicator-dark': "15px 15px 30px rgb(25, 25, 25), -15px -15px 30px rgb(60, 60, 60)",
        
        // Card shadows  
        'neumorphic-card': "20px 20px 60px #a1a1aa, -20px -20px 60px #ffffff",
        'neumorphic-card-dark': "15px 15px 30px rgb(25, 25, 25), -15px -15px 30px rgb(60, 60, 60)",
      },
      colors: {
        // Light theme colors
        'soft-grey': '#f0f4f8',
        'neumorphic': {
          50: '#ffffff',    // Highlight
          100: '#e0e0e0',   // Background
          200: '#d1d9e6',   // Shadow light
          300: '#b4c6d7',   // Shadow medium
          400: '#394a56',   // Text
        },

        // Dark theme colors  
        'neumorphic-dark': {
          50: 'rgb(60, 60, 60)',     // Highlight
          100: '#212121',            // Background
          200: 'rgb(25, 25, 25)',    // Shadow dark
          300: 'rgb(60, 60, 60)',    // Shadow light
          400: '#e2e8f0',            // Text
        },

        // Sidebar colors
        'sidebar': {
          light: '#d4d4d9',      // Same as app background
          dark: '#212121',       // Dark sidebar to match neumorphic design
        },

        // Card colors
        'card': {
          light: '#d4d4d8',      // Light card background
          dark: '#212121',       // Dark card background to match neumorphic design
        }
      },
    },
    plugins: [],
  };
