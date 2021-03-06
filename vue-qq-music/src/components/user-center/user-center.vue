<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switch-wrapper">
        <switches @switch="switchItem" :currentIndex="currentIndex" :switches="switches"></switches>
      </div>
      <div class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoritelist" class="list-scroll" v-if="currentIndex === 0" :data="favoriteList">
          <div class="list-inner" >
            <songlist :songs="favoriteList" :rank="rank" @selectItem="selectSong"></songlist>
          </div>
        </scroll>
        <scroll ref="playlist" class="list-scroll" :data="playHistory" v-if="currentIndex === 1">
          <div class="list-inner">
            <songlist :rank="rank" @selectItem="selectSong" :songs="playHistory"></songlist>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <noResult :title="noResultDes"></noResult>
      </div>
    </div>
  </transition>
</template>

<script>
  import switches from 'base/switch/switch'
  import {mapGetters, mapActions} from 'vuex'
  import scroll from 'base/scroll/scroll'
  import Song from 'common/js/song'
  import songlist from 'base/song-list/song-list'
  import {playListMixin} from 'common/js/mixin'
  import noResult from 'base/no-result/no-result'
  export default {
    mixins: [playListMixin],
    computed: {
      ...mapGetters([
        'playHistory',
        'favoriteList'
      ]),
      noResult() {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length > 0
        } else {
          return !this.playHistory.length > 0
        }
      },
      noResultDes() {
        if (this.currentIndex === 0) {
          return '暂无收藏歌曲'
        } else {
          return '你还没有听过歌曲'
        }
      }
    },
    data() {
      return {
        switches: [
          {name: '我喜欢的'},
          {name: '我最近听的'}
        ],
        currentIndex: 0,
        rank: false
      }
    },
    methods: {
      handlePlayList(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoritelist && this.$refs.favoritelist.refresh()
        this.$refs.playlist && this.$refs.playlist.refresh()
      },
      switchItem(index) {
        this.currentIndex = index
      },
      selectSong(song) {
        this.inserSong(new Song(song))
      },
      back() {
        this.$router.back()
      },
      random() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        if (list.length === 0) {
          return
        }
        list = list.map((song) => {
          return new Song(song)
        })
        this.randomPlay({
          list: list
        })
      },
      ...mapActions([
        'inserSong',
        'randomPlay'
      ])
    },
    components: {
      switches,
      scroll,
      songlist,
      noResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable.styl'
  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 12px
        font-size: $font-size-large-x
        color: $color-theme
    .switch-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
        position: absolute
        top: 110px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>