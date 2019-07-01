/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, TextInput, AsyncStorage} from 'react-native';
import DataStore from '../expand/dao/DataStore'

export default class DataStoreDemoPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showText: ''
    };

    this.dataStore = new DataStore();
  }

  loadData() {
    let url = `https://api.github.com/search/repositories?q=${this.value}`;
    this.dataStore.fetchData(url)
      .then(data => {
        let showData = `初次数据加载时间: ${new Date(data.timestamp)} \n ${JSON.stringify(data.data)}`;
        this.setState({
          showText: showData
        })
      })
      .catch(error => {
        error && console.log(error.toString());
      })
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text>离线缓存框架设计 使用</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            this.value = text;
          }}
        />
        <View style={styles.input_content}>
          <Button title='获取' onPress={() => {
            this.loadData();
          }}/>
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    height: 30,
    borderColor: '#f00',
    borderWidth: 1,
    marginRight: 20,
  },
  input_content: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
