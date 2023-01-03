import Vue from 'vue'
import VueRouter from 'vue-router'
import routerConifig from './routerConfig'
import app from '@/main.js'
import MENU_LIST_CONFIG from '@/config/menu_list_config'
import { loginErrorRefresh } from '@/js/service/index.js'
// import { syncIsPro } from '../store/src/auth/actions'

Vue.use(VueRouter)
const getParamsConfigPaths = function () {
	return MENU_LIST_CONFIG.reduce((pre, cur) => {
		if (cur.child) {
			pre.push(...cur.child.map(item => item.path))
		}
		return pre
	}, [])
}
const paramsConfigPaths = getParamsConfigPaths()
const router = new VueRouter({
	base: process.env.BASE_URL,
	routes: routerConifig
})
router.afterEach((to, from) => {
	if (to.path === '/login') {
		loginErrorRefresh()
	} else {
		if (paramsConfigPaths.includes(to.name)) {
			app.vue.$store.dispatch('systemGetParamsConfig')
		}
		app.vue.$store.dispatch('systemGetBiubiuorderUrl')
		app.vue.$store.dispatch('systemGetMesUrl')
		const { authModuleList, orderRequiredBillType, orderMistakeCheckBillType } = to.meta
		if (authModuleList) {
			getModuleAuth(authModuleList)
		}
		if (orderRequiredBillType) {
			getOrderRequiredConfig(orderRequiredBillType)
		}
		if (orderMistakeCheckBillType) {
			getOrderMistakeCheckConfig(orderMistakeCheckBillType)
		}
	}
})
function getModuleAuth (moduleName) {
	return app.vue.$store.dispatch('syncDetailsAuth', { moduleName })
}
function getOrderRequiredConfig (orderRequiredBillType) {
	return app.vue.$store.dispatch('getOrderRequiredConfig', { type: orderRequiredBillType })
}
function getOrderMistakeCheckConfig (orderMistakeCheckBillType) {
	return app.vue.$store.dispatch('getOrderMistakeCheckConfig', { type: orderMistakeCheckBillType })
}
export default router
