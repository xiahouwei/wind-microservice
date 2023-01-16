import Vue from 'vue'
import App from './App.vue'
import router from './router'
import appInit, { appMount } from '@/js/appInit'
import { createSubStore } from '@wind-microservice/wind-micro-core'
appInit(Vue)
Vue.prototype.$printstore = createSubStore()

const app = {}
Vue.config.productionTip = false
// app.vue = appMount(Vue, router, App)

window.$$windMicroMount = () => {
	// const router = new VueRouter({ base, routes });
	// instance = new Vue({ router, render: (h) => h(App) }).$mount("#app");
	app.vue = appMount(Vue, router, App)
}
window.$$windMicroUnmount = () => {
	// instance.$destroy();
	app.vue.$destroy()
}
export default app
