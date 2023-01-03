import { get, post, put, del } from '@/js/api/dataSource'
// import app from '@/main.js'
// const API_MODULE = 'machiningOrder'

export default {
	// 加工单
	machiningOrder: {
		// 获取生产计划 机构列表
		getOrganSelectTab () {
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
		// 获取品项所有组合BOM信息
		getBomList (itemId) {
			return get({ url: `/archive/compose_bom/v1/listBom/${itemId}`, loading: false })
		},
		// 分页查询品项下拉列表tab
		getItemSelectTab () {
			return get({ url: '/archive/item/v1/list/tab' })
		},
		// 获取经办人接口
		getAgentList () {
			return get({ url: '/archive/bill/employee/v1/all' })
		},
		// 分页查询
		getPage () {
			return post({ url: '/bill/machine_compose/v1/page ' })
		},
		getDelPage () {
			return post({ url: '/bill/machine_compose/v1/page', query: { del_flag: true } })
		},
		// 新增主表
		add () {
			return post({
				url: '/bill/machine_compose/v1',
				autoSuccessMsg: true
			})
		},
		edit (id) {
			return put({
				url: `/bill/machine_compose/v1/${id}`,
				autoSuccessMsg: true
			})
		},
		//  获取加工单详情
		getDetails (id) {
			return get({ url: `/bill/machine_compose/v1/${id} `, loading: false })
		},
		//  获取计算组合BOM制造费用的换算系数
		getCountBomMachineChargeConversion (bomId, itemUnitId) {
			return get({ url: `/archive/compose_bom/v1/getCountBomMachineChargeConversion/${bomId}/itemUnit/${itemUnitId}`, loading: false })
		},
		//  生产计划中获取品项以及单位
		getItemUnitList (itemId = 0, houseId) {
			return get({ url: `/archive/bill/item/v1/production_plan/itemUnitList/${itemId}/house/${houseId} `, loading: false })
		},
		// 删除空单据
		delEmptyBill (id) {
			return del({ url: `/bill/machine_compose/v1/clear/empty/${id}`, loading: false })
		},
		// 新增成品
		addDetailProduct (billId) {
			return post({
				url: `/bill/machine_compose/${billId}/detail/v1/product`
			})
		},
		// 新增配料
		addDetailDosing  (billId) {
			return post({
				url: `/bill/machine_compose/${billId}/detail/v1/dosing`
			})
		},
		// 批量新增配料
		addDetailDosingMulity  (billId) {
			return post({
				url: `/bill/machine_compose/${billId}/detail/v1/dosing/batch/add`
			})
		},
		// 修改成品
		editDetailProduct (billId, id) {
			return put({
				url: `/bill/machine_compose/${billId}/detail/v1/product/${id} `
			})
		},
		// 修改配料
		editDetailDosing (billId, id) {
			return put({
				url: `/bill/machine_compose/${billId}/detail/v1/dosing/${id} `
			})
		},
		// 清空成品关联bom
		relationProduct (billId) {
			return del({ url: `/bill/machine_compose/${billId}/detail/v1/delete/relation_product` })
		},
		// 清空明细
		clear (billId) {
			return del({ url: `/bill/machine_compose/${billId}/detail/v1/clear` })
		},
		// 提交
		submit (id) {
			return put({ url: `/bill/machine_compose/v1/submit/${id}`, autoSuccessMsg: true })
		},
		// 退回
		return (id) {
			return put({ url: `/bill/machine_compose/v1/back/${id}`, autoSuccessMsg: true })
		},
		// 审核
		check (id) {
			return put({ url: `/bill/machine_compose/v1/check/${id}`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 反审核
		uncheck (id) {
			return put({ url: `/bill/machine_compose/v1/uncheck/${id}`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 删除
		delete (id) {
			return put({ url: `/bill/machine_compose/v1/delete/${id}`, autoSuccessMsg: true })
		},
		// 批量删除明细
		delDetailMulity (billId) {
			return del({ url: `/bill/machine_compose/${billId}/detail/v1/delete`, autoSuccessMsg: true })
		},
		// 批量提交
		submitMulity () {
			return post({ url: '/bill/machine_compose/v1/batch/submit', autoSuccessMsg: true })
		},
		// 批量退回
		returnMulity () {
			return post({ url: '/bill/machine_compose/v1/batch/back', autoSuccessMsg: true })
		},
		// 批量审核
		checkMulity () {
			return post({ url: '/bill/machine_compose/v1/batch/check', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量反审
		uncheckMulity () {
			return post({ url: '/bill/machine_compose/v1/batch/uncheck', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量删除
		deleteMulity () {
			return post({ url: '/bill/machine_compose/v1/batch/delete', autoSuccessMsg: true })
		},
		// 退回生产计划
		backToPlan () {
			return post({ url: '/bill/machine_compose/v1/batch/backToPlan', autoSuccessMsg: true })
		},
		// 回收站批量恢复
		recoverMulity () {
			return post({ url: '/bill/machine_compose/v1/batch/restore', autoSuccessMsg: true })
		},
		// 回收站删除
		recyclingDelete (id) {
			return put({ url: `/bill/machine_compose/v1/remove/${id}`, autoSuccessMsg: true })
		},
		// 回收站批量删除
		recyclingDeleteMulity () {
			return post({ url: '/bill/machine_compose/v1/batch/remove', autoSuccessMsg: true })
		},
		// 复制单据
		copyOrder (id, continueFlag) {
			return put({ url: `/bill/machine_compose/v1/copy/${id}` })
		},
		// 单据业务链
		getBillChain (id) {
			return get({ url: `/bill/machine_compose/v1/${id}/chain` })
		},
		// 其他费用类型
		other_cost_type (id = 0) {
			return get({ url: `/archive/other_cost_type/v1/list/${id}` })
		},
		// 根据bom获取原料
		getLastDosing (organId, bomId, planTotal, itemUnitId) {
			return get({ url: `/archive/compose_bom/v1/organ/${organId}/${bomId}/lastDosing/${planTotal}/itemUnit/${itemUnitId}` })
		},
		// 防错校验
		checkMistake (billId) {
			return post({ url: `/bill/machine_compose/v1/mistake_proofing/${billId}` })
		},
		// 查询未关联品项
		Rel (billId) {
			return post({ url: `/bill/in_store/v1/mistake_proofing/${billId}`, query: { error_check: false }, data: ['RelAllGoods'], loading: false })
		},
		// 查成品下的配料
		getDosing (billId, id) {
			return get({ url: `/bill/machine_compose/${billId}/detail/v1/product/${id}` })
		},
		// 异常警告-查询实际产量为0
		actualZeroAmount (billId) {
			return post({ url: `/bill/machine_compose/v1/mistake_proofing/${billId}`, query: { error_check: false }, data: ['ActualZeroAmount'], loading: false })
		},
		// 异常警告-查询重复品项
		repeatItem (billId) {
			return post({ url: `/bill/machine_compose/v1/mistake_proofing/${billId}`, query: { error_check: false }, data: ['RepeatItem'], loading: false })
		},
		// // 异常警告-警告-费用为0
		// costZero (billId) {
		// 	return post({ url: `/bill/machine_compose/v1/mistake_proofing/${billId}`, query: { error_check: false }, data: ['CostZero'], loading: false })
		// }
		// 异常警告-成品未添加配料
		productNotHaveDosing (billId) {
			return post({ url: `/bill/machine_compose/v1/mistake_proofing/${billId}`, query: { error_check: false }, data: ['ProductNotHaveDosing'], loading: false })
		},
		// 导出Excel数据
		exportData (id) {
			return get({ url: `/excel/machine_compose/v1/export/${id}`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 批量导出
		exportMulity () {
			return post({ url: '/excel/machine_compose/v1/batch/export', responseType: 'arraybuffer', responseComplete: true })
		}
	}
}
