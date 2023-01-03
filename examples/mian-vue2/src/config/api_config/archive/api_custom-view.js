import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 自定义查询显示列
	customView: {
		// 新增
		add () {
			return post({ url: '/archive/custom_view/v1', autoSuccessMsg: true })
		},
		// 修改
		save (id) {
			return put({ url: `/archive/custom_view/v1/${id}`, autoSuccessMsg: true })
		},
		// 清空
		clear (type) {
			return del({ url: `/archive/custom_view/v1/${type}`, autoSuccessMsg: true })
		},
		// 获取
		get (type) {
			return get({ url: `/archive/custom_view/v1/${type}` })
		},
		// 获取全部
		getAll () {
			return get({ url: '/archive/custom_view/v1' })
		}
	}
}
