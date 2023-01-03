import initUi from '@/js/appInit/src/ui.js'
export const appMount = function (Vue, router, App) {
	const vue = new Vue({
		router,
		render: h => h(App)
	})
	vue.$mount('#app')
	return vue
}
export default (vue) => {
	initUi(vue)
}
