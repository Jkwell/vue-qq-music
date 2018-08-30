<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="topList" ref="topList">
      <ul>
        <li class="item" @click="selectItem(item)" v-for="(item, index) in topList" :key="index">
          <div class="icon">
            <img v-lazy="item.picUrl" width="100" height="100" >
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}--{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import {getTopList} from 'api/rank'
  import {playListMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'
  const ERR_OK = 0
  export default {
    mixins: [playListMixin],
    data() {
      return {
        topList: []
      }
    },
    created() {
      this._getTopList()
    },
    methods: {
      _getTopList() {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList
          }
        })
      },
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.topList.refresh()
      },
      ...mapMutations({
        'setTopList': 'SET_TOPLIST'
      }),
      selectItem(item) {
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
      }
    },
    components: {
      scroll,
      loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .rank
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    .topList
      width: 100%
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            nowrap()
            line-height: 26px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>