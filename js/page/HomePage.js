/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import NavigationUtil from "../navigator/NavigationUtil";
import DynamicTabNavigator from "../navigator/DynamicTabNavigator";
import {BackHandler} from 'react-native';
import {NavigationActions} from 'react-navigation'
import actions from "../action";
import {connect} from "react-redux";
import BackPressComponent from "../common/BackPressComponent";

import CustomTheme from '../page/CustomTheme'
import ThemeDao from "../expand/dao/ThemeDao";
import ThemeFactory, {ThemeFlags} from "../res/styles/ThemeFactory";

class HomePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      themeColor:''
    };

    this.backPress = new BackPressComponent({
      backPress: this.onBackPress()
    });

    this.themeDao = new ThemeDao();
  }

  componentDidMount() {
    this.backPress.componentDidMount();

    this.getThemeData()
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  getThemeData(){
    this.themeDao.getTheme()
      .then((data) => {
        if (data) {
          this.setState({
            themeColor:data.themeColor
          });

          this.setThemeData();
        }
      }).catch((error) => {
      console.log(error);
    });
  }

  setThemeData(){
    console.log(this.state.themeColor);
    const {onThemeChange} = this.props;
    onThemeChange(ThemeFactory.createTheme(this.state.themeColor || ThemeFlags.Default));
  }

  /**
   * 处理android 中的物理返回键
   * @returns {*}
   */

  onBackPress = () => {
    const {dispatch, nav} = this.props;
    console.log(nav);
    if (nav.routes[1].index === 0) { // 如果RootNavigator中的MainNavigator的index为0 则不处理返回事件
      return false
    }
    dispatch(NavigationActions.back());
    return true;
  };

  renderCustomThemeView() {
    const {customThemeViewVisible, onShowCustomThemeView} = this.props;
    return (
      <CustomTheme
        visible={customThemeViewVisible}
        {...this.props}
        onClose={() => onShowCustomThemeView(false)}
      />
    )
  }

  render() {
    NavigationUtil.navigation = this.props.navigation;

    return <View style={{flex: 1}}>
      <DynamicTabNavigator/>
      {this.renderCustomThemeView()}
    </View>
  }
}


const mapStateToProps = state => ({
  nav: state.nav,
  customThemeViewVisible: state.theme.customThemeViewVisible,
});

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
  onThemeChange: (theme) => dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)







