import API_CONFIG from '@/config/api_config/index'
import { dataSource } from './dataSource'

const API = { ...API_CONFIG }
export default function (apiName, ...arg) {
	const [apiModule, apiFunc] = apiName.split('.')
	if (!API[apiModule][apiFunc]) {
		console.warn('fxWarn:api接口命名有误')
		return false
	}
	const options = API[apiModule][apiFunc](...arg)
	return dataSource(options)
}

export const downloadFile = function (apiName, ...arg) {
	const [apiModule, apiFunc] = apiName.split('.')
	if (!API[apiModule][apiFunc]) {
		console.warn('fxWarn:api接口命名有误')
		return false
	}
	const options = API[apiModule][apiFunc](...arg)
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
