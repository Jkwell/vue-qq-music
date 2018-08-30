<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchbox ref="searchbox" @changeQuery="onChangeQuery"></searchbox>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div class="hotkey">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotkey" :key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length > 0">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <div class="search-list-wrapper">
              <searchlist @select="addQuery" @delete="deleteOne" :searches="searchHistory"></searchlist>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" @select="saveSearch" @listenScroll="inputBlur" :query="query"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearch" text="是否清空所有数据" confirmBtnText="清空"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
  import searchbox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'
  import searchlist from 'base/search-list/search-list'
  import suggest from 'components/suggest/suggest'
  import confirm from 'base/confirm/confirm'
  import scroll from 'base/scroll/scroll'
  import {mapActions} from 'vuex'
  import {playListMixin, searchMixin} from 'common/js/mixin'
  const ERR_OK = 0
  export default {
    mixins: [playListMixin, searchMixin],
    computed: {
      shortcut() {
        return this.hotkey.concat(this.searchHistory)
      }
    },
    data() {
      return {
        hotkey: []
      }
    },
    created() {
      this._getHotKey()
    },
    methods: {
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotkey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      deleteOne(item) {
        this.deleteSearch(item)
      },
      clearSearch() {
        this.clearSearch()
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      ...mapActions({
        'clearSearch': 'clearSearchHistory'
      })
    },
    watch: {
      query(newVal) {
        if (!newVal) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 200)
        }
      }
    },
    components: {
      searchbox,
      searchlist,
      suggest,
      confirm,
      scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hotkey
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      overflow: hidden
</style>