import ContextMenu from './ContextMenu.vue'

export default {
	install (Vue, options) {
		const VueContextMenu = Vue.extend(ContextMenu)
		let instance = null
		const getToastInstance = () => {
			if (instance) {
				return instance
			}
			return new VueContextMenu({
				el: document.createElement('div')
			})
		}
		VueContextMenu.prototype.close = function () {
			this.visible = false
			this.closed = true
		}
		const $ContextMenu = (options = {}) => {
			instance = getToastInstance()
			instance.closed = false
			instance.top = options.top
			instance.left = options.left
			instance.menuList = options.menuList
			instance.contextEvent = options.contextEvent
			document.body.appendChild(instance.$el)
			Vue.nextTick(function () {
				instance.visible = true
			})
			return instance
		}
		$ContextMenu.getVisiable = function () {
			return instance && instance.closed === false
		}
		$ContextMenu.init = function (el, { menuList, beforeShow }) {
			el.addEventListener('contextmenu', e => {
				e.preventDefault()
				if (typeof beforeShow === 'function' && !beforeShow(e)) {
					return false
				}
				$ContextMenu({
					top: `${e.clientY}px`,
					left: `${e.clientX}px`,
					menuList,
					contextEvent: e
				})
			})
			document.addEventListener('click', e => {
				instance && instance.close()
			})
		}
		Vue.prototype.$fxContextMenu = $ContextMenu
	}
}
