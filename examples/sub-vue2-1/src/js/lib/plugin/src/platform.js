import utils from '@/js/lib/utils'

export default {
	init () {
		const platformIs = utils.platformIs()
		let platformValue = ''
		if (platformIs.safari) {
			platformValue = 'safari'
		} else if (platformIs.chrome) {
			platformValue = 'chrome'
		}
		window.document.documentElement.setAttribute('data-platform-type', platformValue)
	}
}
