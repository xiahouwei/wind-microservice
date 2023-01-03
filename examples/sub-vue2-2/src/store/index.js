import Vue from 'vue'
import Vuex from 'vuex'
import loginer from './src/loginer/index'
import pageIndex from './src/pageIndex/index'
import address from './src/address/index'
import system from './src/system/index'
import stylusDynamic from './src/stylus-dynamic'
Vue.use(Vuex)

const store = () => new Vuex.Store({
	modules: {
		loginer,
		pageIndex,
		address,
		system,
		stylusDynamic
	}
})

export default store
