import Taro from '@tarojs/taro'
import Notify from '../components/vant/notify/notify';
const interceptor = function (chain) {
  const requestParams = chain.requestParams
  return chain.proceed(requestParams).then(res => {
    const data = res.data
    if (data.errCode === 200) {
      return Promise.resolve(data.data)
    } else {
      Notify({
        type: 'danger',
        selector: '#van-notify',
        message: data.errMsg,
        duration: 1000,
      })
      return Promise.reject(data.errMsg)
    }
  }, err => {
    Notify({
      type: 'danger',
      selector: '#van-notify',
      message: '服务端异常',
      duration: 1000,
    })
    return err.toString()
  })
}
Taro.addInterceptor(interceptor)
export const baseURL = 'http://localhost:5001/storage'
export const instance = (method, url, data, options) => {
  return Taro.request({
    dataType: 'json',
    header: {
      'content-type': 'application/json'
    },
    method,
    url: baseURL + url,
    data,
    ...options
  })
}
