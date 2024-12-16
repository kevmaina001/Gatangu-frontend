// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFD700", // Gold color
        secondary: "#000000", // Black color
        textPrimary: "#FFFFFF", // White text on black background
        textSecondary: "#FFD700", // Gold text on black background
        backgroundLight: "#F5F5F5", // Light background for content
        borderGray: "#E0E0E0", // Soft border color
      },
      fontFamily: {
        sans: ["Roboto", "Poppins", "sans-serif"], // Roboto and Poppins for modern sans-serif text
        playfair: ['"Playfair Display"', "serif"], // Playfair Display for classic, elegant text
        lora: ['"Lora"', "serif"], // Lora for stylish and readable serif text
      },
      spacing: {
        '5%': '5%',
        '10%': '10%',
        '15%': '15%', // Additional spacing for centralized layout
      },
      container: {
        center: true, // Center the container
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
      animation: {
        fadeIn: 'fadeIn 1.5s ease-in-out', // Custom fade-in animation
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
