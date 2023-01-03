// 项目通用类型设置
export const COMMON_TYPE_CONFIG = {
	// 全部机构类型(包括机构, 供货商, 客户)
	allOrganType: [{
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
	}],
	// 证照类型
	certificatType: [{
		id: '1',
		label: '税务登记证'
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
		id: '1',
		label: '以盘计销'
	}, {
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
		label: '手工新建'
	}, {
		type: 'send',
		id: 5001,
		label: '采购生成'
	}]
}
