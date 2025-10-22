// postcss.config.js
export default {
  plugins: {
    'postcss-import': {},
    '@tailwindcss/postcss': {},  // ✅ este es el nuevo plugin correcto
    autoprefixer: {},
  },
}
  