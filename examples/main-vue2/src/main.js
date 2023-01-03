import Vue from 'vue'
import App from './App.vue'
import router from './router'
import appInit, { appMount } from '@/js/appInit'
import test from '@wind-microservice/wind-micro-core'
console.log(test)
appInit(Vue)
const app = {}
Vue.config.productionTip = false

app.vue = appMount(Vue, router, App)
window.fxApp = app
export default app
