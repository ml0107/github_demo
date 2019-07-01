/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'
import NavigationUtil from "../navigator/NavigationUtil";
import NavigationBar from '../common/NavigationBar'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

const THEME_COLOR = '#678';

import HTMLView from 'react-native-htmlview';
import {MORE_MENU} from "../common/MORE_MENU";
import GlobalStyle from "../res/styles/GlobalStyle"
import ViewUtil from "../util/ViewUtil";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import CustomTheme from "./CustomTheme";

class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    }
  }

  componentDidMount() {

  }

  getRightButton() {
    return <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => {

      }}
      >
        <View style={{padding: 5, marginRight: 8}}>
          <Feather
            name={'search'}
            size={24}
            style={{color: '#ffff'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }

  getLeftButton(callBack) {
    return <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        style={{padding: 5, marginLeft: 12}}
        onPress={callBack}
      >
        <Ionicons
          name={'ios-arrow-back'}
          size={26}
          style={{color: '#ffff'}}
        />
      </TouchableOpacity>
    </View>
  }

  onClick(menu) {
    let RouteName, params = {};
    console.log(menu + '页面名称');
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '教程';
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=89';
        params.theme = this.props.theme;
        break;
      case MORE_MENU.About:
        RouteName = 'AboutPage';
        params.theme = this.props.theme;
        break;
      case MORE_MENU.Sort_Key: // 标签排序页
        RouteName = 'SortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_key
        params.theme = this.props.theme;
        break;
      case MORE_MENU.Sort_Language: // 语言排序页
        RouteName = 'SortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_language
        params.theme = this.props.theme;
        break;
      case MORE_MENU.Custom_Theme: // 改变主题
        const {onShowCustomThemeView} = this.props;
        onShowCustomThemeView(true);
        break;
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
        RouteName = 'CustomKeyPage';
        params.isRemoveKey = menu === MORE_MENU.Remove_Key;
        params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language;
        params.theme = this.props.theme;
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        params.theme = this.props.theme;
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName)
    }
  }

  getItem(menu) {
    const {theme} = this.props;
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor);
  }
  render() {
    const {theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    };
    let navigationBar = <NavigationBar
      title={'我的'}
      statusBar={statusBar}
      style={theme.styles.navBar}
      // style={{ backgroundColor:theme.themeColor}}
      rightButton={this.getRightButton()}
      leftButton={this.getLeftButton()}
    />;
    return (
      <View style={GlobalStyle.root_container}>
        {navigationBar}
        <ScrollView>

          <TouchableOpacity
            style={styles.item}
            onPress={() => this.onClick(MORE_MENU.About)}
          >
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={
                  {
                    marginRight: 10,
                    color: theme.themeColor
                  }
                }
              />
              <Text>Github Popular</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{
                marginRight: 10,
                alignSelf: 'center',
                color: theme.themeColor
              }}
            />
          </TouchableOpacity>

          <View style={GlobalStyle.line}></View>

          {this.getItem(MORE_MENU.Tutorial)}

          {/*趋势管理*/}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/*自定义语言*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          <View style={GlobalStyle.line}></View>
          {/*语言排序*/}
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          <View style={GlobalStyle.line}></View>
          {/*标签排序*/}
          {this.getItem(MORE_MENU.Sort_Key)}
          <View style={GlobalStyle.line}></View>
          {/*标签移除*/}
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          <View style={GlobalStyle.line}></View>
          {/*关于作者*/}
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyle.line}></View>
          {/*反馈*/}
          {this.getItem(MORE_MENU.Feedback)}

        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.theme.theme
});
const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: show => dispatch(actions.onShowCustomThemeView(show))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginTop: 30
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
  item: {
    flex: 1,
    padding: 10,
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  about_left: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray'
  }

});
