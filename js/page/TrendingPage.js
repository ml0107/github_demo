/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  DeviceEventEmitter, DeviceInfo
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'

import {createAppContainer, createMaterialTopTabNavigator} from 'react-navigation'
import NavigationUtil from '../navigator/NavigationUtil'
import TrendingItem from '../common/TrendingItem'
import Toast from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";

const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'; //
const URL = 'https://github.com/trending/';
const QUERY_STR = '&sort=stars'; // 排序方式 点赞数
const THEME_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

 class TrendingPage extends Component {
  constructor(props) {
    super(props);
    // 关闭页面警告
    // console.disableYellowBox = true;
    // this.tabNames = ['JavaScript', 'Java', 'PHP', 'HTML', 'Vue',];
    this.state = {
      timeSpan: TimeSpans[0]
    }
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_language);
    this.preKeys = [];
  }

  _getTabs() {
    const tabs = {};
    const {keys,theme} = this.props;
    this.preKeys = keys;
    // this.tabNames.forEach((item, index) => {
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <TrendingTabPage {...props} tabLabel={item.name} theme={theme}/>,
          navigationOptions: {
            title: item.name
          }
        }
      }
    });
    return tabs
  }

  // 自定义头部菜单
  renderTitleView() {
    return <View>
      <TouchableOpacity
        underlayColor={'transparent'}
        onPress={() => this.dialog.show()}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: '#fff', fontWeight: '400'}}>趋势{this.state.timeSpan.showText}</Text>
          <MaterialIcons
            name={'arrow-drop-down'}
            size={22}
            style={{color: '#fff'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }

  // 切换 今天 本周 本月
  onSelectTimeSpan(tab) {
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab
    });
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab)
  }

  returnTrendingDialog() {
    return <TrendingDialog
      ref={dialog => this.dialog = dialog}
      onSelect={tab => this.onSelectTimeSpan(tab)}
    />
  }

  _tabNav() {
    const {theme} = this.props;
    if (theme === this.theme && this.tabNav && ArrayUtil.isEqual(this.preKeys,this.props.keys)) {
      return this.tabNav
    }
    this.theme = theme;
    const TabNavigator = createMaterialTopTabNavigator(
      this._getTabs(), {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false, // 标签名称是否大写 默认true
          scrollEnabled: true, // 选项卡是否滚动 默认false
          style: {
            backgroundColor: theme.themeColor, // TabBar 的背景颜色
            height: 30,
          },
          indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
          labelStyle: styles.labelStyle, // 文字的样式
        },
        lazy: true
      }
    );

    // const AppTabNavigator = createAppContainer(TabNavigator);
    return this.tabNav = createAppContainer(TabNavigator);
  }

  render() {
    const {keys,theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    };
    let navigationBar = <NavigationBar
      // title={'趋势'}
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{backgroundColor: theme.themeColor}}
    />;

    const AppTabNavigator = keys.length ? this._tabNav() : null;
    return <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
      {navigationBar}
      {AppTabNavigator && <AppTabNavigator/>}
      {this.returnTrendingDialog()}
    </View>;
  }
}

const mapTrendingStateToProps = state => ({
  keys: state.language.languages,
  theme: state.theme.theme
});
const mapTrendingDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

// connect 只是个function,并不一定非要放在export后面
export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);


const pageSize = 10; // 每页条数 设为常量，防止修改
class TrendingTab extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false;
  }

  componentDidMount() {
    this.loadData();
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan;
      this.loadData();
    });

    EventBus.getInstance().addListener(EventTypes.favorite_changed_trending, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
      if (data.to === 1 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    });
  }

  componentWillUnmount() {
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove();
    }
    ;
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }

  loadData(loadMore, refreshFavorite) {
    const {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);

    if (loadMore) {
      console.log('--------刷新加载更多-------');
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('没有更多')
      })
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
    } else {
      console.log('--------刷新加载-------');

      onRefreshTrending(this.storeName, url, pageSize, favoriteDao)
    }

  }

  /**
   * 获取与当前页面有关的数据
   * @private
   */
  _store() {
    const {trending} = this.props;
    let store = trending[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], // 要显示的数据
        hideLoadingMore: true, // 默认隐藏加载更多
      }
    }
    return store
  }

  genFetchUrl(key) {
    return URL + key + '?since=daily';
  }

  renderItem(data) {
    const item = data.item;
    const {theme} = this.props;
    return <TrendingItem
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          projectModel: item,
          flag: FLAG_STORAGE.flag_trending,
          theme:theme,
          callback,
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
    />
  }

  genIndicator() {
    return this._store().hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
        />
        <Text>正在加载更多</Text>
      </View>
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
          // contentContainerStyle={{backgroundColor: 'blue', flex: 1}}
          refreshControl={
            <RefreshControl
              title={'loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={theme.themeColor}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            console.log('---------onEndReached---------');
            setTimeout(() => {
              if (this.canLoadMore) { // 解决 滚动时 两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100)
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true; // 初始化滚动 调用onEndReached的问题
            console.log('---------onMomentumScrollBegin---------');
          }}
        />
        <Toast ref={'toast'}
               position={'center'}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  trending: state.trending
});
const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
  onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
});

// connect 只是个function,并不一定非要放在export后面
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  tabStyle: {
    // minWidth: 50
    padding: 0,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff'
  },
  labelStyle: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 6
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    color: 'red',
    margin: 10
  }

});
