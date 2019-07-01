import Types from '../../action/types'
import ThemeFactory, {ThemeFlags} from "../../res/styles/ThemeFactory";

const defaultState = {
  // theme: 'blue',
  theme: ThemeFactory.createTheme(ThemeFlags.Default),
  customThemeViewVisible: false
};

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
export default function onAction(state = defaultState, action) {

  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme
      };
    case Types.THEME_INIT:
      return {
        ...state,
        customThemeViewVisible: action.customThemeViewVisible
      };
    default:
      return state;
  }
}
