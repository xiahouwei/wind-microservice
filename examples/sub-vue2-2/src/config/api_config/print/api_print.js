import { get, post, put, del } from '@/js/api/dataSource'
import { devUrl } from '@/js/service/baseUrl'
export default {
	// 打印
	print: {
		// 获取打印方案接口
		getTemplateDetails (type, id) {
			return get({ url: `${devUrl}/print/template/v1/type/${type}/plans/${id}` })
		},
		// 新增打印方案接口
		addTemplate () {
			return post({ url: `${devUrl}/print/template/v1/plans/`, autoSuccessMsg: true })
		},
		// 修改打印方案接口
		updateTemplate (id) {
			return put({ url: `${devUrl}/print/template/v1/plans/${id}`, autoSuccessMsg: true })
		},
		// 删除打印方案接口
		delTemplate (id) {
			return del({ url: `${devUrl}/print/template/v1/plans/${id}`, autoSuccessMsg: true })
		},
		// 获取打印方案列表
		getTemplateList (type) {
			return get({ url: `${devUrl}/print/template/v1/type/${type}/plans/` })
		},
		// 获取打印数据-根据type
		// getPrintData (type) {
		// 	return post({ url: `${devUrl}/print/schedule/${type}` })
		// }
		getPrintData (type) {
			return post({ url: `${devUrl}/bill/${type}/v1/print` })
		}
	}
}
