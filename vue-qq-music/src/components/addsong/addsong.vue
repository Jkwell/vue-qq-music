<template>
  <transition name="move">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <searchbox ref="searchbox" @changeQuery="onChangeQuery" placeholder="搜索歌曲"></searchbox>
      </div>
      <div class="shortcut" v-show="!query">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
        <div class="list-wrapper">
          <scroll ref="songlist" class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
            <div class="list-inner" >
              <songlist :songs="playHistory" :rank="rank" @selectItem="selectSong"></songlist>
            </div>
          </scroll>
          <scroll ref="searchlist" class="list-scroll" :data="searchHistory" v-if="currentIndex === 1">
            <div class="list-inner">
              <searchlist @select="addQuery" @delete="deleteOne" :searches="searchHistory"></searchlist>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggeset @listenScroll="inputBlur" :query="query" :showSinger="showSinger" @select="selectSuggest"></suggeset>
      </div>
      <topTip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌已经添加到播放队列</span>
        </div>
      </topTip>
    </div>
  </transition>
</template>

<script>
  import searchbox from 'base/search-box/search-box'
  import searchlist from 'base/search-list/search-list'
  import songlist from 'base/song-list/song-list'
  import suggeset from 'components/suggest/suggest'
  import scroll from 'base/scroll/scroll'
  import switches from 'base/switch/switch'
  import topTip from 'base/top-tip/top-tip'
  import {mapGetters, mapActions} from 'vuex'
  import {searchMixin} from 'common/js/mixin'
  import Song from 'common/js/song'
  export default {
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        showSinger: false,
        rank: false,
        currentIndex: 1,
        switches: [
          {name: '最近播放'},
          {name: '搜索历史'}
        ]
      }
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    methods: {
      showTip() {
        this.$refs.topTip.show()
      },
      selectSong(item, index) {
        if (index !== 0) {
          this.inserSong(new Song(item))
          this.showTip()
        }
      },
      show() {
        this.showFlag = true
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songlist.refresh()
          } else {
            this.$refs.searchlist.refresh()
          }
        })
      },
      hide() {
        this.showFlag = false
      },
      selectSuggest() {
        this.saveSearch()
        this.showTip()
      },
      deleteOne(item) {
        this.deleteSearch(item)
      },
      switchItem(index) {
        this.currentIndex = index
      },
      ...mapActions([
        'inserSong'
      ])
    },
    components: {
      searchbox,
      searchlist,
      songlist,
      suggeset,
      switches,
      scroll,
      topTip
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable" 
  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 300
    background: $color-background
    &.move-enter-active, &.move-leave-active
      transition: all 0.3s
    &.move-enter, &.move-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme
    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        overflow: hidden
        background: $color-background
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text

</style>