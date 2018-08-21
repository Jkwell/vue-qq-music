<template>
  <div class="singer">
   <listview :data="singerList"></listview>
  </div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import Singer from 'common/js/singer'
  import listview from 'base/listview/listview'

  const ERR_OK = 0
  const HOT_SINGER_LENGTH = 10
  const HOT_NAME = '热门'

  export default {
    data() {
      return {
        singerList: []
      }
    },
    mounted() {
      this._getSingerList()
    },
    methods: {
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