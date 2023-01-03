import app from '@/main.js'
import API_CONFIG from '@/config/api_config/index'
import { dataSource } from './dataSource'
import utils from '@/js/lib/utils'

const log = utils.fxDebug('fxApi')
const API = { ...API_CONFIG }
export default function (apiName, ...arg) {
	const [apiModule, apiFunc] = apiName.split('.')
	if (!API[apiModule][apiFunc]) {
		log(`api接口命名有误${apiName}`)
		return false
	}
	const options = API[apiModule][apiFunc](...arg)
	return dataSource(options)
}

export const downloadFile = function (apiName, ...arg) {
	const [apiModule, apiFunc] = apiName.split('.')
	if (!API[apiModule][apiFunc]) {
		log(`api接口命名有误${apiName}`)
		return false
	}
	const options = API[apiModule][apiFunc](...arg)
	options.query.Authorization = app.vue.$store.state.loginer.token
	const url = `${window.location.origin}${options.url}?${urlEncode(options.query)}`
	window.open(url)
}
const urlEncode = function (obj) {
	const params = []
	Object.keys(obj).forEach((key) => {
		let value = obj[key]
		if (typeof value === 'undefined') {
			value = ''
		}
		params.push([key, value].join('='))
	})
	return encodeURI(params.join('&'))
}
