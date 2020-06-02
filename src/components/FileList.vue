<template>
  <view class="file-list">
    <van-checkbox-group v-if="inChoose"
                        :value="selectedList"
                        @change="handleCheckboxGroupChange">
      <van-checkbox v-for="(item,index) in fileList"
                    :key="`${item.fileName}${index}`"
                    :name="item.fileName"
                    checkedColor="#520cd4">
        <view class="file-listitem">
          <image class="icon"
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
            <view v-if="isTrash"
                  class="trash-info">
              <view class="trash-time">
                时间: {{ item.updatedTime }}
              </view>
              <view class="trash-from">
                来源: {{ item.fromPath || '未知' }}
              </view>
            </view>
          </view>
          <view class="opeartion"
                style="visibility: hidden;">
            <van-icon name="ellipsis"
                      size="30px" />
          </view>
        </view>
      </van-checkbox>
    </van-checkbox-group>
    <view v-else>
      <view v-for="(item,index) in fileList"
            :key="`${item.fileName}${index}`">
        <view class="file-listitem">
          <image class="icon"
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
            <view v-if="isTrash"
                  class="trash-info">
              <view class="trash-time">
                时间: {{ item.updatedTime }}
              </view>
              <view class="trash-from">
                来源: {{ item.fromPath || '未知' }}
              </view>
            </view>
          </view>
          <view class="opeartion">
            <van-icon name="ellipsis"
                      size="30px"
                      @tap="handleShowAction(item)" />
          </view>
        </view>
      </view>
    </view>
    <view v-show="inChoose"
          class="batch-select-header">
      <view class="left"
            @tap="handleSelectAll">
        {{ selectedList.length === fileList.length ? '取消全选' : '全选' }}
      </view>
      <view class="center">
        已选中{{ selectedList.length }}个文件
      </view>
      <view class="right"
            @tap="handleBatchCancel">
        取消
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
    },
    inChoose: {
      type: Boolean,
      default: false
    },
    selectedList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleOpen (item) {
      if (!this.inChoose) {
        this.$emit('onOpen', item)
      }
    },
    handleShowAction (item) {
      if (!this.inChoose) {
        this.$emit('onShowAction', item)
      }
    },
    handleCheckboxGroupChange (e) {
      this.$emit('update:selectedList', e.detail)
    },
    handleBatchCancel () {
      this.$emit('update:inChoose', false)
    },
    handleSelectAll () {
      if (this.selectedList.length !== this.fileList.length) {
        this.$emit('update:selectedList', this.fileList.map(item => item.fileName))
      } else {
        this.$emit('update:selectedList', [])
      }
    }
  }
}
</script>
<style lang='scss'>
$main-color: #520cd4;
.file-list {
  padding: 0 0 50px;
  .file-listitem {
    display: flex;
    align-items: center;
    padding: 20px 30px;
    width: 100%;
    box-sizing: border-box;
    width: 100vw;
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
      .trash-info {
        width: 100%;
        color: #999;
        font-size: 24px;
        .trash-from {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
          margin-right: 20px;
        }
      }
      .file-updated-time {
        display: flex;
        align-items: center;
      }
    }
  }
  .batch-select-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 140px;
    background: #fff;
    z-index: 1000;
    display: flex;
    align-items: center;
    .center {
      width: 100%;
      flex: 1;
      text-align: center;
      font-size: 36px;
      color: #262626;
      font-weight: bold;
    }
    .left,
    .right {
      padding: 0 40px;
      font-size: 36px;
      font-weight: bold;
      cursor: pointer;
    }
    .left {
      color: rgb(10, 81, 204);
    }
    .right {
      color: rgb(167, 61, 13);
    }
  }
  .van-checkbox__icon-wrap {
    position: absolute;
    right: 30px;
    .van-checkbox__icon {
      font-size: 48px !important;
    }
  }
  .van-checkbox__label {
    margin-left: 0;
    line-height: normal;
  }
}
</style>
