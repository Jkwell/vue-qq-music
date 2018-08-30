<template>
  <transition name="slide">
    <div class="top-list">
      <musicList :rank="rank" :title="title" :bgImage="bgImage" :songs="songs"></musicList>
    </div>
  </transition>
</template>

<script>
  import {createSong} from 'common/js/song'
  import {mapGetters} from 'vuex'
  import musicList from 'components/music-list/music-list'
  import {getMusicList} from 'api/rank'
  const ERR_OK = 0
  export default {
    computed: {
      ...mapGetters([
        'topList'
      ]),
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length > 0) {
          return this.songs[0].image
        }
        return ''
      }
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      this._getTopList()
    },
    methods: {
      _getTopList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.data.songid && musicData.data.albummid) {
            ret.push(createSong(musicData.data))
          }
        })
        return ret
      }
    },
    components: {
      musicList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  .top-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    transform: translate3d(0, 0, 0)
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s linear
</style>