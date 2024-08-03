module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#243c5a',
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // If you are using form elements and need styling
  ],
}
