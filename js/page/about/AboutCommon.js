import React, {Component} from 'react';
import BackPressComponent from "../../common/BackPressComponent";
import NavigationUtil from "../../navigator/NavigationUtil";
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {Platform, Image, Text, View, Dimensions, StyleSheet} from 'react-native';
import GlobalStyle from '../../res/styles/GlobalStyle'
import ViewUtil from "../../util/ViewUtil";

const THEME_COLOR = '#678';
export const FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'}
export default class AboutCommon {
  constructor(props, updateState) {
    this.props = props;
    this.updateState = updateState;
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})



  }

  onBackPress() {
    NavigationUtil.goBack(this.props.navigation);
    return true;
  }

  componentDidMount() {
    this.backPress.componentDidMount();


    fetch('http://www.devio.org/io/GitHubPopular/json/github_app_config.json')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network Error')
      })
      .then(responseData => {
        if (responseData) {
          this.updateState({
            data: responseData
          })
        }
      })
      .catch(e => {
        console.log(e);
      })
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  getParallaxRenderConfig(params) {
    let config = {};
    let avatar = typeof (params.avatar) === 'string' ? {uri: params.avatar} : params.avatar;

    console.log(avatar);
    // 背景
    config.renderBackground = () => (
      <View key="background">
        <Image source={{
          uri: params.backgroundImg,
          width: window.width,
          height: PARALLAX_HEADER_HEIGHT
        }}/>
        <View style={{
          position: 'absolute',
          top: 0,
          width: window.width,
          backgroundColor: 'rgba(0,0,0,.4)',
          height: PARALLAX_HEADER_HEIGHT
        }}/>
      </View>
    );

    // 前景
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image style={styles.avatar} source={avatar}/>
        <Text style={styles.sectionSpeakerText}>
          {params.name}
        </Text>
        <Text style={styles.sectionTitleText}>
          {params.description}
        </Text>
      </View>
    );

    // 悬浮的header
    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    );

    // 固定的header
    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtil.getLeftBackButton(() => NavigationUtil.goBack(this.props.navigation))}
        {ViewUtil.getShareButton(() => this.onShare())}
      </View>
    );
    return config;
  }

  // header 分享按钮事件
  onShare() {

  }

  render(contentView, params) {
    const {theme} = this.props;
    const renderConfig = this.getParallaxRenderConfig(params);
    return (
      <ParallaxScrollView
        backgroundColor={theme.themeColor}
        contentBackgroundColor={GlobalStyle.backgroundColor}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        backgroundScrollSpeed={10}
        {...renderConfig}>
        {contentView}
      </ParallaxScrollView>
    )
  }
}

const window = Dimensions.get('window');
const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? GlobalStyle.nav_bar_height_ios + 20 : GlobalStyle.nav_bar_height_android;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    marginTop:20
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 60
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
    marginBottom: 5,
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10
  },
});
