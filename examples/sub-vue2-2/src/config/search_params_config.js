/*
 * 项目搜索条件设置
 * @eq => e (= 查询条件)
 * @fuzzy => u (组合查询)
 * @link => l (模糊查询)
 * @custom => custom (自定义查询)
 * @in => i (范围查询)
 * @rl => rl(明细备注查询)
 * @orl => orl(or Like 查询)
 * @range => r(区间查询)
 * @rangeIn => ri(关联范围查询)
 * @rangeInId => rid(关联范围id查询)
*/
export default {
	// 机构list
	organList: {
		eq: ['enableFlag'],
		fuzzy: [{
			id: 'organKey',
			rule: 'name-code-pinYin-nickName'
		}],
		link: ['memo'],
		custom: ['father', 'treeLV']
	},
	// 财务分类list
	financialList: {
		eq: ['enableFlag', 'subject'],
		fuzzy: [{
			id: 'financialKey',
			rule: 'name-code-pinYin'
		}],
		link: ['memo'],
		custom: []
	},
	// 业务类型list
	bussinessTypeList: {
		eq: ['enableFlag', 'pid', 'billType'],
		fuzzy: [{
			id: 'bussinessKey',
			rule: 'name'
		}]
	},
	// 供货商list
	supplierList: {
		eq: ['enableFlag', 'pplierTypeId', 'organType'],
		fuzzy: [{
			id: 'supplierKey',
			rule: 'name-code-pinYin-nickName'
		}],
		link: ['memo'],
		custom: ['father', 'accounting', 'supplierTypeId', 'treeLV']
	},
	// 员工list
	employeeList: {
		eq: ['enableFlag'],
		fuzzy: [{
			id: 'employeeKey',
			rule: 'name-code-pinYin'
		}],
		link: ['username'],
		custom: ['treeLV', 'organ']
	},
	// 客户list
	customerList: {
		eq: ['enableFlag', 'organType'],
		fuzzy: [{
			id: 'customerKey',
			rule: 'name-code-pinYin-nickName'
		}],
		link: ['memo'],
		custom: ['treeLV', 'accounting', 'father', 'customerType']
	},
	// 品项list
	itemList: {
		eq: ['enableFlag', 'consumptionMethod'],
		fuzzy: [{
			id: 'itemKey',
			rule: 'name-code-pinYin'
		}],
		link: ['memo'],
		custom: ['itemTypeId']
	},
	// 角色list
	roleList: {
		custom: ['employee', 'role']
	},
	// 会计期list
	accountList: {
		eq: ['year', 'organId']
	},
	// 价格方案list
	planPriceList: {
		eq: ['enableFlag', 'billState'],
		fuzzy: [{
			id: 'planKey',
			rule: 'name-code'
		}],
		custom: ['workDate'],
		link: ['memo', 'item', 'sellerOrgan', 'buyerOrgan'],
		rl: ['pd-memo']
	},
	// 采购方案list
	planStockList: {
		eq: ['enableFlag', 'planState'],
		fuzzy: [{
			id: 'planKey',
			rule: 'name-code'
		}],
		custom: ['item', 'buyer', 'seller'],
		link: ['memo'],
		rl: ['pd-memo']
	},
	// 采购订单list
	stockList: {
		custom: ['beginOrderDate', 'endOrderDate'],
		link: ['billCode', 'buyerOrgan', 'sellerOrgan', 'item', 'billBizType', 'buyerHouse', 'purchasePlan', 'memo'],
		in: ['state', 'billKind', 'assignStatus', 'supplierState', 'urgent'],
		rl: ['pd-memo']
	},
	// 销售订单list
	saleList: {
		range: ['businessDate'],
		link: ['memo'],
		in: ['srmState', 'organId', 'otherOrganId', 'billBizTypeId', 'stockPlanId', 'billState', 'billType', 'inAssignStatus', 'outAssignStatus', 'urgent'],
		rl: ['detail-memo'],
		orl: ['userBillCode', 'sysBillCode'],
		rangeIn: ['detail-itemId']
	},
	// 入库分派list
	inStoreAssignList: {
		range: ['businessDate'],
		link: ['memo'],
		in: ['srmState', 'organId', 'otherOrganId', 'billBizTypeId', 'stockPlanId', 'billState', 'billType', 'inAssignStatus', 'outAssignStatus', 'urgent'],
		rl: ['detail-memo'],
		orl: ['userBillCode', 'sysBillCode'],
		rangeIn: ['detail-itemId']
	},
	// 入库分派品项list
	inStoreAssignItemList: {
		in: ['bill.id', 'bill.otherOrganId', 'bill.organId', 'bill.inHouseId', 'detail.itemId'],
		orl: ['bill.userBillCode', 'bill.sysBillCode'],
		eq: ['stockWay']
	},
	// 入库单list
	inStoreList: {
		eq: ['enableFlag'],
		custom: ['beginDate', 'endDate'],
		link: ['memo'],
		in: ['item', 'organId', 'inHouse', 'otherOrganId', 'otherHouse', 'source', 'billState', 'billType', 'billBizTypeId', 'source'],
		rl: ['bd-memo'],
		orl: ['userBillCode', 'sysBillCode']
	},
	// 出库单list
	outStoreList: {
		eq: ['enableFlag'],
		link: ['memo'],
		in: ['organId', 'otherOrganId', 'source', 'billState', 'billType', 'billBizTypeId', 'source'],
		rl: ['bd-memo'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate'],
		rangeIn: ['detail-itemId', 'detail-outHouseId', 'detail-inHouseId']
	},
	// 调拨单list
	moveList: {
		range: ['businessDate'],
		link: ['memo'],
		orl: ['userBillCode', 'sysBillCode'],
		in: ['organId', 'otherOrganId', 'billState', 'moveState', 'billType', 'billBizTypeId'],
		rangeIn: ['detail-itemId', 'detail-inHouseId', 'detail-outHouseId'],
		rl: ['detail-memo']
	},
	// 盘点分类list
	takeStockClassList: {
		eq: ['enableFlag'],
		fuzzy: [{
			id: 'classKey',
			rule: 'name-code-pinYin'
		}],
		link: ['memo'],
		in: ['house']
	},
	// 盘点单list
	takeStockList: {
		range: ['businessDate'],
		link: ['sysBillCode', 'userBillCode', 'memo'],
		in: ['billState', 'billType', 'billBizTypeId', 'organId', 'houseId'],
		rangeIn: ['detail-itemId'],
		rl: ['detail-memo']
	}
}
