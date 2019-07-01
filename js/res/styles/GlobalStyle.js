import {DeviceInfo} from "react-native";

/**
 * 全局样式
 * @type {string}
 */
const BACKGROUND_COLOR = '#f3f3f4';
export default {
  line: {
    height: 0.5,
    opacity: 0.5,
    backgroundColor: 'darkgray'
  },

  root_container:{
    flex:1,
    backgroundColor: BACKGROUND_COLOR,
    marginTop:DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },

  backgroundColor:BACKGROUND_COLOR,
  nav_bar_height_ios: 44,
  nav_bar_height_android: 50,
}
