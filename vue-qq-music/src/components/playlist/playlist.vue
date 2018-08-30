<template>
  <transition name="fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="modeIcon" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content" :data="sequenceList" :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li ref="item" class="item" v-for="(item, index) in sequenceList" :key="item.id" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="showAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="是否清空播放列表" @confirm="clear" confirmBtnText="清空"></confirm>
      <addSong ref="addsong"></addSong>
    </div>
  </transition>
</template>

<script>
  import {mapActions} from 'vuex'
  import scroll from 'base/scroll/scroll'
  import confirm from 'base/confirm/confirm'
  import {playerMixin} from 'common/js/mixin'
  import {playMode} from 'common/js/config'
  import addSong from 'components/addsong/addsong'
  export default {
    mixins: [playerMixin],
    computed: {
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '循环播放' : '随机播放'
      }
    },
    data() {
      return {
        showFlag: false,
        refreshDelay: 100
      }
    },
    methods: {
      showAddSong() {
        this.$refs.addsong.show()
      },
      clear() {
        this.deletSongs()
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      show() {
        this.showFlag = true
        this.scrollToCurrent(this.currentSong)
      },
      hide() {
        this.showFlag = false
      },
      ...mapActions([
        'deleteSong',
        'deletSongs'
      ]),
      deleteOne(item) {
        this.deleteSong(item)
      },
      refresh() {
        this.$refs.listContent.refresh()
      },
      getCurrentIcon(item) {
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        }
        return ''
      },
      scrollToCurrent(current) {
        const index = this.sequenceList.findIndex((song) => {
          return song.id === current.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.item[index], 300)
      },
      selectItem(item, index) {
        this.$emit('select', item, index)
      }
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (newSong.id === oldSong.id || !this.showFlag) {
          return
        }
        this.scrollToCurrent(newSong)
      }
    },
    components: {
      scroll,
      confirm,
      addSong
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .playlist
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.3s
      .list-wrapper
        transition: all 0.3s
    &.fade-enter, &.fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
    .list-content
      max-height: 240px
      overflow: hidden
      padding: 0 30px 0 20px
      .item
        display: flex
        align-items: center
        height: 40px
        overflow: hidden
        &.list-enter-active, &-list-leave-active
          transition: all 0.3s
        &.list-enter, &.list-leave-to
          height: 0
        .current
          flex: 0 0 20px
          width: 20px
          font-size: $font-size-small
          color: $color-theme-d
        .text
          flex: 1
          no-wrap()
          font-size: $font-size-medium
          color: $color-text-d
        .like
          margin-right: 15px
          font-size: $font-size-small
          color: $color-theme
          .icon-favorite
            color: $color-sub-theme
        .delete
          font-size: $font-size-small
          color: $color-theme
    .list-operate
      width: 140px
      margin: 20px auto 30px auto
      .add
        display: flex
        align-items: center
        padding: 8px 16px
        border: 1px solid $color-text-l
        border-radius: 100px
        color: $color-text-l
        .icon-add
          margin-right: 5px
          font-size: $font-size-small-s
        .text
          font-size: $font-size-small
    .list-close
      text-align: center
      line-height: 50px
      background: $color-background
      font-size: $font-size-medium-x
      color: $color-text-l
</style>