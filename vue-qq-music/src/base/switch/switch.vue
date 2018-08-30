<template>
  <ul class="switches">
    <li class="switch-item" @click="switchItem(index)" v-for="(item, index) in switches" :key="index" :class="{'active': index=== currentIndex}">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      switches: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItem(index) {
        this.$emit('switch', index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/switch/switch.styl'
</style>