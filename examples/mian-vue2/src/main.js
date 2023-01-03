import Vue from 'vue'
import App from './App.vue'
import router from './router'
import appInit, { appMount } from '@/js/appInit'
appInit(Vue)
const app = {}
Vue.config.productionTip = false

app.vue = appMount(Vue, router, App)
window.fxApp = app
export default app
