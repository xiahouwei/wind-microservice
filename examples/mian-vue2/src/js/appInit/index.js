import initUi from '@/js/appInit/src/ui.js'

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
}
