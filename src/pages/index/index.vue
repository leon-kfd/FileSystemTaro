<template>
  <view class="home">
    <HeaderNav />
    <view class="home-content">
      <view class="folder-path">
        <view v-for="(item,index) in currentPathArr"
              :key="item + index"
              class="path-wrapper">
          <text class="path-link"
                :class="{disabled: index === currentPathArr.length - 1}"
                @click="handlePathClick(item)">
            {{ item }}
          </text>
          <text class="path-divider">
            /
          </text>
        </view>
      </view>
      <view class="file-list">
        <view v-for="item in computedFileList"
              :key="item.fileName"
              class="file-listitem">
          <cover-image class="icon"
                       :src="item.icon" />
          <view class="file-name">
            {{ item.fileName }}
          </view>
        </view>
      </view>
    </view>
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
      fileList: []
    }
  },
  computed: {
    computedFileList () {
      return this.fileList.map(item => {
        return {
          icon: this.iconFormatter(item.fileName, item.isFolder),
          ...item
        }
      }).sort((a, b) => {
        return ~~b.isFolder - ~~a.isFolder
      })
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    handlePathClick (item) {

    },
    async getData () {
      let { data } = await Taro.request({
        url: 'http://localhost:5001/storage/getFileList'
      })
      this.fileList = data.data
      console.log(this.fileList)
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
      .path-link {
        padding: 0 4px;
        &.disabled {
          color: #99a;
        }
      }
      .path-divider {
        color: #99a;
        font-weight: normal;
        margin: 0 6px;
      }
    }
  }
  .file-listitem {
    display: flex;
    align-items: center;
    padding: 10px 30px;
    .icon {
      width: 60px;
      height: 60px;
    }
    .file-name {
      color: #667;
      font-size: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 16px;
    }
  }
}
</style>
