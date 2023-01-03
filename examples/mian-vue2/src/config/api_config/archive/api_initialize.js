import { get } from '@/js/api/dataSource'
export default {
	// 基础数据导入接口
	initialize: {
		// 数据初始化-初始化单据
		initializeBill () {
			return get({ url: '/excel/sysInit/v1/bill', autoSuccessMsg: true })
		},
		// 数据初始化-初始化单据+档案
		initializeBillAndArchives () {
			return get({ url: '/excel/sysInit/v1/billArchive', autoSuccessMsg: true })
		},
		// 企业名称二次确认
		check (value) {
			return get({ url: `/archive/organ/v1/tenantExistence?name=${value}`, autoSuccessMsg: true })
		}
	}
}
