<template>
  <view class="home">
    <view>
      <van-notify id="van-notify" />
      <van-dialog id="van-dialog" />
      <van-toast id="van-toast" />
      <HeaderNav :active-nav="activeNav"
                 @onChangeNav="changeNav" />
      <view v-if="activeNav === 0"
            class="home-content">
        <FolderPath :current-path-arr="currentPathArr"
                    @onPathClick="handlePathClick" />
        <view class="control-height-40" />
        <view class="loading-box">
          <van-loading color="#1989fa" />
        </view>
        <FileList :file-list="computedFileList"
                  :in-choose.sync="inChoose"
                  :selected-list.sync="selectedList"
                  @onOpen="handleOpen"
                  @onShowAction="handleShowFileAction" />
        <FileActionSheet ref="fileActionSheet"
                         :current-path-arr="currentPathArr"
                         :action-visible.sync="actionVisible"
                         :action-file-info="actionFileInfo"
                         type="file"
                         @onOpen="handleOpen"
                         @onMove="handleMoveSelect"
                         @onNeedRefresh="getData" />
        <FileOperationFooter :in-choose="inChoose"
                             :in-move="clipboardList.length > 0"
                             :current-path-arr="currentPathArr"
                             :file-list="computedFileList"
                             :selected-list="selectedList"
                             @onNeedRefresh="getData"
                             @onBatchOperation="handleBatchOperation"
                             @onBatchCancel="handleBatchCancel"
                             @onMoveCancel="handleMoveCancel"
                             @onPaste="handlePaste"
                             @onMove="handleMoveSelect" />
      </view>
      <view v-if="activeNav === 1">
        <view class="loading-box">
          <van-loading color="#1989fa" />
        </view>
        <FileList :file-list="computedTrashList"
                  :is-trash="true"
                  @onShowAction="handleShowTrashAction" />
        <FileActionSheet :action-visible.sync="trashActionVisible"
                         :action-file-info="actionTrashInfo"
                         type="trash"
                         @onNeedRefresh="getTrashList" />
      </view>
    </view>
  </view>
</template>

<script>
import HeaderNav from '../../components/HeaderNav.vue'
import FolderPath from '../../components/FolderPath.vue'
import FileList from '../../components/FileList.vue'
import FileActionSheet from '../../components/FileActionSheet.vue'
import FileOperationFooter from '../../components/FileOperationFooter.vue'
import { iconFormatter, sizeFormatter } from '../../utils/file-utils'
import Taro from '@tarojs/taro'
const imgSuffixArr = ['jpg', 'png', 'svg', 'gif']
const videoSuffixArr = ['mp4', 'mov', 'm4v', '3gp', 'avi', 'm3u8']
const documentSuffixArr = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']
export default {
  name: 'Index',
  components: {
    HeaderNav,
    FolderPath,
    FileList,
    FileActionSheet,
    FileOperationFooter,
  },
  data () {
    return {
      activeNav: 0,
      currentPathArr: ['$Root'],
      currentPathParams: '$Root',
      forwardArr: [],
      fileList: [],
      trashList: [],
      actionVisible: false,
      actionFileInfo: {},
      trashActionVisible: false,
      actionTrashInfo: {},
      selectedList: [],
      inChoose: false,
      firstLoadFlag: true,
      clipboardList: [],
      moveType: 1
    }
  },
  computed: {
    computedFileList () {
      return this.fileList.map(item => {
        const arr = item.fileName.split('.')
        const suffix = arr[arr.length - 1]
        return {
          icon: iconFormatter(item.fileName, item.isFolder),
          suffix,
          ...item,
          size: sizeFormatter(item.size),
          realSize: item.size
        }
      }).sort((a, b) => {
        return ~~b.isFolder - ~~a.isFolder
      })
    },
    computedTrashList () {
      return this.trashList.map(item => {
        const arr = item.fileName.split('.')
        const suffix = arr[arr.length - 1]
        return {
          icon: iconFormatter(item.fileName, item.isFolder),
          suffix,
          ...item
        }
      }).sort((a, b) => {
        return new Date(b.updatedTime) - new Date(a.updatedTime)
      })
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
  created () {
    this.auth()
  },
  methods: {
    handleError (e) {
      this.$notify({ type: 'danger', message: e || '登录失败', duration: 1000 })
    },
    auth () {
      Taro.login().then(data => {
        if (data.code) {
          this.$post('/wechatLogin', {
            code: data.code
          }).then(data => {
            const { sessionId } = data
            Taro.setStorageSync('sessionId', sessionId)
            this.$notify({ type: 'success', message: '自动登录成功', duration: 1000 })
            this.getData()
          }, () => {
            this.handleError()
          })
        } else {
          this.handleError()
        }
      }, () => {
        this.handleError()
      })
    },
    handlePathClick (path) {
      const index = this.currentPathArr.findIndex(item => item === path)
      if (~index) {
        this.currentPathArr = this.currentPathArr.slice(0, index + 1)
        this.getData()
      }
    },
    getData (pull) {
      // !pull && Taro.startPullDownRefresh()
      this.inChoose = false
      this.selectedList = []
      this.$nextTick(() => {
        this.$get('/getFileList', {
          currentPath: this.currentPathParams
        }).then(data => {
          this.fileList = data
        }, data => {
          if (data.errCode === 300) {
            Taro.login().then(data => {
              if (data.code) {
                this.$post('/wechatLogin', {
                  code: data.code
                }).then(data => {
                  const { sessionId } = data
                  Taro.setStorageSync('sessionId', sessionId)
                  this.$notify({ type: 'success', message: '自动登录成功', duration: 1000 })
                  this.getData()
                }, () => {
                  handleError(3)
                })
              } else {
                handleError(2)
              }
            }, () => {
              handleError(1)
            })
          }
        }).finally(() => {
          setTimeout(() => Taro.stopPullDownRefresh(), 500)
        })
      })
    },
    getTrashList (pull) {
      // !pull && Taro.startPullDownRefresh()
      this.$nextTick(() => {
        this.$get('/getTrashList').then(data => {
          this.trashList = data
          this.firstLoadFlag = false
        }).finally(() => {
          setTimeout(() => Taro.stopPullDownRefresh(), 500)
        })
      })
    },
    changeNav (index) {
      this.activeNav = index
      if (index === 1 && this.firstLoadFlag) {
        this.$nextTick(() => {
          this.getTrashList()
        })
      }
    },
    handleOpen (item) {
      if (item.isFolder) {
        this.forwardArr.length = 0
        this.currentPathArr.push(item.fileName)
        this.getData()
      } else if ([...imgSuffixArr, ...documentSuffixArr, ...videoSuffixArr].includes(item.suffix)) {
        this.handleShowFileAction(item)
        this.$nextTick(() => {
          this.$refs.fileActionSheet.handleActionPreview()
        })
      } else {
        this.$notify({ type: 'warning', message: '暂不支持打开或预览该类型文件', duration: 1000 })
      }
    },
    handleShowFileAction (item) {
      this.actionVisible = true
      this.actionFileInfo = item
    },
    handleShowTrashAction (item) {
      this.trashActionVisible = true
      this.actionTrashInfo = item
    },
    handleBatchOperation () {
      this.inChoose = true
    },
    handleBatchCancel () {
      this.inChoose = false
      this.selectedList = []
    },
    handleMoveSelect (rows, moveType = 1) {
      this.handleBatchCancel()
      this.clipboardList = rows
      this.moveType = moveType
      this.$notify({ type: 'success', message: '已添加到剪贴板，请进入相应目录进行粘贴', duration: 2000 })
    },
    handleMoveCancel () {
      this.clipboardList = []
    },
    handlePaste () {
      this.$dialog.confirm({
        message: `是否确认将所需文件 ${this.moveType === 1 ? '移动' : '复制'} 到当前目录?`,
      }).then(() => {
        this.$post('/move', {
          moveFrom: this.clipboardList,
          moveTo: this.currentPathArr.join('/'),
          moveType: this.moveType - 1
        }).then(data => {
          this.$notify({ type: 'success', message: '操作成功', duration: 1000 })
          this.getData()
          this.clipboardList = []
        }).finally(() => {
        })
      }).catch(() => {
        // on cancel
      });
    }
  },
  onPullDownRefresh () {
    if (this.activeNav === 0) {
      this.getData(true)
    } else if (this.activeNav === 1) {
      this.getTrashList(true)
    }
  }
}
</script>

<style lang="scss">
.home {
  padding-top: 80px;
  .home-content {
    padding-bottom: 110px;
  }
}
.control-height-40 {
  height: 80px;
}
.loading-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -60px;
}
</style>
