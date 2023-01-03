import app from '@/main.js'
const postMessageKey = {
	getSystemInfo: 'getSystemInfo'
}
const postMessage = params => {
	window.parent.postMessage(params, '*')
}

const logOut = () => {
	postMessage({ sessionState: '-1' })
}
const postMessageMes = params => {
	window.frames.mes.postMessage(params, '*')
}

export default {
	init () {
		window.addEventListener('message', receiveMessage, false)
		function receiveMessage (event) {
			const actionType = event.data && event.data.action
			switch (actionType) {
			case postMessageKey.getSystemInfo:
				postMessageMes({
					app: 'scm8',
					action: postMessageKey.getSystemInfo,
					data: app.vue.$store.state.system.sysParamsConfig
				})
				break
			}
		}
	},
	logOut
}
