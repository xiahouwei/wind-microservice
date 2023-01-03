import Vue from 'vue'
import App from './App.vue'
import router from './router'
import appInit, { appMount } from '@/js/appInit'
import { createStore } from '@wind-microservice/wind-micro-core'
appInit(Vue)
Vue.prototype.$printstore = createStore(window.parent.$$windMicroStore)

// class Store {
// 	constructor () {
// 		this.vm = new Vue({
// 			data: {
// 				state: window.parent.$$windMicroStore.state
// 			}
// 		})
// 	}

// 	get state () {
// 		return this.vm.state
// 	}

// 	setData () {
// 		this.vm.state.aaa++
// 	}
// }


// Vue.prototype.$printstore = new Store()
const app = {}
Vue.config.productionTip = false
app.vue = appMount(Vue, router, App)
export default app
