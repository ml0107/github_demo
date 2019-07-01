/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {ScrollView, Text, View, TouchableOpacity, Linking} from 'react-native';

import NavigationUtil from "../../navigator/NavigationUtil";
const THEME_COLOR = '#678';

import {MORE_MENU} from "../../common/MORE_MENU";
import GlobalStyle from "../../res/styles/GlobalStyle"
import ViewUtil from "../../util/ViewUtil";
import {FLAG_ABOUT} from "./AboutCommon";
import AboutCommon from "./AboutCommon";
import config from '../../res/data/config'


export default class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {theme} = this.params;
    this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation,
      flagAbout: FLAG_ABOUT.flag_about,
    }, data => this.setState({...data}));
    this.state = {
      data: config,
      theme
    };

  }

  componentDidMount() {
  }

  onClick(menu) {
    let RouteName, params = {};

    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '教程';
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=89';
        params.theme = this.state.theme;
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        params.theme = this.state.theme;
        break;
      case MORE_MENU.Feedback:
        let url = 'mailto://1183891137@qq.com';
        Linking.canOpenURL(url)
          .then(support => {
            if(!support){
              console.log("can't handle url: " + url)
            } else{
              Linking.openURL(url);
            }
          }).catch(e=>{
          console.error('An error occurred', e);
        });
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName)
    }
  }

  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, this.state.theme.themeColor);
  }

  render() {
    const content = <View>
      {this.getItem(MORE_MENU.Tutorial)}
      <View style={GlobalStyle.line}></View>
      {this.getItem(MORE_MENU.About_Author)}
      <View style={GlobalStyle.line}></View>
      {this.getItem(MORE_MENU.Feedback)}
    </View>;
    return this.aboutCommon.render(content, this.state.data.app)
  }
}





