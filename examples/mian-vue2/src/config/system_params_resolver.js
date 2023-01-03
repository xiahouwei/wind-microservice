// 项目系统参数解析规则
export default {
	// {{{ 基础参数
	// 基础核算，核算方式
	JCHS_HSFS (value) {
		return value === 'HSFS_XJXC'
	},
	// 系统规范, 是否填充零
	XTGF_ZERO_FILL (value) {
		return value === 'XTGF_ZERO_FILL_TRUE'
	},
	// 是否允许负库存
	KCGL_FKC (value) {
		return value === 'FKC_TRUE'
	},
	// 系统规范, 二等分、三等分打印, 合计显示方式 (是否是 显示整单总合计)
	XTGF_TWOTHREE_PRINT_SUM (value) {
		return value === 'XTGF_TWOTHREE_PRINT_SUM_BILL'
	},
	// 实时库存
	XTGF_ITEM_STOCK (value) {
		return value === 'XTGF_ITEM_STOCK_YES'
	},
	// 采销业务中选择订货方案后切换订货单位
	SJXZL_STOCK_SALES_CHANGE_PLAN_UNIT (value) {
		return value === 'SJXZL_STOCK_SALES_CHANGE_PLAN_UNIT_YES'
	},
	// 辅助数量与主单位数量联动计算
	SJXZL_ASSIST_MAIN_TOGETER (value) {
		return value === 'SJXZL_ASSIST_MAIN_TOGETER_YES'
	},
	// }}}
	// {{{ 入库单
	// 入库单，明细显示顺序
	SJXZL_INSTORE_ITEM_ORDER (value) {
		return value === 'INSTORE_ITEM_ORDER_BY_SORTNUM' ? { sortNum: 'asc' } : { 'item.code': 'asc' }
	},
	// 入库单，待审核单据中单价、金额可编辑
	SJXZL_INSTORE_MONEY_AUTH (value) {
		return value === 'INSTORE_MONEY_AUTH_YES'
	},
	// 入库单，- 入库数量允许大于订单数量
	IN_AMOUNT_GREATER_ORDER_AMOUNT (value) {
		return value === 'IN_GREATER_ORDER_TRUE'
	},
	// 入库单，- 是否显示导入出库按钮
	SJXZL_OUTSTORE_CREATE_IN (value) {
		return value === 'OUTSTORE_CREATE_IN_HAND' || value === 'OUTSTORE_CREATE_IN_AUTO'
	},
	// 入库单，- 出库单生成入库单，审核类按钮可点击限制
	SJXZL_INSTORE_CHECKED_BUTTON (value) {
		return (btnType) => {
			switch (btnType) {
			case 'check':
				return value !== 'INSTORE_CHECKED_BUTTON_END_CHECKED' && value !== 'INSTORE_CHECKED_BUTTON_BATCH_CHECKED' && value !== 'INSTORE_CHECKED_BUTTON_NO_CHECKED'
			case 'endCheck':
				return value !== 'INSTORE_CHECKED_BUTTON_CHECKED' && value !== 'INSTORE_CHECKED_BUTTON_BATCH_CHECKED' && value !== 'INSTORE_CHECKED_BUTTON_NO_END_CHECKED'
			case 'splitCheck':
				return value !== 'INSTORE_CHECKED_BUTTON_CHECKED' && value !== 'INSTORE_CHECKED_BUTTON_END_CHECKED' && value !== 'INSTORE_CHECKED_BUTTON_NO_BATCH_CHECKED'
			default:
				return false
			}
		}
	},
	// 入库单，自动弹出供货商评价弹窗
	YWLJL_INSTORE_SUPPLIER_EVALUEATE (value) {
		return value === 'YWLJL_INSTORE_SUPPLIER_EVALUEATE_YES'
	},
	// }}}
	// {{{ 出库单
	// 出库单，明细显示顺序
	SJXZL_OUTSTORE_ITEM_ORDER (value) {
		return value === 'OUTSTORE_ITEM_ORDER_BY_SORTNUM' ? { sortNum: 'asc' } : { 'item.code': 'asc' }
	},
	// 出库单，待审核单据中单价、金额可编辑
	SJXZL_OUTSTORE_MONEY_AUTH (value) {
		return value === 'OUTSTORE_MONEY_AUTH_YES'
	},
	// 出库单，- 出库数量允许大于订单数量
	OUT_AMOUNT_GREATER_ORDER_AMOUNT (value) {
		return value === 'OUT_GREATER_ORDER_TRUE'
	},
	// 出库单，出库单支持自行选择批次
	SJXZL_OUTSTORE_CHOOSE_BATCHCODE (value) {
		return value === 'SJXZL_OUTSTORE_CHOOSE_BATCHCODE_YES'
	},
	// }}}
	// {{{ 调拨单
	// 调拨单，明细显示顺序
	SJXZL_MOVESTORE_ITEM_ORDER (value) {
		return value === 'MOVESTORE_ITEM_ORDER_BY_SORTNUM' ? { sortNum: 'asc' } : { 'item.code': 'asc' }
	},
	// }}}
	// {{{ 盘点单
	// 盘点单，盘点时间取值(是否取当前系统时间)
	CHECK_DATE (value) {
		return value === 'SYSTEM_TIME'
	},
	// 盘点单，明细显示顺序
	SJXZL_CHECKSTORE_ITEM_ORDER (value) {
		switch (value) {
		case 'CHECKSTORE_ITEM_ORDER_BY_SORTNUM':
			return { sortNum: 'asc' }
		case 'CHECKSTORE_ITEM_ORDER_BY_CODE':
			return { 'item.code': 'asc' }
		case 'CHECKSTORE_ITEM_ORDER_BY_CHECKCLASS':
			return { 'item.indexNum': 'asc' }
		}
	},
	// }}}
	// {{{ 采购计划单
	// 采购计划单，期望到货时间(小时)
	CXGL_CGJHD_SJQZL_EXPECTTIME (value) {
		return value
	},
	// 采购计划单，明细显示顺序
	SJXZL_STOCKPLAN_ITEM_ORDER (value) {
		return value === 'STOCKPLAN_ITEM_ORDER_BY_SORTNUM' ? { sortNum: 'asc' } : { 'item.code': 'asc' }
	},
	// 采购计划单，审核后进入按价格方案分派流程
	SJXZL_STOCKPLAN_CHECKED_PRICE (value) {
		return value === 'STOCKPLAN_CHECKED_PRICE_YES'
	},
	// 采购计划单，合并单据自动进行合并
	SJXZL_STOCKPLAN_AUTO_MERGE (value) {
		return value === 'STOCKPLAN_AUTO_MERGE_YES'
	},
	// }}}
	// {{{ 采购订单
	// 采购订单，期望到货时间(小时)
	CXGL_CGDD_SJQZL_EXPECTTIME (value) {
		return value
	},
	// 采购订单，明细显示顺序
	SJXZL_STOCKSTORE_ITEM_ORDER (value) {
		return value === 'STOCKSTORE_ITEM_ORDER_BY_SORTNUM' ? { sortNum: 'asc' } : { 'item.code': 'asc' }
	},
	// }}}
	// {{{ 销售订单
	// 销售订单，期望到货时间(小时)
	CXGL_XSDD_SJQZL_EXPECTTIME (value) {
		return value
	},
	// 销售订单，明细显示顺序
	SJXZL_SALESTORE_ITEM_ORDER (value) {
		return value === 'SALESTORE_ITEM_ORDER_BY_SORTNUM' ? { sortNum: 'asc' } : { 'item.code': 'asc' }
	},
	// }}}
	// {{{ 采购报价单
	// 采购报价单
	// 采购报价单，明细显示顺序
	SJXZL_STOCKOFFER_ITEM_ORDER (value) {
		return value === 'STOCKOFFER_ITEM_ORDER_BY_SORTNUM' ? { sortNum: 'asc' } : { 'item.code': 'asc' }
	}
	// }}}
}
