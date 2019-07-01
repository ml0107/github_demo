import Types from '../types'

export function onThemeChange(theme) {
  return {
    type: Types.THEME_CHANGE,
    theme: theme
  }
}

export function onShowCustomThemeView(show) {
  return {
    type: Types.THEME_INIT,
    customThemeViewVisible: show
  }
}



