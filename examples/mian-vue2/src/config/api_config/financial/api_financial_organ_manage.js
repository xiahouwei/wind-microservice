import { get, post, put } from '@/js/api/dataSource'
import app from '@/main.js'
export default {
	// 财务档案-机构管理列表接口
	financialOrgan: {
		// {{{ 主列表筛选条件
		// 获取机构列表
		getFilterOrganSelectList () {
			return post({ url: '/finance/cw_organ/v1/search', data: { changeToTab: true }, loading: false })
		},
		// }}}
		// 机构列表分页查询
		getOrganList () {
			return post({ url: '/finance/cw_organ/v1/page' })
		},
		// 修改机构详情
		saveOrganDetails () {
			return put({ url: '/finance/cw_organ/v1', autoSuccessMsg: true })
		},
		// 查询机构信息
		getOrganDetails (id) {
			return get({ url: `/finance/cw_organ/v1/${id}` })
		},
		// 查询机构结算信息
		getDetails (id) {
			return get({
				url: `/finance/cw_organ/v1/${id}`,
				success: res => {
					return res.settlementWayList || []
				}
			})
		},
		// 批量启用机构
		organEnable () {
			return put({ url: '/finance/cw_organ/v1/enable', autoSuccessMsg: true })
		},
		// 批量停用机构
		organDisable () {
			return put({ url: '/finance/cw_organ/v1/disable', autoSuccessMsg: true })
		},
		// 批量导入
		importMulity () {
			return post({ url: '/finance/cw_organ/v1/sync', autoSuccessMsg: true })
		},
		// 获取结算方式列表
		getSettlementWayList () {
			return post({ url: '/finance/settlement/v1/search', data: { enableFlag: 1, hasSysDefault: true }, loading: false })
		},
		// 新增机构结算信息
		addDetail (detailInfo) {
			return post({
				url: '/finance/cw_organ_settlement_way/v1',
				data: {
					...detailInfo,
					...app.vue.$fxCommon.getTenantIdParam()
				},
				success: res => {
					detailInfo.createDate = res.createDate
					detailInfo.createMan = res.createMan
					return res
				}
			})
		},
		// 编辑机构结算信息
		editDetail () {
			return put({ url: '/finance/cw_organ_settlement_way/v1' })
		},
		// 批量删除机构结算信息
		delDetailMulity () {
			return post({ url: '/finance/cw_organ_settlement_way/v1/delete', autoSuccessMsg: true })
		},
		// excel 导出
		exportData () {
			return get({ url: '/excel/organ/v1/organ/export', responseType: 'arraybuffer', responseComplete: true })
		}
	}
}
