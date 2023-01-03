import Vue from 'vue'
import App from './App.vue'
import router from './router'
import appInit, { appMount } from '@/js/appInit'
appInit(Vue)

class Store {
	constructor () {
		this.vm = new Vue({
			data: {
				state: window.parent.$$windMicroStore.states
			}
		})
	}

	get state () {
		return this.vm.state
	}

	setData () {
		this.vm.state.aaa++
	}
}


Vue.prototype.$printstore = new Store()
const app = {}
Vue.config.productionTip = false
app.vue = appMount(Vue, router, App)
export default app
