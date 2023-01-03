import Vue from 'vue'
import App from './App.vue'
import router from './router'
import appInit, { appMount } from '@/js/appInit'
import { createSubStore } from '@wind-microservice/wind-micro-core'
appInit(Vue)
Vue.prototype.$printstore = createSubStore()

const app = {}
Vue.config.productionTip = false
app.vue = appMount(Vue, router, App)
export default app
