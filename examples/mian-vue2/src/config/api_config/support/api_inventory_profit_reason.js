import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 盘盈原因接口
	inventoryProfitReason: {
		// 新增盘盈原因
		addReason () {
			return post({ url: '/bill/check/cause/v1' })
		},
		// 修改盘盈原因
		editReason (id) {
			return put({ url: `/bill/check/cause/v1/${id}` })
		},
		// 删除盘盈原因
		delete (id) {
			return del({ url: `/bill/check/cause/v1/${id}`, autoSuccessMsg: true })
		},
		// 查询盘盈原因明细
		getReasonDetails (id) {
			return get({ url: `/bill/check/cause/v1/${id}` })
		},
		// 盘盈原因列表分页查询
		getReasonList () {
			return post({ url: '/bill/check/cause/v1/page' })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/bill/check/cause/v1/disable', autoSuccessMsg: true })
		},
		// 批量启用
		enabelMulity () {
			return put({ url: '/bill/check/cause/v1/enable', autoSuccessMsg: true })
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/bill/check/cause/v1/delete', autoSuccessMsg: true })
		}
	}
}

