import common from '@/js/common'
export default {
	getRemote ({ host, token, router }) {
		const stockManageUrl = common.getEnvironmentVariable('VUE_APP_STOCK_MANAGE_URL')
		return `${host || stockManageUrl}${token.accessTokenUser}?route=${router}`
	}
}
