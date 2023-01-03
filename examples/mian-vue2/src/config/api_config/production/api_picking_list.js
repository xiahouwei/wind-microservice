import { get, post, put, del } from '@/js/api/dataSource'

export default {
	// 领料单
	pickingList: {
		// 获取生产计划 机构列表
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
			return post({ url: '/bill/pick/v1/page ' })
		},
		getDelPage () {
			return post({ url: '/bill/pick/v1/page', query: { del_flag: true } })
		},
		// 新增领料单主表
		add () {
			return post({
				url: '/bill/pick/v1',
				autoSuccessMsg: true
			})
		},
		edit (id) {
			return put({
				url: `/bill/pick/v1/${id}`,
				autoSuccessMsg: true
			})
		},
		//  获取领料单详情
		getDetails (id) {
			return get({ url: `/bill/pick/v1/${id} `, loading: false })
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
			return del({ url: `/bill/pick/v1/clear/empty/${id}`, loading: false })
		},
		// 新增明细
		addDetail (billId) {
			return post({
				url: `/bill/pick/${billId}/detail/v1`
			})
		},
		// 修改明细
		editDetail (billId, id) {
			return put({
				url: `/bill/pick/${billId}/detail/v1/${id} `
			})
		},
		// 清空明细
		clear (billId) {
			return del({ url: `/bill/pick/${billId}/detail/v1/clear` })
		},
		// 提交
		submit (id) {
			return put({ url: `/bill/pick/v1/submit/${id}`, autoSuccessMsg: true })
		},
		// 退回
		return (id) {
			return put({ url: `/bill/pick/v1/back/${id}`, autoSuccessMsg: true })
		},
		// 审核
		check (id) {
			return put({ url: `/bill/pick/v1/audit/${id}`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 反审核
		uncheck (id) {
			return put({ url: `/bill/pick/v1/unAudit/${id}`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 删除
		delete (id) {
			return put({ url: `/bill/pick/v1/delete/${id}`, autoSuccessMsg: true })
		},
		// 批量删除领料单明细
		delDetailMulity (billId) {
			return del({ url: `/bill/pick/${billId}/detail/v1/delete`, autoSuccessMsg: true })
		},
		// 批量提交生产计划
		submitMulity () {
			return post({ url: '/bill/pick/v1/batch/submit', autoSuccessMsg: true })
		},
		// 批量退回生产计划
		returnMulity () {
			return post({ url: '/bill/pick/v1/batch/back', autoSuccessMsg: true })
		},
		// 批量审核生产计划
		checkMulity () {
			return post({ url: '/bill/pick/v1/batch/audit', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量反审生产计划
		uncheckMulity () {
			return post({ url: '/bill/pick/v1/batch/unAudit', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量删除生产计划
		deleteMulity () {
			return post({ url: '/bill/pick/v1/batch/delete', autoSuccessMsg: true })
		},
		// 回收站批量恢复
		recoverMulity () {
			return post({ url: '/bill/pick/v1/batch/recovery', autoSuccessMsg: true })
		},
		// 回收站删除
		recyclingDelete (id) {
			return put({ url: `/bill/pick/v1/recycle/${id}`, autoSuccessMsg: true })
		},
		// 回收站批量删除
		recyclingDeleteMulity () {
			return post({ url: '/bill/pick/v1/batch/recycle', autoSuccessMsg: true })
		},
		// 复制单据
		copyOrder (id, continueFlag) {
			return put({ url: `/bill/pick/v1/copy/${id}` })
		},
		// 领料单退回生产计划
		backToPlan () {
			return post({ url: '/bill/pick/v1/batch/backToPlan', autoSuccessMsg: true })
		},
		// 批量领料 获取领料数据
		getPickList (id) {
			return post({ url: `/bill/pick/v1/execute_record/view/${id}`, autoSuccessMsg: true })
		},
		// 领料
		repeatPick (id) {
			return put({ url: `/bill/pick/v1/execute_record/${id}`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 领料完成
		pickComplete (id) {
			return put({ url: `/bill/pick/v1/execute_record/pickComplete/${id}`, autoSuccessMsg: true })
		},
		// 取消领料完成
		pickUnfinished (id) {
			return put({ url: `/bill/pick/v1/execute_record/pickUnfinished/${id}`, autoSuccessMsg: true })
		},
		// 完成前校验实际领料是否0
		getPickRecordList (id) {
			return get({ url: `/bill/pick/v1/execute_record/getPickRecordList/${id}` })
		},
		// 异常警告-防错校验
		checkMistake (billId) {
			return post({ url: `/bill/pick/v1/mistake_proofing/${billId}` })
		},
		// 异常警告-查询应领数量为0
		pickZeroAmount (billId) {
			return post({ url: `/bill/pick/v1/mistake_proofing/${billId}`, query: { error_check: false }, data: ['PickZeroAmount'], loading: false })
		},
		// 异常警告-仓库与品项关联关系
		belong (billId) {
			return post({ url: `/bill/pick/v1/mistake_proofing/${billId}`, query: { error_check: false }, data: ['Belong'], loading: false })
		},
		// 异常警告-仓库与品项关联关系
		repeatItem (billId) {
			return post({ url: `/bill/pick/v1/mistake_proofing/${billId}`, query: { error_check: false }, data: ['RepeatItem'], loading: false })
		},
		// 异常警告-保存合并重复品项
		saveMergeOrder (billId) {
			return put({ url: `/bill/pick/v1/merge/${billId}`, autoSuccessMsg: true })
		},
		// 单据业务链
		getBillChain (billId) {
			return get({ url: `/bill/pick/v1/${billId}/chain` })
		}
	}
}
