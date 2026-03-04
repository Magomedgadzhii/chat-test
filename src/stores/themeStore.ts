import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'
export type Wallpaper = 'gradient1' | 'gradient2' | 'gradient3' | 'gradient4'

const THEME_KEY = 'app_theme'
const WALLPAPER_KEY = 'app_wallpaper'

export const wallpapers = {
  gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  gradient4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('light')
  const wallpaper = ref<Wallpaper>('gradient1')

  const loadFromStorage = () => {
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null
    const savedWallpaper = localStorage.getItem(WALLPAPER_KEY) as Wallpaper | null

    if (savedTheme) {
      theme.value = savedTheme
    }
    if (savedWallpaper) {
      wallpaper.value = savedWallpaper
    }

    applyTheme()
  }

  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setWallpaper = (newWallpaper: Wallpaper) => {
    wallpaper.value = newWallpaper
  }

  watch(theme, (newTheme) => {
    localStorage.setItem(THEME_KEY, newTheme)
    applyTheme()
  })

  watch(wallpaper, (newWallpaper) => {
    localStorage.setItem(WALLPAPER_KEY, newWallpaper)
  })

  loadFromStorage()

  return {
    theme,
    wallpaper,
    toggleTheme,
    setWallpaper
  }
})
