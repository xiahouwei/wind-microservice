import { fxDebug } from './debug'
import utilsType from './type.js'

const log = fxDebug('cache')
const cacheMap = new Map()
/**
 * @name Cache
 * @desc 缓存功能
 * @author shw
 * @date 2021/9/30
 * @param {String} moduleName 模块名称
 */
class Cache {
	constructor (moduleName) {
		this.moduleName = moduleName
	}

	getModule () {
		let module = cacheMap.get(this.moduleName)
		if (!module) {
			cacheMap.set(this.moduleName, module = new Map())
		}
		return module
	}

	clear () {
		cacheMap.set(this.moduleName, new Map())
	}

	setCache (key, value) {
		const module = this.getModule()
		module.set(key, value)
	}

	getCache (key, fn) {
		const module = this.getModule()
		return module.get(key)
	}

	hasCache (key) {
		const module = this.getModule()
		return module.has(key)
	}

	cacher (key, fn) {
		if (this.hasCache(key)) {
			return Promise.resolve(this.getCache(key))
		} else {
			if (isFnOrObj(fn) && utilsType.isFunction(fn.then)) {
				return fn.then(res => {
					this.setCache(key, res)
					return Promise.resolve(res)
				})
			}
			if (utilsType.isFunction(fn)) {
				const res = fn(key)
				this.setCache(key, res)
				return Promise.resolve(res)
			}
			log('无法获取缓存的数据,缓存失败')
		}
	}
}

const isFnOrObj = function (val) {
	return utilsType.isFunction(val) || utilsType.isObject(val)
}

export const fxCache = function (moduleName) {
	return new Cache(moduleName)
}
