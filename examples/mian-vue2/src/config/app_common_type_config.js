// 项目通用类型设置
import TYPE_CONFIG from './common_type_config'
import ASSIGN_SUMMARY_SHEET_SELECT_CONFIG from './assign_summary_sheet_select_config'
export const COMMON_TYPE_CONFIG = {
	// 全部机构类型(包括企业, 机构, 供货商, 客户)
	allOrganType: [{
		type: 'group',
		id: '0',
		label: '企业',
		icon: 'organ-type-group',
		organLevel: '0'
	}, {
		type: 'shop',
		id: '2',
		label: '门店',
		icon: 'organ-shop',
		organLevel: '1'
	}, {
		type: 'rdc',
		id: '1',
		label: '配送中心',
		icon: 'organ-rdc',
		organLevel: '1'
	}, {
		type: 'store',
		id: '3',
		label: '仓库',
		icon: 'organ-store',
		organLevel: '2'
	}, {
		type: 'section',
		id: '4',
		label: '部门',
		icon: 'organ-section',
		organLevel: '2'
	}, {
		type: 'supplier',
		id: '5',
		label: '供货商主体',
		icon: 'organ-supplier',
		organLevel: '1'
	}, {
		type: 'customer',
		id: '6',
		label: '客户主体',
		icon: 'organ-customer',
		organLevel: '1'
	}],
	// 机构类型
	organType: [{
		type: 'shop',
		id: '2',
		label: '门店',
		icon: 'organ-shop',
		organLevel: '1'
	}, {
		type: 'rdc',
		id: '1',
		label: '配送中心',
		icon: 'organ-rdc',
		organLevel: '1'
	}, {
		type: 'store',
		id: '3',
		label: '仓库',
		icon: 'organ-store',
		organLevel: '2'
	}, {
		type: 'section',
		id: '4',
		label: '部门',
		icon: 'organ-section',
		organLevel: '2'
	}, {
		type: 'workshop',
		id: '7',
		label: '车间',
		icon: 'organ-customer',
		organLevel: '2'
	}],
	// 财务档案-机构类型
	financialOrganType: [{
		type: 'shop',
		id: '2',
		label: '门店',
		icon: 'organ-shop',
		organLevel: '1'
	}, {
		type: 'rdc',
		id: '1',
		label: '配送中心',
		icon: 'organ-rdc',
		organLevel: '1'
	}],
	// 财务类型
	financialType: [{
		id: '1',
		label: '成本'
	}, {
		id: '2',
		label: '费用'
	}],
	// 供货商机构类型
	supplierType: [{
		type: 'supplier',
		id: '5',
		label: '供货商主体',
		icon: 'organ-supplier',
		organLevel: '1'
	}, {
		type: 'store',
		id: '3',
		label: '供货商仓库',
		icon: 'organ-store',
		organLevel: '2'
	}, {
		type: 'section',
		id: '4',
		label: '供货商部门',
		icon: 'organ-section',
		organLevel: '2'
	}],
	// 客户机构类型
	customerOrganType: [{
		type: 'customer',
		id: '6',
		label: '客户主体',
		icon: 'organ-customer',
		organLevel: '1'
	}, {
		type: 'store',
		id: '3',
		label: '客户仓库',
		icon: 'organ-store',
		organLevel: '2'
	}, {
		type: 'section',
		id: '4',
		label: '客户部门',
		icon: 'organ-section',
		organLevel: '2'
	}],
	// 耗用方式类型
	offsetMethodType: [{
		type: 'checkToSell',
		id: '1',
		label: '以盘计销'
	}, {
		type: 'deductToCost',
		id: '2',
		label: '冲减耗用'
	}],
	// 冲减方式类型
	consumptionMethodType: [{
		id: '1',
		label: '按1:1计算理论库存'
	}, {
		id: '2',
		label: '按BOM计算理论消耗'
	}, {
		id: '3',
		label: '按1:1实际冲减'
	}, {
		id: '4',
		label: '按BOM实际冲减'
	}],
	// 品项类型
	itemCategory: [{
		id: 0,
		label: '原料/物料'
	}, {
		id: 1,
		label: '菜品'
	}, {
		id: 2,
		label: '商品'
	}],
	// 品项管理——图片上传筛选条件
	haveImageSelectList: [{
		id: 0,
		label: '否'
	}, {
		id: 1,
		label: '是'
	}],
	// 员工管理机构类型
	manageAllOrganType: [{
		id: '1',
		label: '全部机构'
	}, {
		id: '2',
		label: '该员工直属机构'
	}, {
		id: '0',
		label: '自定义'
	}],
	// 员工管理供货商类型
	manageAllSupplierType: [{
		id: '1',
		label: '全部供货商'
	}, {
		id: '2',
		label: '该员工直属供货商'
	}, {
		id: '0',
		label: '自定义'
	}],
	// 员工管理客户类型
	manageAllCustomerType: [{
		id: '1',
		label: '全部客户'
	}, {
		id: '2',
		label: '该员工直属客户'
	}, {
		id: '0',
		label: '自定义'
	}],
	// 员工待办工作接受范围
	toDealWorkType: [{
		id: '1',
		label: '同管理机构+供货商+客户'
	}, {
		id: '2',
		label: '全部机构'
	}, {
		id: '3',
		label: '该员工直属机构'
	}, {
		id: '4',
		label: '自定义'
	}, {
		id: '5',
		label: '不接受待办工作提醒'
	}],
	// 价格策略
	strategyType: [{
		type: 'fixed',
		id: 1,
		label: '按固定价'
	}, {
		type: 'cost',
		id: 2,
		label: '按成本价'
	}, {
		type: 'proportion',
		id: 3,
		label: '按比例加价'
	}, {
		type: 'price',
		id: 4,
		label: '按金额加价'
	}],
	// 单据类型
	billCreateType: [{
		type: 'hand',
		id: 1,
		label: '手工新建'
	}, {
		type: 'send',
		id: 2,
		label: '分派生成'
	}],
	// 采购订单
	stockOrderType: [{
		type: 'hand',
		id: 1,
		label: '采购订单'
	}, {
		type: 'send',
		id: 2,
		label: '分派生成'
	}],
	// 计价方式
	taxPlayerType: [
		{
			type: '',
			id: 1,
			name: '价税分离'
		},
		{
			type: '',
			id: 0,
			name: '非价税分离'
		}
	],
	// 月结方式
	monthBalanceType: [
		{
			type: '',
			id: '2-1',
			name: '固定日'
		},
		{
			type: '',
			id: '2-2',
			name: '月结天数'
		}
	],
	// 入库单单据类型
	inStoreBillType: [{
		type: 'start',
		id: 1,
		label: '期初入库',
		pinYin: 'qcrk'
	}, {
		type: 'buy',
		id: 2,
		label: '采购入库',
		pinYin: 'cgrk'
	}, {
		type: 'other',
		id: 3,
		label: '其他入库',
		pinYin: 'qtrk'
	}, {
		type: 'earn',
		id: 4,
		label: '盘盈入库',
		disabled: true,
		pinYin: 'pyrk'
	}, {
		type: 'diff',
		id: 5,
		label: '差异收货',
		disabled: true,
		pinYin: 'cyrk'
	}],
	// 调拨单新增类型
	moveBillCreateType: [{
		type: 'instore',
		icon: 'organ-supplier',
		id: 0,
		label: '入库方申请',
		color: 'green',
		rule (billType, applyMode) {
			return `${billType}` === '3001' && `${applyMode}` === '0'
		}
	}, {
		type: 'outstore',
		icon: 'organ-supplier',
		id: 1,
		label: '出库方申请',
		color: 'green',
		rule (billType, applyMode) {
			return `${billType}` === '3001' && `${applyMode}` === '1'
		}
	}, {
		type: 'inside',
		icon: 'organ-supplier',
		id: 2,
		label: '内部领用申请',
		color: 'green',
		rule (billType) {
			return `${billType}` === '3002'
		}
	}, {
		type: 'production',
		icon: 'organ-supplier',
		id: 3,
		label: '生产领料',
		color: 'green',
		rule (billType) {
			return `${billType}` === '3003'
		}
	}],
	// 盘点方式
	checkWay: [{
		type: 'split',
		id: 0,
		label: '分批',
		pinYin: 'fp'
	}, {
		type: 'blending',
		id: 1,
		label: '合批',
		pinYin: 'hp'
	}],
	// 盘点单单据类型
	takeStockBillType: [{
		type: 'takeStock',
		id: 4001,
		label: '盘点',
		pinYin: 'pd'
	}],
	// 未盘品项处理方式
	notCheckType: [{
		type: 'zero',
		id: 0,
		label: '实盘结0',
		pinYin: 'spjl'
	}, {
		type: 'keep',
		id: 1,
		label: '实盘不变',
		pinYin: 'spbb'
	}],
	// 销售订单单据类型
	saleBillType: [{
		type: 'hand',
		id: 5000,
		label: '销售订单'
	}, {
		type: 'send',
		id: 5001,
		label: '采购生成'
	}],
	// 采购计划单单据类型
	stockPlanBillType: [{
		type: 'stockPlan',
		id: 6000,
		label: '采购计划'
	}],
	// 订货方式
	stockWay: [{
		type: '直发',
		id: 1,
		label: '直发'
	}, {
		type: '越库',
		id: 2,
		label: '越库'
	}],
	// 生产计划 数据来源
	dataSource: [{
		type: '手工新建',
		id: 'MANUAL',
		label: '手工新建'
	}, {
		type: '精益生产',
		id: 'OTHER',
		label: '精益生产'
	}],
	// 生产计划明细 生产状态
	productionState: [
		{
			id: 0,
			label: '未开始'
		}, {
			id: 1,
			label: '可开工'
		}, {
			id: 2,
			label: '在加工'
		}, {
			id: 3,
			label: '已完成'
		}
	],
	// 生产计划 单据类型
	productionPlanBilltype: [{
		type: '生产加工',
		id: 9000,
		label: '生产加工',
		name: '生产加工'
	}, {
		type: '生产加工',
		id: 9001,
		label: '生产加工',
		name: '生产加工'
	}],
	// 领料单 数据来源
	pickingType: [{
		type: '手工新建',
		id: 9100,
		label: '手工新建'
	}, {
		type: '计划下发',
		id: 9101,
		label: '计划下发'
	}],
	// 领料单 数据来源
	pickCompleteType: [{
		type: '是',
		id: 1,
		label: '是'
	}, {
		type: '否',
		id: 0,
		label: '否'
	}],
	// 加工单 数据来源
	machiningType: [{
		type: '手工新建-组合加工',
		id: 9200,
		label: '手工新建-组合加工'
	}, {
		type: '生产计划下发',
		id: 9201,
		label: '生产计划下发'
	}, {
		type: '工序任务生成 ',
		id: 9203,
		label: '工序任务生成 '
	}],
	// 默认仓库类型 仓库类型
	defaultHouseType: [{
		type: '加工出库仓库',
		id: 0,
		label: '加工出库仓库'
	}, {
		type: '领用出库仓库',
		id: 1,
		label: '领用出库仓库'
	}],
	// 辅助分类
	supportClass: [{
		code: 'financialClass',
		id: 'financialClass',
		authId: 'basic-archives_support-archives_financial-class',
		name: '财务分类',
		component: 'listContainerFinancialClass'
	}, {
		code: 'bussinessType',
		id: 'bussinessType',
		authId: 'basic-archives_support-archives_bussiness-type',
		name: '业务类型',
		component: 'listContainerBussinessType'
	}, {
		code: 'inventoryProfitReason',
		id: 'inventoryProfitReason',
		authId: 'basic-archives_support-archives_inventory-profit-reason',
		name: '盘盈原因',
		component: 'listContainerInventoryProfitReasons'
	}, {
		code: 'outStoreReason',
		id: 'outStoreReason',
		authId: 'basic-archives_support-archives_out-store-reason',
		name: '出库原因',
		component: 'listContainerOutStoreReason'
	}, {
		code: 'otherExpenseTypeSetting',
		id: 'otherExpenseTypeSetting',
		authId: 'basic-archives_support-archives_other-expense-type-setting',
		name: '其他费用类型',
		component: 'listContainerOtherExpenseTypeSetting'
	}, {
		code: 'takeStockClass',
		id: 'takeStockClass',
		authId: 'basic-archives_support-archives_take-stock-class',
		name: '盘点分类',
		component: 'listContainerTakeStockClass'
	}, {
		code: 'itemCustomGroup',
		id: 'itemCustomGroup',
		authId: 'basic-archives_support-archives_item-custom-group',
		name: '品项自定义分组',
		component: 'listContainerItemCustomGroup'
	}, {
		code: 'invoiceType',
		id: 'invoiceType',
		authId: 'basic-archives_support-archives_invoice-type',
		name: '发票类型',
		component: 'listContainerInvoiceType'
	}],
	// 发票类型
	invoiceTypeList: [{
		id: 0,
		name: '采购发票',
		i18nCode: 'invoice.type.purchase'
	}],
	// 配料类型
	ingredientsType: [
		{
			id: 0,
			name: '主料'
		}, {
			id: 1,
			name: '配料'
		}, {
			id: 2,
			name: '调料'
		}
	],
	// 盘盈生成方式
	inventoryProfitType: [
		{
			id: '0001',
			name: '蓝色入库单'
		}, {
			id: '0002',
			name: '红色出库单'
		}
	],
	// 全部机构类型(简易)
	allOrganTypeSimple: [{
		type: 'rdc',
		id: '1',
		name: '配送中心'
	}, {
		type: 'shop',
		id: '2',
		name: '门店'
	}],
	// 销售渠道
	saleChannel: [
		{
			id: 0,
			name: '全部'
		}, {
			id: 11,
			name: '极速订'
		}
	],
	create_type: [
		{
			id: 1,
			name: '手动新建'
		}, {
			id: 2,
			name: '批量新建'
		}, {
			id: 3,
			name: 'excel导入'
		}, {
			id: 4,
			name: '餐饮7'
		}, {
			id: 5,
			name: 'SCM8.0'
		}
	],
	generate_way_in_store: [
		{ id: 3, name: '极速订2.0' },
		{ id: 4, name: '供应链' }
	],
	generate_way: [
		{ id: 1, name: '手工新建' },
		{ id: 2, name: '采购生成' },
		{ id: 3, name: '极速订2.0' }
	],
	unitSettingBillClassList: [
		{
			id: 'InStore',
			name: '入库单',
			billtype: [{ id: 1001, name: '期初入库' },
				{ id: 1002, name: '采购入库' },
				{ id: 1003, name: '其他入库' }]
		},
		{
			id: 'OutStore',
			name: '出库单',
			billtype: [{ id: 2001, name: '销售出库' },
				{ id: 2002, name: '其他出库' },
				{ id: 2003, name: '报损出库' }]
		},
		{
			id: 'MoveApply',
			name: '调拨单',
			billtype: [{ id: 3001, name: '调拨申请' },
				{ id: 3002, name: '领用申请' }]
		},
		{
			id: 'CheckBill',
			name: '盘点单',
			billtype: [{ id: 4001, name: '盘点单' }]
		},
		{
			id: 'StockPlan',
			name: '采购计划单',
			billtype: [{ id: 6000, name: '采购计划单' }]
		},
		{
			id: 'StockOrder',
			name: '采购订单',
			billtype: [{ id: 1, name: '采购订单' }]
		},
		{
			id: 'SalesOrder',
			name: '销售订单',
			billtype: [{ id: 5000, name: '销售订单' }]
		}
	],
	storageSpaceTypeList: [
		{
			id: '0',
			label: '通用货位'
		},
		{
			id: '1',
			label: '出库货位'
		},
		{
			id: '2',
			label: '存储货位'
		},
		{
			id: '3',
			label: '周转库位'
		}
	],
	storageRackTypeList: [
		{
			id: 1000,
			label: '货架'
		},
		{
			id: 1001,
			label: '地面平仓'
		}
	],
	// 财务档案——收支属性
	balancePropertiesList: [
		{
			id: 0,
			label: '收支'
		},
		{
			id: 1,
			label: '收入'
		},
		{
			id: 2,
			label: '支出'
		}
	],
	// 财务档案——结算方式类型
	settlementWayGenerateTypeList: [
		{
			id: 0,
			label: '系统预设'
		},
		{
			id: 1,
			label: '自定义设置'
		}
	],
	// 财务档案——财务分类
	taxTypeList: [
		{
			id: 0,
			label: '一般纳税人'
		},
		{
			id: 1,
			label: '小规模纳税人'
		}
	],
	// 快速出库方案——出库方式
	outWayType: [
		{
			id: 0,
			label: '快速出库'
		},
		{
			id: 1,
			label: '快速调拨'
		}
	],
	// 品项管理——品项设置向导
	itemSettingGuideList: [
		{
			id: 'takeStockClass',
			name: '盘点分类',
			component: 'takeStockClassSetting'
		},
		{
			id: 'pricePlan',
			name: '价格方案',
			component: 'pricePlanSetting'
		},
		{
			id: 'stockPlan',
			name: '订货方案',
			component: 'stockPlanSetting'
		}
	],
	// 应收单——客户支付方式
	payWayList: [
		{
			id: 1,
			name: '微信'
		},
		{
			id: 2,
			name: '微企付'
		},
		{
			id: 3,
			name: '线下支付'
		},
		{
			id: 4,
			name: '预付货款支付'
		}
	],
	// 应收单——业务来源
	sourceTypeList: [
		{
			id: 1000,
			name: '供应链'
		},
		{
			id: 1002,
			name: '极速订2.0'
		}
	],
	...TYPE_CONFIG,
	...ASSIGN_SUMMARY_SHEET_SELECT_CONFIG
}
