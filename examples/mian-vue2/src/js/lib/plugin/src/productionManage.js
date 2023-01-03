import app from '@/main.js'
export default {
	getRemote ({ host, token, router, billId }) {
		const productionManagerUrl = app.vue.$store.state.system.productionManagerUrl + '/#/redictPage'
		return `${host || productionManagerUrl}?token=${token}&app=scm8&router=${router}&billId=${billId}`
	}
}
