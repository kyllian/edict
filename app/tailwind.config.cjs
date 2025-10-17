// Tailwind config for the Next app
// Enables the line-clamp plugin and includes content paths used by this project.
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Tailwind plugin requires use CommonJS `require` in this config file.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/line-clamp'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('daisyui')
  ],
};
