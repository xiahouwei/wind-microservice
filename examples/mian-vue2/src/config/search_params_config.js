/*
 * 项目搜索条件设置
 * @eq => e (= 查询条件)
 * @fuzzy => u (组合查询)
 * @link => l (模糊查询)
 * @custom => custom (自定义查询)
 * @in => i (范围查询)
 * @notIn => ni (不在范围查询)
 * @rl => rl(明细备注查询)
 * @orl => orl(or Like 查询)
 * @range => r(区间查询)
 * @rangeIn => ri(关联范围查询 或)
 * @rangeAnd => ra(关联范围查询 且)
 * @rangeInId => rid(关联范围id查询)

 * @merge[function] merge搜索配置 传参为搜索参数 return 同搜索条件结构一致
*/
export default {
	// 机构list
	organList: {
		eq: ['enableFlag', 'organType'],
		link: ['memo'],
		custom: ['father', 'treeLV'],
		in: ['id']
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
	// 盘盈原因list
	inventoryProfitList: {
		eq: ['enableFlag'],
		fuzzy: [{
			id: 'reasonKey',
			rule: 'name-code-pinYin'
		}]
	},
	// 出库原因list
	outStoreReasonList: {
		eq: ['os.enableFlag'],
		fuzzy: [{
			id: 'reasonKey',
			rule: 'os.name-os.code'
		}]
	},
	// 其他费用类型list
	otherExpenseTypeSettingList: {
		eq: ['os.enableFlag'],
		link: ['os.code', 'os.name']
	},
	// 品项自定义分组list
	itemCustomGroupList: {
		fuzzy: [{
			id: 'groupKey',
			rule: 'os.name-os.code'
		}],
		custom: ['relItem']
	},
	// 业务类型list
	bussinessTypeList: {
		eq: ['enableFlag', 'pid', 'billType'],
		link: ['name']
	},
	// 供货商list
	supplierList: {
		eq: ['enableFlag', 'pplierTypeId', 'organType'],
		link: ['memo'],
		custom: ['father', 'accounting', 'supplierTypeId', 'treeLV'],
		in: ['id']
	},
	// 员工list
	employeeList: {
		eq: ['enableFlag'],
		fuzzy: [{
			id: 'employeeKey',
			rule: 'name-code-pinYin'
		}],
		link: ['username', 'phone'],
		custom: ['organType', 'treeLV'],
		in: ['organId']
	},
	// 客户list
	customerList: {
		eq: ['enableFlag', 'organType'],
		link: ['memo'],
		custom: ['treeLV', 'accounting', 'father', 'customerType'],
		in: ['id']
	},
	// 品项list
	itemList: {
		eq: ['enableFlag', 'consumptionMethod', 'haveImage'],
		link: ['memo'],
		custom: ['itemTypeId'],
		in: ['id', 'financeSortId'],
		merge (params) {
			return params.itemTypeFlag ? { rangeAnd: ['category-category'] } : { rangeIn: ['category-category'] }
		}
	},
	// 角色list
	roleList: {
		custom: ['employee'],
		in: ['id']
	},
	// 会计期list
	accountList: {
		eq: ['year', 'organId']
	},
	// 月末结转list
	carryForwardList: {
		eq: ['organ.organType', 'ap.id', 'oap.accountingState'],
		in: ['organ.id']
	},
	// 价格方案list
	planPriceList: {
		eq: ['enableFlag', 'billState', 'delFlag'],
		fuzzy: [{
			id: 'planKey',
			rule: 'name-code'
		}],
		custom: ['workDate'],
		link: ['memo'],
		rangeIn: ['pd-itemId', 'pb-organId', 'ps-organId'],
		rl: ['pd-memo']
	},
	// 订货方案list
	planStockList: {
		eq: ['enableFlag', 'planState', 'delFlag'],
		fuzzy: [{
			id: 'planKey',
			rule: 'name-code'
		}],
		custom: ['item'],
		link: ['memo'],
		rangeIn: ['pd-itemId', 'pd-sellerOrgan', 'pb-buyerOrgan'],
		rl: ['pd-memo']
	},
	// 快速出库方案list
	quickOutPlanList: {
		eq: ['enableFlag', 'billState', 'delFlag'],
		fuzzy: [{
			id: 'planKey',
			rule: 'name-code'
		}],
		link: ['memo'],
		rangeIn: ['pd-itemId', 'pd-inOrganId', 'pd-inHouseId', 'pd-outHouseId'],
		rl: ['pd-memo']
	},
	// 单位使用场景设置list
	unitSettingList: {
		eq: ['item.enableFlag', 'item.delFlag'],
		custom: ['item.itemType'],
		in: ['item.id'],
		merge (params) {
			return params.itemTypeFlag ? { rangeAnd: ['category-category'] } : { rangeIn: ['category-category'] }
		}
	},
	// 货位管理list
	storageManageList: {
		eq: ['hil.locationCategory', 'hil.enableFlag'],
		custom: ['treeLV'],
		in: ['hil.id', 'hil.shelfId', 'hil.organId', 'hil.houseId']
	},
	// 采购计划单list
	stockPlanOrderList: {
		range: ['businessDate'],
		in: ['organId', 'billState', 'billType', 'billBizTypeId', 'stockPlanId', 'assignStatus', 'operateMan'],
		rl: ['detail-memo'],
		eq: ['urgent', 'history'],
		orl: ['userBillCode', 'sysBillCode'],
		link: ['memo'],
		rangeIn: ['detail-itemTypeId', 'detail-itemId', 'detail-inHouseId']
	},
	// 采购计划单分派list
	stockPlanOrderAssignList: {
		range: ['businessDate'],
		link: ['memo'],
		in: ['srmState', 'organId', 'otherOrganId', 'billBizTypeId', 'stockPlanId', 'billState', 'billType', 'assignStatus', 'urgent'],
		rl: ['detail-memo'],
		orl: ['userBillCode', 'sysBillCode'],
		rangeIn: ['detail-itemId']
	},
	// 采购报价单list
	stockOfferOrderList: {
		eq: ['sendState'],
		in: ['organId', 'otherOrganId', 'billState', 'billType', 'billBizTypeId', 'operateMan'],
		orl: ['userBillCode', 'sysBillCode'],
		link: ['memo']
	},
	// 采购订单list
	stockList: {
		eq: ['history'],
		range: ['businessDate'],
		link: ['memo'],
		in: ['sendState', 'urgent', 'billState', 'billType', 'purchasePlan', 'billBizTypeId', 'organId', 'otherOrganId', 'operateMan'],
		rl: ['detail-memo'],
		orl: ['userBillCode', 'sysBillCode'],
		rangeIn: ['detail-itemTypeId', 'detail-itemId', 'detail-inHouseId']
	},
	// 销售订单list
	saleList: {
		eq: ['history'],
		range: ['businessDate'],
		link: ['memo'],
		in: ['srmState', 'organId', 'otherOrganId', 'billBizTypeId', 'stockPlanId', 'billState', 'billType', 'inAssignStatus', 'outAssignStatus', 'urgent', 'generateWay', 'operateMan'],
		rl: ['detail-memo'],
		orl: ['userBillCode', 'sysBillCode'],
		rangeIn: ['detail-itemTypeId', 'detail-itemId']
	},
	// 采购询定价单list
	stockInquiryOrderList: {
		range: ['businessDate'],
		in: ['organId', 'billState', 'isStockOffer', 'billType', 'billBizTypeId', 'stockPlanId', 'assignStatus', 'operateMan'],
		rl: ['detail-memo'],
		eq: ['urgent', 'history'],
		orl: ['userBillCode', 'sysBillCode'],
		link: ['memo'],
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
		in: ['bill.id', 'bill.otherOrganId', 'bill.organId', 'detail.inHouseId', 'bill.crossOrgan', 'detail-itemTypeId', 'detail.itemId'],
		orl: ['bill.userBillCode', 'bill.sysBillCode'],
		eq: ['stockWay']
	},
	// 入库单list 和 退货品项list
	inStoreList: {
		eq: ['enableFlag', 'history'],
		link: ['bill.memo'],
		in: ['sendState', 'organId', 'otherOrganId', 'source', 'billState', 'billType', 'billBizTypeId', 'generateWay', 'operateMan'],
		rl: ['detail-memo', 'detail-batchCode'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate'],
		rangeIn: ['detail-itemTypeId', 'detail-itemId', 'detail-outHouseId', 'detail-inHouseId']
	},
	// 出库单list
	outStoreList: {
		eq: ['enableFlag', 'history', 'autoType'],
		link: ['bill.memo'],
		in: ['organId', 'otherOrganId', 'source', 'billState', 'billType', 'billBizTypeId', 'source', 'operateMan'],
		rl: ['detail-memo'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate'],
		rangeIn: ['detail-itemTypeId', 'detail-itemId', 'detail-outHouseId', 'detail-inHouseId']
	},
	// 调拨单list
	moveList: {
		eq: ['history'],
		range: ['businessDate'],
		link: ['memo'],
		orl: ['userBillCode', 'sysBillCode'],
		in: ['organId', 'otherOrganId', 'billState', 'moveState', 'billType', 'billBizTypeId', 'operateMan'],
		rangeIn: ['detail-itemTypeId', 'detail-itemId', 'detail-inHouseId', 'detail-outHouseId'],
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
		in: ['organ', 'house']
	},
	// 盘点单list
	takeStockList: {
		eq: ['history'],
		range: ['businessDate'],
		orl: ['userBillCode', 'sysBillCode'],
		link: ['memo'],
		in: ['billState', 'billType', 'billBizTypeId', 'organId', 'houseId'],
		rangeIn: ['detail-itemTypeId', 'detail-itemId', 'detail-modifyMan'],
		rl: ['detail-memo']
	},
	// 采购发票list
	purchaseInvoiceList: {
		range: ['invoicingDate'],
		link: ['invoicingCode', 'memo'],
		in: ['state', 'salesOrganId', 'purchaseOrganId', 'invoicingTypeId']
	},
	// 财务单据管理list
	financialInStoreList: {
		link: ['memo'],
		in: ['organId', 'otherOrganId', 'billState', 'billType', 'billBizTypeId'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate'],
		rangeIn: ['detail-itemId', 'detail-outHouseId', 'detail-inHouseId']
	},
	// 出库单list
	financialOutStoreList: {
		link: ['memo'],
		in: ['organId', 'otherOrganId', 'billState', 'billType', 'billBizTypeId', 'sourceType'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate'],
		rangeIn: ['detail-itemId', 'detail-outHouseId', 'detail-inHouseId']
	},
	// 应付单list
	payableOrderList: {
		link: ['memo'],
		in: ['organId', 'otherOrganId', 'billState', 'billType', 'billBizTypeId', 'departmentId', 'operateMan'],
		notIn: ['id'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate']
	},
	// 付款单list
	paymentOrderList: {
		link: ['memo'],
		in: ['organId', 'otherOrganId', 'billState', 'billType', 'billBizTypeId', 'departmentId', 'operateMan'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate'],
		rl: ['detail-bankAccount', 'detail-memo']
	},
	// 预付单list
	advancedOrderList: {
		link: ['memo'],
		in: ['organId', 'otherOrganId', 'billState', 'billType', 'billBizTypeId', 'departmentId', 'operateMan'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate'],
		rl: ['detail-bankAccount', 'detail-memo']
	},
	// 应付核销list
	verificationOrderList: {
		link: ['memo'],
		in: ['writeOffWay', 'organId', 'otherOrganId', 'billState', 'billType', 'billBizTypeId', 'departmentId', 'writeOffMan'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate'],
		rl: ['detail-memo']
	},
	// 应付核销-新增明细list
	verificationDetailsList: {
		eq: ['organId', 'otherOrganId'],
		notIn: ['id'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate']
	},
	// 应收单list
	receivableOrderList: {
		link: ['memo'],
		in: ['organId', 'otherOrganId', 'billState', 'billType', 'billBizTypeId', 'departmentId', 'operateMan', 'sourceType', 'payWay'],
		notIn: ['id'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate']
	},
	// 应收单明细--财务出库单list
	receivableOrderOutStoreList: {
		in: ['organId', 'otherOrganId', 'sourceType', 'payWay'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate']
	},
	// 发票类型list
	invoiceTypeList: {
		eq: ['enableFlag', 'type'],
		fuzzy: [{
			id: 'invoiceKey',
			rule: 'name-pinYin'
		}]
	},
	// 销售区域list
	salesAreaList: {
		eq: ['enableFlag'],
		fuzzy: [{
			id: 'salesAreaKey',
			rule: 'name-code-pinYin'
		}],
		custom: ['treeLV', 'organ']
	},
	// 理论耗用单list
	theoryCostList: {
		eq: ['enableFlag'],
		link: ['memo'],
		in: ['organId', 'billState', 'billType', 'billBizTypeId'],
		rl: ['detail-memo'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate'],
		rangeIn: ['detail-itemId', 'detail-outHouseId']
	},
	// 菜品营业单list
	foodBusinessList: {
		eq: ['enableFlag'],
		link: ['memo'],
		in: ['organId', 'salesRegionId', 'billState', 'billType', 'billBizTypeId', 'offsetState'],
		rl: ['detail-memo'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate'],
		rangeIn: ['detail-itemId', 'detail-outHouseId']
	},
	// 商品管理list
	goodsList: {
		eq: ['enable_flag', 'channel_type'],
		link: ['name_code'],
		range: ['create_date']
	},
	// 关联品项档案list
	relateItemList: {
		orl: ['item.name', 'item.code', 'item.pinyin']
	},
	// 营业数据查询
	businessDataSearchList: {
		in: ['business.syncFlag', 'business.organId'],
		range: ['business.createDate']
	},
	// 生产计划list
	productionPlan: {
		eq: ['enableFlag'],
		in: ['organId', 'billState', 'createMachiningFlag', 'createPickingFlag', 'createProcedureTaskFlag'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate']
	},
	// 领料单list
	pickingList: {
		eq: ['enableFlag'],
		in: ['organId', 'billState', 'billType', 'operateMan', 'pickComplete'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate'],
		rangeIn: ['detail-outHouseId', 'detail-inHouseId', 'product-itemId', 'dosing-itemId']
	},
	// 加工单list
	machiningOrderList: {
		eq: ['enableFlag'],
		in: ['billState', 'billType', 'operateMan'],
		orl: ['userBillCode', 'sysBillCode'],
		range: ['businessDate', 'checkDate'],
		rangeIn: ['product-itemId', 'dosing-itemId']
	},
	// 默认仓库list
	dosingDefaultHouseList: {
		in: ['organId', 'houseId', 'defaultHouseType'],
		rangeIn: ['detail-itemId']

	},
	// 财务档案-结算方式list
	settlementWayList: {
		eq: ['enableFlag'],
		fuzzy: [{
			id: 'searchKey',
			rule: 'name-code-pinYin'
		}],
		link: ['memo']
	},
	// 财务档案-机构list
	financialOrganList: {
		eq: ['enableFlag', 'organType'],
		in: ['id']
	},
	// 财务档案-供货商list
	financialSupplierList: {
		eq: ['enableFlag', 'supplierTypeId'],
		in: ['organId']
	},
	// 财务档案-客户list
	financialCustomerList: {
		eq: ['enableFlag', 'customerTypeId'],
		in: ['organId']
	}
}
