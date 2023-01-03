// 项目通用类型设置
export default {
	/**
	 * @name inStoreBillGenerateType
	 * @desc 入库单生成类型
	 * @author shw
	 * @date 2021/9/10
	 */
	inStoreBillGenerateType: [{
		id: 0,
		type: 'beginPeriod',
		label: '期初入库单',
		rule (billType, subBillType) {
			return `${billType}` === '1001'
		}
	}, {
		id: 1,
		type: 'purchase',
		label: '采购入库单',
		rule (billType, subBillType) {
			return `${billType}` === '1002'
		}
	}, {
		id: 2,
		type: 'other',
		label: '其他入库单',
		rule (billType, subBillType) {
			return `${billType}` === '1003'
		}
	}, {
		id: 3,
		type: 'stockProfit',
		label: '盘盈入库单',
		rule (billType, subBillType) {
			return `${billType}` === '1004'
		}
	}, {
		id: 4,
		type: 'diff',
		label: '差异入库单',
		rule (billType, subBillType) {
			return `${billType}` === '1005'
		}
	}, {
		id: 5,
		type: 'move',
		label: '调拨入库单',
		rule (billType, subBillType) {
			return `${billType}` === '1006'
		}
	}, {
		id: 6,
		type: 'return',
		label: '退货出库单',
		rule (billType, subBillType) {
			return `${billType}` === '1007'
		}
	}, {
		id: 7,
		type: 'normal-sub',
		label: '普通入库单',
		rule (billType, subBillType, organDetails = {}) {
			return organDetails.autoType === 0
		}
	}, {
		id: 8,
		type: 'assignStraight-sub',
		label: '直发分派入库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '1002-2'
		}
	}, {
		id: 9,
		type: 'assignCross-sub',
		label: '越库分派入库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '1002-3'
		}
	}, {
		id: 10,
		type: 'amount-sub',
		label: '数量出库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '1005-4'
		}
	}, {
		id: 11,
		type: 'money-sub',
		label: '金额出库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '1005-5'
		}
	}, {
		id: 12,
		type: 'offset',
		label: '冲减返库单',
		rule (billType, subBillType) {
			return `${billType}` === '1008'
		}
	}, {
		id: 13,
		type: 'outStore-sub',
		label: '出库单审核生成',
		rule (billType, subBillType) {
			return `${subBillType}` === '1002-4'
		}
	}, {
		id: 14,
		type: 'saleOrder-sub-outOrder',
		label: '销售订单分派的出库单直接生成',
		rule (billType, subBillType) {
			return `${subBillType}` === '1002-5'
		}
	}, {
		id: 15,
		type: 'stockOrder-sub-outOrder',
		label: '采购订单的出库单直接生成',
		rule (billType, subBillType) {
			return `${subBillType}` === '1002-6'
		}
	}, {
		id: 16,
		type: 'delSaleReturnOutStoreOrder-sub-blueOrder',
		label: '删除销售返库红色出库单生成的蓝色入库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '1002-7'
		}
	}, {
		id: 17,
		type: 'handReturn-sub-blueOrder',
		label: '手工新建的入库单退货生成的蓝色入库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '1009-1'
		}
	}, {
		id: 18,
		type: 'outStoreOrderChildInStoreOrder-sub-blueOrder',
		label: '出库单的下级入库单退货生成的蓝色入库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '1009-2'
		}
	}, {
		id: 19,
		type: 'assigneSaleOrderInStoreOrderReturn-sub-blueOrder',
		label: '销售订单入库分派的入库单退货生成的蓝色入库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '1009-3'
		}
	}, {
		id: 20,
		type: 'salesReturn',
		label: '销售返库',
		rule (billType, subBillType) {
			return `${billType}` === '1009'
		}
	}, {
		id: 21,
		type: 'srm-sub-inStore',
		label: 'srm生成入库单',
		rule (sourceBillType) {
			return `${sourceBillType}` === 'SRM_Bill'
		}
	}, {
		id: 22,
		type: 'red-inStore',
		label: '红色入库单',
		rule (billSign) {
			return `${billSign}` === '2'
		}
	}, {
		id: 23,
		type: 'jsd-return-sub-sale-back-inStore',
		label: '极速订退单生成销售返库入库单',
		rule (sourceType) {
			return `${sourceType}` === '1002'
		}
	}]
}
