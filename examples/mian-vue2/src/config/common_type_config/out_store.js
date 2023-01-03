// 项目通用类型设置
export default {
	/**
	 * @name outStoreBillGenerateType
	 * @desc 出库单生成类型
	 * @author shw
	 * @date 2021/9/10
	 */
	outStoreBillGenerateType: [{
		id: 0,
		type: 'sale',
		label: '销售出库单',
		rule (billType, subBillType) {
			return `${billType}` === '2001'
		}
	}, {
		id: 1,
		type: 'other',
		label: '其他出库单',
		rule (billType, subBillType) {
			return `${billType}` === '2002'
		}
	}, {
		id: 2,
		type: 'break',
		label: '报损出库单',
		rule (billType, subBillType) {
			return `${billType}` === '2003'
		}
	}, {
		id: 3,
		type: 'stockLoss',
		label: '盘亏出库单',
		rule (billType, subBillType) {
			return `${billType}` === '2004'
		}
	}, {
		id: 4,
		type: 'diff',
		label: '差异出库单',
		rule (billType, subBillType) {
			return `${billType}` === '2005'
		}
	}, {
		id: 5,
		type: 'move',
		label: '调拨出库单',
		rule (billType, subBillType) {
			return `${billType}` === '2006'
		}
	}, {
		id: 6,
		type: 'stockProfit',
		label: '盘盈出库单',
		rule (billType, subBillType) {
			return `${billType}` === '2007'
		}
	}, {
		id: 7,
		type: 'normal-sub',
		label: '普通出库单',
		rule (billType, subBillType, organDetails = {}) {
			return organDetails.autoType === 0
		}
	}, {
		id: 8,
		type: 'assignStraight-sub',
		label: '直发分派出库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '2001-2'
		}
	}, {
		id: 9,
		type: 'assignCross-sub',
		label: '越库分派出库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '2001-3'
		}
	}, {
		id: 10,
		type: 'amount-sub',
		label: '数量出库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '2005-4'
		}
	}, {
		id: 11,
		type: 'money-sub',
		label: '金额出库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '2005-5'
		}
	}, {
		id: 12,
		type: 'offset',
		label: '冲减出库单',
		rule (billType, subBillType) {
			return `${billType}` === '2009'
		}
	}, {
		id: 13,
		type: 'saleReturnStoreAmount',
		label: '销售返库数量出库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '2008-1'
		}
	}, {
		id: 14,
		type: 'overcharge-sub',
		label: '超收生成的出库单',
		rule (billType, subBillType) {
			return `${subBillType}` === '2009-1'
		}
	}]
}
