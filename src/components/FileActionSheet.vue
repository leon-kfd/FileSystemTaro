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
          <image class="icon"
                 :src="actionFileInfo.icon" />
          <view class="file-name">
            {{ actionFileInfo.showFileName || actionFileInfo.fileName }}
          </view>
        </view>
        <view v-if="type==='file'">
          <view v-if="isDownloading"
                class="downloading-box">
            <view class="text">
              <view class="percent">
                {{ downloadingInfo.progress }}%
              </view>
              <view class="load">
                {{ downloadingInfo.totalBytesWritten }} / {{ downloadingInfo.totalBytesExpectedToWrite }}
              </view>
            </view>
            <van-progress :percentage="downloadingInfo.progress"
                          :show-pivot="false"
                          color="linear-gradient(to right, #be99ff, #7232dd)" />
          </view>
          <view v-else
                class="operation-list">
            <!-- <view v-show="!actionFileInfo.isFolder"
                class="operation-list-item"
                @tap="handleActionDownload">
            <van-icon name="down"
                      size="24px" /> 下载
          </view> -->
            <view v-show="!actionFileInfo.isFolder && previewArr.includes(actionFileInfo.suffix)"
                  class="operation-list-item"
                  @tap="handleActionPreview">
              <van-icon name="eye-o"
                        size="24px" /> 预览
            </view>
            <view v-show="actionFileInfo.isFolder"
                  class="operation-list-item"
                  @tap="handleActionOpen">
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
    <view v-if="mediaPreviewVisible > 0"
          class="media-preview">
      <view class="close"
            @tap="handlePreviewClose">
        <van-icon name="cross"
                  size="36px"
                  color="#f5f5f7" />
      </view>
      <image v-if="mediaPreviewVisible===1"
             :src="imgPreviewURL"
             mode="widthFix"
             class="image" />
      <video v-if="mediaPreviewVisible===2"
             id="video"
             :autoplay="true"
             class="video"
             :src="videoPreviewURL" />
    </view>
  </view>
</template>

<script>
const imgSuffixArr = ['jpg', 'png', 'svg', 'gif']
const videoSuffixArr = ['mp4', 'mov', 'm4v', '3gp', 'avi', 'm3u8']
const documentSuffixArr = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']
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
      isDownloading: false,
      downloadingTask: null,
      downloadingInfo: {
        progress: 0,
        totalBytesWritten: 0,
        totalBytesExpectedToWrite: 0
      },
      previewArr: [...imgSuffixArr, ...documentSuffixArr, ...videoSuffixArr],
      mediaPreviewVisible: 0,
      imgPreviewURL: '',
      videoPreviewURL: ''
    }
  },
  methods: {
    nothing () { },
    handleActionCancel () {
      if (this.downloadTask) {
        this.downloadTask.abort()
        this.isDownloading = false
        this.downloadingInfo = {
          progress: 0,
          totalBytesWritten: 0,
          totalBytesExpectedToWrite: 0
        }
        this.downloadTask = null
      }
      this.$emit('update:actionVisible', false)
    },
    handleActionDelete () {
      this.$emit('update:actionVisible', false)
      this.delete([this.actionFileInfo])
    },
    handleActionOpen () {
      this.$emit('update:actionVisible', false)
      this.$emit('onOpen', this.actionFileInfo)
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
      this.$notify({ type: 'danger', message: '抱歉,由于小程序限制,该功能暂不能提供,请使用PC端进行下载', duration: 3000 })
      this.$emit('update:actionVisible', false)
    },
    handleActionPreview (el) {
      const target = this.actionFileInfo
      const targetPath = this.currentPathArr.join('/') + '/' + target.fileName
      const realPath = targetPath.replace('$Root', this.$baseURL)
      const sessionId = Taro.getStorageSync('sessionId')
      if (videoSuffixArr.includes(target.suffix)) {
        this.handleActionCancel()
        this.mediaPreviewVisible = 2
        this.videoPreviewURL = realPath + '?sessionid=' + Taro.getStorageSync('sessionId')
      } else if (this.previewArr.includes(target.suffix)) {
        this.downloadTask = wx.downloadFile({
          url: realPath,
          header: {
            'sessionid': sessionId
          },
          success: (data) => {
            const { tempFilePath } = data
            if (imgSuffixArr.includes(target.suffix)) {
              this.mediaPreviewVisible = 1
              this.imgPreviewURL = tempFilePath
            } else if (documentSuffixArr.includes(target.suffix)) {
              Taro.openDocument({
                filePath: tempFilePath
              })
            }
            this.handleActionCancel()
          },
          fail: () => {
            this.$notify({ type: 'danger', message: `下载失败`, duration: 2000 })
          }
        })
        this.downloadTask.onProgressUpdate((res) => {
          this.isDownloading = true
          const { progress, totalBytesWritten, totalBytesExpectedToWrite } = res
          this.downloadingInfo = { progress, totalBytesWritten, totalBytesExpectedToWrite }
        })
      }
    },
    handlePreviewClose () {
      this.videoPreviewURL = ''
      const video = Taro.createVideoContext('video')
      video.stop()
      this.mediaPreviewVisible = 0
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
      const callback = (res) => {
        this.$emit('update:actionVisible', false)
        this.$toast.loading({
          mask: true,
          message: '上传中...'
        })
        const filePaths = type === 3 ? res.tempFiles.map(item => item.path) : res.tempFilePaths
        Promise.all(
          filePaths.map(item => {
            return Taro.uploadFile({
              url: this.$baseURL + '/simpleUpload',
              filePath: item,
              name: 'file',
              formData: {
                targetPath: this.currentPathArr.join('/')
              },
              header: {
                sessionid: Taro.getStorageSync('sessionId')
              }
            }).then(data => {
              try {
                const res = JSON.parse(data.data)
                if (res.errCode === 200) {
                  const { fileName } = res.data
                  this.$notify({ type: 'success', message: `上传成功，文件保存为${fileName}`, duration: 2000 })
                  this.$emit('onNeedRefresh')
                } else {
                  this.$notify({ type: 'success', message: `上传失败，${res.errMsg}`, duration: 2000 })
                }
              } catch (e) {
                this.$notify({ type: 'success', message: `上传失败，服务端错误`, duration: 2000 })
              }
            })
          })
        ).then(() => {
          this.$toast.clear()
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
  .downloading-box {
    padding: 20px 40px;
    .text {
      display: flex;
      margin-bottom: 20px;
      align-items: center;
      justify-content: space-between;
      .percent {
        font-size: 36px;
        font-weight: bold;
        color: #262626;
      }
      .load {
        font-size: 28px;
        color: rgb(77, 77, 184);
      }
    }
  }
}
.media-preview {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 99999;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 100000;
  }
  .image {
    width: 95vw;
  }
  .video {
    width: 100vw;
    height: 85vh;
  }
}
</style>
