import { get, post, put, del } from '@/js/api/dataSource'

export default {
	// 生产计划
	productionPlan: {
		// 分页查询-机构下拉列表(tab分页数据结构)
		getFilterOrganSelectList () {
			const params = { organTypeList: ['1'] }
			return post({
				url: '/archive/organ/v1/manage/simple/tab',
				data: params,
				success: res => {
					return res
				}
			})
		},
		// 分页查询-获取仓库下拉列表(tab分页数据结构)
		getHouseSelect (typeList = []) {
			const params = {
				organTypeList: [2, 1, 5, 6]
			}
			if (typeList.length > 0) {
				params.organTypeList = typeList
			}
			return post({
				url: '/archive/house/v1/manage/simple/tab',
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
		getItemSelectTab () {
			return get({ url: '/archive/item/v1/list/tab' })
		},
		// 获取经办人接口
		getAgentList () {
			return get({ url: '/archive/bill/employee/v1/all' })
		},
		// 获取品项所有组合BOM信息
		getBomList (itemId) {
			return get({ url: `/archive/compose_bom/v1/listBom/${itemId}`, loading: false })
		},
		// 生产计划分页查询
		getPage () {
			return post({ url: '/bill/production_plan/v1/page' })
		},
		getDelPage () {
			return post({ url: '/bill/production_plan/v1/page', query: { del_flag: true } })
		},
		// 新增生产计划主表
		add () {
			return post({
				url: '/bill/production_plan/v1',
				autoSuccessMsg: true
			})
		},
		edit (id) {
			return put({
				url: `/bill/production_plan/v1/${id}`,
				autoSuccessMsg: true
			})
		},
		//  查询
		getDetails (id) {
			return get({ url: `/bill/production_plan/v1/${id} `, loading: false })
		},
		//  生产计划中获取品项以及单位
		getItemUnitList (itemId = 0, houseId) {
			return get({ url: `/archive/bill/item/v1/production_plan/itemUnitList/${itemId}/house/${houseId} `, loading: false })
		},
		// 获取中心下车间列表
		getWorkshopList (centerId) {
			return get({ url: `/archive/workshop/v1/organ/${centerId}/emp/workshopList`, loading: false })
		},
		// 删除空单据
		delEmptyBill (id) {
			return del({ url: `/bill/production_plan/v1/clear/empty/${id}`, loading: false })
		},
		// 新增明细
		addDetail (billId) {
			return post({
				url: `/bill/production_plan/${billId}/detail/v1`
			})
		},
		// 修改明细
		editDetail (billId, id) {
			return put({
				url: `/bill/production_plan/${billId}/detail/v1/${id} `
			})
		},
		// 清空明细
		clear (billId) {
			return del({ url: `/bill/production_plan/${billId}/detail/v1/clear` })
		},
		// 提交
		submit (id) {
			return put({ url: `/bill/production_plan/v1/submit/${id}`, autoSuccessMsg: true })
		},
		// 退回
		return (id) {
			return put({ url: `/bill/production_plan/v1/back/${id}`, autoSuccessMsg: true })
		},
		// 审核
		check (id) {
			return put({ url: `/bill/production_plan/v1/audit/${id}`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 反审核
		uncheck (id) {
			return put({ url: `/bill/production_plan/v1/unAudit/${id}`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 删除
		delete (id) {
			return put({ url: `/bill/production_plan/v1/delete/${id}`, autoSuccessMsg: true })
		},
		// 批量删除生产计划明细
		delDetailMulity (billId) {
			return del({ url: `/bill/production_plan/${billId}/detail/v1/delete`, autoSuccessMsg: true })
		},
		// 批量提交生产计划
		submitMulity () {
			return post({ url: '/bill/production_plan/v1/batch/submit', autoSuccessMsg: true })
		},
		// 批量退回生产计划
		returnMulity () {
			return post({ url: '/bill/production_plan/v1/batch/back', autoSuccessMsg: true })
		},
		// 批量审核生产计划
		checkMulity () {
			return post({ url: '/bill/production_plan/v1/batch/audit', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量反审生产计划
		uncheckMulity () {
			return post({ url: '/bill/production_plan/v1/batch/unAudit', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量删除生产计划
		deleteMulity () {
			return post({ url: '/bill/production_plan/v1/batch/delete', autoSuccessMsg: true })
		},
		// 回收站批量恢复
		recoverMulity () {
			return post({ url: '/bill/production_plan/v1/batch/recovery', autoSuccessMsg: true })
		},
		// 回收站删除
		recyclingDelete (id) {
			return put({ url: `/bill/production_plan/v1/recycle/${id}`, autoSuccessMsg: true })
		},
		// 回收站批量删除
		recyclingDeleteMulity () {
			return post({ url: '/bill/production_plan/v1/batch/recycle', autoSuccessMsg: true })
		},
		// 复制单据
		copyOrder (id, continueFlag) {
			return put({ url: `/bill/production_plan/v1/copy/${id}` })
		},
		// 生成领料单
		createPick () {
			return post({ url: '/bill/production_plan/v1/batch/create/pick', autoSuccessMsg: true })
		},
		// 生成加工单
		createMachineCompose () {
			return post({ url: '/bill/production_plan/v1/batch/create/machineCompose', autoSuccessMsg: true })
		},
		// 单据业务链
		getBillChain (id) {
			return get({ url: `/bill/production_plan/v1/${id}/chain` })
		},
		// 获取当前机构是否开通了指定子产品
		getListSubProduct () {
			return post({ url: '/archive/organ_sub/v1/query/getListSubProduct' })
		},
		// 获取工艺路线
		getListLine () {
			return post({ url: '/bill/production_plan/v1/production/getListLine' })
		},
		// 生成工序任务
		createProcedureTask () {
			return post({ url: '/bill/production_plan/v1/batch/create/procedureTask', autoSuccessMsg: true })
		},
		// 获取当前登录人及所属机构
		getCurrentUser () {
			return get({ url: '/archive/employee/v1/currentUser', loading: false })
		},
		// 获取精益生产（MES）地址
		getMesUrl () {
			return get({ url: '/param/config/v1/mes/url', loading: false })
		}
	}
}
