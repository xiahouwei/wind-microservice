import directive from './directive'
import Loading from './Loading.vue'
const DEFAULT_BACKGROUND = 'rgba(48, 49, 51, 0.3)'
const DEFAULT_FULLSCREEN = true
const DEFAULT_LOADINGTYPE = ''
export default {
	install (Vue) {
		const FxLoading = Vue.extend(Loading)
		let instance = null
		const getToastInstance = () => {
			if (instance) {
				return instance
			}
			return new FxLoading({
				el: document.createElement('div')
			})
		}
		const $FxLoading = function (options = {}) {
			instance = getToastInstance()
			instance.visible = true
			instance.background = options.background || DEFAULT_BACKGROUND
			instance.fullscreen = options.fullscreen || DEFAULT_FULLSCREEN
			instance.loadingType = options.loadingType || DEFAULT_LOADINGTYPE
			document.body.appendChild(instance.$el)
			return instance
		}
		Vue.prototype.$fxLoadingRunning = $FxLoading
		Vue.use(directive)
	}
}
