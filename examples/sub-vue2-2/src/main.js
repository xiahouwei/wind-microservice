import Vue from 'vue'
import App from './App.vue'
import router from './router'
import appInit, { appMount } from '@/js/appInit'
import { createSubStore } from '@wind-microservice/wind-micro-core'
appInit(Vue)
const app = {}
Vue.config.productionTip = false
Vue.prototype.$printstore = createSubStore()

app.vue = appMount(Vue, router, App)
export default app
