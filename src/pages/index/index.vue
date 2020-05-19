<template>
  <view class="home">
    <van-notify id="van-notify" />
    <van-dialog id="van-dialog" />
    <HeaderNav />
    <view class="home-content">
      <view class="folder-path">
        <view v-for="(item,index) in currentPathArr"
              :key="item + index"
              class="path-wrapper">
          <text class="path-link"
                :class="{disabled: index === currentPathArr.length - 1}"
                @tap="handlePathClick(item)">
            {{ item }}
          </text>
          <text class="path-divider">
            /
          </text>
        </view>
      </view>
      <view class="file-list">
        <view v-for="(item,index) in computedFileList"
              :key="`${item.fileName}${index}`"
              class="file-listitem">
          <cover-image class="icon"
                       :src="item.icon" />
          <view class="file-info"
                @tap="handleOpen(item)">
            <view class="file-name">
              {{ item.fileName }}
            </view>
            <view class="file-updated-time">
              {{ item.updatedTime }}
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
    <van-action-sheet :show="actionVisible"
                      :overlay="true"
                      :close-on-click-overlay="true"
                      @tap="handleActionCancel"
                      @close="actionVisible = false">
      <view class="operation-box"
            @tap.stop="">
        <view class="operation-header">
          <cover-image class="icon"
                       :src="actionFileInfo.icon" />
          <view class="file-name">
            {{ actionFileInfo.fileName }}
          </view>
        </view>
        <view class="operation-list">
          <view class="operation-list-item">
            <van-icon name="down"
                      size="24px" /> 下载
          </view>
          <view class="operation-list-item">
            <van-icon name="records"
                      size="24px" /> 移动
          </view>
          <view class="operation-list-item">
            <van-icon name="edit"
                      size="24px" /> 重命名
          </view>
          <view class="operation-list-item"
                @tap="handleActionDelete">
            <van-icon name="delete"
                      size="24px" /> 删除
          </view>
        </view>
        <view class="operation-cancel"
              @tap="handleActionCancel">
          取消
        </view>
      </view>
    </van-action-sheet>
  </view>
</template>

<script>
import HeaderNav from '../../components/HeaderNav.vue'
import Taro from '@tarojs/taro'
import typesMap from '../../utils/file-icon'
const sizeFormatter = (size) => {
  return size < 1024 * 1024
    ? `${parseFloat((size / 1024).toFixed(1))} KB`
    : size < 1024 * 1024 * 1024
      ? `${parseFloat((size / (1024 * 1024)).toFixed(1))} MB`
      : `${parseFloat((size / (1024 * 1024 * 1024)).toFixed(1))} GB`
}
export default {
  name: 'Index',
  components: {
    HeaderNav
  },
  data () {
    return {
      iconFormatter (fileName, isFolder) {
        if (!fileName) return typesMap.folder
        if (isFolder) return typesMap.folder
        const arr = fileName.split('.')
        if (arr.length > 1) {
          const type = arr[arr.length - 1]
          return typesMap[type] || typesMap.unknown
        } else {
          return typesMap.unknown
        }
      },
      currentPathArr: ['$Root'],
      currentPathParams: '$Root',
      forwardArr: [],
      fileList: [],
      actionVisible: false,
      actionFileInfo: {}
    }
  },
  computed: {
    computedFileList () {
      const a = this.fileList.map(item => {
        return {
          icon: this.iconFormatter(item.fileName, item.isFolder),
          ...item
        }
      }).sort((a, b) => {
        return ~~b.isFolder - ~~a.isFolder
      })
      return a
    }
  },
  watch: {
    currentPathArr: {
      handler (val) {
        this.currentPathParams = val.join('/')
      },
      immediate: true
    },
  },
  mounted () {
    this.getData()
  },
  methods: {
    handlePathClick (path) {
      const index = this.currentPathArr.findIndex(item => item === path)
      if (~index) {
        this.currentPathArr = this.currentPathArr.slice(0, index + 1)
        this.getData()
      }
    },
    getData () {
      this.isReady = false
      this.$nextTick(() => {
        this.isReady = true
        this.$get('/getFileList', {
          currentPath: this.currentPathParams
        }).then(data => {
          this.fileList = data
        })
      })
    },
    handleOpen (item) {
      if (item.isFolder) {
        this.forwardArr.length = 0
        this.currentPathArr.push(item.fileName)
        this.getData()
      }
    },
    handleShowAction (item) {
      this.actionVisible = true
      this.actionFileInfo = item
    },
    handleActionCancel () {
      this.actionVisible = false
    },
    handleActionDelete () {
      this.actionVisible = false
      this.delete([this.actionFileInfo])
    },
    delete (rows) {
      const pathPrefix = this.currentPathArr.join('/')
      const deleteList = rows.map(row => {
        return {
          target: pathPrefix + '/' + row.fileName,
          isFolder: row.isFolder
        }
      })
      this.$dialog.confirm({
        message: '此操作会将文件移动到回收站，你可在一个月内进行恢复操作，一个月后将永久删除（空文件夹默认直接删除）',
      }).then(() => {
        this.$post('/delete', {
          deleteList
        }).then(data => {
          this.$notify({ type: 'success', message: '操作成功', duration: 1000 })
          this.getData()
        })
      }).catch(() => {
        // on cancel
      });
    },
    handleTap () {
      console.log(1)
    }
  }
}
</script>

<style lang="scss">
.home-content {
  .folder-path {
    font-size: 36px;
    color: #363636;
    font-weight: bold;
    padding-left: 40px;
    margin-left: 10px;
    width: 100%;
    display: flex;
    margin-bottom: 10px;
    .path-wrapper {
      display: flex;
      align-items: center;
      line-height: 40px;
      .path-link {
        padding: 0 4px;
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
      .file-updated-time {
        width: 100%;
        color: #999;
        font-size: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.operation-box {
  .operation-header {
    display: flex;
    align-items: center;
    padding: 20px 30px;
    .icon {
      width: 72px;
      height: 72px;
      min-width: 72px;
    }
    .file-name {
      color: #262626;
      font-size: 36px;
      font-weight: bold;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 10px 16px;
    }
  }
  .operation-list-item {
    margin: 20px 0;
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #262626;
    font-size: 36px;
    .van-icon {
      margin-right: 20px;
    }
  }
  .operation-cancel {
    text-align: center;
    line-height: 80px;
    margin-top: 20px;
    color: #262626;
    font-size: 36px;
    font-weight: bold;
    border-top: 10px solid #f5f5f6;
  }
}
</style>
