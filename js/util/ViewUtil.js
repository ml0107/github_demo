import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class ViewUtil {

  /**
   * 获取左侧返回按钮
   * @param callBack
   * @returns {*}
   */
  static getLeftBackButton(callBack) {
    return <TouchableOpacity
      style={{padding: 8, paddingLeft: 12}}
      onPress={callBack}>
      <Ionicons
        name={'ios-arrow-back'}
        size={26}
        style={{color: '#fff'}}
      />
    </TouchableOpacity>
  }

  /**
   * 获取右侧文字按钮
   * @param title
   * @param callBack
   */
  static getRightButton(title, callBack) {
    return <TouchableOpacity
      style={{alignItems: 'center'}}
      onPress={callBack}
    >
      <Text style={{fontSize: 20, color: '#fff', marginRight: 10}}>{title}</Text>

    </TouchableOpacity>
  }


  /**
   * 获取分享按钮
   * @param callBack
   * @returns {*}
   */
  static getShareButton(callBack) {
    return <TouchableOpacity
      underlayColor={'transparent'}
      onPress={callBack}
    >
      <Ionicons
        name={'md-share'}
        size={20}
        style={{opacity: 0.9, marginRight: 10, color: '#fff'}}
      />
    </TouchableOpacity>
  }

  /**
   * 获取设置页的Item
   * @param callBack 单击Item 的回调
   * @param text 显示的文本
   * @param color 图标颜色
   * @param Icons react-native-vector-icons 组件
   * @param icon 左侧图标
   * @param expandableIcon 右侧图标
   */
  static getSettingItem(callBack, text, color, Icons, icon, expandableIcon) {
    return (
      <TouchableOpacity
        onPress={callBack}
        style={styles.setting_item_container}
      >
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          {Icons && icon ?
            <Icons
              name={icon}
              size={16}
              style={{color: color, marginRight: 10}}
            /> :
            <View style={{opacity: 1, width: 16, height: 16, marginRight: 10,}}/>
          }
          <Text>{text}</Text>
        </View>
        <Ionicons
          name={expandableIcon ? expandableIcon : 'ios-arrow-forward'}
          size={16}
          style={{
            marginRight: 10,
            alignSelf: 'center',
            color: color || 'black'
          }}
        />
      </TouchableOpacity>
    )
  }

  /**
   * 获取设置页的Item
   * @param callBack 单击Item的回调
   * @param menu @MORE_MENU
   * @param color 图标颜色
   * @param expandableIcon 右侧图标
   */
  static getMenuItem(callBack, menu, color, expandableIcon){
      return ViewUtil.getSettingItem(callBack,menu.name,color,menu.Icons,menu.icon,expandableIcon)
  }
}




const styles = StyleSheet.create({
  setting_item_container: {
    backgroundColor: '#fff',
    padding: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
});





