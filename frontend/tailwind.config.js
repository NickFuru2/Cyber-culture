/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "var(--color-background, #10141a)",
        "surface-variant": "var(--color-surface-variant, #31353c)",
        "primary": "var(--color-primary, #baf2ff)",
        "primary-fixed": "var(--color-primary-fixed, #a5eeff)",
        "secondary-container": "var(--color-secondary-container, #c3f400)",
        "error": "var(--color-error, #ffb4ab)",
        "error-container": "var(--color-error-container, #93000a)",
      },
      fontFamily: {
        "h1": ["Space Grotesk", "sans-serif"],
        "h2": ["Space Grotesk", "sans-serif"],
        "h3": ["Space Grotesk", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "code": ["JetBrains Mono", "monospace"]
      }
    },
  },
  plugins: [],
}
