<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide"> 
      <slot></slot>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        showFlag: false
      }
    },
    methods: {
      show() {
        this.showFlag = true
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.hide()
        }, 2000)
      },
      hide() {
        this.showFlag = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/top-tip/top-tip.styl'
</style>