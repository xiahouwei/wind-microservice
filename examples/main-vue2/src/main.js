import Vue from 'vue'
import App from './App.vue'
import router from './router'
import appInit, { appMount } from '@/js/appInit'
import { createStore } from '@wind-microservice/wind-micro-core'
const printstore = createStore({
	state: {
		aaa: 1
	},
	mutations: {
		setA (states) {
			states.aaa++
		}
	}
})
Vue.prototype.$printstore = printstore
appInit(Vue)
const app = {}
Vue.config.productionTip = false

app.vue = appMount(Vue, router, App)
window.fxApp = app
export default app
