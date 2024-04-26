/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'hero-image':
          "url('https://cdn.pixabay.com/photo/2024/02/23/12/02/ai-generated-8591920_1280.jpg')"
      }
    }
  },
  plugins: []
}
