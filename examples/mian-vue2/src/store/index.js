import Vue from 'vue'
import Vuex from 'vuex'
import address from './src/address/index'
import appTabs from './src/appTabs/index'
import filterItem from './src/filterItem/index'
import auth from './src/auth/index'
import loginer from './src/loginer/index'
import orderRequired from './src/orderRequired/index'
import stylusDynamic from './src/stylus-dynamic/index'
import system from './src/system/index'
import orderMistakeCheck from './src/orderMistakeCheck/index'
Vue.use(Vuex)

const store = () => new Vuex.Store({
	modules: {
		address,
		appTabs,
		filterItem,
		auth,
		loginer,
		orderRequired,
		stylusDynamic,
		system,
		orderMistakeCheck
	}
})

export default store
