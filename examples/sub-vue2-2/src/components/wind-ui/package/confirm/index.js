import { MessageBox } from 'element-ui'
const DEFAULT_TITLE = '提示信息'
const DEFAULT_OPTIONS = {
	closeOnClickModal: false,
	closeOnPressEscape: false,
	closeOnHashChange: false
}
const getParams = function (options) {
	const message = typeof options === 'string' ? options : normalizationMessage(options).message
	const title = typeof options === 'string' ? DEFAULT_TITLE : options.title || DEFAULT_TITLE
	const op = typeof options === 'string' ? DEFAULT_OPTIONS : normalizationMessage(options).option || DEFAULT_OPTIONS
	return [message, title, op]
}
const normalizationMessage = function (options) {
	if (options.selectedRowsLength) {
		let message = []
		let htmlString = ''
		const option = {}
		const mulitySelectedRowsMessage = `已选中${options.selectedRowsLength}条数据`
		message = [options.message, mulitySelectedRowsMessage]
		message.forEach(item => {
			htmlString += `<div>${item}</div>`
		})
		option.dangerouslyUseHTMLString = true
		options.message = htmlString
		options.option = option
	}
	return options
}
export default {
	install (Vue) {
		const $Confirm = (options) => {
			return MessageBox.confirm(...getParams(options))
		}
		const $alert = function (options) {
			return MessageBox.alert(...getParams(options))
		}
		const $prompt = function (options) {
			return MessageBox.prompt(...getParams(options))
		}
		Vue.prototype.$fxConfirm = $Confirm
		Vue.prototype.$fxAlert = $alert
		Vue.prototype.$fxPrompt = $prompt
	}
}
