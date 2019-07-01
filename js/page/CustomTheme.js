/**
 * 自定义主题
 * @flow
 * **/
import React, {Component} from "react";
import {
  StyleSheet,
  View,
  Image,
  Modal, Text,
  Platform,
  ScrollView,
  TouchableHighlight
} from "react-native";
import ThemeFactory, {ThemeFlags} from "../res/styles/ThemeFactory";
import ThemeDao from "../expand/dao/ThemeDao";
import actions from "../action";
import {connect} from "react-redux";
import GlobalStyles from "../res/styles/GlobalStyle";

class CustomTheme extends Component {

  constructor(props) {
    super(props);
    this.themeDao = new ThemeDao();
  }

  onSelectTheme(themeKey) {
    this.props.onClose();
    this.themeDao.save(ThemeFlags[themeKey]);

    const {onThemeChange} = this.props;
    onThemeChange(ThemeFactory.createTheme(ThemeFlags[themeKey]));
  }

  renderContentView() {
    return (<Modal
      animationType={"slide"}
      transparent={true}
      visible={this.props.visible}
      onRequestClose={() => {
        this.props.onClose();
      }}
    >
      <ScrollView style={styles.modalContainer}>
        {this.renderThemeItems()}
      </ScrollView>
    </Modal>)
  }

  /**
   * 创建主题Item
   * @param themeKey
   * @returns {*}
   */
  getThemeItem(themeKey) {
    return (
      <TouchableHighlight
        style={{flex: 1}}
        underlayColor='white'
        onPress={()=>this.onSelectTheme(themeKey)}>
        <View style={[{backgroundColor: ThemeFlags[themeKey]}, styles.themeItem]}>
          <Text style={styles.themeText}>{themeKey}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderThemeItems() {
    const views = [];
    for (let i = 0, keys = Object.keys(ThemeFlags), l = keys.length; i < l; i += 3) {
      const key1 = keys[i], key2 = keys[i + 1], key3 = keys[i + 2];
      views.push(<View key={i} style={{flexDirection: 'row'}}>
        {this.getThemeItem(key1)}
        {this.getThemeItem(key2)}
        {this.getThemeItem(key3)}
      </View>)
    }
    return views;
  }

  render() {
    let view = this.props.visible ? <View style={GlobalStyles.root_container}>
      {this.renderContentView()}
    </View> : null;
    return view
  }

}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  onThemeChange: (theme) => dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps,mapDispatchToProps)(CustomTheme)
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 10,
    marginTop: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: 'white',
    borderRadius: 3,
    shadowColor: 'gray',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    padding: 3
  },
  themeItem: {
    flex: 1,
    height: 120,
    margin: 3,
    padding: 3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  themeText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  }
})
