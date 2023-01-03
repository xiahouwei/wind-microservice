import app from '@/main.js'

class FxFastReport {
	constructor () {
		this.inited = false
	}

	init () {
		return new Promise(resolve => {
			if (navigator.userAgent.indexOf('Windows') < 0) {
				app.vue.$fxMessage.warning('请在 Windows 系统中使用自定义打印！')
				return false
			}
			window.TDevices.init().then(() => {
				this.inited = true
				resolve()
			})
		})
	}

	getPrinter () {
		return new Promise(resolve => {
			const report = new window.FastReport()
			report.enable = true
			report.printerlist(result => {
				const list = result.message.list.map(item => {
					return {
						value: item,
						label: item
					}
				})
				resolve(list)
			})
		})
	}
}

export const createFastReport = function () {
	return new FxFastReport()
}
