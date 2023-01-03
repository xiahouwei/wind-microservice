import { get, post, put, del } from '@/js/api/dataSource'
export default {
	// 销售区域
	salesArea: {
		// 分页查询
		getPageList () {
			return post({ url: '/archive/sales_region/v1/page' })
		},
		// 批量启用
		enableMulity () {
			return put({ url: '/archive/sales_region/v1/enable', autoSuccessMsg: true })
		},
		// 批量停用
		disableMulity () {
			return put({ url: '/archive/sales_region/v1/disable', autoSuccessMsg: true })
		},
		// 批量删除
		deleteMulity () {
			return put({ url: '/archive/sales_region/v1/delete', autoSuccessMsg: true })
		},
		// 新建销售区域
		add () {
			return post({ url: '/archive/sales_region/v1', autoSuccessMsg: true })
		},
		// 修改销售区域
		save (id) {
			return put({ url: `/archive/sales_region/v1/${id}`, autoSuccessMsg: true })
		},
		// 删除销售区域
		delete (id) {
			return del({ url: `/archive/sales_region/v1/${id}`, autoSuccessMsg: true })
		},
		// 获取所属机构list
		getOrganSelectList () {
			return post({ url: '/archive/bill/organ/v1/in_store/organ_list' })
		},
		// 获取品项类别树
		getItemTree () {
			return get({
				url: '/archive/item/type/v1/tree',
				success: (res) => {
					return [{
						name: '全部',
						treeType: 'root',
						fatherId: null,
						children: res,
						id: '1'
					}]
				}
			})
		},
		// 查询冲减品项
		getItemList () {
			return post({ url: '/archive/sales_region/v1/item/query' })
		},
		// 获取所属机构下所有仓库list
		getStoreSelectList (organId) {
			return post({ url: `/archive/house/v1/houses/organId/${organId}`, data: true })
		},
		// 批量设置获取销售区域信息
		getSalesAreaList () {
			return post({ url: '/archive/sales_region/v1/getSalesRegions' })
		},
		// 单个销售区域设置冲减仓库
		setOffsetHouse () {
			return post({ url: '/archive/sales_region/v1/setOffsetHouse', autoSuccessMsg: true })
		},
		// 批量设置冲减仓库
		setOffsetHouseMulity () {
			return post({ url: '/archive/sales_region/v1/batch/setOffsetHouse', autoSuccessMsg: true })
		}
	}
}
