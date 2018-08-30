<template>
  <div class="singer" ref="singer">
   <listview @select="selectItem" :data="singerList" ref="list"></listview>
   <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import Singer from 'common/js/singer'
  import listview from 'base/listview/listview'
  import {playListMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  const ERR_OK = 0
  const HOT_SINGER_LENGTH = 10
  const HOT_NAME = '热门'

  export default {
    mixins: [playListMixin],
    data() {
      return {
        singerList: []
      }
    },
    mounted() {
      this._getSingerList()
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      ...mapMutations({
        'setSinger': 'SET_SINGER'
      }),
      selectItem(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singerList = this._normalSingerList(res.data.list)
          }
        })
      },
      _normalSingerList(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LENGTH) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (/[a-zA-Z]/.test(val.title)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          let aTitle = a.title.charCodeAt(0)
          let bTitle = b.title.charCodeAt(0)
          return aTitle - bTitle
        })
        return hot.concat(ret)
      }
    },
    components: {
      listview
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>