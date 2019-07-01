/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'
import NavigationUtil from "../navigator/NavigationUtil";

class TestPage extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text>TestPage</Text>
        <Text onPress={() => {
          NavigationUtil.goPage(
            {navigation: this.props.navigation},
            'DetailPage'
          )
        }}>跳转到详情页</Text>
        <Text onPress={() => {
          NavigationUtil.goPage(
            {navigation: this.props.navigation},
            'FetchDemoPage'
          )
        }}>跳转到Fetch 页面</Text>
        <Text onPress={() => {
          NavigationUtil.goPage(
            {navigation: this.props.navigation},
            'AsyncStorageDemoPage'
          )
        }}>跳转到AsyncStorageDemoPage 页面</Text>
        <Text onPress={() => {
          NavigationUtil.goPage(
            {navigation: this.props.navigation},
            'DataStoreDemoPage'
          )
        }}>跳转到DataStoreDemoPage 页面</Text>
        <Button
          title={'改变主题色-green'}
          onPress={() => {
            this.props.onThemeChange('orange')
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(TestPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
