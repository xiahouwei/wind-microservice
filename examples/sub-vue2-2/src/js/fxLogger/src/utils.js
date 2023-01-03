const getUUID = function () {
	const r = []
	const s = '0123456789abcdef'.split('')
	for (let i = 0; i < 32; i++) {
		r[i] = s[Math.floor(Math.random() * 0x10)]
	}
	return r.join('')
}
const createUUIDInt = function () {
	var id = 0
	return function () {
		return ++id
	}
}
const getUUIDInt = createUUIDInt()
const getTime = function () {
	return new Date().getTime()
}
const getDomain = function () {
	return window.location.href.match(/:\/\/([\w.\-_]+(?::\d+)?)\//)[1]
}
export default {
	getUUID,
	getUUIDInt,
	getTime,
	getDomain
}
