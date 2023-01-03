import { get, post, file } from '@/js/api/dataSource'
import { COMMON_TYPE_CONFIG } from '@/config/app_common_type_config.js'
import app from '@/main.js'
export default {
	// 通用接口
	common: {
		// 获取区域, 省, 市 数据
		getAreaProvinceCity () {
			return get({
				url: '/archive/commonData/v1/address',
				loading: false
			})
		},
		// 文件上传
		uploadFile () {
			return file({ url: '/archive/fileupload/v1/upload' })
		},
		// 根据类型获取树
		getTreeByType () {
			return post({ url: '/archive/archive_common/v1/alltree' })
		},
		// 获取机构，供货商，客户的树
		getAllTree () {
			return post({
				url: '/archive/archive_common/v1/alltree',
				data: [{
					type: 'Organ',
					level: 0
				}]
			})
		},
		// 获取当前登录人及所属机构及机构的默认收货地址
		getCurrentUser () {
			return get({ url: '/archive/employee/v1/currentUser' })
		},
		// 获取经办人接口
		getAgentList () {
			return get({ url: '/archive/bill/employee/v1/enable' })
		},
		// 获取辅助分类树
		getSupportClassTree () {
			return get({
				url: '/archive/bill_type/v1/tree',
				success: (res) => {
					const [financialClass, bussinessType, inventoryProfitReason, outStoreReason, otherExpenseTypeSetting, takeStockClass, itemCustomGroup, invoiceType] = COMMON_TYPE_CONFIG.supportClass
					invoiceType.children = COMMON_TYPE_CONFIG.invoiceTypeList
					const children = res[0].children
					res[0].children = [financialClass, { ...bussinessType, children }, inventoryProfitReason, outStoreReason, otherExpenseTypeSetting, takeStockClass, itemCustomGroup, invoiceType]
					res[0].children = res[0].children.filter(item => {
						return app.vue.$store.getters.moduleAuthGetter(item.authId)
					})
					return res
				}
			})
		},
		// 获取机构资质类型接口
		getResourceTypeList () {
			return get({ url: '/archive/organ/v1/resource/types' })
		}
	}
}
