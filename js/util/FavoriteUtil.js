import React, {Component} from 'react';
import {FLAG_STORAGE} from "../expand/dao/DataStore";

export default class FavoriteUtil {

  /**
   * favoriteIcon 单击回调函数
   * @param favoriteDao
   * @param item
   * @param isFavorite
   * @param flag
   */
  static onFavorite(favoriteDao, item, isFavorite, flag) {
    const key=flag===FLAG_STORAGE.flag_popular? item.id.toString():item.fullName;

    console.log(key);
    if (isFavorite) {
      favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
    } else {
      favoriteDao.removeFavoriteItem(key);
    }
  }

}





