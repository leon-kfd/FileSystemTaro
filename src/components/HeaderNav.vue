<template>
  <view class="header-nav">
    <view v-for="(item,index) in nav"
          :key="item"
          class="nav-item"
          :class="{active: activeNav===index}"
          @tap="turnTo(index)">
      {{ item }}
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
export default {
  name: 'HeaderNav',
  props: {
    activeNav: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      nav: ['个人网盘', '回收站', '我']
    }
  },
  methods: {
    turnTo (index) {
      this.$emit('onChangeNav', index)
    }
  }
}
</script>
<style lang="scss">
$main-color: #520cd4;
.header-nav {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: #fff;
  z-index: 99;
  .nav-item {
    width: 33.33%;
    text-align: center;
    line-height: 72px;
    position: relative;
    font-weight: bold;
    color: #262626;
    &:after {
      position: absolute;
      content: '';
      bottom: -2px;
      width: 60px;
      left: calc(50% - 30px);
      transform: scale(0);
      height: 8px;
      background: $main-color;
      border-radius: 4px;
      transition: transform 0.4s ease-in-out;
    }
    &.active {
      color: $main-color;
      &:after {
        transform: scale(1);
        transition: transform 0.4s ease-in-out;
      }
    }
  }
}
</style>
