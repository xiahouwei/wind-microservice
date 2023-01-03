import config from '@/config/slCloud_report_config'
import app from '@/main.js'

function fullScreenHandler (value) {
	app.vue.$fxEventBus.$emit('ebs-menu-hidden', value)
}
function reportChangeHandler (value) {
	const menu = getReportMenuById(value)
	if (!menu) {
		return false
	}
	app.vue.$fxEventBus.$emit('ebs-menu-active', menu)
	app.vue.$fxRouter.replaceRouterPathNofresh(`/main/report?reportId=${menu}`)
}
function getReportMenuById (id) {
	const reportMap = config.reportMap
	const report = Object.keys(reportMap).find(key => {
		return id === reportMap[key]
	})
	return report
}

export default {
	getRemote ({ host = config.host, token, reportId }) {
		return `${host}?token=${token}&id=${config.reportMap[reportId]}`
	},
	getTokenParams () {
		return {
			bizLineToken: app.vue.$store.state.loginer.token,
			...config.loginParams
		}
	},
	init () {
		window.addEventListener('message', receiveMessage, false)
		function receiveMessage (event) {
			const msgType = event.data && event.data.type
			switch (msgType) {
			case 'fullScreen':
				fullScreenHandler(event.data.value)
				break
			case 'reportChange':
				reportChangeHandler(event.data.value)
			}
		}
	}
}
