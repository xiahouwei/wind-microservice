import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import appInit, { appMount } from '@/js/appInit'
appInit(Vue)
const app = {}
Vue.config.productionTip = false

app.vue = appMount(Vue, router, store, App)
window.fxApp = app
export default app
