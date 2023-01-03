import axios from 'axios'
import app from '@/main.js'
import { requestConfig, requestFileConfig } from './config'
import { Loading } from 'element-ui'
import utils from '@/js/lib/utils'
const loginErrorList = [100001, 100002, 100003, 100005]
const tokenErrorList = [100004]
let requestRetryList = []
let isRefreshing = false
const service = axios.create(requestConfig)
const serviceFile = axios.create(requestFileConfig)
let loadingInstance
let loadingQueue = 0
const showLoading = (loadingFlag = true) => {
	loadingQueue++
	if (!loadingFlag) {
		return false
	}
	loadingInstance = Loading.service({ fullscreen: true, background: '#3031330f' })
	loadingInstance.fxIsLoading = true
}
const hideLoading = () => {
	loadingQueue--
	if (loadingQueue === 0 && loadingInstance) {
		loadingInstance.close()
		loadingInstance.fxIsLoading = false
	}
}
const requestInterceptors = [
	config => {
		config.headers.authorizationMes = app.vue.$store.state.loginer.authorizationMes
		config.headers.Authorization = app.vue.$store.state.loginer.token
		return config
	},
	error => {
		return Promise.reject(error)
	}
]
const responseInterceptors = [
	res => {
		hideLoading()
		if (!res.headers['content-disposition']) {
			const enc = new TextDecoder('utf-8')
			let response = app.vue.$fxUtils.JSONparse(enc.decode(new Uint8Array(res.data)), 'object')
			if (typeof response !== 'object') {
				response = app.vue.$fxUtils.JSONparse(response, 'object')
			}
			if (response.result || response.resultCode === 1) {
				return response
			} else if (tokenErrorList.includes(response.code)) {
				const config = res.config
				if (!isRefreshing) {
					isRefreshing = true
					return refreshToken().then(res => {
						app.vue.$store.commit('SET_LOGINER', {
							authorizationMes: res.token
						})
						requestRetryList.forEach(cb => cb())
						requestRetryList = []
						return service(config)
					})
				} else {
					return new Promise(resolve => {
						const retryFunc = function () {
							resolve(service(config))
						}
						requestRetryList.push(retryFunc)
					})
				}
			} else {
				return Promise.reject(response)
			}
		} else {
			return res
		}
	},
	error => {
		hideLoading()
		const serviceError = {
			code: 5000,
			message: '请求失败！'
		}
		if (error.response && error.response.data) {
			const enc = new TextDecoder('utf-8')
			const errData = app.vue.$fxUtils.JSONparse(enc.decode(new Uint8Array(error.response.data)))
			if (typeof errData !== 'object' || errData.status === 500) {
				return Promise.reject(serviceError)
			}
			return Promise.reject(errData)
		} else {
			return Promise.reject(serviceError)
		}
	}
]
service.interceptors.request.use(...requestInterceptors)
serviceFile.interceptors.request.use(...requestInterceptors)
service.interceptors.response.use(...responseInterceptors)
serviceFile.interceptors.response.use(...responseInterceptors)
const errorToast = error => {
	return new Promise(resolve => {
		app.vue.$fxMessage.error(error.message || error.msg || 'has not error message').then(resolve)
	})
}
const successToast = message => {
	return new Promise(resolve => {
		app.vue.$fxMessage.success(message).then(resolve)
	})
}
const requestCommon = (type) => {
	return ({ url, data, query = {}, loading = true, autoErrorMsg = true, autoSuccessMsg, responseComplete, success }) => {
		const requestInfo = app.vue.$fxLogger.requestInfoStart(url, data, query)
		showLoading(loading)
		return new Promise((resolve, reject) => {
			service({
				method: type,
				url,
				data,
				params: query,
				responseType: 'arraybuffer'
			}).then(res => {
				if (autoSuccessMsg && (res.message || res.msg)) {
					successToast(res.message || res.msg)
				}
				let _res = responseComplete ? res : (utils.isDef(res.data) ? res.data : {})
				if (success && typeof success === 'function') {
					_res = success(_res)
				}
				resolve(_res)
			}).catch((error) => {
				if (autoErrorMsg) {
					errorToast(error).then(() => {
						reject(error)
					})
				} else {
					reject(error)
				}
			}).always(() => {
				requestInfo.end(url)
			})
		})
	}
}
const requestFile = ({ url, data, query = {}, loading = true, autoErrorMsg = true, autoSuccessMsg, responseComplete, success }) => {
	const params = new FormData()
	Object.keys(data).forEach(item => {
		params.append(item, data[item])
	})
	showLoading(loading)
	return new Promise((resolve, reject) => {
		serviceFile({
			method: 'post',
			url,
			data: params,
			params: query,
			responseType: 'arraybuffer'
		}).then(res => {
			if (autoSuccessMsg && res.message) {
				successToast(res.message)
			}
			let _res = responseComplete ? res : (utils.isDef(res.data) ? res.data : {})
			if (success && typeof success === 'function') {
				_res = success(_res)
			}
			resolve(_res)
		}).catch((error) => {
			if (loginErrorList.includes(error.code)) {
				errorToast(error).then(() => {
					app.vue.$router.replace({ name: 'login' })
				})
			} else if (autoErrorMsg) {
				errorToast(error).then(() => {
					reject(error)
				})
			} else {
				reject(error)
			}
		})
	})
}
function refreshToken () {
	return new Promise(resolve => {
		app.vue.$fxApi('common.refreshToken')({
			data: {
				// token: app.vue.$store.state.loginer.authorizationMes
				token: app.vue.$store.state.loginer.token
			}
		}).then(res => {
			return resolve(res)
		}).catch(res => {
			// window.location.href = '/'
		})
	})
}
export default {
	requestPost: requestCommon('post'),
	requestPut: requestCommon('put'),
	requestDel: requestCommon('delete'),
	requestGet: requestCommon('get'),
	requestFile
}
export const fxLoading = loadingInstance
