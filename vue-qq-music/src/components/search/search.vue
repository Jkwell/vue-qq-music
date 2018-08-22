<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchbox></searchbox>
    </div>
    <div class="shortcut-wrapper">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item">
              <span></span>
            </li>
          </ul>
        </div>
        <div class="search-history">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <searchlist></searchlist>
        </div>
      </div>
    </div>
    <div class="search-result">
    </div>
  </div>
</template>

<script>
  import searchbox from 'base/search-box/search-box'
  import searchlist from 'base/search-list/search-list'
  export default {
    components: {
      searchbox,
      searchlist
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .search
    .search-box-wrapper
      margin: 20px
</style>