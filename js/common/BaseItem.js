import React, {Component} from 'react'
import {StyleSheet, Image, Text, View, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import HTMLView from 'react-native-htmlview';
import PropTypes from 'prop-types'

export default class BaseItem extends Component {
  static propTypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      isFavorite: this.props.projectModel.isFavorite
    }
  }

  /**
   * https://blog.csdn.net/xiangzhihong8/article/details/81075769
   * getDerivedStateFromProps 用于替换 componentWillReceiveProps ，该函数会在初始化和 update 时被调用
   * getSnapshotBeforeUpdate 用于替换 componentWillUpdate ，该函数会在 update 后 DOM 更新前被调用，用于读取最新的 DOM 数据
   * @param nextProps
   * @param prevState
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    const isFavorite = nextProps.projectModel.isFavorite;
    if (prevState.isFavorite !== isFavorite) {
      return {
        isFavorite: isFavorite
      }
    }
    return null;
  }

  /**
   * 监听收藏状态
   */
  onItemClick(){
    this.props.onSelect(isFavorite =>{
      this.setFavoriteState(isFavorite)
    })
  }

  /**
   * 更新收藏状态
   */
  setFavoriteState(isFavorite){
    this.props.projectModel.isFavorite = isFavorite;
    this.setState({
      isFavorite: isFavorite
    })
  }

  onPressFavorite(){
    this.setFavoriteState(!this.state.isFavorite);
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
  }

  /**
   * 渲染图标
   * @returns {*}
   * @private
   */
  _favoriteIcon() {
    const {theme} = this.props;
    return <TouchableOpacity
      style={{padding: 6}}
      underlayColor={'transparent'}
      onPress={() => this.onPressFavorite()}
    >
      <FontAwesome
        name={this.state.isFavorite ? 'star' : 'star-o'}
        size={26}
        style={{color: theme.themeColor}}
      />
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({});
