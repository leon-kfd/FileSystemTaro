<template>
  <view class="header-nav">
    <view class="nav-item active">
      个人网盘
    </view>
    <view class="nav-item">
      回收站
    </view>
    <view class="nav-item"
          @tap="turnToPersonal">
      我
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
export default {
  name: 'HeaderNav',
  data () {
    return {
    }
  },
  methods: {
    turnToPersonal () {
      console.log(1)
      Taro.redirectTo({
        url: '/pages/personal/index'
      })
      // Taro.switchTab({
      //   url: '/page/personal/index'
      // })
    }
  }
}
</script>
<style lang="scss">
$main-color: #520cd4;
.header-nav {
  display: flex;
  .nav-item {
    width: 33.33%;
    text-align: center;
    line-height: 72px;
    position: relative;
    font-weight: bold;
    color: #262626;
    &.active {
      color: $main-color;
      &:after {
        position: absolute;
        content: '';
        bottom: -6px;
        width: 60px;
        left: 50%;
        transform: translateX(-50%);
        height: 8px;
        background: $main-color;
        border-radius: 4px;
      }
    }
  }
}
</style>
