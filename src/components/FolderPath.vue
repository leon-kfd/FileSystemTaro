<template>
  <view class="folder-path">
    <view v-for="(item,index) in currentPathArr"
          :key="item + index"
          class="path-wrapper">
      <view class="path-link"
            :class="{disabled: index === currentPathArr.length - 1}"
            @tap="handlePathClick(item)">
        {{ item }}
      </view>
      <view class="path-divider">
        /
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    currentPathArr: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handlePathClick (item) {
      this.$emit('onPathClick', item)
    }
  }
}
</script>
<style lang='scss'>
.folder-path {
  font-size: 32px;
  color: #363636;
  font-weight: bold;
  width: 100%;
  display: flex;
  padding: 20px;
  position: fixed;
  top: 80px;
  left: 0;
  background: #fff;
  z-index: 99;
  overflow-x: auto;
  .path-wrapper {
    display: flex;
    align-items: center;
    height: 40px;
    flex-wrap: nowrap;
    font-size: 32px;
    .path-link {
      padding: 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &.disabled {
        color: #99a;
      }
    }
    .path-divider {
      color: #99a;
      margin: 0 6px;
    }
  }
}
</style>
