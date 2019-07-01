/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, TextInput} from 'react-native';

export default class FetchDemoPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showText: ''
    }
  }


  loadData() {
    // https://api.github.com/search/repositories?q=web
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
    fetch(url)
      .then(response => response.text())
      .then(responseText => {
        this.setState({
          showText: responseText
        })
      })
  }

  loadData2() {
    // https://api.github.com/search/repositories?q=web
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        // 抛出异常
        throw new Error('Network response was not ok.');
      })
      .then(responseText => {
        this.setState({
          showText: responseText
        })
      })
      .catch(e => {
        this.setState({
          showText: e.toString()
        })
      })
  }

  render() {
    const {navigation} = this.props;
    return (
      <View>
        <Text>FetchDemoPage 使用</Text>
        <View style={styles.input_content}>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              this.searchKey = text;
            }}
          />
          <Button title='获取' onPress={() => {
            this.loadData();
          }}/>
          <Button title='获取2' onPress={() => {
            this.loadData2();
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    height: 30,
    flex: 1,
    borderColor: '#f00',
    borderWidth: 1,
    marginRight: 20,
  },
  input_content: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
