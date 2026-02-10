import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import IconGallery from './IconGallery.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('IconGallery', IconGallery)
  },
} satisfies Theme
