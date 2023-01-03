import { post } from '@/js/api/dataSource'
import { devUrl } from '@/js/service/baseUrl'
export default {
	// 对外接口
	foreign: {
		// 获取商龙云token
		getSLCloudToken () {
			return post({ url: `${devUrl}/api/auth/login` })
		},
		// 商龙刷新token
		refreshSLCloudToken () {
			return post({ url: `${devUrl}/api/auth/token/expire/reset`, autoErrorMsg: false })
		}
	}
}
