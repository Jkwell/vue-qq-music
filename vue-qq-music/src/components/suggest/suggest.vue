<template>
  <scroll class="suggest" :beforeScroll="beforeScroll" @beforeScroll="listenScroll" :pullup="true" :data="result" @scrollToEnd="searchMore" ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" @click="selectItem(item)" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" :title="text"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
  import scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import noResult from 'base/no-result/no-result'
  import {mapMutations, mapActions} from 'vuex'
  import {search} from 'api/search'
  import {createSong} from 'common/js/song'
  const TYPE_SINGER = 'singer'
  const perpage = 20
  const ERR_OK = 0
  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        hasMore: true,
        text: '上拉加载',
        beforeScroll: true
      }
    },
    methods: {
      refresh() {
        this.$refs.suggest.refresh()
      },
      search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._getResult(res.data)
            this.checkMore(res.data)
          }
        })
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._getResult(res.data))
            this.checkMore(res.data)
          }
        })
      },
      listenScroll() {
        this.$emit('listenScroll')
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.set_singer(singer)
        }
        this.insert_song(item)
        this.$emit('select')
      },
      ...mapMutations({
        'set_singer': 'SET_SINGER'
      }),
      ...mapActions({
        'insert_song': 'inserSong'
      }),
      checkMore(data) {
        const song = data.song
        if (!song.list.length || song.curpage * perpage > song.totalnum) {
          this.hasMore = false
        }
      },
      _getResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      getIconClass(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
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
    watch: {
      query() {
        this.search()
      }
    },
    components: {
      scroll,
      loading,
      'no-result': noResult
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/suggest/suggest.styl'
</style>