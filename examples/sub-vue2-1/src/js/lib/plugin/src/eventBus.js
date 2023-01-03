import Vue from 'vue'

export const createEventBus = function () {
	const eventBus = new Vue({})
	eventBus.initEvent = function (context, event, methods) {
		eventBus.$on(event, methods)
		context.$once('hook:beforeDestroy', function () {
			eventBus.$off(event, methods)
		})
	}
	return eventBus
}
const fxEventBus = createEventBus()
export default fxEventBus
