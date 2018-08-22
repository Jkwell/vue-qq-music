<template>
  <transition name="slide">
    <div class="singer-detail">
      <musicList :title="title" :bgImage="bgImage" :songs="songs"></musicList>
    </div>
  </transition>
</template>

<script>
  import {getSingerDetail} from 'api/singer'
  import {createSong} from 'common/js/song'
  import {mapGetters} from 'vuex'
  import musicList from 'components/music-list/music-list'
  const ERR_OK = 0
  export default {
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      }
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSingerDetail()
    },
    methods: {
      _getSingerDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let musicData = item.musicData
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
  .singer-detail
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