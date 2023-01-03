// 项目通用类型设置
export default {
	/**
	 * @name stockOrderGenerateType
	 * @desc 采购单生成类型
	 * @author shw
	 * @date 2021/9/10
	 */
	stockOrderGenerateType: [{
		id: 0,
		type: 'hand',
		label: '手工采购订单',
		rule (billType, subBillType, organDetails = {}) {
			return organDetails.autoType === 0
		}
	}, {
		id: 1,
		type: 'assign',
		label: '分派采购订单',
		rule (billType, subBillType) {
			return `${billType}` === '2'
		}
	}, {
		id: 2,
		type: 'planAssign',
		label: '计划分派采购订单',
		rule (billType, subBillType) {
			return `${billType}` === '3'
		}
	}, {
		id: 3,
		type: 'normal-sub',
		label: '普通采购订单',
		rule (billType, subBillType) {
			return `${subBillType}` === '2-1'
		}
	}, {
		id: 4,
		type: 'assignCross-sub',
		label: '越库分采购订单',
		rule (billType, subBillType) {
			return `${subBillType}` === '2-2'
		}
	}, {
		id: 5,
		type: 'assignStockPlan-sub',
		label: '采购计划分派采购订单',
		rule (billType, subBillType) {
			return `${subBillType}` === '2-3'
		}
	}, {
		id: 6,
		type: 'jsd-sub',
		label: '极速订来源生成采购订单',
		rule (sourceType) {
			return `${sourceType}` === '1002'
		}
	}]
}
