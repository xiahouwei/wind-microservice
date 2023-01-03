import { get } from '@/js/api/dataSource'
export default {
	// 极速订接口
	biubiuorder: {
		// 获取极速订地址
		getBiubiuorderUrl () {
			return get({ url: '/param/config/v1/jsd/url', loading: false })
		}
	}
}
