import Vue from 'vue'
import App from './App.vue'
import router from './router'
import appInit, { appMount } from '@/js/appInit'
appInit(Vue)
const app = {}
Vue.config.productionTip = false

class Store {
	constructor () {
		this.vm = new Vue({
			data: {
				state: window.parent.$$printstore.states
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

app.vue = appMount(Vue, router, App)
export default app
