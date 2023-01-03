import { get, post, put, del } from '@/js/api/dataSource'
import stypeMiddleware from '@/js/typeMiddleware'
import API from './index'
export default {
	// 机构接口
	organ: {
		// {{{ 主列表筛选条件
		// 获取机构列表
		getFilterOrganSelectList () {
			return post({ url: '/archive/organ/v1/page/organ/tab', data: [1, 2, 3, 4, 7], loading: false })
		},
		// }}}
		// 删除机构
		delDetails (organType, id) {
			return del({ url: `/archive/organ/v1/${organType}/${id}`, autoSuccessMsg: true })
		},
		// 删除机构(回收站)
		recyclingDelete (organType, id) {
			return del({ url: `/archive/organ/v1/${organType}/${id}`, query: { realDel: true }, autoSuccessMsg: true })
		},
		// 新建机构详情
		addOrganDetails () {
			return post({ url: '/archive/organ/v1/', autoSuccessMsg: true })
		},
		// 修改机构详情
		saveOrganDetails (id) {
			return put({ url: `/archive/organ/v1/${id}`, autoSuccessMsg: true })
		},
		// 查询单个机构信息
		getOrganDetails (id) {
			return get({ url: `/archive/organ/v1/${id}` })
		},
		// 查询单个机构信息(回收站中)
		getOrganDetailsRecycling (id) {
			return get({ url: `/archive/organ/v1/recycle_bin/${id}` })
		},
		// 获取 机构树 数据
		getOrganTree () {
			return get({
				url: '/archive/organ/v1/tree',
				success: (res) => {
					if (res[0]) {
						res[0].enableFlag = 1
					}
					return res
				}
			})
		},
		// 机构列表分页查询
		getOrganList () {
			return post({ url: '/archive/organ/v1/page' })
		},
		// 机构列表分页查询(回收站)
		getOrganListRecycling () {
			return post({ url: '/archive/organ/v1/page', query: { del_flag: true } })
		},
		// 批量启用机构
		organEnable () {
			return put({ url: '/archive/organ/v1/enable', autoSuccessMsg: true })
		},
		// 批量停用机构
		organDisable () {
			return put({ url: '/archive/organ/v1/disable', autoSuccessMsg: true })
		},
		// 获取上级机构
		getParentOrgan (organLeve, id = '0') {
			return get({ url: `/archive/organ/v1/${organLeve}/${id}/fathers` })
		},
		// 批量删除机构
		organDelete () {
			return put({ url: '/archive/organ/v1/delete', autoSuccessMsg: true })
		},
		// 批量删除机构(回收站)
		recyclingDeleteMulity () {
			return put({ url: '/archive/organ/v1/delete', query: { realDel: true }, autoSuccessMsg: true })
		},
		// 恢复机构(回收站)
		recover (organType, id) {
			return put({ url: `/archive/organ/v1/restore/${organType}/${id}`, autoSuccessMsg: true })
		},
		// 批量恢复机构(回收站)
		recoverMulity () {
			return put({ url: '/archive/organ/v1/restore', autoSuccessMsg: true })
		},
		// excel 导出
		exportData () {
			return get({ url: '/excel/organ/v1/organ/export', responseType: 'arraybuffer', responseComplete: true })
		},
		// 获取带层级的机构
		getOrganCascader () {
			return get({ url: '/archive/organ/v1/organ_tree' })
		},
		// 获取所有上级机构ID接口
		getFatherIdsById (id) {
			return get({ url: `/archive/sub_organ/v1/${id}/fatherIds` })
		},
		// 根据部门/仓库查询关联品项
		getConnectItem (typeId, id) {
			const type = stypeMiddleware.getCommonTypeItemById('organType')(typeId).type
			switch (type) {
			case 'store':
				return API.store.getConnectItem(id)
			case 'section':
				return API.section.getConnectItem(id)
			}
		},
		// 查询某机构下的所有仓库简单信息
		getDefaultHouseSelect (organId) {
			return post({ url: `/archive/house/v1/organId/${organId}` })
		},
		// 修改机构与品项关联关系接口
		saveConnectItem (typeId, id) {
			const type = stypeMiddleware.getCommonTypeItemById('organType')(typeId).type
			switch (type) {
			case 'store':
				return API.store.saveConnectItem(id)
			case 'section':
				return API.section.saveConnectItem(id)
			}
		},
		getOrganExcludeId (typeId, id) {
			const type = stypeMiddleware.getCommonTypeItemById('organType')(typeId).type
			switch (type) {
			case 'store':
				return API.store.getStoreExcludeId(id)
			case 'section':
				return API.section.getSectionExcludeId(id)
			}
		},
		copyConnectWithSection (typeId, id) {
			const type = stypeMiddleware.getCommonTypeItemById('organType')(typeId).type
			switch (type) {
			case 'store':
				return API.store.copyConnectWithStore(id)
			case 'section':
				return API.section.copyConnectWithSection(id)
			}
		},
		copyConnectOrgan2Organ (typeId, sourceId, targetId) {
			const type = stypeMiddleware.getCommonTypeItemById('organType')(typeId).type
			switch (type) {
			case 'store':
				return API.store.copyConnectStore2Store(sourceId, targetId)
			case 'section':
				return API.section.copyConnectSection2Section(sourceId, targetId)
			}
		},
		// Excel导出关联关系
		exportConnectItem (houseId) {
			return get({ url: `/excel/house_item_rel/v1/house/${houseId}/export`, responseType: 'arraybuffer', responseComplete: true })
		}
	}
}
