// 项目通用类型设置
export default {
	/**
	 * @name stockInquiryOrderGenerateType
	 * @desc 采购询定价单生成类型
	 * @author ysl
	 * @date 2022/11/30
	 */
	stockInquiryOrderGenerateType: [{
		id: 0,
		type: 'hand',
		label: '手工采购询定价单',
		rule (organDetails = {}) {
			return organDetails.autoType === 0
		}
	}, {
		id: 1,
		type: 'stockPlanSub',
		label: '采购计划生成采购询价单',
		rule (organDetails = {}) {
			return organDetails.billType === 9301
		}
	}]
}
