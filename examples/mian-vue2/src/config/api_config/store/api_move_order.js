import { get, post, put, del, file } from '@/js/api/dataSource'
import { EMPTY_TAB_DATA } from '../common'
import app from '@/main.js'
const API_MODULE = 'moveOrder'

export default {
	// 调拨单
	moveOrder: {
		// 分页查询接口
		getPage () {
			return post({ url: '/bill/move_apply/v1/page', query: { del_flag: false } })
		},
		// 回收站分页查询
		getPageRecycling () {
			return post({ url: '/bill/move_apply/v1/page', query: { del_flag: true } })
		},
		// 批量退回
		returnMulity () {
			return put({ url: '/bill/move_apply/v1/back', autoSuccessMsg: true })
		},
		// 批量提交
		submitMulity () {
			return put({ url: '/bill/move_apply/v1/submit', autoSuccessMsg: true })
		},
		// 删除空单据接口
		delEmptyBill (id) {
			return del({ url: `/bill/move_apply/v1/${id}/silent`, loading: false, autoErrorMsg: false })
		},
		// 批量复审
		recheckMulity () {
			return put({ url: '/bill/move_apply/v1/recheck', autoSuccessMsg: true })
		},
		// 批量取消复审
		unrecheckMulity () {
			return put({ url: '/bill/move_apply/v1/un_recheck', autoSuccessMsg: true })
		},
		// 批量删除单据
		deleteMulity () {
			return put({ url: '/bill/move_apply/v1/delete', autoSuccessMsg: true })
		},
		// 回收站还原
		recover (id) {
			return put({ url: `/bill/move_apply/v1/${id}/restore`, autoSuccessMsg: true })
		},
		// 回收站批量还原
		recoverMulity () {
			return put({ url: '/bill/move_apply/v1/restore', autoSuccessMsg: true })
		},
		// 回收站删除
		recyclingDelete (id) {
			return del({ url: `/bill/move_apply/v1/${id}`, autoSuccessMsg: true })
		},
		// 回收站批量删除
		recyclingDeleteMulity () {
			return put({ url: '/bill/move_apply/v1/remove', autoSuccessMsg: true })
		},
		// 获取经办人接口
		getAgentList () {
			return get({ url: '/archive/bill/employee/v1/all' })
		},
		// 新增调拨单
		add () {
			return post({
				url: '/bill/move_apply/v1',
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 修改调拨单
		save (id) {
			return put({
				url: `/bill/move_apply/v1/${id}`,
				autoSuccessMsg: true,
				data: {
					...app.vue.$fxCommon.getBillUpdateVersion(API_MODULE, id),
					...app.vue.$fxCommon.getTenantIdParam()
				},
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 查询某机构下的所有仓库简单信息
		getDefaultHouseSelect (organId) {
			return post({ url: `/archive/house/v1/organId/${organId}` })
		},
		// 审核店内调拨单
		checkIn (id) {
			return put({ url: `/bill/move_apply/v1/${id}/in/check`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 反审店内调拨单
		uncheckIn (id) {
			return put({ url: `/bill/move_apply/v1/${id}/in/uncheck`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 反审生产领料类型调拨单
		uncheckPick (id) {
			return put({ url: `/bill/move_apply/v1/${id}/pick/uncheck`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量反审
		uncheckMulity () {
			return put({ url: '/bill/move_apply/v1/uncheck', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量审核
		checkMulity () {
			return put({ url: '/bill/move_apply/v1/check', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量同意
		agreeMulity () {
			return put({ url: '/bill/move_apply/v1/agree/batch', autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 批量拒绝
		rejectMulity () {
			return put({ url: '/bill/move_apply/v1/reject/batch', autoSuccessMsg: true })
		},
		// 同意
		agree (billId) {
			return put({
				url: `/bill/move_apply/v1/agree/${billId}`,
				autoSuccessMsg: true,
				autoErrorMsg: false,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 拒绝
		reject (billId) {
			return put({
				url: `/bill/move_apply/v1/reject/${billId}`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 获取当前登录人有无申请方与被申请方的管理权限
		getBtnAuth (billId) {
			return get({ url: `/bill/move_apply/v1/current_user_auth/${billId}` })
		},
		// 获取单据业务链接口
		getBillChain (id) {
			return get({ url: `/bill/move_apply/v1/${id}/chain` })
		},
		// {{{ 明细
		// 提交
		submit (billId) {
			return put({
				url: `/bill/move_apply/v1/${billId}/submit`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 退回
		return (billId) {
			return put({
				url: `/bill/move_apply/v1/${billId}/back`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 复审
		recheck (billId) {
			return put({
				url: `/bill/move_apply/v1/${billId}/recheck`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 取消复审
		unrecheck (billId) {
			return put({
				url: `/bill/move_apply/v1/${billId}/un_recheck`,
				autoSuccessMsg: true,
				success: res => app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
			})
		},
		// 删除接口
		del (billId) {
			return put({ url: `/bill/move_apply/v1/${billId}/delete`, autoSuccessMsg: true })
		},
		// 查询明细
		getDetails (billId) {
			return get({
				url: `/bill/move_apply/v1/${billId}`,
				success: (res) => {
					const { details } = app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
					details.forEach(item => {
						item.inHouse || (item.inHouse = { id: '' })
						item.outHouse || (item.outHouse = { id: '' })
					})
					return details || []
				}
			})
		},
		// 多仓切换单仓,明细仓库查询
		checkDetailsHouse (billId, houseType) {
			return get({ url: `/bill/move_apply/${billId}/detail/v1/${houseType}/identical/house` })
		},
		// 根据id查询单据详情
		get (id) {
			return get({
				url: `/bill/move_apply/v1/${id}`,
				success: res => {
					res.otherOrgan || (res.otherOrgan = { id: '' })
					res.inHouse || (res.inHouse = { id: '' })
					res.otherHouse || (res.otherHouse = { id: '' })
					res.appendixList || (res.appendixList = [])
					res.details.forEach(item => {
						item.inHouse || (item.inHouse = { id: '' })
						item.outHouse || (item.outHouse = { id: '' })
					})
					return app.vue.$fxCommon.normalizationBillUpdateVersion(API_MODULE, res)
				}
			})
		},
		// 新增单条明细
		addDetails (billId) {
			return post({
				url: `/bill/move_apply/${billId}/detail/v1`,
				data: { ...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId) },
				success: res => app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId),
				loadingType: 'circle'
			})
		},
		// 保存单条明细
		saveDetails (billId, id) {
			return put({
				url: `/bill/move_apply/${billId}/detail/v1/${id}`,
				data: { ...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId) },
				success: res => app.vue.$fxCommon.normalizationBillDetailUpdateVersion(API_MODULE, res, billId),
				loadingType: 'circle'
			})
		},
		// 删除单条明细
		delDetail (billId, detailId) {
			return del({ url: `/bill/move_apply/${billId}/detail/v1/${detailId}`, autoSuccessMsg: true, loadingType: 'circle' })
		},
		// 批量新增明细
		addDetailsMulity (billId, data) {
			data = data.map(item => Object.assign({}, app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId), item))
			return post({ url: `/bill/move_apply/${billId}/detail/v1/add`, data, autoSuccessMsg: true })
		},
		// 批量删除明细
		delDetailMulity (billId) {
			return put({ url: `/bill/move_apply/${billId}/detail/v1/delete`, autoSuccessMsg: true, loadingType: 'circle' })
		},
		// 根据单据id清空单据明细
		clearDetails (billId) {
			return put({ url: `/bill/move_apply/${billId}/detail/v1/delete`, data: [], autoSuccessMsg: true })
		},
		// 审核店间调拨
		checkOut (id) {
			return put({ url: `/bill/move_apply/v1/${id}/out/check`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 反审店间调拨
		uncheckOut (id) {
			return put({ url: `/bill/move_apply/v1/${id}/out/uncheck`, autoSuccessMsg: true, autoErrorMsg: false })
		},
		// 根据仓库查询品项接口
		getItemByStore (billId, houseId, itemId = 0) {
			return get({ url: `/bill/move_apply/${billId}/detail/v1/house/${houseId}/itemList/${itemId}`, loadingType: 'circle' })
		},
		// 查询全部品项
		getItemAll (billId) {
			return get({ url: `/bill/move_apply/${billId}/detail/v1/itemList`, loadingType: 'circle' })
		},
		// 根据品项获取单位列表
		getItemUnitList (billId, itemId) {
			return post({ url: `/bill/move_apply/${billId}/detail/v1/unitList/${itemId}`, loadingType: 'circle' })
		},
		// 批量设置明细
		settingMulity (billId) {
			return put({
				url: `/bill/move_apply/${billId}/detail/v1/set`,
				loading: false,
				autoSuccessMsg: true,
				data: {
					...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId)
				}
			})
		},
		// 导出空白模板
		exportModel (billId) {
			return get({ url: `/excel/move_apply/v1/${billId}/model/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 按模板导出数据
		exportData (billId) {
			return get({ url: `/excel/move_apply/v1/${billId}/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 根据模板导入Excel数据
		importData (id) {
			return file({ url: `/excel/move_apply/v1/${id}/import/model`, responseType: 'arraybuffer', responseComplete: true, autoSuccessMsg: true })
		},
		// 清空明细出库仓库
		clearDetailsOutstore (billId) {
			return put({
				url: `/bill/move_apply/${billId}/detail/v1/batch_set/house`,
				data: {
					inOrOut: 0,
					houseId: '',
					...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId)
				}
			})
		},
		// 清空明细入库仓库
		clearDetailsInstore (billId) {
			return put({
				url: `/bill/move_apply/${billId}/detail/v1/batch_set/house`,
				data: {
					inOrOut: 1,
					houseId: '',
					...app.vue.$fxCommon.getBillDetailUpdateVersion(API_MODULE, billId)
				}
			})
		},
		// 明细查询库存
		stockAmount (billId, organId, otherOrganId) {
			return post({ url: `/bill/move_apply/${billId}/detail/v1/${organId}/${otherOrganId}/stock/amount`, loading: false })
		},
		// 获取当前用户可管辖的仓库库列表
		getValidStoreList (organId) {
			return post({ url: `/archive/bill/house/v1/organ/${organId}/houseList`, loadingType: 'circle' })
		},
		// 出库方申请的调拨单，审核后，选择入库仓库时，根据品项进行仓库反查
		getValidOrganItemInStoreList (data) {
			return post({ url: '/archive/bill/house/v1/organ_item/houseList', data })
		},
		// }}}
		// {{{ 查询
		// 分页查询-入库方下拉列表(tab分页数据结构)
		getInOrganSelect () {
			const params = { organTypeList: ['2', '1'] }
			return post({ url: '/archive/organ/v1/manage/simple/tab', data: params })
		},
		// 分页查询-出库方下拉列表(tab分页数据结构)
		getOutOrganSelect () {
			const params = { organTypeList: ['2', '1'] }
			return post({ url: '/archive/organ/v1/manage/simple/tab', data: params })
		},
		// 主列表筛选条件：获取品项类别关系表
		getItemTypeCascader () {
			return get({ url: '/archive/item/type/v1/tree' })
		},
		// 分页查询品项下拉列表
		getItemSelect () {
			return get({ url: '/archive/item/v1/list' })
		},
		// 分页查询品项下拉列表tab
		getItemSelectTab () {
			return get({ url: '/archive/item/v1/list/tab' })
		},
		// 分页查询-获取入库仓库下拉列表(tab分页数据结构)
		getInhouseSelect () {
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
					res.push(EMPTY_TAB_DATA)
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
					res.push(EMPTY_TAB_DATA)
					return res
				}
			})
		},
		// 分页查询-单据业务类型下拉列表
		getBillBizTypeSelect () {
			return get({ url: '/archive/bill/bill_biz_type/v1/bill_type/103', data: [] })
		},
		// 详情-根据单据种类获取可使用单据业务类型
		getBillDetailBizTypeSelect (type) {
			return post({ url: `/archive/bill/bill_biz_type/v1/bill_type/103/${type}`, loading: false })
		},
		// 分页查询-单据类型下拉列表
		getBilltypeSelect () {
			return get({ url: '/bill/move_apply/v1/types' })
		},
		//  获取入库方/出库下拉列表(tab)数据
		getOrganTabList (ids) {
			const params = { ids, names: ['Shop', 'Center'] }
			return post({ url: '/archive/bill/organ/v1/in_store/organ_list', data: params })
		},
		//  获取入库方/出库下拉列表(tab)数据(全部已启用机构)
		getAllOrganTabList (ids) {
			const params = { organIdList: ids, organTypeList: [2, 1], enableFlag: 1 }
			return post({ url: '/archive/organ/v1/all/simple/tab', data: params })
		},
		// }}}
		// {{{
		// 防错校验
		// 提交前的防错校验接口
		checkMistake (billId) {
			return post({
				url: `/bill/move_apply/v1/mistake_proofing/${billId}`,
				success: (res) => {
					app.vue.$fxCommon.syncBillVersionByMistakeDetails(API_MODULE, billId, res)
					return res
				}
			})
		},
		// 删除重复品项
		delCheckDetailsMulity (billId) {
			return put({ url: `/bill/move_apply/${billId}/detail/v1/delete` })
		},
		// 查询仓库未关联品项
		getRel (billId) {
			return post({
				url: `/bill/move_apply/v1/mistake_proofing/${billId}`,
				query: { error_check: false },
				data: ['Belong'],
				success: (res) => {
					app.vue.$fxCommon.syncBillVersionByMistakeDetails(API_MODULE, billId, res)
					return res
				}
			})
		},
		// 查询调拨数量为0的品项
		getZeroAmount (billId) {
			return post({
				url: `/bill/move_apply/v1/mistake_proofing/${billId}`,
				query: { error_check: false },
				data: ['ZeroAmount'],
				success: (res) => {
					app.vue.$fxCommon.syncBillVersionByMistakeDetails(API_MODULE, billId, res)
					return res
				}
			})
		},
		// }}}
		// 复制单据
		copyOrder (id) {
			return get({ url: `/bill/move_apply/v1/copyMoveApply/${id}` })
		}
	}
}
