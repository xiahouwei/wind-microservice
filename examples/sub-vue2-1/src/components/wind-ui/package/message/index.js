import { Message } from 'element-ui'
const DEFAULT_OPTION = {
	duration: 2000,
	dangerouslyUseHTMLString: true
}
export default {
	install (Vue) {
		const $Message = (options) => {
			return new Promise(resolve => {
				const currentOptions = typeof options === 'string' ? { message: options, ...DEFAULT_OPTION } : options
				currentOptions.duration = currentOptions.duration || DEFAULT_OPTION.duration
				Message(currentOptions)
				window.setTimeout(() => {
					resolve()
				}, 500)
			})
		}
		$Message.success = (message) => {
			return new Promise(resolve => {
				Message.success({
					message,
					...DEFAULT_OPTION
				})
				window.setTimeout(() => {
					resolve()
				}, 500)
			})
		}
		$Message.warning = (message) => {
			return new Promise(resolve => {
				Message.warning({
					message,
					...DEFAULT_OPTION
				})
				window.setTimeout(() => {
					resolve()
				}, 500)
			})
		}
		$Message.error = (message) => {
			return new Promise(resolve => {
				Message.error({
					message,
					...DEFAULT_OPTION
				})
				window.setTimeout(() => {
					resolve()
				}, 500)
			})
		}
		Vue.prototype.$fxMessage = $Message
	}
}

