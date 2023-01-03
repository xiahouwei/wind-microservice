import app from '@/main.js'
export default {
	getRemote ({ host, token, router }) {
		const biubiuorderUrl = app.vue.$store.state.system.biubiuorderUrl + '/biubiuorder/#/redictPage'
		return `${host || biubiuorderUrl}?token=${token}&app=scm8&router=${router}`
	}
}
