import initUi from '@/js/appInit/src/ui.js'
import initUitls from '@/js/appInit/src/utils.js'
import initVueCommon from '@/js/appInit/src/vueCommon.js'
import initAppPlugin from '@/js/appInit/src/appPlugin.js'
import initAppLogger from '@/js/appInit/src/appLogger.js'
export const appMount = function (Vue, router, store, App) {
	const vue = new Vue({
		router,
		store,
		render: h => h(App)
	})
	vue.$mount('#app')
	return vue
}
export default (vue) => {
	initUi(vue)
	initUitls(vue)
	initVueCommon(vue)
	initAppPlugin(vue)
	initAppLogger(vue)
}
