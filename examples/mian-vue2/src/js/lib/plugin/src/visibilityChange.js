import app from '@/main.js'
function getHiddenProp () {
	var prefixes = ['webkit', 'moz', 'ms', 'o']
	if ('hidden' in document) {
		return 'hidden'
	}
	for (var i = 0; i < prefixes.length; i++) {
		if ((`${prefixes[i]}Hidden`) in document) {
			return `${prefixes[i]}Hidden`
		}
	}
	return null
}

function getVisibilityState () {
	var prefixes = ['webkit', 'moz', 'ms', 'o']
	if ('visibilityState' in document) return 'visibilityState'
	for (var i = 0; i < prefixes.length; i++) {
		if ((prefixes[i] + 'VisibilityState') in document) {
			return prefixes[i] + 'VisibilityState'
		}
	}
	return null
}
export default function () {
	var visProp = getHiddenProp()
	if (visProp) {
		var evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange'
		document.addEventListener(evtname, function () {
			if (document[getVisibilityState()] === 'visible') {
				app.vue.$fxEventBus.$emit('app-visible')
			}
		}, false)
	}
}
