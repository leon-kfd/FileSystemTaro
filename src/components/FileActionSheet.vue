<template>
  <view class="file-action-sheet">
    <van-action-sheet :show="actionVisible"
                      :overlay="true"
                      :closeOnClickOverlay="true"
                      @tap="handleActionCancel"
                      @close="handleActionCancel">
      <view class="operation-box"
            style="z-index: 9999"
            @tap.stop="">
        <view v-if="type!=='upload'"
              class="operation-header">
          <cover-image class="icon"
                       :src="actionFileInfo.icon" />
          <view class="file-name">
            {{ actionFileInfo.showFileName || actionFileInfo.fileName }}
          </view>
        </view>
        <view v-if="type==='file'"
              class="operation-list">
          <view v-show="!actionFileInfo.isFolder"
                class="operation-list-item"
                @tap="handleActionDownload">
            <van-icon name="down"
                      size="24px" /> 下载
          </view>
          <view v-show="actionFileInfo.isFolder"
                class="operation-list-item">
            <van-icon name="circle"
                      size="24px" /> 打开
          </view>
          <view class="operation-list-item">
            <van-icon name="records"
                      size="24px" /> 移动
          </view>
          <view class="operation-list-item"
                @tap="handleActionRename">
            <van-icon name="edit"
                      size="24px" /> 重命名
          </view>
          <view class="operation-list-item"
                @tap="handleActionDelete">
            <van-icon name="delete"
                      size="24px" /> 删除
          </view>
        </view>
        <view v-if="type==='trash'"
              class="operation-list">
          <view class="trash-time">
            时间: {{ actionFileInfo.updatedTime|| '未知' }}
          </view>
          <view class="trash-form">
            来源: {{ actionFileInfo.fromPath || '未知' }}
          </view>
          <view class="operation-list-item"
                @tap="handleTrashRestore">
            <van-icon name="replay"
                      size="24px" /> 还原
          </view>
          <view class="operation-list-item"
                style="color: #b22"
                @tap="hanldeShieldDelete">
            <van-icon name="delete"
                      size="24px"
                      color="#b22" /> 永久删除
          </view>
        </view>
        <view v-if="type==='upload'"
              class="upload-box">
          <view class="title">
            上传方式
          </view>
          <view class="operation-list-item"
                @tap="handleUploadFile(1)">
            <van-icon name="photo-o"
                      size="24px" /> 上传本地图片
          </view>
          <view class="operation-list-item"
                @tap="handleUploadFile(2)">
            <van-icon name="video-o"
                      size="24px" /> 上传本地视频
          </view>
          <view class="operation-list-item"
                @tap="handleUploadFile(3)">
            <van-icon name="chat-o"
                      size="24px" /> 从聊天文件中选取
          </view>
        </view>
        <view class="operation-cancel"
              @tap="handleActionCancel">
          取消
        </view>
      </view>
    </van-action-sheet>
    <van-dialog :useSlot="true"
                title="重命名"
                :show="renameVisible"
                :showCancelButton="true"
                @confirm="handleRenameSubmit">
      <view class="rename-input-box">
        <view class="rename-input">
          <van-field v-if="renameVisible"
                     :value="renamingPrefix"
                     :autoFocus="true"
                     :clearable="true"
                     :border="true"
                     required
                     @change="handleRenameInputChange" />
        </view>
        <view class="rename-suffix">
          {{ renamingSuffix }}
        </view>
      </view>
    </van-dialog>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
export default {
  props: {
    currentPathArr: {
      type: Array,
      default: () => []
    },
    actionVisible: {
      type: Boolean,
      default: false
    },
    actionFileInfo: {
      type: Object,
      default: () => { }
    },
    type: {
      type: String,
      default: 'file'
    }
  },
  data () {
    return {
      renameVisible: false,
      renamingPrefix: '',
      renamingSuffix: '',
    }
  },
  methods: {
    handleActionCancel () {
      this.$emit('update:actionVisible', false)
    },
    handleActionDelete () {
      this.$emit('update:actionVisible', false)
      this.delete([this.actionFileInfo])
    },
    handleActionRename () {
      this.$emit('update:actionVisible', false)
      this.renameVisible = false
      this.$nextTick(() => {
        const arr = this.actionFileInfo.fileName.split('.')
        const prefix = arr.length > 1 ? arr.slice(0, arr.length - 1).join('.') : arr[0]
        const suffix = arr.length > 1 ? arr[arr.length - 1] : ''
        this.renamingOldPrefix = prefix
        this.renamingPrefix = prefix
        this.renamingSuffix = !this.actionFileInfo.isFolder ? `.${suffix}` : ''
        this.renameVisible = true
      })
    },
    handleRenameInputChange (e) {
      this.renamingPrefix = e.detail
    },
    handleRenameSubmit () {
      const newName = !this.actionFileInfo.isFolder ? `${this.renamingPrefix}${this.renamingSuffix}` : this.renamingPrefix
      const hasChange = this.actionFileInfo.fileName !== newName
      if (hasChange) {
        const pathPrefix = this.currentPathArr.join('/')
        this.$post('/rename', {
          oldPath: pathPrefix + '/' + this.actionFileInfo.fileName,
          newPath: pathPrefix + '/' + newName
        }).then(data => {
          this.renameVisible = false
          this.$notify({ type: 'success', message: '操作成功', duration: 1000 })
          this.$emit('onNeedRefresh')
        })
      } else {
        this.renameVisible = false
      }
    },
    handleActionDownload () {
      const targetPath = this.currentPathArr.join('/') + '/' + this.actionFileInfo.fileName
      const realPath = targetPath.replace('$Root', this.$baseURL)
      Taro.downloadFile({
        url: realPath
      }).then(data => {
      }, data => {
        this.$notify({ type: 'danger', message: '文件大小超出限制，无法下载，请使用PC端下载', duration: 2500 })
      })
    },
    handleTrashRestore () {
      if (this.actionFileInfo.fromPath) {
        this.$emit('update:actionVisible', false)
        this.restore([this.actionFileInfo])
      } else {
        this.$notify({ type: 'warning', message: '文件来源已丢失，无法还原', duration: 2500 })
      }
    },
    hanldeShieldDelete () {
      this.$emit('update:actionVisible', false)
      this.shieldDelete([this.actionFileInfo])
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
          this.$emit('onNeedRefresh')
        })
      }).catch(() => {
        // on cancel
      });
    },
    restore (rows) {
      this.$dialog.confirm({
        message: '是否将所选的文件还原?',
      }).then(() => {
        this.$post('/restore', {
          restoreList: rows
        }).then(data => {
          this.$notify({ type: 'success', message: '操作成功', duration: 1000 })
          this.$emit('onNeedRefresh')
        })
      }).catch(() => {
        // on cancel
      });
    },
    shieldDelete (rows) {
      this.$dialog.confirm({
        message: '该操作会永久删除所选文件或文件夹，不可恢复，是否继续?',
      }).then(() => {
        this.$post('/permanentlyDelete', {
          deleteList: rows
        }).then(data => {
          this.$notify({ type: 'success', message: '操作成功', duration: 1000 })
          this.$emit('onNeedRefresh')
        })
      }).catch(() => {
        // on cancel
      });
    },
    handleUploadFile (type = 1) {
      const _this = this
      const callback = (res) => {
        _this.$emit('update:actionVisible', false)
        const filePaths = res.tempFilePaths
        filePaths.map(item => {
          Taro.uploadFile({
            url: _this.$baseURL + '/simpleUpload',
            filePath: item,
            name: 'file',
            formData: {
              targetPath: _this.currentPathArr.join('/')
            }
          }).then(data => {
            try {
              const res = JSON.parse(data.data)
              if (res.errCode === 200) {
                const { fileName } = res.data
                _this.$notify({ type: 'success', message: `上传成功，文件保存为${fileName}`, duration: 2000 })
                _this.$emit('onNeedRefresh')
              } else {
                _this.$notify({ type: 'success', message: `上传失败，${res.errMsg}`, duration: 2000 })
              }
            } catch (e) {
              _this.$notify({ type: 'success', message: `上传失败，服务端错误`, duration: 2000 })
            }
          })
        })
      }
      if (type === 1) {
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success (res) {
            callback(res)
          }
        })
      } else if (type === 2) {
        wx.chooseVideo({
          sourceType: ['album', 'camera'],
          maxDuration: 60,
          camera: 'back',
          success (res) {
            callback(res)
          }
        })
      } else if (type === 3) {
        wx.chooseMessageFile({
          count: 1,
          success (res) {
            callback(res)
          }
        })
      }
    }
  }
}
</script>
<style lang='scss'>
$main-color: #520cd4;
.file-action-sheet {
  .rename-input-box {
    display: flex;
    align-items: center;
    margin: 30px 0;
    padding: 0 40px;
    .rename-input {
      width: 100%;
      flex: 1;
      background: #f0f0f3;
    }
    .rename-suffix {
      font-size: 36px;
      font-weight: bold;
    }
  }
  .upload-box {
    .title {
      font-weight: bold;
      font-size: 36px;
      color: #262626;
      padding: 20px 50px 10px;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 28px;
        top: 26px;
        height: 40px;
        border-left: 10px solid $main-color;
      }
    }
  }
  .trash-time,
  .trash-form {
    font-size: 24px;
    margin: 10px 20px;
    color: #999;
    line-height: 1.4;
  }
}
</style>
