import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao {
  constructor(flag) {
    console.log(flag+'页面名称');
    this.flag = flag;
    this.favoriteKey=FAVORITE_KEY_PREFIX+ flag;
  }

  /**
   * 收藏项目, 保存收藏的项目
   * @param key 项目id
   * @param value 收藏的项目
   * @param callback
   */
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, value, (error, result) => {
      if (!error) { // 更新Favorite的key
        this.updateFavoriteKeys(key, true);
      }
    })
  }

  /**
   * 更新 Favorite key 集合
   * @param key
   * @param isAdd true 添加 false 删除
   */
  updateFavoriteKeys(key, isAdd) {
    console.log(this.favoriteKey+'更新收藏item');

    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = [];
        if (result) {
          favoriteKeys = JSON.parse(result);
        }
        let index = favoriteKeys.indexOf(key);
        if (isAdd) { //如果是添加且key不在存在 则添加到数组中
          if (index === -1) favoriteKeys.push(key)
        } else { // 如果是删除且key存在 则将其从数值中移除
          if (index !== -1) favoriteKeys.splice(index, 1)
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys))
      }
    })
  }

  /**
   * 获取收藏的Repository 对应的key
   * @returns {Promise<any> | Promise<*>}
   */
  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(error)
          }
        } else {
          reject(error)
        }
      })
    })
  }

  /**
   * 取消收藏, 移除已经收藏的项目
   * @param key 项目id
   */
  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (error, result) => {
      if (!error) { // 更新Favorite的key
        this.updateFavoriteKeys(key, false);
      }
    })
  }

  /**
   * 获取所有收藏的项目
   * @returns {Promise<any> | Promise<*>}
   */
  getAllItems() {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys().then((keys) => {
        let items = [];
        if (keys) {
          AsyncStorage.multiGet(keys, (error, stores) => {
            try {
              stores.map((result, i, store) => {
                let key = store[i][0];
                let value = store[i][1];
                if (value) items.push(JSON.parse(value));
              });
              resolve(items)
            } catch (e) {
              reject(error)
            }
          })
        } else {
          resolve(items)
        }
      }).catch((e) => {
        reject(e)
      })
    })
  }
}
