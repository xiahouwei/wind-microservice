import { get, post, put, del, file } from '@/js/api/dataSource'
import app from '@/main.js'
export default {
	// 快速出库方案
	quickOutPlan: {
		// {{{ 分页查询筛选条件
		// 筛选条件--获取机构tab列表
		getOrganSelectTab () {
			// 2: 'Shop' 门店, 1: 'Center' 中心
			const params = { organTypeList: [2, 1] }
			return post({ url: '/archive/organ/v1/manage/simple/tab', data: params })
		},
		// 筛选条件--获取仓库tab列表
		getHouseSelectTab () {
			// 2: 'Shop' 门店, 1: 'Center' 中心
			const params = { organTypeList: [2, 1] }
			return post({
				url: '/archive/house/v1/all/simple/tab',
				data: params,
				success: res => {
					res.forEach(item => {
						if (!item.listData) {
							item.listData = []
						}
					})
					return res
				}
			})
		},
		// 筛选条件--获取品项列表
		getItemSelect () {
			return get({ url: '/archive/item/v1/list' })
		},
		// }}}
		// 分页查询接口
		getPage () {
			return post({ url: '/plan/out/v1/page' })
		},
		// 新增接口
		add () {
			return post({
				url: '/plan/out/v1',
				data: {
					...app.vue.$fxCommon.getTenantIdParam()
				},
				autoSuccessMsg: true,
				success: res => {
					res.appendixList || (res.appendixList = [])
					return res
				}
			})
		},
		// 修改接口
		save () {
			return put({ url: '/plan/out/v1', autoSuccessMsg: true })
		},
		// 删除接口
		del (id) {
			return del({ url: `/plan/out/v1/${id}`, autoSuccessMsg: true })
		},
		// 批量启用
		enableMulity () {
			return put({ url: '/plan/out/v1/enable', autoSuccessMsg: true })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/plan/out/v1/disable', autoSuccessMsg: true })
		},
		// 查询接口
		get (id) {
			return get({
				url: `/plan/out/v1/${id}`,
				success: res => {
					res.appendixList || (res.appendixList = [])
					return res
				}
			})
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/plan/out/v1/delete', autoSuccessMsg: true })
		},
		// 删除(回收站)
		recyclingDelete (id) {
			return put({ url: `/plan/out/v1/remove/${id}`, autoSuccessMsg: true })
		},
		// 批量删除(回收站)
		recyclingDeleteMulity () {
			return put({ url: '/plan/out/v1/batch/remove', autoSuccessMsg: true })
		},
		// 批量恢复(回收站)
		recoverMulity () {
			return put({ url: '/plan/out/v1/restore', autoSuccessMsg: true })
		},
		// 批量审核
		checkMulity () {
			return put({ url: '/plan/out/v1/batch/check', autoSuccessMsg: true })
		},
		// 批量反审
		uncheckMulity () {
			return put({ url: '/plan/out/v1/batch/uncheck', autoSuccessMsg: true })
		},
		// 删除空单据接口
		delEmptyBill (id) {
			return del({ url: `/plan/out/v1/${id}`, loading: false, autoErrorMsg: false })
		},
		// 明细
		// 新增接口
		addDetails (planId, params) {
			const data = {
				planId: params.planId,
				itemId: params.item.id,
				inOrganId: params.inOrgan.id,
				inHouseId: params.inHouse.id,
				outHouseId: params.outHouse.id || '',
				outWay: params.outWay,
				memo: params.memo,
				sortNum: params.sortNum,
				...app.vue.$fxCommon.getTenantIdParam()
			}
			return post({
				url: `/plan/out_detail/${planId}/detail/v1`,
				data,
				success: res => {
					params.createMan = res.createMan
					params.createDate = res.createDate
					return res
				}
			})
		},
		// 修改接口
		saveDetails (planId, params) {
			const data = {
				id: params.id,
				planId: params.planId,
				itemId: params.item.id,
				inOrganId: params.inOrgan.id,
				inHouseId: params.inHouse.id,
				outHouseId: params.outHouse.id || '',
				outWay: params.outWay,
				memo: params.memo,
				sortNum: params.sortNum,
				createMan: params.createMan,
				createDate: params.createDate,
				...app.vue.$fxCommon.getTenantIdParam()
			}
			return put({ url: `/plan/out_detail/${planId}/detail/v1`, data })
		},
		// 删除明细接口
		delDetail (planId) {
			return put({ url: `/plan/out_detail/${planId}/detail/v1/delete`, autoSuccessMsg: true })
		},
		// 获取明细接口
		getDetailsPage (planId) {
			return get({
				url: `/plan/out_detail/${planId}/detail/v1`,
				success: res => {
					res.forEach(item => {
						item.outHouse || (item.outHouse = {})
					})
					return res
				}
			})
		},
		// 查询已经启用的品项和传入的id列表信息
		getItemList () {
			return post({ url: '/archive/plan/price/v1/item/query', loading: false })
		},
		// 查询入库机构
		getInOrganSelectList () {
			return post({
				url: '/archive/plan/v1/out_plan/organ_list',
				data: {
					names: ['Shop', 'Center']
				},
				loading: false
			})
		},
		// 审核接口
		check (id) {
			return put({ url: `/plan/out/v1/check/${id}`, autoSuccessMsg: true })
		},
		// 反审核接口
		uncheck (id) {
			return put({ url: `/plan/out/v1/uncheck/${id}`, autoSuccessMsg: true })
		},
		// 启用接口
		enable (id) {
			return put({ url: `/plan/out/v1/enable/${id}`, autoSuccessMsg: true })
		},
		// 停用接口
		disable (id) {
			return put({ url: `/plan/out/v1/disable/${id}`, autoSuccessMsg: true })
		},
		// 明细批量设置接口
		settingMulityDetails (planId) {
			return put({ url: `/plan/out_detail/${planId}/detail/v1/batch/set`, autoSuccessMsg: true })
		},
		// 导出空白模板
		exportModel (planId) {
			return get({ url: `/excel/out_plan/v1/export/model/${planId}`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 按模板导出数据
		exportData (planId) {
			return get({ url: `/excel/out_plan/v1/export/${planId}`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 根据模板导入Excel数据
		importData (planId) {
			return file({ url: `/excel/out_plan/v1/import/${planId}`, responseType: 'arraybuffer', responseComplete: true, autoSuccessMsg: true })
		}
	}
}
