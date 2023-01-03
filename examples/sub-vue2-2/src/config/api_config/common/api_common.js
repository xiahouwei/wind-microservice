import { put } from '@/js/api/dataSource'
import { devUrl } from '@/js/service/baseUrl'
export default {
	// 通用
	common: {
		// 刷新token
		refreshToken () {
			return put({ url: `${devUrl}/archive/token/refresh` })
		}
	}
}
