import {onThemeChange,onShowCustomThemeView} from './theme'
import {onRefreshPopular,onLoadMorePopular,onFlushPopularFavorite} from './popular'
import {onRefreshTrending,onLoadMoreTrending,onFlushTrendingFavorite} from './trending'
import {onLoadFavoriteData} from './favorite'
import {onLoadLanguage} from './language'

// 根action
export default {
  onThemeChange,
  onShowCustomThemeView,
  onRefreshPopular,
  onLoadMorePopular,
  onFlushPopularFavorite,
  onRefreshTrending,
  onLoadMoreTrending,
  onFlushTrendingFavorite,
  onLoadFavoriteData,
  onLoadLanguage
}
