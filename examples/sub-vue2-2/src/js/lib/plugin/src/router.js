import app from '@/main.js'
import billRouterConfig from '@/router/billRouterConfig.js'
export function go (routerPath) {
	const isHttp = typeof routerPath === 'string' && (/http/.test(routerPath) || /https/.test(routerPath))
	if (!isHttp) {
		const $router = app.vue.$router
		if (typeof routerPath === 'object' && routerPath.replace === true) {
			$router.replace(routerPath)
		} else {
			routerPath === 'BACK' ? $router.go(-1) : $router.push(routerPath)
		}
	} else {
		window.location.href = routerPath
	}
}

export function getUrl (url, $router) {
	// Make sure the href is right in hash mode
	if ($router && !$router._history && typeof url === 'string' && !/http/.test(url)) {
		return '#!' + url
	}
	return url && typeof url !== 'object' ? url : 'javascript:void(0);'
}

export function goBlank (routerPath) {
	const isHttp = typeof routerPath === 'string' && (/http/.test(routerPath) || /https/.test(routerPath))
	if (!isHttp) {
		const $router = app.vue.$router
		let routeData = {}
		if (typeof routerPath === 'string') {
			routeData = $router.resolve(routerPath)
		} else {
			const { path, query } = routerPath
			routeData = $router.resolve({ path, query })
		}
		window.open(routeData.href, '_blank')
	} else {
		window.open(routerPath, '_blank')
	}
}
export function goToBillBlank (type, query) {
	const path = billRouterConfig[type].path
	const routeData = app.vue.$router.resolve({ path, query })
	window.open(routeData.href, '_blank')
}

export function goPrint (billType, billId) {
	goBlank({
		path: '/print',
		query: {
			source: 'scm8',
			billType,
			billId
		}
	})
}
