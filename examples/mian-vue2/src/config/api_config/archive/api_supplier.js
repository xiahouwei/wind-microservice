import { get, post, put, del } from '@/js/api/dataSource'
import stypeMiddleware from '@/js/typeMiddleware'
export default {
	// 供货商接口
	supplier: {
		// {{{ 主列表筛选条件
		// 获取供货商列表
		getFilterSupplierSelectList () {
			return post({ url: '/archive/supplier/v1/page/organ/tab', data: [5], loading: false })
		},
		// }}}
		// 查询供货商详情
		getSupplierDetails (id) {
			return get({ url: `/archive/supplier/v1/${id}` })
		},
		// 查询供货商详情(回收站)
		getSupplierDetailsRecycling (id) {
			return get({ url: `/archive/supplier/v1/recycle_bin/${id}` })
		},
		// 修改供货商详情
		saveDetails (id) {
			return put({ url: `/archive/supplier/v1/${id}`, autoSuccessMsg: true })
		},
		// 新增供货商
		add (id) {
			return post({ url: '/archive/supplier/v1/', autoSuccessMsg: true })
		},
		// 获取 供货商树 数据
		getSupplierTree () {
			return get({ url: '/archive/supplier/v1/tree' })
		},
		// 供货商列表分页查询
		getSupplierList () {
			return post({ url: '/archive/supplier/v1/page' })
		},
		// 供货商列表分页查询(回收站)
		getSupplierListRecycling () {
			return post({ url: '/archive/supplier/v1/page', query: { del_flag: true } })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/archive/supplier/v1/disable', autoSuccessMsg: true })
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/archive/supplier/v1/delete', autoSuccessMsg: true })
		},
		// 批量删除(回收站)
		recyclingDeleteMulity () {
			return put({ url: '/archive/supplier/v1/delete', query: { realDel: true }, autoSuccessMsg: true })
		},
		// 恢复供货商(回收站)
		recover (organType, id) {
			return put({ url: `/archive/supplier/v1/restore/${organType}/${id}`, autoSuccessMsg: true })
		},
		// 批量恢复供货商(回收站)
		recoverMulity () {
			return put({ url: '/archive/supplier/v1/restore', autoSuccessMsg: true })
		},
		// 批量启用
		enabelMulity () {
			return put({ url: '/archive/supplier/v1/enable', autoSuccessMsg: true })
		},
		// excel 导出
		exportData () {
			return get({ url: '/excel/organ/v1/supplier/export', responseType: 'arraybuffer', responseComplete: true })
		},
		// 获取上级机构list
		getFatherList (organLevel, id = 0) {
			return post({ url: `/archive/supplier/v1/${organLevel}/${id}/fathers` })
		},
		// 删除
		delete (organType, id) {
			return del({ url: `/archive/supplier/v1/${organType}/${id}`, autoSuccessMsg: true })
		},
		// 删除(回收站)
		recyclingDelete (organType, id) {
			return del({ url: `/archive/supplier/v1/${organType}/${id}`, query: { realDel: true }, autoSuccessMsg: true })
		},
		// 查询某机构下的所有仓库简单信息
		getDefaultHouseSelect (organId) {
			return post({ url: `/archive/house/v1/organId/${organId}` })
		},
		// 修改机构与品项关联关系接口
		saveConnectItem (typeId, id) {
			const type = stypeMiddleware.getCommonTypeItemById('supplierType')(typeId).type
			switch (type) {
			case 'supplier':
				return put({ url: `/archive/supplier_item/v1/supplier/${id}`, autoSuccessMsg: true })
			case 'store':
				// 后续还需修改
				return put({ url: `/archive/house/v1/supplier/itemhouse/${id}`, autoSuccessMsg: true })
			case 'section':
				return put({ url: `/archive/itemdepartment/v1/supplier/department/${id}`, autoSuccessMsg: true })
			}
		},
		getSupplierExcludeId (typeId, id) {
			const type = stypeMiddleware.getCommonTypeItemById('organType')(typeId).type
			switch (type) {
			case 'store':
				return get({ url: `/archive/house/v1/supplier/itemhouse/except/${id}/all` })
			case 'section':
				return get({ url: `/archive/itemdepartment/v1/supplier/department/except/${id}` })
			}
		},
		copyConnectOrgan2Organ (typeId, sourceId, targetId) {
			const type = stypeMiddleware.getCommonTypeItemById('organType')(typeId).type
			switch (type) {
			case 'store':
				return put({ url: `/archive/house/v1/supplier/itemhouse/${sourceId}/copy/${targetId}`, autoSuccessMsg: true })
			case 'section':
				return put({ url: `/archive/itemdepartment/v1/supplier/department/${sourceId}/copy/${targetId}`, autoSuccessMsg: true })
			}
		},
		copyConnectWithSection (typeId, id) {
			const type = stypeMiddleware.getCommonTypeItemById('organType')(typeId).type
			switch (type) {
			case 'store':
				return put({ url: `/archive/house/v1/supplier/itemhouse/${id}/copy`, autoSuccessMsg: true })
			case 'section':
				return put({ url: `/archive/itemdepartment/v1/supplier/department/copy/${id}`, autoSuccessMsg: true })
			}
		},
		copySupplierItemWithSection (id) {
			return put({ url: `/archive/supplier_item/v1/supplieritem/${id}/copy`, autoSuccessMsg: true })
		},
		// 与其他供货商一致
		copyOtherSupplierItem (sourceId, targetId) {
			return put({ url: `/archive/supplier_item/v1/supplieritem/${sourceId}/copy/${targetId}`, autoSuccessMsg: true })
		},
		// 复制关系页面查询其他供货商
		getSupplierItem (id) {
			return get({ url: `/archive/supplier_item/v1/${id}/all` })
		},
		// 获取供货商品项关联关系
		getConnectItem (id) {
			return get({ url: `/archive/supplier_item/v1/supplier/${id}` })
		},
		// Excel导出关联关系
		exportConnectItem (supplierId) {
			return get({ url: `/excel/supplier_item/v1/supplier/${supplierId}/export`, responseType: 'arraybuffer', responseComplete: true })
		},
		// 获取该手机号关联的供货商企业
		getSupplierBusinessList (phone) {
			return get({
				url: `/archive/supplier/v1/bind/srm/${phone}`,
				success: res => {
					res.forEach(item => {
						item.isSelected = false
					})
					return res
				}
			})
		},
		// 绑定srm账号
		binding (id) {
			return post({ url: `/archive/supplier/v1/${id}/bind/srm`, autoSuccessMsg: true, responseComplete: true })
		},
		// 解绑srm账号
		unbinding (id, autoSuccessMsg) {
			return put({ url: `/archive/supplier/v1/${id}/un_bound/srm`, autoSuccessMsg: autoSuccessMsg })
		}
	}
}
