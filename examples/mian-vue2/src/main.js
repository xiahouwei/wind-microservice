import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import appInit, { appMount } from '@/js/appInit'
appInit(Vue)
const app = {}
Vue.config.productionTip = false

app.vue = appMount(Vue, router, store, App)
app.vue.$fxLogger.init(app.vue.$store.state.loginer)
window.fxApp = app
export default app
