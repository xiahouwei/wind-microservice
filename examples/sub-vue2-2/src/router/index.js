import Vue from 'vue'
import VueRouter from 'vue-router'
import routerConifig from './routerConfig'

Vue.use(VueRouter)
const router = new VueRouter({
	base: process.env.BASE_URL,
	routes: routerConifig
})
export default router
