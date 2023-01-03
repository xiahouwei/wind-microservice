import { post, get } from '@/js/api/dataSource'
export default {
	// 单据必填设置
	orderRequired: {
		// 新增/保存单据必填项设置
		saveOrderRequired () {
			return post({ url: '/archive/must_fill_set/v1' })
		},
		// 查询单据必填项
		getOrderRequired (type) {
			return get({ url: `/archive/must_fill_set/v1/${type}` })
		},
		// 查询单据必填项(所有)
		getOrderRequiredAll () {
			return get({ url: '/archive/must_fill_set/v1' })
		}
	}
}
