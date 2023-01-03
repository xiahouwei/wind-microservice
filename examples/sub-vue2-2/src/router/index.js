import Vue from 'vue'
import VueRouter from 'vue-router'
import routerConifig from './routerConfig'
import app from '@/main.js'
import MENU_LIST_CONFIG from '@/config/menu_list_config'

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
	if (paramsConfigPaths.includes(to.name)) {
		app.vue.$store.dispatch('systemGetParamsConfig')
	}
})
export default router
