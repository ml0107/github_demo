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
  TextInput,
  Platform
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'

import NavigationUtil from '../navigator/NavigationUtil'
import PopularItem from '../common/PopularItem'
import Toast from 'react-native-easy-toast'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import LanguageDao from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import GlobalStyle from "../res/styles/GlobalStyle";
import ViewUtil from '../util/ViewUtil'
import Utils from "../util/Utils";


const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const pageSize = 10; // 设为常量，防止修改

class SearchPage extends Component {
  constructor(props) {
    super(props);
    // 关闭页面警告
    console.disableYellowBox = true;

    this.params = this.props.navigation.state.params;
    this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress()});
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.isKeyChange = false;
  }

  componentDidMount() {
    this.backPress.componentDidMount()
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  loadData(loadMore) {
    const {onLoadMoreSearch, onSearch, search, keys} = this.props;
    if (loadMore) {
      console.log('--------刷新加载更多-------');
      onLoadMoreSearch(++search.pageIndex, pageSize, search.items, this.favoriteDao, callback => {
        this.toast.show('没有更多')
      })
    } else {
      console.log('--------刷新加载-------');
      onSearch(this.inputKey, pageSize, this.searchToken = new Date().getTime(), this.favoriteDao, keys, message => {
        this.toast.show(message)
      })
    }
  }

  onBackPress() {
    const {onSearchCancel, onLoadLanguage} = this.props;
    onSearchCancel(); // 退出时取消搜索
    this.refs.input.blur();
    NavigationUtil.goBack(this.props.navigation);
    if (this.isKeyChange) {
      onLoadLanguage(FLAG_LANGUAGE.flag_key); // 重新加载标签
    }
    return true;
  }

  renderItem(data) {
    const item = data.item;
    const {theme} = this.params;
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
    const {search} = this.props;
    return search.hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
        />
        <Text>正在加载更多</Text>
      </View>
  }


  /**
   * 搜索or取消
   */
  onRightButtonClick() {
    const {onSearchCancel, search} = this.props;

    if (search.showText === '搜索') {
      this.loadData()
    } else {
      onSearchCancel(this.searchToken)
    }
  }

  renderNavBar() {
    const {theme} = this.params;
    const {showText, inputKey} = this.props.search;
    // console.log('输入的文字' + inputKey);
    const placeholder = inputKey || "请输入";
    let backButton = ViewUtil.getLeftBackButton(() => this.onBackPress());
    let inputView = <TextInput
      ref={'input'}
      placeholder={placeholder}
      onChangeText={text => this.inputKey = text}
      style={styles.textInput}
    >
    </TextInput>;

    let rightButton = <TouchableOpacity onPress={() => {
      this.refs.input.blur(); // 收起键盘
      this.onRightButtonClick();
    }}
    >
      <View style={{marginRight: 10}}>
        <Text style={styles.title}>{showText}</Text>
      </View>
    </TouchableOpacity>;

    return <View style={{
      backgroundColor: theme.themeColor,
      flexDirection: 'row',
      alignItems: 'center',
      height: (Platform.OS === 'ios') ? GlobalStyle.nav_bar_height_ios : GlobalStyle.nav_bar_height_android
    }}>
      {backButton}
      {inputView}
      {rightButton}
    </View>
  }

  /**
   * 保存
   */
  saveKey() {
    const {keys} = this.props;
    let key = this.inputKey;
    if (Utils.checkKeyIsExist(keys, key)) {
      this.toast.show(key + '已经存在')
    } else {
      key = {
        "path": key,
        "name": key,
        "checked": true
      };
      keys.unshift(key); // 将key添加到数组的开头
      this.languageDao.save(keys);
      this.toast.show(key.name + '保存成功');
      this.isKeyChange = true;
    }
  }


  render() {
    const {isLoading, projectModels, showBottomButton} = this.props.search;
    const {theme} = this.params;
    let statusBar = null;
    if (Platform.OS === 'ios') {
      statusBar = <View style={[styles.statusBar, {backgroundColor: theme.themeColor}]}></View>
    }
    let listView = !isLoading ? <FlatList
      data={projectModels}
      renderItem={data => this.renderItem(data)} ƒ
      keyExtractor={item => "" + item.item.id}
      contentInset={{bottom: 45}}
      refreshControl={
        <RefreshControl
          title={'loading'} ƒ
          titleColor={theme.themeColor}
          colors={[theme.themeColor]}
          refreshing={isLoading}
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
    /> : null;

    let bottomButton = showBottomButton ?
      <TouchableOpacity
        style={[styles.bottomButton, {backgroundColor: theme.themeColor}]}
        onPress={() => {
          this.saveKey();
        }}
      >
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.title}>朕收下了</Text>
        </View>
      </TouchableOpacity> : null;
    let indicatorView = isLoading ?
      <ActivityIndicator style={styles.centering} size={'large'} animating={isLoading}/> : null;
    let resultView = <View style={{flex: 1}}>
      {indicatorView}
      {listView}
    </View>;
    return (
      <View style={styles.container}>
        {statusBar}
        {this.renderNavBar()}
        {resultView}
        {bottomButton}
        <Toast ref={toast => this.toast = toast}/>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  search: state.search,
  keys: state.language.keys
});

const mapDispatchToProps = dispatch => ({
  onSearch: (inputKey, pageSize, token, favoriteDao, popularKeys, callBack) => dispatch(actions.onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack)),
  onSearchCancel: (token) => dispatch(actions.onSearchCancel(token)),
  onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callBack) => dispatch(actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callBack)),
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

// connect 只是个function,并不一定非要放在export后面
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);

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
  },
  statusBar: {
    height: 20,
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    left: 10,
    top: GlobalStyle.window_height - 45,
    right: 10,
    borderRadius: 3
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  textInput: {
    flex: 1,
    height: (Platform.OS === 'ios') ? 26 : 36,
    borderWidth: (Platform.OS === 'ios') ? 1 : 0,
    borderColor: 'white',
    alignSelf: 'center',
    paddingLeft: 5,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 3,
    opacity: 0.7,
    color: 'white'
  },
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: '500'
  }

});
