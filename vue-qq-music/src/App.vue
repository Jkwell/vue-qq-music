<template>
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>

import mHeader from 'components/header/header'
import tab from 'components/tab/tab'
import player from 'components/player/player'
export default {
  components: {
    'm-header': mHeader,
    tab,
    player
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
