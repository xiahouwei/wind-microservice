import utilsType from './type.js'
import app from '@/main.js'
/*
 * 数据校验类 by shw
 * @method resetData 重置数据
 * @method checkData 校验数据
 * @method checkComfirm 校验数据,且自动提示 返回promise , params[data] 需要校验的数据 params[message] 需要提示的语句
 */
class Verification {
	constructor (data) {
		this.resetData(data)
	}

	resetData (data) {
		this.origin = typeof data === 'object' ? utilsType.deepClone(data) : data
	}

	checkData (data, log = false) {
		return utilsType.compare(this.origin, data, log)
	}

	checkComfirm (data, message = '当前页面存在未保存数据，是否确定取消并退出操作？') {
		return new Promise(resolve => {
			if (this.checkData(data)) {
				resolve()
			} else {
				app.vue.$fxConfirm(message).then(() => {
					resolve()
				})
			}
		})
	}

	getOriginData () {
		return utilsType.deepClone(this.origin)
	}
}

export const fxDataVerification = function (origin) {
	return new Verification(origin)
}

