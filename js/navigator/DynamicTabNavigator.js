/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import {
  createAppContainer,
  createBottomTabNavigator,
} from 'react-navigation' ;
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';

import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'
import TestPage from '../page/TestPage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import NavigationUtil from "./NavigationUtil";
import {BottomTabBar} from 'react-navigation-tabs'
import EventBus from "react-native-event-bus";
import EventTypes from '../util/EventTypes'

const TABS = {
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: '最热',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons
          name={'whatshot'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: '趋势',
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons
          name={'md-trending-up'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: '收藏',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons
          name={'favorite'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({tintColor, focused}) => (
        <Entypo
          name={'user'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  TestPage: {
    screen: TestPage,
    navigationOptions: {
      tabBarLabel: '测试',
      tabBarIcon: ({tintColor, focused}) => (
        <Entypo
          name={'air'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
};

class DynamicTabNavigator extends Component {
  constructor(props) {
    super(props);
    // 关闭页面警告
    // console.disableYellowBox = true;
  }

  _tabNavigator() {

    if(this.Tabs){
      return this.Tabs;
    }

    const {PopularPage, TrendingPage, FavoritePage, MyPage, TestPage} = TABS;
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage, TestPage}; // 根据需要定制显示的tab

    PopularPage.navigationOptions.tabBarLabel = '最热'; // 动态配置Tab属性
    const AppBottomNavigator = createBottomTabNavigator(tabs, {
      tabBarComponent: props => {
        return <TabBarComponent theme={this.props.theme} {...props} />
      }
    });

    return this.Tabs = createAppContainer(AppBottomNavigator);

    // return createAppContainer(AppBottomNavigator);
  }

  render() {
    // NavigationUtil.navigation = this.props.navigation;
    const Tab = this._tabNavigator();
    return <Tab
      onNavigationStateChange={(prevState,newState, action) => {
        EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select,{ // 发送Tab事件
          from: prevState.index,
          to: newState.index
        })
      }}
    />
  }
}

class TabBarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.theme = {
      tintColor: props.activeTintColor,
      updateTime: new Date().getTime()
    }
  }

  render() {
    // console.log(this.props.navigation);
    // const {routes, index} = this.props.navigation.state;
    // if (routes[index].params) {
    //   const {theme} = routes[index].params;
    //   // 以最新的更新时间为主, 防止被其他tab之前的修改覆盖掉
    //   if (theme && theme.updateTime > this.theme.updateTime) {
    //     this.theme = theme
    //   }
    // }
    return <BottomTabBar
      {...this.props}
      // activeTintColor={this.theme.tintColor || this.props.activeTintColor}
      activeTintColor={this.props.theme.themeColor}
    />
  }
}

const mapStateToProps = state => ({
  theme: state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator)







