<template>
  <transition name="slide">
    <div class="disc">
      <musicList :title="title" :bgImage="bgImage" :songs="songs"></musicList>
    </div>
  </transition>
</template>

<script>
  import musicList from 'components/music-list/music-list'
  import {getDiscSongs} from 'api/recommend'
  import {createSong} from 'common/js/song'
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'disc'
      ]),
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      }
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getDiscSongs(this.disc.dissid).then((res) => {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
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
  .disc
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