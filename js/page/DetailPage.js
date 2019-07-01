/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, DeviceInfo} from 'react-native';
import { WebView } from 'react-native-webview';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";
import FavoriteDao from "../expand/dao/FavoriteDao";

const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678';

export default class DetailPage extends Component {

  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {projectModel,flag,theme} = this.params;
    this.favoriteDao = new FavoriteDao(flag);
    console.log(projectModel);
    this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
    const title = projectModel.item.full_name || projectModel.item.fullName;
    this.state = {
      title: title,
      url: this.url,
      canGoBack: false,
      isFavorite: projectModel.isFavorite,
      theme:theme
    };

    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
  }

  componentDidMount() {
    this.backPress.componentDidMount()
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  onBackPress() {
    this.onBack();
    return true;
  }

  /**
   * 点击收藏按钮
   */
  onFavoriteButtonClick(){
    const {projectModel,callback} = this.params;
    const isFavorite = projectModel.isFavorite =! projectModel.isFavorite;
    callback(isFavorite); // 更新item的收藏状态
    this.setState({
      isFavorite:isFavorite
    });
    let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
    if (projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
    } else {
      this.favoriteDao.removeFavoriteItem(key);
    }
  }

  renderRightButton() {
    return <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={() => {
          this.onFavoriteButtonClick()
        }}
      >
        <FontAwesome
          name={this.state.isFavorite ? 'star' : 'star-o'}
          size={20}
          style={{color: '#fff', marginRight: 10}}
        />

      </TouchableOpacity>
      {ViewUtil.getShareButton(() => {

      })}
    </View>
  }

  onBack() {
    if (this.state.canGoBack) { // 判断页面是否还处于webView 之中
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })
  }

  render() {
    const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null
    let navigationBar = <NavigationBar
      title={this.state.title}
      titleLayoutStyle={titleLayoutStyle}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      rightButton={this.renderRightButton()}
      style={{backgroundColor: this.state.theme.themeColor}}
    />;
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },
});
