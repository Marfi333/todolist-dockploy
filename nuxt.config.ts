import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-12-02",
  devtools: { enabled: true },
  css: ['./app/assets/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    '@primevue/nuxt-module'
  ],
  primevue: {
      /* Configuration */
  }
});