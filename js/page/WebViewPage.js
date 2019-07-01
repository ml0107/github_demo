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
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";

const THEME_COLOR = '#678';

export default class WebViewPage extends Component {

  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {title, url, theme} = this.params;

    console.log(this.params);
    this.state = {
      title: title,
      url: url,
      canGoBack: false,
      theme
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

  onBack() {
    if (this.state.canGoBack) { // 判断页面是否还处于webView 之中
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  /**
   * 导航状态监听
   * @param navState
   */
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })
  }

  render() {
    let navigationBar = <NavigationBar
      title={this.state.title}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
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
