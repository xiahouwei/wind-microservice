import { requestAnimationFrameInit } from './requestAnimationFrame'
const scrollTopW = function ({ offsetTop = 0, $el = document.documentElement, distance = 100 }) {
	if (!window.requestAnimationFrame) {
		requestAnimationFrameInit()
	}
	let timer = null
	let scrollTop = $el.scrollTop
	window.cancelAnimationFrame(timer)
	timer = window.requestAnimationFrame(function fn () {
		if (scrollTop < offsetTop) {
			scrollTop += distance
			$el.scrollTop = scrollTop
			timer = window.requestAnimationFrame(fn)
		} else {
			$el.scrollTop = offsetTop
			window.cancelAnimationFrame(timer)
		}
	})
}
const getComputedStyle = document.defaultView.getComputedStyle.bind(document.defaultView)
const getScrollEventTarget = function (element, rootParent = window) {
	let node = element
	while (
		node &&
		node.tagName !== 'HTML' &&
		node.tagName !== 'BODY' &&
		node.nodeType === 1 &&
		node !== rootParent
	) {
		const { overflowY } = getComputedStyle(node)
		if (overflowY === 'scroll' || overflowY === 'auto') {
			return node
		}
		node = node.parentNode
	}
	return rootParent
}
const doScrollTop = function (element, distance = 20, parent = null) {
	const scrollEventTarget = getScrollEventTarget(element)
	const offsetTop = !parent ? element.offsetTop : getElementTop(element, parent)
	scrollTopW({
		$el: scrollEventTarget,
		offsetTop,
		distance
	})
}
const getElementTop = function (el, parent) {
	let actualTop = el.offsetTop
	let current = el.offsetParent
	while (current !== null && current !== parent) {
		actualTop += current.offsetTop
		current = current.offsetParent
	}
	return actualTop
}
export default {
	scrollTopW,
	doScrollTop
}
