/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'

import {createAppContainer, createMaterialTopTabNavigator} from 'react-navigation'
import NavigationUtil from '../navigator/NavigationUtil'
import PopularItem from '../common/PopularItem'
import Toast from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import {DeviceInfo} from 'react-native'
import Util from '../util/ViewUtil'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import TrendingItem from "../common/TrendingItem";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";


const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars'; // 排序方式 点赞数
const THEME_COLOR = '#678';
// const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

class FavoritePage extends Component {
  constructor(props) {
    super(props);
    // 关闭页面警告
    console.disableYellowBox = true;
    // this.tabNames = ['最热', '趋势'];

  }

  render() {
    const {theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    };
    let navigationBar = <NavigationBar
      title={'收藏'}
      statusBar={statusBar}
      style={{backgroundColor: theme.themeColor}}
    />;
    const TabNavigator = createMaterialTopTabNavigator({
        'Popular': {
          screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} theme={theme}/>, //初始化Component时携带
          navigationOptions: {
            title: '最热'
          }
        },
        'Trending': {
          screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} theme={theme}/>, //初始化Component时携带
          navigationOptions: {
            title: '趋势'
          }
        },
      },
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false, // 标签名称是否大写 默认true
          // scrollEnabled: true, // 选项卡是否滚动 默认false
          style: {
            backgroundColor: theme.themeColor, // TabBar 的背景颜色
            height: 30, // 开启scrollEnabled后再android上初次加载时闪烁问题
            fontSize:24
          },
          indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
          labelStyle: styles.labelStyle, // 文字的样式
        }
      }
    );

    const AppTabNavigator = createAppContainer(TabNavigator);

    return <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
      {navigationBar}
      <AppTabNavigator/>
    </View>;
  }
}

const mapFavoriteStateToProps = state => ({
  theme: state.theme.theme
});
const mapFavoriteDispatchToProps = dispatch => ({
});

// connect 只是个function,并不一定非要放在export后面
export default connect(mapFavoriteStateToProps, mapFavoriteDispatchToProps)(FavoritePage);


class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
  }

  componentDidMount() {
    this.favoriteDao = new FavoriteDao(this.props.flag);
    this.loadData(true);
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
      if(data.to === 2){
        this.loadData(false);
      }
    })
  }
  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener)
  }

  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading)
  }

  /**
   * 获取与当前页面有关的数据
   * @private
   */
  _store() {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], // 要显示的数据
      }
    }
    return store
  }

  renderItem(data) {
    const item = data.item;
    const {theme} = this.props;
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return <Item
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          projectModel: item,
          flag: this.storeName,
          theme:theme,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => this.onFavorite(item,isFavorite) }
    />
  }

  onFavorite(item,isFavorite){
    FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.storeName);

    // 告知页面切换
    if(this.storeName === FLAG_STORAGE.flag_popular){

      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular);
    }else{
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending);
    }
  }

  render() {
    let store = this._store();
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => "" + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={theme.themeColor}
            />
          }
        />
        <Toast ref={'toast'}
               position={'center'}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  favorite: state.favorite,
});
const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
});

// connect 只是个function,并不一定非要放在export后面
const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  tabStyle: {
    // minWidth: 50 //minWidth会导致tabStyle初次加载时闪烁
    padding: 0,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff'
  },
  labelStyle: {
    fontSize: 14,
    margin: 0,
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    color: 'red',
    margin: 10
  }

});
