import { MessageBox } from 'element-ui'
const DEFAULT_TITLE = '提示信息'
const DEFAULT_OPTIONS = {
	closeOnClickModal: false,
	closeOnPressEscape: false,
	closeOnHashChange: false
}
const getParams = function (options) {
	const message = typeof options === 'string' ? options : options.message
	const title = typeof options === 'string' ? DEFAULT_TITLE : options.title || DEFAULT_TITLE
	const op = typeof options === 'string' ? DEFAULT_OPTIONS : options.option || DEFAULT_OPTIONS
	return [message, title, op]
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
