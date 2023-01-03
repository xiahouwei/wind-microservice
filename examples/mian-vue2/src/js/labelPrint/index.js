import app from '@/main.js'
import printTemplate from './template'

const PRINT_SERVE = 'http://localhost:18000/CLodopfuncs.js'
const PRINT_SCRIPT_REG = /CLodopfuncs.js/

class LabelPrint {
	constructor () {
		this.inited = false
	}

	init () {
		return new Promise((resolve) => {
			if (!this.isInit()) {
				this.appenPrintScript(() => {
					this.inited = true
					resolve()
				})
			} else {
				resolve()
			}
		})
		// return Promise.resolve()
	}

	isInit () {
		return this.hasPrintScript() && this.inited
	}

	hasPrintScript () {
		const scripts = document.querySelectorAll('script')
		return Array.prototype.some.call(scripts, item => PRINT_SCRIPT_REG.test(item.src))
	}

	appenPrintScript (cb) {
		const printScript = document.createElement('script')
		printScript.src = PRINT_SERVE
		printScript.onload = cb
		printScript.onerror = () => {
			app.vue.$fxMessage.warning('打印服务不可用! 请联系管理员')
			this.removePrintScript()
		}
		document.body.appendChild(printScript)
	}

	removePrintScript () {
		const scripts = document.querySelectorAll('script')
		for (let i = scripts.length - 1; i >= 0; i--) {
			if (PRINT_SCRIPT_REG.test(scripts[i].src)) {
				scripts[i].parentNode.removeChild(scripts[i])
			}
		}
	}

	print (printData, filter, templateType, templateSize) {
		let template = printTemplate[templateType]
		if (!template) {
			app.vue.$fxMessage.warning('无法匹配打印模板')
			return false
		}
		template = template.find(item => item.size === templateSize)
		if (!template) {
			app.vue.$fxMessage.warning('无法匹配打印模板')
			return false
		}
		template.handler(printData, filter)
	}
}

export const createLablePrint = function () {
	return new LabelPrint()
}
