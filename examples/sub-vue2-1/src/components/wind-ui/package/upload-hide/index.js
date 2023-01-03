import Upload from './UploadHide.vue'
export default {
	install (Vue) {
		const FxUpload = Vue.extend(Upload)
		let instance = null
		const getToastInstance = () => {
			if (instance) {
				return instance
			}
			return new FxUpload({
				el: document.createElement('div')
			})
		}
		const $Upload = function (options = {}) {
			return new Promise(resolve => {
				instance = getToastInstance()
				instance.fileSize = options.fileSize || 30
				instance.type = options.type || 'file'
				instance.uploadFn = resolve
				document.body.appendChild(instance.$el)
				Vue.nextTick(instance.upload)
			})
		}
		Vue.prototype.$fxUpload = $Upload
	}
}

