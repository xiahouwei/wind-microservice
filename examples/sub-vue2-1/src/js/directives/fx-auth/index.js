/*
 * fx-auth 权限指令 by shw
 * @params moduleAuth: 模块权限
 * @params detialsAuth: 详情权限
 * @params dynamicRule: 动态规则
 * exmple:
 * 1.v-fx-auth:moduleAuth.detialsAuth 根据当前模块的详情权限 进行显示(允许|, & 规则)
 * example:v-fx-auth:basic-archives_organ-manage.add-shop|add-rdc|add-store|add-section
 * 2.v-fx-auth:moduleAuth.detialsAuth="dynamicRule"
 * a.动态规则dynamicRule如果为false, 则无权限, 如果动态规则为true, 则根据模块详情权限 进行显示
 * b.动态规则dynamicRule如果为function, 且存在moduleAuth, 则向function传入参数hasAuthByDetails, 作用为接收details-name, 返回权限(允许|, & 规则)
 * c如果不存在moduleAuth, 则function无任何参数
 * 3.v-fx-auth ="dynamicRule" 仅仅根据动态权限 进行显示
 */
import app from '@/main'
import utils from '@/js/lib/utils'
const hideEl = function (el) {
	el.style.display = 'none'
}
const getDetailsAuth = function (moduleName) {
	return app.vue.$store.state.auth.detailsAuth[moduleName] || {}
}
const hasAuth = function (authModule, authDetailsName) {
	const detailsAuthMap = getDetailsAuth(authModule)
	return utils.logicJudgmentStr(authDetailsName, detail => {
		return !!detailsAuthMap[detail]
	})
}
const hasAuthByDetails = function (authModule) {
	return function (authDetailsName) {
		return hasAuth(authModule, authDetailsName)
	}
}
const verifyAuth = function (el, binding) {
	if (binding.value === false) {
		hideEl(el)
		return false
	}
	if (typeof binding.value === 'function') {
		const value = binding.arg ? binding.value(hasAuthByDetails(binding.arg)) : binding.value()
		if (!value) {
			hideEl(el)
			return false
		}
	}
	if (binding.arg && utils.isEmptyObj(getDetailsAuth(binding.arg))) {
		hideEl(el)
		return false
	}
	if (binding.arg && binding.modifiers && !utils.isEmptyObj(binding.modifiers)) {
		const authDetailsName = Object.keys(binding.modifiers)[0]
		if (!hasAuth(binding.arg, authDetailsName)) {
			hideEl(el)
			return false
		}
	}
	el.style.display = el.fxDirDisplay
}
const contextArr = new Set()
export const updateAuthRender = function () {
	contextArr.forEach(context => {
		context.$forceUpdate()
	})
}
export default {
	bind: (el, binding, vnode) => {
		contextArr.add(vnode.context)
		el.fxDirDisplay = el.style.display
		verifyAuth(el, binding)
	},
	update: verifyAuth,
	unbind: (el, binding, vnode) => {
		contextArr.delete(vnode.context)
	}
}
