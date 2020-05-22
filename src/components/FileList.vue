<template>
  <view class="file-list">
    <view v-for="(item,index) in fileList"
          :key="`${item.fileName}${index}`"
          class="file-listitem">
      <cover-image class="icon"
                   :src="item.icon" />
      <view class="file-info"
            @tap="handleOpen(item)">
        <view class="file-name">
          {{ item.showFileName || item.fileName }}
        </view>
        <view v-if="!isTrash"
              class="file-updated-time">
          <view>{{ item.updatedTime }}</view>
          <view v-if="!item.isFolder"
                style="margin-left: 10px">
            {{ item.size }}
          </view>
        </view>
        <view v-else
              class="trash-from">
          来源: {{ item.fromPath }}
        </view>
      </view>
      <view class="opeartion">
        <van-icon name="ellipsis"
                  size="30px"
                  @tap="handleShowAction(item)" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    fileList: {
      type: Array,
      default: () => []
    },
    isTrash: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleOpen (item) {
      this.$emit('onOpen', item)
    },
    handleShowAction (item) {
      this.$emit('onShowAction', item)
    }
  }
}
</script>
<style lang='scss'>
.file-list {
  padding: 20px 0;
  .file-listitem {
    display: flex;
    align-items: center;
    padding: 20px 30px;
    .icon {
      width: 72px;
      height: 72px;
      min-width: 72px;
    }
    .file-info {
      margin-left: 16px;
      flex: 1;
      width: 100%;
      overflow: hidden;
      padding: 0 16px;
      .file-name {
        color: #262626;
        font-size: 36px;
        font-weight: bold;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 10px;
      }
      .file-updated-time,
      .trash-from {
        width: 100%;
        color: #999;
        font-size: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
