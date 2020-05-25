<template>
  <view class="home">
    <view v-if="!isLogin">
      正在登录...
    </view>
    <view v-else>
      <van-notify id="van-notify" />
      <van-dialog id="van-dialog" />
      <HeaderNav :active-nav="activeNav"
                 @onChangeNav="changeNav" />
      <view v-if="activeNav === 0"
            class="home-content">
        <FolderPath :current-path-arr="currentPathArr"
                    @onPathClick="handlePathClick" />
        <FileList :file-list="computedFileList"
                  :in-choose="inChoose"
                  :selected-list.sync="selectedList"
                  @onOpen="handleOpen"
                  @onShowAction="handleShowFileAction" />
        <FileActionSheet :current-path-arr="currentPathArr"
                         :action-visible.sync="actionVisible"
                         :action-file-info="actionFileInfo"
                         type="file"
                         @onNeedRefresh="getData" />
        <FileOperationFooter :current-path-arr="currentPathArr"
                             :file-list="computedFileList"
                             @onNeedRefresh="getData"
                             @onBatchOperation="handleBatchOperation" />
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
    FileOperationFooter
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
      isLogin: true,
      inChoose: false
    }
  },
  computed: {
    computedFileList () {
      return this.fileList.map(item => {
        return {
          icon: iconFormatter(item.fileName, item.isFolder),
          ...item,
          size: sizeFormatter(item.size)
        }
      }).sort((a, b) => {
        return ~~b.isFolder - ~~a.isFolder
      })
    },
    computedTrashList () {
      return this.trashList.map(item => {
        return {
          icon: iconFormatter(item.fileName, item.isFolder),
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
    // this.autoLogin()
    this.getData()
  },
  methods: {
    // autoLogin () {
    //   const _this = this
    //   wx.login({
    //     success (res) {
    //       if (res.code) {
    //         _this.isLogin = true
    //         _this.$get('/wechatLogin', {
    //           code: res.code
    //         }).then(data => {
    //           console.log(data)
    //         })
    //       } else {
    //         console.log('登录失败！' + res.errMsg)
    //       }
    //     }
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
      this.$nextTick(() => {
        this.$get('/getFileList', {
          currentPath: this.currentPathParams
        }).then(data => {
          this.fileList = data
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
