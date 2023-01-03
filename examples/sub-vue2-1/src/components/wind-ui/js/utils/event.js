let supportsPassive = false

try {
	const opts = {}
	Object.defineProperty(opts, 'passive', {
		get () {
			supportsPassive = true
		}
	})
	window.addEventListener('test-passive', null, opts)
} catch (e) {}

/**
 * EventUtils by shw
 * @desc Event工具类
 */
class EventUtils {
	constructor () {
		this.onDomMap = new Map()
		this.delegateDomMap = new Map()
	}

	/**
	 * on by shw
	 * @desc 绑定事件
	 * @param target 绑定事件元素
	 * @param event  事件名
	 * @param handler  回调函数
	 * @param passive  禁止阻止默认
	 * @param namespace  命名空间, 用于避免重复绑定
	 */
	on (target, event, handler, passive = false, once = false, namespace) {
		if (namespace) {
			const currentHandler = function () {
				if (handler) {
					handler.apply(this, arguments)
				}
			}
			const key = `${event}&&${namespace}`
			const eventObj = this.onDomMap.get(target) || {}
			const _handler = eventObj[key]
			if (_handler) {
				return false
			}
			eventObj[key] = currentHandler
			this.onDomMap.set(target, eventObj)
			target.addEventListener(
				event,
				currentHandler,
				supportsPassive ? { capture: false, passive, once } : false
			)
		} else {
			target.addEventListener(
				event,
				handler,
				supportsPassive ? { capture: false, passive, once } : false
			)
		}
	}

	/**
	 * on by shw
	 * @desc 绑定事件
	 * @param target 绑定事件元素
	 * @param event  事件名
	 * @param handler  回调函数
	 * @param passive  禁止阻止默认
	 * @param namespace  命名空间, 用于避免重复绑定
	 */
	once (target, event, handler, passive = false, namespace) {
		const _this = this
		if (supportsPassive) {
			this.on(target, event, handler, passive, true, namespace)
		} else {
			const listener = function () {
				if (handler) {
					handler.apply(this, arguments)
				}
				_this.off(target, event, listener)
			}
			this.on(target, event, listener, passive, true, namespace)
		}
	}

	/**
	 * delegate by shw
	 * @desc 事件委托
	 * @param target 委托元素
	 * @param child  需要触发的子元素
	 * @param event  事件名
	 * @param handler  回调函数
	 * @param passive  禁止阻止默认
	 * @param namespace  命名空间, 用于避免重复绑定
	 */
	delegate ({ target, child, event, handler, passive = false, once = false, namespace }) {
		const _this = this
		const currentHandler = function (event) {
			if (event.target && (event.target.classList.contains(child) || _this.findParent(event.target, child, target))) {
				if (handler) {
					handler.apply(this, arguments)
				}
			}
		}
		if (namespace) {
			const key = `${child}&&${event}&&${namespace}`
			const eventObj = this.delegateDomMap.get(target) || {}
			const _handler = eventObj[key]
			if (_handler) {
				return false
			}
			eventObj[key] = currentHandler
			this.delegateDomMap.set(target, eventObj)
		}
		this.on(target, event, currentHandler, passive, once)
	}

	/**
	 * delegateOnce by shw
	 * @desc 事件委托且只执行一次
	 * @param target 委托元素
	 * @param child  需要触发的子元素
	 * @param event  事件名
	 * @param handler  回调函数
	 * @param passive  禁止阻止默认
	 * @param namespace  命名空间, 用于避免重复绑定
	 */
	delegateOnce ({ target, child, event, handler, passive = false, namespace }) {
		const _this = this
		if (supportsPassive) {
			this.delegate({ target, child, event, handler, passive, once: true, namespace })
		} else {
			const listener = function () {
				if (handler) {
					handler.apply(this, arguments)
				}
				_this.off(target, event, listener)
			}
			this.delegate(target, child, event, listener, passive, namespace)
		}
	}

	/**
	 * off 解绑事件
	 * by shw
	 */
	off (target, event, handler) {
		target.removeEventListener(event, handler)
	}

	hasParent (target, parentName) {
		return target.classList && target.classList.contains(parentName)
	}

	isRoot (target, rootTarget) {
		return rootTarget && target === rootTarget
	}

	findParent (target, parentName, rootTarget) {
		if (this.hasParent(target, parentName)) {
			return target
		}
		if (this.isRoot(target, rootTarget)) {
			return null
		}
		let parent = target.parentNode || null
		while (parent) {
			if (this.hasParent(parent, parentName)) {
				return parent
			}
			if (this.isRoot(parent, rootTarget)) {
				return null
			}
			parent = parent.parentNode
		}
		return null
	}
}

/**
 * stop 阻止冒泡
 * by shw
 */
export function stop (event) {
	event.stopPropagation()
}

/**
 * prevent 阻止浏览器默认行为
 * by shw
 */
export function prevent (event) {
	event.preventDefault()
}

/**
 * getTextWidth 获取文本宽度
 * by shw
 */
export function getTextWidth (str) {
	const html = document.createElement('span')
	html.innerText = str
	html.className = 'fx-getTextWidth-span'
	document.querySelector('body').appendChild(html)
	const width = document.querySelector('.fx-getTextWidth-span').offsetWidth
	document.querySelector('.fx-getTextWidth-span').remove()
	return width
}

export function initEventUtils () {
	return new EventUtils()
}
