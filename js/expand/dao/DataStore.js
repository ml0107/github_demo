// import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Trending from 'GitHubTrending'

export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'}

export default class DataStore {

  /**
   * 获取数据
   * 优先获取本地数据 如果无本地数据或者本地数据过期则获取网络数据
   * @param url
   * @param flag
   * @returns {Promise<any> | Promise<*>}
   */
  fetchData(url,flag) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url,flag).then((wrapData) => {
        if (wrapData && DataStore.checkTimestampValid(wrapData)) {
          resolve(wrapData,true);
        } else {
          this.fetchNetData(url,flag).then((data) => {
            resolve(this._wrapData(data));
          }).catch((error) => {
            reject(error);
          })
        }
      }).catch((error) => {
        this.fetchNetData(url,flag).then((data) => {
          resolve(this._wrapData(data));
        }).catch((error) => {
          reject(error);
        })
      })
    })
  };

  /**
   * 获取本地缓存数据
   * AsyncStorage.getItem 获取的数据是String 类型的, 方便使用  我们需要将其反序列成object
   * @param url
   * @returns {Promise<any> | Promise<*>}
   */
  fetchLocalData(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
            console.error(e);
          }
        } else {
          reject(error);
          console.log(error);
        }
      })
    })
  };

  /**
   * 获取网络数据
   * @param url
   * @param flag
   * @returns {Promise<any> | Promise<*>}
   */
  fetchNetData(url,flag) {
    return new Promise((resolve, reject) => {
      if (flag === FLAG_STORAGE.flag_popular) {
        fetch(url)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok')
          })
          .then((responseData) => {
            this.saveData(url, responseData);
            resolve(responseData);
          })
          .catch((error) => {
            reject(error);
          })

      } else {
        new Trending().fetchTrending(url)
          .then((items) => {
            if (!items) {
              reject(new Error('responseData is null'));
              return;
            }
            resolve(items);
            this.saveData(url, items);
          })
          .catch(error => {
            reject(error)
          })

      }

    })
  }

  /**
   * 保存数据
   * @param url 缓存数据的key
   * @param data 接受一个object的参数data作为保存的value， 因为AsyncStorage 是无法直接保存object的 所以我们需要将其序列化成json
   * @param callback
   */
  saveData(url, data, callback) {
    if (!data || !url) return;
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
  };

  /**
   * 数据的有效期, 给缓存的数据添加时间戳
   * @param data
   * @returns {{data: *, timestamp: number}}
   * @private
   */
  _wrapData(data) {
    return {
      data: data,
      timestamp: new Date().getTime()
    }
  };

  /**
   * 判断数据是否有效
   * @param timestamp 项目更新时间
   * @returns {boolean}  true 不需要更新, false 需要更新
   */
  static checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if (currentDate.getFullYear() !== targetDate.getFullYear()) return false;
    if (currentDate.getMonth() !== targetDate.getMonth()) return false;
    if (currentDate.getDate() !== targetDate.getDate()) return false;
    if (currentDate.getHours() - targetDate.getHours() > 4) return false; // 有效四小时
    return true;
  }
}
