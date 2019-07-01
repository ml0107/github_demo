import Types from '../../action/types'
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";

const defaultState = {
  languages: [],
  keys: []
};


export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.LANGUAGE_LOAD_SUCCESS:
      if (FLAG_LANGUAGE.flag_key === action.flag) {
        return { // 最热页面
          ...state,
          keys: action.languages
        }
      } else {
        return { // 趋势页面
          ...state,
          languages: action.languages
        }
      }
    default:
      return state;
  }
}
