import React from 'react'
import {BackHandler} from "react-native";

/**
 * android 物理返回键
 */
export default class BackPressComponent {
  constructor(props) {
    this._hardwareBackPress = this.onHardwareBackPress.bind(this);
    this.props = props;
  }

  componentDidMount() {
    if (this.props.backPress) BackHandler.addEventListener("hardwareBackPress", this._hardwareBackPress);
  }

  componentWillUnmount() {
    if (this.props.backPress) BackHandler.removeEventListener("hardwareBackPress", this._hardwareBackPress);
  }

  onHardwareBackPress(e) {
    return this.props.backPress(e);
  }
}
