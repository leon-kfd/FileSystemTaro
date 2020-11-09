<template>
  <view class="file-operation-footer">
    <view v-if="!inChoose && !inMove"
          class="common-footer">
      <view class="upload-btn-box"
            @tap="handleUpload">
        <view class="upload-icon-box">
          <view class="upload-icon">
            <van-icon name="plus"
                      size="32px"
                      color="#fff" />
          </view>
        </view>
        <view class="upload-text">
          上传
        </view>
      </view>
      <view class="left-btn">
        <view class="new-folder"
              @tap="handleShowNewFolder">
          <image class="icon"
                 :src="folderImg" /> 新建文件夹
        </view>
      </view>
      <view class="right-btn">
        <view class="set-batch"
              @tap.stop="handleBatchOperation">
          <image class="icon"
                 :src="batchImg" /> 批量操作
        </view>
      </view>
    </view>
    <view v-else-if="inChoose"
          class="batch-footer">
      <view class="operation-list-item"
            :class="{disabled: !hasChoose}"
            @tap="handleMove(1)">
        <van-icon name="records"
                  :color="hasChoose?'#fff':'#805D91'"
                  size="24px" />
        <view class="text">
          移动
        </view>
      </view>
      <view class="operation-list-item"
            :class="{disabled: !hasChoose}"
            @tap="handleMove(2)">
        <van-icon name="exchange"
                  :color="hasChoose?'#fff':'#805D91'"
                  size="24px" />
        <view class="text">
          复制
        </view>
      </view>
      <view class="operation-list-item"
            :class="{disabled: !hasChoose}"
            @tap="handleBatchDelete">
        <van-icon name="delete"
                  :color="hasChoose?'#fff':'#805D91'"
                  size="24px" />
        <view class="text">
          删除
        </view>
      </view>
      <!-- <view class="operation-list-item"
            :class="{disabled: !hasChoose}">
        <van-icon name="exchange"
                  :color="hasChoose?'#fff':'#805D91'"
                  size="24px" />
        <view class="text">
          分享
        </view>
      </view> -->
      <view class="cancel-batch"
            @tap="handleBatchCancel">
        <view class="text">
          取消批量
        </view>
      </view>
    </view>
    <view v-else
          class="move-footer">
      <view class="btn-paste"
            @tap="handlePaste">
        <van-icon name="completed"
                  size="24px" />
        <view class="text">
          粘贴到此目录
        </view>
      </view>
      <view class="btn-cancel-move"
            @tap="handleMoveCancel">
        取消移动
      </view>
    </view>
    <van-dialog :useSlot="true"
                title="新建文件夹"
                :show="newFolderVisible"
                :showCancelButton="true"
                @confirm="handleNewFolderSubmit">
      <view class="folder-input-box">
        <view class="folder-input">
          <van-field v-if="newFolderVisible"
                     :value="newFolderName"
                     :autoFocus="true"
                     :clearable="true"
                     :border="true"
                     required
                     @change="handleNewFolderInputChange" />
        </view>
      </view>
    </van-dialog>
    <FileActionSheet ref="fileAction"
                     :action-visible.sync="uploadActionVisible"
                     :current-path-arr="currentPathArr"
                     type="upload"
                     @onNeedRefresh="onNeedRefresh" />
  </view>
</template>

<script>
import FileActionSheet from './FileActionSheet.vue'
export default {
  components: {
    FileActionSheet
  },
  props: {
    fileList: {
      type: Array,
      default: () => []
    },
    currentPathArr: {
      type: Array,
      default: () => []
    },
    inChoose: {
      type: Boolean,
      default: false
    },
    inMove: {
      type: Boolean,
      default: false
    },
    selectedList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      folderImg: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg5OTgyNjY5NTU5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIwOTUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTI0LjkgMjA5LjZINDc3Ljd2LTMzYzAtNTMuNC00MC43LTk2LjYtOTQtOTYuNkg5Ni42QzQzLjIgODAgMCAxMjMuMiAwIDE3Ni42djY3MC44QzAgOTAwLjggNDMuMiA5NDQgOTYuNiA5NDRoODMwLjljNTMuNCAwIDk2LjYtNDMuMiA5Ni42LTk2LjZWMzAzLjZjLTIuNi01My4zLTQ1LjgtOTQtOTkuMi05NHogbTMzIDYzNy44YzAgMTcuOC0xNS4yIDMzLTMzIDMzSDk2LjZjLTE3LjggMC0zMy0xNS4yLTMzLTMzVjQ2My43SDk1OHYzODMuN3ogbTAtNDQ3LjJINjMuNVYxNzYuNmMwLTE3LjggMTUuMi0zMyAzMy0zM2gyODcuMWMxNy44IDAgMzMgMTUuMiAzMyAzM3Y2Ni4xYzAgMTcuOCAxNS4yIDMzIDMzIDMzSDkzMGMxNy44IDAgMzMgMTUuMiAzMyAzM3Y5MS41aC01LjF6IiBwLWlkPSIyMDk2Ij48L3BhdGg+PC9zdmc+`,
      batchImg: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg5OTgzMTUxMDM2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI4NTkiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODcwLjQgNjRoLTU3NmE5NiA5NiAwIDAgMC05NiA5NlYxOTJoLTM5LjY4QTk2IDk2IDAgMCAwIDY0IDI4NC44djU3NkE5NiA5NiAwIDAgMCAxNTguNzIgOTYwaDU3NmE5NiA5NiAwIDAgMCA5Ni05NlY4MzJoMzkuNjhhOTYgOTYgMCAwIDAgOTYtOTZ2LTU3NkE5NiA5NiAwIDAgMCA4NzAuNCA2NHpNNzY4IDg2MC44YTMyIDMyIDAgMCAxLTMyIDMyaC01NzZhMzIgMzIgMCAwIDEtMzItMzJ2LTU3NmEzMiAzMiAwIDAgMSAzMi0zMmg1NzZhMzIgMzIgMCAwIDEgMzIgMzJ6IG0xMzUuNjgtMTI4YTMyIDMyIDAgMCAxLTMyIDMySDgzMnYtNDgwQTk2IDk2IDAgMCAwIDczNC43MiAxOTJIMjYyLjR2LTMzLjI4QTMyIDMyIDAgMCAxIDI5NC40IDEyOGg1NzZhMzIgMzIgMCAwIDEgMzIgMzJ6IiBwLWlkPSIyODYwIj48L3BhdGg+PHBhdGggZD0iTTYyNCA2MTAuNTZMNDc5LjM2IDc2OGwtNTcuNi01NC40YTMyIDMyIDAgMSAwLTQ0LjE2IDQ2LjcyTDQ1OC44OCA4MzJhMzAuNzIgMzAuNzIgMCAwIDAgMjEuNzYgOC4zMiAzMi42NCAzMi42NCAwIDAgMCAyMy4wNC04LjMybDE2Ny4wNC0xNzcuMjhhMzIuNjQgMzIuNjQgMCAwIDAgMC00NS40NCAzMS4zNiAzMS4zNiAwIDAgMC00Ni43MiAxLjI4ek0yNTYgNDQzLjUyaDM4NGEzMiAzMiAwIDAgMCAzMi0zMiAzMi42NCAzMi42NCAwIDAgMC0zMi0zMkgyNTZhMzIgMzIgMCAwIDAtMzIgMzIgMzIgMzIgMCAwIDAgMzIgMzJ6TTUxMiA1NDRhMzIgMzIgMCAwIDAtMzItMzJIMjU2YTMyIDMyIDAgMCAwLTMyIDMyIDMyIDMyIDAgMCAwIDMyIDMyaDIyMi4wOEEzMiAzMiAwIDAgMCA1MTIgNTQ0eiIgcC1pZD0iMjg2MSI+PC9wYXRoPjwvc3ZnPg==`,
      newFolderVisible: false,
      newFolderName: '',
      uploadActionVisible: false
    }
  },
  computed: {
    hasChoose () {
      return this.selectedList.length > 0
    }
  },
  methods: {
    onNeedRefresh () {
      this.$emit('onNeedRefresh')
    },
    handleShowNewFolder () {
      this.newFolderVisible = false
      this.$nextTick(() => {
        const newName = '新建文件夹'
        const count = this.fileList.filter(item => item.fileName.includes(newName))
        this.newFolderName = `${newName}${count.length > 0 ? count.length : ''}`
        this.newFolderVisible = true
      })
    },
    handleNewFolderInputChange (e) {
      this.newFolderName = e.detail
    },
    handleNewFolderSubmit () {
      const pathPrefix = this.currentPathArr.join('/')
      this.$post('/createFolder', {
        folderName: pathPrefix + '/' + this.newFolderName
      }).then(data => {
        this.newFolderVisible = false
        this.$notify({ type: 'success', message: '操作成功', duration: 1000 })
        this.$emit('onNeedRefresh')
      })
    },
    handleUpload () {
      this.uploadActionVisible = true
    },
    handleBatchOperation () {
      this.$emit('onBatchOperation')
    },
    handleBatchCancel () {
      this.$emit('onBatchCancel')
    },
    handleMoveCancel () {
      this.$emit('onMoveCancel')
    },
    handlePaste () {
      this.$emit('onPaste')
    },
    handleBatchDelete () {
      if (this.hasChoose) {
        const selectedList = this.fileList.filter(item => this.selectedList.includes(item.fileName))
        this.$refs.fileAction.delete(selectedList)
      }
    },
    handleMove (type = 1) {
      if (this.hasChoose) {
        const pathPrefix = this.currentPathArr.join('/')
        const rows = this.selectedList.map(item => `${pathPrefix}/${item}`)
        this.$emit('onMove', rows, type)
      }
    }
  }
}
</script>
<style lang='scss'>
$main-color: #520cd4;
.file-operation-footer {
  .common-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: #fff;
    z-index: 99;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    &:after {
      content: '';
      position: absolute;
      bottom: 94px;
      bottom: calc(constant(safe-area-inset-bottom) + 94px);
      bottom: calc(env(safe-area-inset-bottom) + 94px);
      left: 0;
      width: 100%;
      border-top: 4px solid #262626;
    }
    .upload-btn-box {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      width: 30%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      z-index: 100;
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
      &::before {
        z-index: -1;
        content: '';
        top: -18px;
        position: absolute;
        width: 102px;
        height: 102px;
        border-radius: 50%;
        background: #fff;
        border: 4px solid #262626;
        border-left: 4px solid transparent;
        border-bottom: 4px solid transparent;
        transform: rotate(-45deg);
      }
      .upload-icon-box {
        width: 100%;
        .upload-icon {
          width: 84px;
          height: 84px;
          margin: 0 auto;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: $main-color;
          box-shadow: 0 0 4px $main-color;
          transform: translateY(-4px);
        }
      }
      .upload-text {
        padding: 8px 0;
        color: #262626;
        font-size: 24px;
      }
    }
    .left-btn,
    .right-btn {
      position: absolute;
      top: 4rpx;
      width: 35%;
      height: 92px;
      padding: 0 3%;
      display: flex;
      align-items: center;
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
      .new-folder,
      .set-batch {
        width: 100%;
        height: 72px;
        border-radius: 36px;
        background: rgb(255, 249, 240);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #262626;
        font-size: 28px;
        .icon {
          width: 36px;
          height: 36px;
          margin-right: 10px;
        }
      }
    }
    .left-btn {
      left: 0;
    }
    .right-btn {
      right: 0;
    }
  }
  .batch-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    height: 120px;
    align-items: center;
    background: rgb(51, 7, 92);
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .operation-list-item {
      width: 22%;
      text-align: center;
      &.disabled {
        .text {
          color: #805d91;
        }
      }
      .text {
        font-size: 24px;
        color: #fff;
      }
    }
    .cancel-batch {
      width: 34%;
      .text {
        margin: 0 auto;
        height: 72px;
        border-radius: 36px;
        width: 80%;
        background: rgb(228, 218, 238);
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(167, 61, 13);
      }
    }
  }
  .move-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    height: 120px;
    align-items: center;
    justify-content: space-around;
    background: rgb(235, 237, 248);
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    border-top: 4px solid #262626;
    .btn-paste {
      height: 92px;
      padding: 0 3%;
      border-radius: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;
      font-size: 36px;
      font-weight: bold;
      background: rgb(18, 59, 180);
      color: #fff;
      .text {
        margin-left: 10px;
      }
    }
    .btn-cancel-move {
      font-size: 36px;
      font-weight: bold;
      color: rgb(167, 61, 13);
      width: 30%;
    }
  }
}

.folder-input-box {
  display: flex;
  align-items: center;
  margin: 30px 0;
  padding: 0 40px;
  .folder-input {
    width: 100%;
    flex: 1;
    background: #f0f0f3;
  }
}
</style>
