<template>
  <view class="file-list">
    <van-checkbox-group :value="list"
                        @change="handleCheckboxGroupChange">
      <component :is="inChoose?'van-checkbox':'view'"
                 v-for="(item,index) in fileList"
                 :key="`${item.fileName}${index}`"
                 :name="item.fileName"
                 checkedColor="#520cd4">
        <view class="file-listitem">
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
                :style="inChoose?'opacity:0':'opacity:1'">
            <van-icon name="ellipsis"
                      size="30px"
                      @tap="handleShowAction(item)" />
          </view>
        </view>
      </component>
    </van-checkbox-group>
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
    }
  },
  data () {
    return {
      list: []
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
    handleSelect (fileName) {
      if (this.inChoose) {
        const index = this.list.indexOf(fileName)
        console.log(index)
        if (~index) {
          this.list.splice(index, 1)
        } else {
          this.list.push(fileName)
        }
        console.log(this.list)
      }
    },
    handleCheckboxGroupChange (e) {
      this.list = e.detail
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
