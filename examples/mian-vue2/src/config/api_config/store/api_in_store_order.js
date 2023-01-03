import { get, post, put, del, file } from '@/js/api/dataSource'
import { EMPTY_TAB_DATA } from '../common'
import app from '@/main.js'
const API_MODULE = 'inStore'

export default {
	// 入库单
	inStore: {
		getPage () {
			return post({ url: '/bill/in_store/v1/page' })
		},
		getDelPage () {
			return post({ url: '/bill/in_store/v1/page', query: { del_flag: true } })
		},
		getOrganSelect () {
			return post({ url: '/archive/organ/v1/simple/all' })
		},
		// 分页查询-入库方下拉列表(tab分页数据结构)
		getOrganSelectTab (typeList = []) {
			const params = { organTypeList: ['2', '1', '5', '6'] }
			if (typeList.length > 0) {
				params.organTypeList = typeList
			}
			return post({ url: '/archive/organ/v1/manage/simple/tab', data: params })
		},
		// 分页查询-出库方下拉列表(tab分页数据结构)
		getOtherOrganSelectNoEmpty () {
			const params = { organTypeList: ['2', '1', '5', '6'] }
			return post({
				url: '/archive/organ/v1/manage/simple/tab',
				data: params
			})
		},
		// 分页查询-出库方下拉列表(tab分页数据结构)
		getOtherOrganSelect () {
			const params = { organTypeList: ['2', '1', '5', '6'] }
			return post({
				url: '/archive/organ/v1/manage/simple/tab',
				data: params,
				success: res => {
					res.push(EMPTY_TAB_DATA)
					return res
				}
			})
		},
		// 分页查询-获取入库仓库下拉列表(tab分页数据结构)
		getInhouseSelect (typeList = []) {
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
		// 分页查询-获取出库仓库下拉列表(tab分页数据结构)
		getOuthouseSelect () {
			const params = {
				organTypeList: [2, 1]
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
		getWarehouseSelect () {
			return post({ url: '/archive/house/v1/all/simple/tab' })
		},
		// 主列表筛选条件：获取品项类别关系表
		getItemTypeCascader () {
			return get({ url: '/archive/item/type/v1/tree' })
		},
		getItemSelect () {
			return get({ url: '/archive/item/v1/list' })
		},
		getItemSelectTab () {
			return get({ url: '/archive/item/v1/list/tab' })
		},
		// 分页查询-单据业务类型下拉列表
		getBillBizTypeSelect () {
			return get({ url: '/archive/bill/bill_biz_type/v1/bill_type/100', loading: false })
		},
		// 详情-根据单据种类获取可使用单据业务类型
		getBillDetailBizTypeSelect (type) {
			return post({ url: `/archive/bill/bill_biz_type/v1/bill_type/100/${type}`, loading: false })
		},
		getOrganList () {
			return post({ url: '/archive/bill/organ/v1/in_store/organ_list' })
		},
		getBilltypeSelect () {
			return get({ url: '/bill/in_store/v1/billtype' })
		},
		// 入库单退货页面单据类型接口
		getReturnBilltypeSelect () {
			return get({ url: '/bill/in_store/v1/return/billtype' })
		},
		// 获取筛选条件中订货时间的默认值
		getFilterAccountingPeriod () {
			return get({ url: '/archive/accounting_period/v1/managed_organ/begin_end' })
		},
		// 获取当前登录人及所属机构及机构的默认收货地址
		getCurrentUser () {
			return get({ url: '/archive/employee/v1/currentUser' })
		},
		// 获取经办人接口
		getAgentList () {
			return get({ url: '/archive/bill/employee/v1/all' })
		},
		add () {
			return post({
				url: '/bill/in_store/v1',
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		edit (id) {
			return put({
				url: `/bill/in_store/v1/${id}`,
				autoSuccessMsg: true,
				data: {
					...app.vue.$fxCommon.getBillUpdateVersion(API_MODULE, id),
					...app.vue.$fxCommon.getTenantIdParam()
				},
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 删除单据
		del (id) {
			return put({ url: `/bill/in_store/v1/${id}/delete`, autoSuccessMsg: true })
		},
		// 批量删除单据
		deleteMulity () {
			return put({ url: '/bill/in_store/v1/delete', autoSuccessMsg: true })
		},
		// 获取单据详情
		getBill (id) {
			return get({
				url: `/bill/in_store/v1/${id}`,
				success: res => {
					res.billBizTypeId || (res.billBizTypeId = '')
					res.details && res.details.forEach(item => {
						item.inTaxMoneyClone = Math.abs(item.inTaxMoney)
						item.inMoneyClone = Math.abs(item.inMoney)
					})
					return app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
				}
			})
		},
		// 多仓切换单仓,明细仓库查询
		checkDetailsHouse (billId) {
			return get({ url: `/bill/in_store/${billId}/detail/v1/identical/house` })
		},
		// 提交
		submit (id) {
			return put({ url: `/bill/in_store/v1/submit/${id}`, autoSuccessMsg: true })
		},
		// 批量提交
		submitMulity () {
			return put({ url: '/bill/in_store/v1/submit', autoSuccessMsg: true })
		},
		// 退回
		return (id) {
			return put({ url: `/bill/in_store/v1/back/${id}`, autoSuccessMsg: true })
		},
		// 批量退回
		returnMulity () {
			return put({ url: '/bill/in_store/v1/back', autoSuccessMsg: true })
		},
		// 审核
		check (id) {
			return put({ url: `/bill/in_store/v1/${id}/check`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 供货商评分
		supplierRate () {
			return post({
				url: '/bill/supplier_evaluate/v1',
				data: {
					...app.vue.$fxCommon.getTenantIdParam()
				},
				autoSuccessMsg: true
			})
		},
		// 批量审核
		checkMulity () {
			return put({ url: '/bill/in_store/v1/check', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 反审
		uncheck (id) {
			return put({ url: `/bill/in_store/v1/${id}/uncheck`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量反审
		uncheckMulity () {
			return put({ url: '/bill/in_store/v1/uncheck', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 复审
		recheck (id) {
			return put({ url: `/bill/in_store/v1/${id}/recheck`, autoSuccessMsg: true })
		},
		// 批量复审
		recheckMulity () {
			return put({ url: '/bill/in_store/v1/recheck', autoSuccessMsg: true })
		},
		// 取消复审
		unrecheck (id) {
			return put({ url: `/bill/in_store/v1/${id}/un_recheck`, autoSuccessMsg: true })
		},
		// 批量取消复审
		unrecheckMulity () {
			return put({ url: '/bill/in_store/v1/un_recheck', autoSuccessMsg: true })
		},
		// 发单至SRM
		sendSrm (billId) {
			return put({ url: `/bill/in_store/v1/send_return_srm/${billId}`, autoSuccessMsg: true })
		},
		// 批量发单至SRM
		sendSrmMulity () {
			return put({ url: '/bill/in_store/v1/send_return_srm', autoSuccessMsg: true })
		},
		// 批量导出
		exportMulity () {
			return post({ url: '/excel/in_store/v1/batch/export', responseType: 'arraybuffer', responseComplete: true })
		},
		// 结束并审核
		endcheck (id) {
			return put({ url: `/bill/in_store/v1/${id}/end_check`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 拆单并审核
		splitcheck (id) {
			return put({ url: `/bill/in_store/v1/${id}/split_check`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 恢复单据
		restoreMulity () {
			return put({ url: '/bill/in_store/v1/restore', autoSuccessMsg: true })
		},
		// 回收站删除单据
		remove (id) {
			return del({ url: `/bill/in_store/v1/${id}/remove`, autoSuccessMsg: true })
		},
		// 回收站批量删除单据
		removeMulity () {
			return put({ url: '/bill/in_store/v1/remove', autoSuccessMsg: true })
		},
		// 删除空单据
		delEmptyBill (id) {
			return del({ url: `/bill/in_store/v1/${id}/silent`, loading: false })
		},
		// 获取单据业务链接口
		getBillChain (id) {
			return get({ url: `/bill/in_store/v1/${id}/chain` })
		},
		// 明细
		// 查询明细
		getDetails (id) {
			return get({
				url: `/bill/in_store/v1/${id}`,
				success: res => {
					res.details && res.details.forEach(item => {
						item.inTaxMoneyClone = Math.abs(item.inTaxMoney)
						item.inMoneyClone = Math.abs(item.inMoney)
					})
					const { details } = app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
					return details
				},
				loading: false
			})
		},
		// 新增
		addDetail (billId) {
			return post({
				url: `/bill/in_store/${billId}/detail/v1`,
				data: { ...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId) },
				success: res => app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId),
				loadingType: 'circle'
			})
		},
		editDetail (billId) {
			return put({
				url: `/bill/in_store/${billId}/detail/v1`,
				data: { ...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId) },
				success: res => app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId),
				loadingType: 'circle'
			})
		},
		// 查询某机构下的所有仓库简单信息
		getDefaultHouseSelect (organId) {
			return post({ url: `/archive/house/v1/organId/${organId}`, loadingType: 'circle' })
		},
		// 获取当前用户可管辖的仓库库列表
		getValidStoreList (organId) {
			return post({ url: `/archive/bill/house/v1/organ/${organId}/houseList`, loadingType: 'circle' })
		},
		// 查询品项列表
		getItemList (billId, houseId, itemId = '', withUnit = false) {
			return get({ url: `/bill/in_store/${billId}/detail/v1/itemList/${houseId}?item_id=${itemId}&with_unit=${withUnit}`, loadingType: 'circle' })
		},
		// 查询品项列表--根据供货商进行过滤
		getSupplierItemList (billId, houseId, supplierId, itemId = '', withUnit = false) {
			return get({ url: `/bill/in_store/${billId}/detail/v1/itemList/supplier/${supplierId}/house/${houseId}?item_id=${itemId}&with_unit=${withUnit}`, loadingType: 'circle' })
		},
		// 批量新增查询品项列表
		getItemListMulity (billId, houseId) {
			return get({ url: `/bill/in_store/${billId}/detail/v1/${houseId}/item/unit/list` })
		},
		// 批量新增查询品项列表--根据供货商进行过滤
		getSupplierItemListMulity (billId, houseId, supplierId) {
			return get({ url: `/bill/in_store/${billId}/detail/v1/supplier/${supplierId}/house/${houseId}/item/unit/list` })
		},
		// 根据品项查询单位列表
		getUnitList (itemId, billId) {
			return post({ url: `/bill/in_store/${billId}/detail/v1/unitList/${itemId}`, loadingType: 'circle' })
		},
		// 批量新增明细
		addDetailsMulity (billId, data) {
			data = data.map(item => Object.assign({}, app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId), item))
			return post({ url: `/bill/in_store/${billId}/detail/v1/batch/add`, data })
		},
		// 删除单条明细
		delDetail (billId, id) {
			return del({ url: `/bill/in_store/${billId}/detail/v1/${id}`, autoSuccessMsg: true, loadingType: 'circle' })
		},
		// 批量删除明细
		delDetailMulity (billId, loading = true) {
			return put({ url: `/bill/in_store/${billId}/detail/v1/batch/delete`, autoSuccessMsg: true, loading, loadingType: 'circle' })
		},
		// 批量设置
		setMulity (billId) {
			return put({
				url: `/bill/in_store/${billId}/detail/v1/set`,
				loading: false,
				autoSuccessMsg: true,
				data: {
					...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId)
				}
			})
		},
		// 明细查询价格
		priceList (billId) {
			return post({ url: `/bill/in_store/${billId}/detail/v1/priceList`, loading: false })
		},
		// 明细清空
		clear (billId) {
			return del({ url: `/bill/in_store/${billId}/detail/v1/clear` })
		},
		// 明细查询库存
		stockAmount (billId, organId) {
			return post({ url: `/bill/in_store/${billId}/detail/v1/${organId}/stock/amount`, loading: false })
		},
		// 退货根据单位查询库存
		singleStockAmount (billId, organId) {
			return post({ url: `/bill/in_store/${billId}/detail/v1/${organId}/single/stock/amount`, loading: false })
		},
		// 获取机构当前会计期
		getAccountingPeriod (organId) {
			return get({ url: `/archive/accounting_period/v1/organ/${organId}`, loading: false })
		},
		// 获取机构货位列表
		getHouseItemLocationList (houseId, mustShowId, itemId, sysFlag) {
			return post({
				url: '/archive/bill/location/v1/location_item/list',
				loading: false,
				data: {
					houseId,
					itemId,
					showShevesDetail: true,
					mustShowLocationId: mustShowId,
					enableFlag: 1,
					sysFlag
				}
			})
		},
		// 防错校验
		// 总体查询
		checkMistake (billId, flag = true) {
			return post({
				url: `/bill/in_store/v1/mistake_proofing/${billId}`,
				query: { error_check: flag },
				success: (res) => {
					app.vue.$fxCommon.syncBillVersionByMistakeDetails(API_MODULE, billId, res)
					return res
				}
			})
		},
		// 数量为0
		getZeroAmount (billId) {
			return post({
				url: `/bill/in_store/v1/mistake_proofing/${billId}`,
				query: { error_check: false },
				data: ['ZeroAmount'],
				loading: false,
				success: (res) => {
					app.vue.$fxCommon.syncBillVersionByMistakeDetails(API_MODULE, billId, res)
					return res
				}
			})
		},
		// 单价差异
		getDiffPrice (billId) {
			return post({
				url: `/bill/in_store/v1/mistake_proofing/${billId}`,
				query: { error_check: false },
				data: ['DiffPrice'],
				loading: false,
				success: (res) => {
					app.vue.$fxCommon.syncBillVersionByMistakeDetails(API_MODULE, billId, res)
					return res
				}
			})
		},
		// 与最新价格一致
		agreement (billId) {
			return put({ url: `/bill/in_store/${billId}/detail/v1/agreement/price`, autoSuccessMsg: true })
		},
		// 查询未关联品项
		Rel (billId) {
			return post({
				url: `/bill/in_store/v1/mistake_proofing/${billId}`,
				query: { error_check: false },
				data: ['RelAllGoods'],
				loading: false,
				success: (res) => {
					app.vue.$fxCommon.syncBillVersionByMistakeDetails(API_MODULE, billId, res)
					return res
				}
			})
		},
		// 查询出库方为供货商时未关联品项
		getSupplierRefItem (billId) {
			return post({
				url: `/bill/in_store/v1/mistake_proofing/${billId}`,
				query: { error_check: false },
				data: ['SupplierItem'],
				loading: false
			})
		},
		// 导出Excel模板
		exportModal (id) {
			return get({ url: `/excel/in_store/v1/${id}/model/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 导出Excel数据
		exportData (id) {
			return get({ url: `/excel/in_store/v1/${id}/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 根据模板导入Excel数据
		importData (id) {
			return file({ url: `/excel/in_store/v1/${id}/import/model`, responseType: 'arraybuffer', responseComplete: true, autoSuccessMsg: true })
		},
		// 复制单据
		copyOrder (id) {
			return get({ url: `/bill/in_store/v1/copyInstoreBill/${id}` })
		},
		// 明细退货
		returnGoods (billId) {
			return post({ url: `/bill/in_store/v1/return/goods/${billId}` })
		},
		// 查询退货品项
		getReturnGoods () {
			return post({ url: '/bill/in_store/v1/return/goods/page' })
		},
		// 批量退货
		returnGoodsMulity () {
			return post({ url: '/bill/in_store/v1/return/goods', autoSuccessMsg: true })
		},
		// 切换仓库清空明细货位信息
		clearShelf (billId) {
			return put({ url: `/bill/in_store/${billId}/detail/v1/change_house/clear_shelf` })
		},
		// 获取导入出库单列表
		getOutStoreOrderPage () {
			return post({ url: '/bill/out_store/v1/import_create_in/page' })
		},
		// 导入出库单据生成入库单
		importOutStoreOrder () {
			return post({ url: '/bill/out_store/v1/import_create_in', autoSuccessMsg: true })
		},
		// 查询导入生成入库单明细列表
		getOutStoreDetails (billId) {
			return get({
				url: `/bill/out_store/${billId}/detail/v1/import_create_in/list`,
				success: res => {
					res.forEach(item => {
						item.inAmount = item.canImportInAmount
					})
					return res
				}
			})
		},
		// 导入出库明细生成入库单
		importOutStoreDetails () {
			return post({ url: '/bill/out_store/v1/import_create_in/detail', autoSuccessMsg: true })
		},
		// 快速出库
		fastOutStore () {
			return post({ url: '/bill/out_store/v1/quick_out', autoSuccessMsg: true })
		},
		// 快速调拨
		fastMove () {
			return post({ url: '/bill/in_store/v1/quick/allocation', autoSuccessMsg: true })
		},
		// 获取快速调拨仓库列表
		getFastMoveValidStoreList (organId, curInHouseId) {
			return post({
				url: `/archive/bill/house/v1/organ/${organId}/houseList`,
				success: res => {
					const list = res.filter(item => {
						return item.id !== curInHouseId
					})
					return list
				}
			})
		}
	}
}
