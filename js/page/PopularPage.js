/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity} from 'react-native';
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
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import LanguageDao from "../expand/dao/LanguageDao";
import Ionicons from "react-native-vector-icons/Ionicons";

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars'; // 排序方式 点赞数
const THEME_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

class PopularPage extends Component {
  constructor(props) {
    super(props);
    // 关闭页面警告
    console.disableYellowBox = true;
    // this.tabNames = ['Java', 'Android', 'iOS', 'React', 'React Native', 'Vue',];
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key);
    // this.state = {
    //   keys: [],
    // };
    // this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
  }

  componentDidMount() {
    // this.loadKeys();
  }

  //
  // loadKeys() {
  //   this.languageDao.fetch().then((keys) => {
  //     if (keys) {
  //       this.setState({
  //         keys: keys,
  //       });
  //     }
  //   }).catch((error) => {
  //
  //   });
  // }

  _getTabs() {
    const tabs = {};
    const {keys, theme} = this.props;
    console.log(keys);
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <PopularTabPage {...props} tabLabel={item.name} theme={theme}/>,
          navigationOptions: {
            title: item.name
          }
        }
      }
    });
    return tabs
  }

  renderRightButton() {
    const {theme} = this.props;
    return <TouchableOpacity
      onPress={() => {
        NavigationUtil.goPage({theme}, 'SearchPage')
      }}>

      <View style={{padding: 5, marginRight: 8}}>
        <Ionicons
          name={'ios-search'}
          size={24}
          style={{
            marginRight: 8,
            alignSelf: 'center',
            color: 'white'
          }}
        />
      </View>

    </TouchableOpacity>
  }

  render() {
    const {keys, theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    };
    let navigationBar = <NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={theme.styles.navBar}
      rightButton={this.renderRightButton()}
    />;
    const TabNavigator = keys.length ? createMaterialTopTabNavigator(
      this._getTabs(), {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false, // 标签名称是否大写 默认true
          scrollEnabled: true, // 选项卡是否滚动 默认false
          style: {
            backgroundColor: theme.themeColor, // TabBar 的背景颜色
            height: 30, // 开启scrollEnabled后再android上初次加载时闪烁问题
          },
          indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
          labelStyle: styles.labelStyle, // 文字的样式
        },
        lazy: true  // 懒加载 每次只加载一个选项卡
      }
    ) : null;
    const AppTabNavigator = keys.length ? createAppContainer(TabNavigator) : null;

    return <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
      {navigationBar}
      {AppTabNavigator && <AppTabNavigator/>}
    </View>;
  }
}

const mapPopularStateToProps = state => ({
  keys: state.language.keys,
  theme: state.theme.theme
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

// connect 只是个function,并不一定非要放在export后面
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage);


const pageSize = 10; // 每页条数 设为常量，防止修改
class PopularTab extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false;
  }

  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
      if (data.to === 0 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    });
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteChangeListener)
    EventBus.getInstance().removeListener(this.bottomTabSelectListener)
  }

  loadData(loadMore, refreshFavorite) {
    const {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);

    if (loadMore) {
      console.log('--------刷新加载更多-------');
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('没有更多')
      })
    } else if (refreshFavorite) {
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
    } else {
      console.log('--------刷新加载-------');
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
    }

  }

  /**
   * 获取与当前页面有关的数据
   * @private
   */
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
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
    return URL + key + QUERY_STR;
  }

  renderItem(data) {
    const item = data.item;
    const {theme} = this.props;
    return <PopularItem
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          projectModel: item,
          flag: FLAG_STORAGE.flag_popular,
          theme: theme,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
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
          renderItem={data => this.renderItem(data)} ƒ
          keyExtractor={item => "" + item.item.id}
          refreshControl={
            <RefreshControl
              title={'loading'} ƒ
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
  popular: state.popular,
});

const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
});

// connect 只是个function,并不一定非要放在export后面
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

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
