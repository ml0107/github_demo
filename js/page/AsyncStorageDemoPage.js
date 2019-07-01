/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, TextInput} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


const KEY = "save_key";
export default class AsyncStorageDemoPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showText: ''
    }
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text>AsyncStorageDemoPage 使用</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            this.value = text;
          }}
        />
        <View style={styles.input_content}>
          <Button title='储存' onPress={() => {
            this.doSave();
          }}/>
          <Button title='删除' onPress={() => {
            this.doRemove();
          }}/>
          <Button title='获取' onPress={() => {
            this.getData();
          }}/>
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    );
  }

  /**
   * 储存数据
   * @returns {Promise<void>}
   */
  async doSave() {
    // 用法一
    AsyncStorage.setItem(KEY, this.value, error => {
      error && console.log(error.toString());
    });

    // // 用法二
    // AsyncStorage.setItem(KEY, this.value)
    //   .catch(error => {
    //     error && console.log(error.toString());
    //   })
    //
    // // 用法三
    // try{
    //   await  AsyncStorage.setItem(KEY, this.value)
    // }catch (error) {
    //   error && console.log(error.toString());
    // }
  };

  /**
   * 删除数据
   * @returns {Promise<void>}
   */
  async doRemove() {
    // 用法一
    AsyncStorage.removeItem(KEY, error => {
      error && console.log(error.toString());
    });

    // // 用法二
    // AsyncStorage.removeItem(KEY)
    //   .catch(error => {
    //     error && console.log(error.toString());
    //   });
    //
    // // 用法三
    // try {
    //   await AsyncStorage.removeItem(KEY,)
    // } catch (error) {
    //   error && console.log(error.toString());
    // }
  };

  /**
   * 获取数据
   * @returns {Promise<void>}
   */
  async getData() {
    // 用法一
    AsyncStorage.getItem(KEY, (error, value) => {
      this.setState({
        showText: value
      });
      console.log(value);
      error && console.log(error.toString());
    });

    // // 用法二
    // AsyncStorage.getItem(KEY)
    //   .then(value => {
    //     this.setState({
    //       showText: value
    //     });
    //     console.log(value);
    //   })
    //   .catch(error => {
    //     error && console.log(error.toString());
    //   });
    //
    // // 用法三
    // try {
    //   const value = await AsyncStorage.getItem(KEY);
    //   this.setState({
    //     showText: value
    //   });
    //   console.log(value);
    // } catch (error) {
    //   error && console.log(error.toString());
    // }
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
