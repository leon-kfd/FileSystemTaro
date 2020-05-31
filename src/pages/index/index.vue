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
        <FileList :file-list="computedFileList"
                  :in-choose.sync="inChoose"
                  :selected-list.sync="selectedList"
                  @onOpen="handleOpen"
                  @onShowAction="handleShowFileAction" />
        <FileActionSheet :current-path-arr="currentPathArr"
                         :action-visible.sync="actionVisible"
                         :action-file-info="actionFileInfo"
                         type="file"
                         @onOpen="handleOpen"
                         @onNeedRefresh="getData" />
        <FileOperationFooter :in-choose="inChoose"
                             :current-path-arr="currentPathArr"
                             :file-list="computedFileList"
                             :selected-list="selectedList"
                             @onNeedRefresh="getData"
                             @onBatchOperation="handleBatchOperation"
                             @onBatchCancel="inChoose=false" />
      </view>
      <view v-if="activeNav === 1">
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
      inChoose: false
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
          size: sizeFormatter(item.size)
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
  methods: {
    handleError (e) {
      this.$notify({ type: 'danger', message: e || '登录失败', duration: 1000 })
    },
    // auth () {
    //   Taro.checkSession().then(data => {
    //     this.getData()
    //   }, () => {
    //     Taro.login().then(data => {
    //       if (data.code) {
    //         this.$post('/wechatLogin', {
    //           code: data.code
    //         }).then(data => {
    //           const { sessionId } = data
    //           Taro.setStorageSync('sessionId', sessionId)
    //           this.$notify({ type: 'success', message: '自动登录成功', duration: 1000 })
    //           this.getData()
    //         }, () => {
    //           this.handleError(3)
    //         })
    //       } else {
    //         this.handleError(2)
    //       }
    //     }, () => {
    //       this.handleError(1)
    //     })
    //   })
    // },
    handlePathClick (path) {
      const index = this.currentPathArr.findIndex(item => item === path)
      if (~index) {
        this.currentPathArr = this.currentPathArr.slice(0, index + 1)
        this.getData()
      }
    },
    getData () {
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
        })
      })
    },
    getTrashList () {
      this.$nextTick(() => {
        this.$get('/getTrashList').then(data => {
          this.trashList = data
        })
      })
    },
    changeNav (index) {
      this.activeNav = index
      if (index === 1) {
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
    }
  }
}
</script>

<style lang="scss">
.home {
  padding-top: 125px;
  .home-content {
    padding-bottom: 110px;
  }
}
</style>
