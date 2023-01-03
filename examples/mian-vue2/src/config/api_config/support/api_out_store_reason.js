import { get, post, put } from '@/js/api/dataSource'
export default {
	// 出库原因接口
	outStoreReason: {
		// 新增出库原因
		addReason () {
			return post({ url: '/archive/out_reason/v1' })
		},
		// 修改出库原因
		editReason (id) {
			return put({ url: `/archive/out_reason/v1/${id}` })
		},
		// 删除出库原因
		delete (id) {
			return put({ url: `/archive/out_reason/v1/delete/${id}`, autoSuccessMsg: true })
		},
		// 查询出库原因明细
		getReasonDetails (id) {
			return get({ url: `/archive/out_reason/v1/${id}` })
		},
		// 出库原因列表分页查询
		getReasonList () {
			return post({ url: '/archive/out_reason/v1/page' })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/archive/out_reason/v1/disable', autoSuccessMsg: true })
		},
		// 批量启用
		enabelMulity () {
			return put({ url: '/archive/out_reason/v1/enabled', autoSuccessMsg: true })
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/archive/out_reason/v1/delete', autoSuccessMsg: true })
		}
	}
}

