import { get, post, put } from '@/js/api/dataSource'
export default {
	// 财务档案-结算方式接口
	settlementWay: {
		// 结算方式列表分页查询
		getPageList () {
			return post({ url: '/finance/settlement/v1/page' })
		},
		// 获取结算方式编号
		getCode () {
			return get({ url: '/finance/settlement/v1/code' })
		},
		// 新增
		addDetails () {
			return post({ url: '/finance/settlement/v1', autoSuccessMsg: true })
		},
		// 修改详情
		saveDetails (id) {
			return put({ url: `/finance/settlement/v1/${id}`, autoSuccessMsg: true })
		},
		// 查询详情
		getDetails (id) {
			return get({ url: `/finance/settlement/v1/${id}` })
		},
		// 批量启用结算方式
		onEnable () {
			return put({ url: '/finance/settlement/v1/enable', autoSuccessMsg: true })
		},
		// 批量停用结算方式
		onDisable () {
			return put({ url: '/finance/settlement/v1/disable', autoSuccessMsg: true })
		},
		// excel 导出
		exportData () {
			return get({ url: '/excel/organ/v1/organ/export', responseType: 'arraybuffer', responseComplete: true })
		}
	}
}
