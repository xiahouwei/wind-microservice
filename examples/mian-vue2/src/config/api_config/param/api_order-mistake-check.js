import { post, get } from '@/js/api/dataSource'
export default {
	// 单据异常警告设置
	orderMistakeCheck: {
		// 新增/保存单据异常警告设置
		saveOrderMistakeCheck () {
			return post({ url: '/archive/mistake_proofing_set/v1' })
		},
		// 查询单据异常警告设置
		getOrderMistakeCheck (type) {
			return get({ url: `/archive/mistake_proofing_set/v1/${type}` })
		},
		// 查询单据异常警告设置(所有)
		getOrderMistakeCheckAll () {
			return get({ url: '/archive/mistake_proofing_set/v1' })
		}
	}
}
