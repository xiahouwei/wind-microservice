import library from './library.js'
import BILL_ROUTER_CONFIG from '@/router/billRouterConfig.js'
export default {
	id: 'order-summary',
	label: '摘要设置',
	actions: [{
		id: 'edit',
		label: '修改',
		messageHandler ({ pre, cur, type }) {
			return `单据类型：${BILL_ROUTER_CONFIG[type].name}；修改信息为：` + this.createUpdateMessageByLibrary(library.summaryArr)({ summaryArr: pre }, { summaryArr: cur })
		}
	}]
}
