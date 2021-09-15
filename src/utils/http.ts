import axios from 'axios'
import { removeToken } from './cookies'
// import { Message, MessageBox } from 'element-ui'
import url from './url'
import router from '../router'
const CancelToken = axios.CancelToken
let source = CancelToken.source()

const ajax = axios.create({
    // baseURL: '/api', // 允许proxy跨域
    baseURL: url, // 请求地址
    timeout: 30000, // 请求超时
    withCredentials: true // 设置携带cooki
})
let requestNum:number = 0 // 请求的数量
ajax.defaults.headers.post['Content-Type'] = 'application/json' // post 的 请求头设置
// 请求拦截
ajax.interceptors.request.use(config => {
    // 每次请求之前判断vuex中的token是否存在（也可以存在stroge里面）
    // 如果存在，则统一在请求的header中加上token，后台判断是否登录
    // 即使存在token，也有可能过期，所以在响应拦截中也要判断状态
    const token = localStorage.getItem('token')
    token && (config.headers.Authorization = 'Bearer' + token) // jwt验证
    // 全局loading
    if (requestNum === 0) {
        console.log('展示loading')
    }
    requestNum++
    // 每次请求设置一次cancelToken
    if (config.url === '/api/Authorize/Authenticate') {
        source = CancelToken.source()
    }
    config.cancelToken = source.token
    return config
}, error => {
    return Promise.reject(error)
})
// 响应拦截
ajax.interceptors.response.use(
    (response) => {
        // 隐藏loading
        requestNum--
        if (requestNum === 0) {
            console.log('隐藏loading')
        }
        return response
    },
    // 状态码提示
    (err) => {
        console.log(err)
        if (axios.isCancel(err)) { // 取消请求的情况下，终端Promise调用链
            source = CancelToken.source()
            return new Promise(() => {})
        } else {
            if (err && err.response) {
                switch (err.response.status) {
                    case 400:
                        err.message = '请求错误(400)'
                        break
                    case 401:
                        removeToken()
                        router.push({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        })
                        // 取消请求
                        source.cancel()
                        err.message = '未授权，请重新登录(401)'
                        break
                    case 403:
                    // 删除token
                        localStorage.removeItem('token')
                        // 跳转到登录页面可以吧当前浏览的页面传过去，登录成功后返回当前页面
                        // router.push({
                        //     path: 'login',
                        //     query: {
                        //         redirect: router.currentRoute.fullPath
                        //     }
                        // })
                        err.message = '拒绝访问(403)'
                        break
                    case 404:
                        err.message = '请求出错(404)'
                        break
                    case 408:
                        err.message = '请求超时(408)'
                        break
                    case 500:
                        err.message = '服务器错误(500)'
                        break
                    case 501:
                        err.message = '服务未实现(501)'
                        break
                    case 502:
                        err.message = '网络错误(502)'
                        break
                    case 503:
                        err.message = '服务不可用(503)'
                        break
                    case 504:
                        err.message = '网络超时(504)'
                        break
                    case 505:
                        err.message = 'HTTP版本不受支持(505)'
                        break
                    default:
                        err.message = `连接出错(${err.response.status})!`
                }
            } else {
                err.message = '连接服务器失败!'
            }
        }
        return Promise.reject(err.message)
    }
)
export default ajax
