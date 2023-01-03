import app from '@/main.js'
const limitEnter = () => {
	document.body.addEventListener('keydown', (e) => {
		if (app.vue.$fxLoading.fxIsLoading) {
			e.preventDefault()
		}
	}, true)
}
export default {
	init () {
		limitEnter()
	}
}
