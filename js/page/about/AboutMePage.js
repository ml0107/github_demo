/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {ScrollView, Text, View, TouchableOpacity, Linking, Clipboard} from 'react-native';

import NavigationUtil from "../../navigator/NavigationUtil";

const THEME_COLOR = '#678';

import {MORE_MENU} from "../../common/MORE_MENU";
import GlobalStyle from "../../res/styles/GlobalStyle"
import ViewUtil from "../../util/ViewUtil";
import {FLAG_ABOUT} from "./AboutCommon";
import AboutCommon from "./AboutCommon";
import config from '../../res/data/config'
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from 'react-native-easy-toast'


export default class AboutMePage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {theme} = this.params;
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about_me,
    }, data => this.setState({...data}));

    this.state = {
      data: config,
      showTutorial: true,
      showBlog: false,
      showQQ: false,
      showContact: false,
      theme
    };



  }

  componentDidMount() {
  }

  onClick(tab) {
    if(!tab) return;
    if(tab.url){
      NavigationUtil.goPage({
        title:tab.title,
        url: tab.url
      },'WebViewPage')
    }

    if(tab.account && tab.account.indexOf('@') > -1){
      let url = 'mailto://' + tab.account;
      Linking.canOpenURL(url)
        .then(supported => {
          if(!supported){
            console.log("can't handle url: " + url)
          } else{
            return Linking.openURL(url);
          }
        }).catch(e=>{
        console.error('An error occurred', e);
      });
    }

    if(tab.account){
      Clipboard.setString(tab.account);
      this.toast.show(tab.title + tab.account + '已复制到剪切板')
    }
  }

  /**
   * 显示列表数据
   * @param dic
   * @param isShowAccount
   * @returns {*}
   */
  renderItems(dic, isShowAccount) {
    if (!dic) return null;
    let views = [];
    for (let i in dic) {
      let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title;
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(() => this.onClick(dic[i]), title, this.state.theme.themeColor)}
          <View style={GlobalStyle.line}/>
        </View>
      )
    }

    return views
  }

  _item(data, isShow, key) {
    return ViewUtil.getSettingItem(() => {
      this.setState({
        [key]: !this.state[key]
      })
    }, data.name, this.state.theme.themeColor, Ionicons, data.icon, isShow ? 'ios-arrow-up' : 'ios-arrow-down')
  }

  render() {

    const content = <View>
      {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutorial, 'showTutorial')}
      <View style={GlobalStyle.line}/>
      {this.state.showTutorial ? this.renderItems(this.state.data.aboutMe.Tutorial.items) : null}

      {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
      <View style={GlobalStyle.line}/>
      {this.state.showBlog ? this.renderItems(this.state.data.aboutMe.Blog.items) : null}

      {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
      <View style={GlobalStyle.line}/>
      {this.state.showContact ? this.renderItems(this.state.data.aboutMe.Contact.items) : null}

      {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
      <View style={GlobalStyle.line}/>
      {this.state.showQQ ? this.renderItems(this.state.data.aboutMe.QQ.items) : null}
    </View>;
    return <View style={{flex:1}}>
      {this.aboutCommon.render(content, this.state.data.author)}
      <Toast ref={toast => this.toast = toast}
             position={'center'}
      />
    </View>

  }
}





