// 项目通用类型设置
export default {
	/**
	 * @name stockPlanOrderGenerateType
	 * @desc 采购计划单生成类型
	 * @author shw
	 * @date 2021/9/10
	 */
	stockPlanOrderGenerateType: [{
		id: 0,
		type: 'hand',
		label: '手工采购计划单',
		rule (billType, subBillType, organDetails = {}) {
			return organDetails.autoType === 0
		}
	}]
}
