const isInView = function (el, father) {
	const scrollTop = father.scrollTop
	const clientHeight = father.clientHeight
	const offsetTop = el.offsetTop
	return !(scrollTop > offsetTop || offsetTop > (scrollTop + clientHeight))
}
export {
	isInView
}
