import utils from '@/js/lib/utils'
let timeout = 0
const startTimeout = () => {
	timeout = setTimeout(() => {
		window.location.reload()
	}, utils.h2ms(1))
}
document.body.addEventListener('click', () => {
	if (timeout) {
		clearTimeout(timeout)
		startTimeout()
	}
})
export default {
	init () {
		startTimeout()
	}
}
