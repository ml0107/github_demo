export default class Utils {

  /**
   * 检查当前Item是否被收藏
   * @param item
   * @param keys
   * @returns {boolean}
   */
  static checkFavorite(item, keys = []) {
    if (!keys) return false;
    for (let i = 0, len = keys.length; i < len; i++) {
      let id = item.id ? item.id : item.fullName;
      if (id.toString() === keys[i]) {
        return true
      }
    }
    return false;
  }

  /**
   * 检查key是否存在于keys中
   * @param keys
   * @param key
   */
  static checkKeyIsExist(keys, key) {
    for (let i = 0, l = keys.length; i < l; i++) {
      if (key.toLowerCase().trim() === keys[i].name.toLowerCase().trim()) return true;
    }
    return false;
  }

}





