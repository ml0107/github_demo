import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation' ;

import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'
import WebViewPage from '../page/WebViewPage'
import AboutPage from '../page/about/AboutPage'
import AboutMePage from '../page/about/AboutMePage'
import CustomKeyPage from '../page/CustomKeyPage'
import SortKeyPage from '../page/SortKeyPage'
import SearchPage from '../page/SearchPage'
import FetchDemoPage from '../page/FetchDemoPage'
import AsyncStorageDemoPage from '../page/AsyncStorageDemoPage'
import DataStoreDemoPage from '../page/DataStoreDemoPage'
import {connect} from 'react-redux';
import {createReactNavigationReduxMiddleware, createReduxContainer} from 'react-navigation-redux-helpers'

export const rootCom = 'Init'; // 设置跟路由
const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      header: null, // 可以通过将header设为Null 隐藏标题。
    }
  }
});
const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      header: null, // 可以通过将header设为Null 隐藏标题。
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      header: null, // 可以通过将header设为Null 隐藏标题。
    }
  },
  WebViewPage: {
    screen: WebViewPage,
    navigationOptions: {
      header: null, // 可以通过将header设为Null 隐藏标题。
    }
  },
  AboutPage: {
    screen: AboutPage,
    navigationOptions: {
      header: null, // 可以通过将header设为Null 隐藏标题。
    }
  },
  AboutMePage: {
    screen: AboutMePage,
    navigationOptions: {
      header: null, // 可以通过将header设为Null 隐藏标题。
    }
  },
  CustomKeyPage: {
    screen: CustomKeyPage,
    navigationOptions: {
      header: null, // 可以通过将header设为Null 隐藏标题。
    }
  },
  SortKeyPage: {
    screen: SortKeyPage,
    navigationOptions: {
      header: null, // 可以通过将header设为Null 隐藏标题。
    }
  },
  SearchPage: {
    screen: SearchPage,
    navigationOptions: {
      header: null, // 可以通过将header设为Null 隐藏标题。
    }
  },
  FetchDemoPage: {
    screen: FetchDemoPage,
    navigationOptions: {
      title:'Fetch 使用'
      // header: null, // 可以通过将header设为Null 隐藏标题。
    }
  },
  AsyncStorageDemoPage: {
    screen: AsyncStorageDemoPage,
    navigationOptions: {
      title:'AsyncStorage 使用'
      // header: null, // 可以通过将header设为Null 隐藏标题。
    }
  },
  DataStoreDemoPage: {
    screen: DataStoreDemoPage,
    navigationOptions: {
      title:'DataStoreDemoPage 使用'
      // header: null, // 可以通过将header设为Null 隐藏标题。
    }
  },
});
export const RootNavigator = createSwitchNavigator({
// export default createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator,
}, {
  navigationOptions: {
    header: null, // 可以通过将header设为Null 隐藏标题。
  }
});

/**
 * 1.初始化 react-navigation 与 redux 的中间件
 * @type {Middleware}
 */
export const middleware = createReactNavigationReduxMiddleware(
  state => state.nav,
  'root'
);
/**
 * 2.将根导航器组件传递给 createReduxContainer 函数，
 * 并返回一个将navigation state 和 dispatch 函数作为 props的新组件
 * 注意: 要在createReactNavigationReduxMiddleware之后执行
 * @type {React.ComponentType<any>}
 */
const AppWithNavigationState = createReduxContainer(createAppContainer(RootNavigator), 'root');

/**
 * 3.State 到Props 的映射关系
 * @param state
 * @returns {{state: NavigationState}}
 */
const mapStateToProps = state => ({
  state: state.nav
});


// export default createAppContainer(AppStackNavigator);

/**
 * 4.连接React 组件与Redux store
 */
export default connect(mapStateToProps)(AppWithNavigationState)
