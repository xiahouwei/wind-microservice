export const getComputedStyle = document.defaultView.getComputedStyle.bind(document.defaultView)

export function getScrollEventTarget (element, rootParent = window) {
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

export function getScrollTop (element) {
	return 'scrollTop' in element ? element.scrollTop : element.pageYOffset
}

export function setScrollTop (element, value) {
	'scrollTop' in element ? (element.scrollTop = value) : element.scrollTo(element.scrollX, value)
}

// get distance from element top to page top
export function getElementTop (element) {
	return (element === window ? 0 : element.getBoundingClientRect().top) + getScrollTop(window)
}

export function getVisibleHeight (element) {
	return element === window ? element.innerHeight : element.getBoundingClientRect().height
}
