import { get, post, put, del } from '@/js/api/dataSource'
import stypeMiddleware from '@/js/typeMiddleware'
export default {
	// 客户接口
	customer: {
		// {{{ 主列表筛选条件
		// 获取客户列表
		getFilterCustomerSelectList () {
			return post({ url: '/archive/customer/v1/page/organ/tab', data: [6], loading: false })
		},
		// }}}
		// 查询客户详情
		getDetails (id) {
			return get({ url: `/archive/customer/v1/${id}` })
		},
		// 查询客户详情(回收站)
		getDetailsRecycling (id) {
			return get({ url: `/archive/customer/v1/recycle_bin/${id}` })
		},
		// 获取客户树数据
		getCustomTree (id) {
			return get({ url: '/archive/customer/v1/tree' })
		},
		// 分页查询客户list
		getCustomList () {
			return post({ url: '/archive/customer/v1/page' })
		},
		// 分页查询客户list(回收站)
		getCustomListRecycling () {
			return post({ url: '/archive/customer/v1/page', query: { del_flag: true } })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/archive/customer/v1/disable', autoSuccessMsg: true })
		},
		// 批量启用
		enabelMulity () {
			return put({ url: '/archive/customer/v1/enable', autoSuccessMsg: true })
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/archive/customer/v1/delete', autoSuccessMsg: true })
		},
		// 批量删除(回收站)
		recyclingDeleteMulity () {
			return put({ url: '/archive/customer/v1/delete', query: { realDel: true }, autoSuccessMsg: true })
		},
		// 恢复客户(回收站)
		recover (organType, id) {
			return put({ url: `/archive/customer/v1/restore/${organType}/${id}`, autoSuccessMsg: true })
		},
		// 批量恢复客户(回收站)
		recoverMulity () {
			return put({ url: '/archive/customer/v1/restore', autoSuccessMsg: true })
		},
		// excel 导出
		exportData () {
			return get({ url: '/excel/organ/v1/customer/export', responseType: 'arraybuffer', responseComplete: true })
		},
		// 修改客户
		saveDetails (id) {
			return put({ url: `/archive/customer/v1/${id}`, autoSuccessMsg: true })
		},
		// 新增客户
		add (id) {
			return post({ url: '/archive/customer/v1/', autoSuccessMsg: true })
		},
		// 删除
		delete (organType, id) {
			return del({ url: `/archive/customer/v1/${organType}/${id}`, autoSuccessMsg: true })
		},
		// 删除(回收站)
		recyclingDelete (organType, id) {
			return del({ url: `/archive/customer/v1/${organType}/${id}`, query: { realDel: true }, autoSuccessMsg: true })
		},
		// 查询某机构下的所有仓库简单信息
		getDefaultHouseSelect (organId) {
			return post({ url: `/archive/house/v1/organId/${organId}` })
		},
		// 修改机构与品项关联关系接口
		saveConnectItem (typeId, id) {
			const type = stypeMiddleware.getCommonTypeItemById('supplierType')(typeId).type
			switch (type) {
			case 'store':
				return put({ url: `/archive/house/v1/customer/itemhouse/${id}`, autoSuccessMsg: true })
			case 'section':
				return put({ url: `/archive/itemdepartment/v1/customer/department/${id}`, autoSuccessMsg: true })
			}
		},
		getCustomerExcludeId (typeId, id) {
			const type = stypeMiddleware.getCommonTypeItemById('organType')(typeId).type
			switch (type) {
			case 'store':
				return get({ url: `/archive/house/v1/customer/itemhouse/except/${id}/all` })
			case 'section':
				return get({ url: `/archive/itemdepartment/v1/customer/department/except/${id}` })
			}
		},
		copyConnectOrgan2Organ (typeId, sourceId, targetId) {
			const type = stypeMiddleware.getCommonTypeItemById('organType')(typeId).type
			switch (type) {
			case 'store':
				return put({ url: `/archive/house/v1/customer/itemhouse/${sourceId}/copy/${targetId}`, autoSuccessMsg: true })
			case 'section':
				return put({ url: `/archive/itemdepartment/v1/customer/department/${sourceId}/copy/${targetId}`, autoSuccessMsg: true })
			}
		},
		copyConnectWithSection (typeId, id) {
			const type = stypeMiddleware.getCommonTypeItemById('organType')(typeId).type
			switch (type) {
			case 'store':
				return put({ url: `/archive/house/v1/customer/itemhouse/${id}/copy`, autoSuccessMsg: true })
			case 'section':
				return put({ url: `/archive/itemdepartment/v1/customer/department/copy/${id}`, autoSuccessMsg: true })
			}
		},
		// 根据客户id查询可关联的订货方案
		getCustomerStockPlan (id) {
			return get({ url: `/plan/stock/v1/${id}/list` })
		},
		// 获取多个客户订货方案(交集)
		getStockPlanList () {
			return post({ url: '/plan/stock/v1/customer/unite_list', loading: false })
		},
		// 批量设置
		settingMulity () {
			return post({ url: '/archive/customer/v1/batch/setting' })
		}
	}
}
