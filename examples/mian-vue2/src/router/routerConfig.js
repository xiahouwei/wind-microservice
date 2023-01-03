/**
 * @name route
 * @desc 路由设置
 * @author shw
 * @date 2022/8/11
 * @param {Boolean} meta.closable  路由标签是否可以关闭
 * @param {Boolean} meta.single  路由标签是否唯一
 * @param {Function|String} meta.tagTitle  路由标签title
 * @param {Boolean} meta.keepAlive 开启缓存
 * @param {String[]} meta.authModuleList  路由页面请求的权限模块
 * @param {String} meta.orderRequiredBillType  路由页面必填模块
 * @param {String} meta.parentMenuPath  分页详情路由页面对应菜单模块
 */

export default [{
	path: '/',
	redirect: '/login'
}, {
	path: '/redictPage',
	name: 'redictPage',
	component: () => import('@/views/redictPage/Index.vue')
}, {
	path: '/login',
	name: 'login',
	component: r => require.ensure([], function (require) { r(require('@/views/login/Index.vue')) }, 'login')
}, {
	path: '/print',
	name: 'print',
	component: r => require.ensure([], function (require) { r(require('@/views/print/Index.vue')) }, 'print')
}, {
	path: '/printInvoice',
	name: 'printInvoice',
	component: r => require.ensure([], function (require) { r(require('@/views/print-invoice/Index.vue')) }, 'printInvoice')
}, {
	path: '/printNested',
	name: 'printNested',
	component: r => require.ensure([], function (require) { r(require('@/views/print-nested/Index.vue')) }, 'printNested')
}, {
	path: '/main',
	component: r => require.ensure([], function (require) { r(require('@/views/index/Index.vue')) }, 'main'),
	children: [{
		path: '/',
		redirect: 'home'
	}, {
		// 首页
		path: 'home',
		name: 'home',
		component: r => require.ensure([], function (require) { r(require('@/views/home/Index.vue')) }, 'home'),
		meta: {
			tagTitle: '首页',
			single: true,
			closable: false
		}
	}, {
		path: 'print',
		name: 'mainPrint',
		component: r => require.ensure([], function (require) { r(require('@/views/print/Index.vue')) }, 'print'),
		meta: {
			tagTitle: (query = {}) => {
				return `${query.billName || '单据'}打印`
			},
			single: false,
			keepAlive: true
		}
	}, {
		path: 'printInvoice',
		name: 'mainPrintInvoice',
		component: r => require.ensure([], function (require) { r(require('@/views/print-invoice/Index.vue')) }, 'printInvoice'),
		meta: {
			tagTitle: '采购发票打印',
			single: false,
			keepAlive: true
		}
	}, {
		path: 'printNested',
		name: 'mainPrintNested',
		component: r => require.ensure([], function (require) { r(require('@/views/print-nested/Index.vue')) }, 'printNested'),
		meta: {
			tagTitle: (query = {}) => {
				return `${query.billName || '单据'}打印`
			},
			single: false,
			keepAlive: true
		}
	}, {
		// 基础档案-机构管理
		path: 'organManage',
		name: 'organManage',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_organ-manage/Index.vue')) }, 'organManage'),
		meta: {
			tagTitle: '机构管理',
			single: true,
			keepAlive: true,
			authModuleList: [
				'basic-archives_organ-manage',
				'basic-archives_support-archives_financial-class'
			]
		}
	}, {
		// 基础档案-机构管理详情
		path: 'organManageDetail',
		name: 'organManageDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_organ-manage/components/organ-create/Index.vue')) }, 'organManageDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增机构'
				} else {
					return `${query.organTypeLable || ''}:${query.name || ''}`
				}
			},
			single: false,
			parentMenuPath: 'organManage',
			authModuleList: [
				'basic-archives_organ-manage',
				'basic-archives_support-archives_financial-class'
			]
		}
	}, {
		// 基础档案-供货商管理
		path: 'supplierManage',
		name: 'supplierManage',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_supplier-manage/Index.vue')) }, 'supplierManage'),
		meta: {
			tagTitle: '供货商管理',
			single: true,
			keepAlive: true,
			authModuleList: ['basic-archives_supplier-manage', 'basic-archives_support-archives_financial-class']
		}
	}, {
		// 基础档案-供货商管理详情
		path: 'supplierManageDetail',
		name: 'supplierManageDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_supplier-manage/components/create-container/Index.vue')) }, 'supplierManageDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增供货商'
				} else {
					return `${query.organTypeLable || ''}:${query.name || ''}`
				}
			},
			single: false,
			parentMenuPath: 'supplierManage',
			authModuleList: ['basic-archives_supplier-manage', 'basic-archives_support-archives_financial-class']
		}
	}, {
		// 基础档案-员工管理
		path: 'employeeManage',
		name: 'employeeManage',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_employee-manage/Index.vue')) }, 'employeeManage'),
		meta: {
			tagTitle: '员工管理',
			single: true,
			keepAlive: true,
			authModuleList: ['basic-archives_employee-manage']
		}
	}, {
		// 基础档案-员工管理详情
		path: 'employeeManageDetail',
		name: 'employeeManageDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_employee-manage/components/create-container/Index.vue')) }, 'employeeManageDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增员工'
				} else {
					return `员工:${query.name || ''}`
				}
			},
			single: false,
			parentMenuPath: 'employeeManage',
			authModuleList: ['basic-archives_employee-manage']
		}
	}, {
		// 基础档案-客户管理
		path: 'customerManage',
		name: 'customerManage',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_customer-manage/Index.vue')) }, 'customerManage'),
		meta: {
			tagTitle: '客户管理',
			single: true,
			keepAlive: true,
			authModuleList: ['basic-archives_customer-manage', 'basic-archives_support-archives_financial-class']
		}
	}, {
		// 基础档案-客户管理详情
		path: 'customerManageDetail',
		name: 'customerManageDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_customer-manage/components/create-container/Index.vue')) }, 'customerManageDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增客户'
				} else {
					return `${query.organTypeLable || ''}:${query.name || ''}`
				}
			},
			single: false,
			parentMenuPath: 'customerManage',
			authModuleList: ['basic-archives_customer-manage', 'basic-archives_support-archives_financial-class']
		}
	}, {
		// 基础档案-品项管理
		path: 'itemManage',
		name: 'itemManage',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_item-manage/Index.vue')) }, 'itemManage'),
		meta: {
			tagTitle: '品项管理',
			single: true,
			keepAlive: true,
			authModuleList: [
				'basic-archives_item-manage',
				'basic-archives_support-archives_financial-class'
			]
		}
	}, {
		// 基础档案-品项管理详情
		path: 'itemManageDetail',
		name: 'itemManageDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_item-manage/components/create-container/Index.vue')) }, 'itemManageDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增品项'
				} else {
					return `品项:${query.name || ''}`
				}
			},
			single: false,
			parentMenuPath: 'itemManage',
			authModuleList: ['basic-archives_item-manage', 'basic-archives_support-archives_financial-class']
		}
	}, {
		// 基础档案-商品管理
		path: 'goodsManage',
		name: 'goodsManage',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_goods-manage/Index.vue')) }, 'goodsManage'),
		meta: {
			tagTitle: '商品管理',
			single: true,
			keepAlive: true,
			authModuleList: ['basic-archives_goods-manage']
		}
	}, {
		// 基础档案-商品管理详情
		path: 'goodsManageDetail',
		name: 'goodsManageDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_goods-manage/components/create-container/Index.vue')) }, 'goodsManageDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增商品'
				} else {
					return `商品:${query.name || ''}`
				}
			},
			single: false,
			parentMenuPath: 'goodsManage',
			authModuleList: ['basic-archives_goods-manage']
		}
	}, {
		// 基础档案-权限管理
		path: 'roleManage',
		name: 'roleManage',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_role-manage/Index.vue')) }, 'roleManage'),
		meta: {
			tagTitle: '权限管理',
			single: true,
			authModuleList: ['basic-archives_role-manage']
		}
	}, {
		// 基础档案-价格方案
		path: 'pricePlan',
		name: 'pricePlan',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_price-plan/Index.vue')) }, 'pricePlan'),
		meta: {
			tagTitle: '价格方案',
			single: true,
			keepAlive: true,
			authModuleList: ['basic-archives_price-plan']
		}
	}, {
		// 基础档案-价格方案详情
		path: 'pricePlanDetail',
		name: 'pricePlanDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_price-plan/components/create-container/Index.vue')) }, 'pricePlan'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增价格方案'
				} else {
					return `价格方案:${query.code || ''}`
				}
			},
			single: false,
			parentMenuPath: 'pricePlan',
			authModuleList: ['basic-archives_price-plan']
		}
	}, {
		// 基础档案-BOM设置
		path: 'bomSet',
		name: 'bomSet',
		component: r => require.ensure([], function (require) { r(require('@/views/store-account_bom-set/Index.vue')) }, 'bomSet'),
		meta: {
			tagTitle: 'BOM设置',
			single: true,
			authModuleList: [
				'basic-archives_bom-set_food-bom',
				'basic-archives_bom-set_compose-bom',
				'basic-archives_bom-set_split-bom'
			]
		}
	}, {
		// 基础档案-辅助档案-辅助分类
		path: 'supportClass',
		name: 'supportClass',
		component: r => require.ensure([], function (require) { r(require('@/views/support-archives_support-class/Index.vue')) }, 'supportClass'),
		meta: {
			tagTitle: '辅助分类',
			single: true,
			keepAlive: true,
			authModuleList: [
				'basic-archives_support-archives_financial-class',
				'basic-archives_support-archives_bussiness-type',
				'basic-archives_support-archives_take-stock-class',
				'basic-archives_support-archives_invoice-type',
				'basic-archives_support-archives_inventory-profit-reason',
				'basic-archives_support-archives_out-store-reason',
				'basic-archives_support-archives_item-custom-group',
				'basic-archives_support-archives_other-expense-type-setting'
			]
		}
	}, {
		// 基础档案-辅助档案-销售区域
		path: 'salesArea',
		name: 'salesArea',
		component: r => require.ensure([], function (require) { r(require('@/views/business-data_sales-area/Index.vue')) }, 'salesArea'),
		meta: {
			tagTitle: '销售区域',
			single: true,
			authModuleList: ['basic-archives_support-archives_sales-area']
		}
	}, {
		// 基础档案-单位使用设置
		path: 'unitSetting',
		name: 'unitSetting',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_unit-setting/Index.vue')) }, 'unitSetting'),
		meta: {
			tagTitle: '单位使用设置',
			single: true,
			keepAlive: true,
			authModuleList: ['basic-archives_unit-setting']
		}
	}, {
		// 基础档案-单位使用设置详情
		path: 'unitSettingDetail',
		name: 'unitSettingDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_unit-setting/components/create-container/Index.vue')) }, 'unitSettingDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增单位使用设置'
				} else {
					return `单位使用设置:${query.name || ''}`
				}
			},
			single: false,
			parentMenuPath: 'unitSetting',
			authModuleList: ['basic-archives_unit-setting']
		}
	}, {
		// 基础档案-货位管理
		path: 'storageManage',
		name: 'storageManage',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_storage-manage/Index.vue')) }, 'storageManage'),
		meta: {
			tagTitle: '货位管理',
			single: true,
			keepAlive: true,
			authModuleList: ['basic-archives_storage-manage']
		}
	}, {
		// 基础档案-货位管理详情
		path: 'storageManageDetail',
		name: 'storageManageDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_storage-manage/components/create-container/Index.vue')) }, 'storageManageDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增货位'
				} else {
					return `货位:${query.code || ''}`
				}
			},
			single: false,
			parentMenuPath: 'storageManage',
			authModuleList: ['basic-archives_storage-manage']
		}
	}, {
		// 基础档案-快速出库方案
		path: 'quickOutPlan',
		name: 'quickOutPlan',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_quick-out-plan/Index.vue')) }, 'quickOutPlan'),
		meta: {
			tagTitle: '快速出库方案',
			single: true,
			keepAlive: true,
			authModuleList: ['basic-archives_quick-out-plan']
		}
	}, {
		// 基础档案-快速出库方案详情
		path: 'quickOutPlanDetail',
		name: 'quickOutPlanDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_quick-out-plan/components/create-container/Index.vue')) }, 'quickOutPlanDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增快速出库方案'
				} else {
					return `快速出库方案:${query.code || ''}`
				}
			},
			single: false,
			parentMenuPath: 'quickOutPlan',
			authModuleList: ['basic-archives_quick-out-plan']
		}
	}, {
		// 系统设置-操作日志
		path: 'logManage',
		name: 'logManage',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_log-manage/Index.vue')) }, 'logManage'),
		meta: {
			tagTitle: '操作日志',
			single: true
		}
	}, {
		// 系统设置-系统参数
		path: 'systemParams',
		name: 'systemParams',
		component: r => require.ensure([], function (require) { r(require('@/views/support-archives_system-params/Index.vue')) }, 'systemParams'),
		meta: {
			tagTitle: '系统参数',
			single: true,
			authModuleList: ['system-setting_system-params']
		}
	}, {
		// 系统设置-账户设置
		path: 'accountBinding',
		name: 'accountBinding',
		component: r => require.ensure([], function (require) { r(require('@/views/application-setting_account-binding/Index.vue')) }, 'accountBinding'),
		meta: {
			tagTitle: '账户设置',
			single: true
		}
	}, {
		// 系统设置-基础数据导入
		path: 'importManage',
		name: 'importManage',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_import-manage/Index.vue')) }, 'importManage'),
		meta: {
			tagTitle: '基础数据导入',
			single: true,
			authModuleList: ['system-setting_import-manage']
		}
	}, {
		// 系统设置-数据初始化
		path: 'dataInitialization',
		name: 'dataInitialization',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_data-initialization/Index.vue')) }, 'dataInitialization'),
		meta: {
			tagTitle: '数据初始化',
			single: true,
			authModuleList: ['system-setting_data-initialization']
		}
	}, {
		// 系统设置-单据展示设置
		path: 'filterSetting',
		name: 'filterSetting',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_filter-setting/Index.vue')) }, 'filterSetting'),
		meta: {
			tagTitle: '单据展示设置',
			single: true,
			keepAlive: true,
			authModuleList: ['system-setting_filter-setting']
		}
	}, {
		// 系统设置-单据必填设置
		path: 'orderRequiredSetting',
		name: 'orderRequiredSetting',
		component: r => require.ensure([], function (require) { r(require('@/views/system-setting_order-required-setting/Index.vue')) }, 'orderRequiredSetting'),
		meta: {
			tagTitle: '单据必填设置',
			single: true,
			authModuleList: ['system-setting_order-required-setting']
		}
	}, {
		// 系统设置-单据异常警告设置
		path: 'orderMistakeCheckSetting',
		name: 'orderMistakeCheckSetting',
		component: r => require.ensure([], function (require) { r(require('@/views/system-setting_order-mistake-check-setting/Index.vue')) }, 'orderMistakeCheckSetting'),
		meta: {
			tagTitle: '单据异常警告设置',
			single: true,
			authModuleList: ['system-setting_order-mistake-check-setting']
		}
	}, {
		// 采销管理-订货方案
		path: 'stockPlan',
		name: 'stockPlan',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_stock-plan/Index.vue')) }, 'stockPlan'),
		meta: {
			tagTitle: '订货方案',
			single: true,
			keepAlive: true,
			authModuleList: ['stock-sale-manage_stock-plan']
		}
	}, {
		// 采销管理-订货方案详情
		path: 'stockPlanDetail',
		name: 'stockPlanDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/basic-archives_stock-plan/components/create-container/Index.vue')) }, 'stockPlanDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增订货方案'
				} else {
					return `订货方案:${query.code || ''}`
				}
			},
			single: false,
			parentMenuPath: 'stockPlan',
			authModuleList: ['stock-sale-manage_stock-plan']
		}
	}, {
		// 采销管理-采购计划单
		path: 'stockPlanOrder',
		name: 'stockPlanOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/stock-sale-manage_stock-plan-order/Index.vue')) }, 'stockPlanOrder'),
		meta: {
			tagTitle: '采购计划单',
			single: true,
			keepAlive: true,
			authModuleList: [
				'stock-sale-manage_stock-plan-order',
				'basic-archives_support-archives_bussiness-type',
				'stock-sale-manage_assign-manage_stock-plan'
			],
			orderRequiredBillType: 'StockPlanOrder'
		}
	}, {
		// 采销管理-采购计划单详情
		path: 'stockPlanOrderDetail',
		name: 'stockPlanOrderDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/stock-sale-manage_stock-plan-order/components/create-container/Index.vue')) }, 'stockPlanOrderDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增采购计划单'
				} else {
					return `采购计划单:${query.sysBillCode || ''}`
				}
			},
			single: false,
			parentMenuPath: 'stockPlanOrder',
			authModuleList: [
				'stock-sale-manage_stock-plan-order',
				'basic-archives_support-archives_bussiness-type',
				'stock-sale-manage_assign-manage_stock-plan'
			],
			orderRequiredBillType: 'StockPlanOrder',
			orderMistakeCheckBillType: 'StockPlanOrder'
		}
	}, {
		// 采销管理-采购订单
		path: 'stockOrder',
		name: 'stockOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/stock-sale-manage_stock-order/Index.vue')) }, 'stockOrder'),
		meta: {
			tagTitle: '采购订单',
			single: true,
			keepAlive: true,
			authModuleList: [
				'stock-sale-manage_stock-order',
				'basic-archives_support-archives_bussiness-type'
			],
			orderRequiredBillType: 'StockOrder'
		}
	}, {
		// 采销管理-采购订单详情
		path: 'stockOrderDetail',
		name: 'stockOrderDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/stock-sale-manage_stock-order/components/create-container/Index.vue')) }, 'stockOrderDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增采购订单'
				} else {
					return `采购订单:${query.sysBillCode || ''}`
				}
			},
			single: false,
			parentMenuPath: 'stockOrder',
			authModuleList: [
				'stock-sale-manage_stock-order',
				'basic-archives_support-archives_bussiness-type'
			],
			orderRequiredBillType: 'StockOrder',
			orderMistakeCheckBillType: 'StockOrder'
		}
	}, {
		// 采销管理-销售订单
		path: 'saleOrder',
		name: 'saleOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/stock-sale-manage_sale-order/Index.vue')) }, 'saleOrder'),
		meta: {
			tagTitle: '销售订单',
			single: true,
			keepAlive: true,
			authModuleList: [
				'stock-sale-manage_sale-order',
				'basic-archives_support-archives_bussiness-type',
				'stock-sale-manage_assign-manage_in-store',
				'stock-sale-manage_assign-manage_out-store'
			],
			orderRequiredBillType: 'SaleOrder'
		}
	}, {
		// 采销管理-销售订单详情
		path: 'saleOrderDetail',
		name: 'saleOrderDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/stock-sale-manage_sale-order/components/create-container/Index.vue')) }, 'saleOrderDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增销售订单'
				} else {
					return `销售订单:${query.sysBillCode || ''}`
				}
			},
			single: false,
			parentMenuPath: 'saleOrder',
			authModuleList: [
				'stock-sale-manage_sale-order',
				'basic-archives_support-archives_bussiness-type',
				'stock-sale-manage_assign-manage_in-store',
				'stock-sale-manage_assign-manage_out-store'
			],
			orderRequiredBillType: 'SaleOrder'
		}
	}, {
		// 采销管理-采购询定价单
		path: 'stockInquiryOrder',
		name: 'stockInquiryOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/stock-sale-manage_stock-inquiry-order/Index.vue')) }, 'stockInquiryOrder'),
		meta: {
			tagTitle: '采购询定价单',
			single: true,
			keepAlive: true,
			authModuleList: ['stock-sale-manage_stock-inquiry-order']
		}
	}, {
		// 采销管理-采购询定价单详情
		path: 'stockInquiryOrderDetail',
		name: 'stockInquiryOrderDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/stock-sale-manage_stock-inquiry-order/components/create-container/Index.vue')) }, 'stockInquiryOrderDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增采购询定价单'
				} else {
					return `采购询定价单:${query.sysBillCode || ''}`
				}
			},
			single: false,
			parentMenuPath: 'stockInquiryOrder',
			authModuleList: ['stock-sale-manage_stock-inquiry-order']
		}
	}, {
		// 采销管理-采购报价单
		path: 'stockOfferOrder',
		name: 'stockOfferOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/stock-sale-manage_stock-offer-order/Index.vue')) }, 'stockOfferOrder'),
		meta: {
			tagTitle: '采购报价单',
			single: true,
			keepAlive: true,
			authModuleList: ['stock-sale-manage_stock-offer-order']
		}
	}, {
		// 采销管理-采购报价单详情
		path: 'stockOfferOrderDetail',
		name: 'stockOfferOrderDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/stock-sale-manage_stock-offer-order/components/create-container/Index.vue')) }, 'stockOfferOrderDetail'),
		meta: {
			tagTitle: (query = {}) => {
				return `采购报价单:${query.sysBillCode || ''}`
			},
			single: false,
			parentMenuPath: 'stockOfferOrder',
			authModuleList: ['stock-sale-manage_stock-offer-order']
		}
	}, {
		// 采销管理-分派管理-入库分派
		path: 'inStoreAssign',
		name: 'inStoreAssign',
		component: r => require.ensure([], function (require) { r(require('@/views/assign-manage_in-store/Index.vue')) }, 'inStoreAssign'),
		meta: {
			tagTitle: '入库分派',
			single: true,
			keepAlive: true,
			authModuleList: ['stock-sale-manage_assign-manage_in-store']
		}
	}, {
		// 采销管理-分派管理-出库分派
		path: 'outStoreAssign',
		name: 'outStoreAssign',
		component: r => require.ensure([], function (require) { r(require('@/views/assign-manage_out-store/Index.vue')) }, 'outStoreAssign'),
		meta: {
			tagTitle: '出库分派',
			single: true,
			keepAlive: true,
			authModuleList: ['stock-sale-manage_assign-manage_out-store']
		}
	}, {
		// 采销管理-分派管理-采购计划单分派
		path: 'stockPlanAssign',
		name: 'stockPlanAssign',
		component: r => require.ensure([], function (require) { r(require('@/views/assign-manage_stock-plan/Index.vue')) }, 'stockPlanAssign'),
		meta: {
			tagTitle: '采购计划单分派',
			single: true,
			keepAlive: true,
			authModuleList: ['stock-sale-manage_assign-manage_stock-plan']
		}
	}, {
		// 采销管理-分派汇总表
		path: 'assignSummarySheet',
		name: 'assignSummarySheet',
		component: r => require.ensure([], function (require) { r(require('@/views/stock-sale-manage_assign-summary-sheet/Index.vue')) }, 'assignSummarySheet'),
		meta: {
			tagTitle: '分派汇总表',
			single: true,
			keepAlive: true,
			authModuleList: [
				'stock-sale-manage_sale-order',
				'store-manage_in-store-order',
				'store-manage_out-store-order'
			]
		}
	}, {
		// 库存管理-入库单
		path: 'inStoreOrder',
		name: 'inStoreOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/store-manage_in-store-order/Index.vue')) }, 'inStore'),
		meta: {
			tagTitle: '入库单',
			single: true,
			keepAlive: true,
			authModuleList: [
				'store-manage_in-store-order',
				'basic-archives_support-archives_bussiness-type'
			],
			orderRequiredBillType: 'InStore'
		}
	}, {
		// 库存管理-入库单详情
		path: 'inStoreOrderDetail',
		name: 'inStoreOrderDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/store-manage_in-store-order/components/create-container/Index.vue')) }, 'inStoreOrderDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增入库单'
				} else {
					return `入库单:${query.sysBillCode || ''}`
				}
			},
			single: false,
			authModuleList: [
				'store-manage_in-store-order',
				'basic-archives_support-archives_bussiness-type'
			],
			parentMenuPath: 'inStoreOrder',
			orderRequiredBillType: 'InStore',
			orderMistakeCheckBillType: 'InStore'
		}
	}, {
		// 库存管理-出库单
		path: 'outStoreOrder',
		name: 'outStoreOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/store-manage_out-store-order/Index.vue')) }, 'outStoreOrder'),
		meta: {
			tagTitle: '出库单',
			single: true,
			keepAlive: true,
			authModuleList: [
				'store-manage_out-store-order',
				'basic-archives_support-archives_bussiness-type'
			],
			orderRequiredBillType: 'OutStore'
		}
	}, {
		// 库存管理-出库单详情
		path: 'outStoreOrderDetail',
		name: 'outStoreOrderDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/store-manage_out-store-order/components/create-container/Index.vue')) }, 'outStoreOrderDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增出库单'
				} else {
					return `出库单:${query.sysBillCode || ''}`
				}
			},
			single: false,
			authModuleList: [
				'store-manage_out-store-order',
				'basic-archives_support-archives_bussiness-type'
			],
			parentMenuPath: 'outStoreOrder',
			orderRequiredBillType: 'OutStore',
			orderMistakeCheckBillType: 'OutStore'
		}
	}, {
		// 库存管理-调拨单
		path: 'moveOrder',
		name: 'moveOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/store-manage_move-order/Index.vue')) }, 'moveOrder'),
		meta: {
			tagTitle: '调拨单',
			single: true,
			keepAlive: true,
			authModuleList: [
				'store-manage_move-order',
				'basic-archives_support-archives_bussiness-type'
			],
			orderRequiredBillType: 'MoveOrder'
		}
	}, {
		// 库存管理-调拨单详情
		path: 'moveOrderDetail',
		name: 'moveOrderDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/store-manage_move-order/components/create-container/Index.vue')) }, 'moveOrderDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增调拨单'
				} else {
					return `调拨单:${query.sysBillCode || ''}`
				}
			},
			single: false,
			authModuleList: [
				'store-manage_move-order',
				'basic-archives_support-archives_bussiness-type'
			],
			parentMenuPath: 'moveOrder',
			orderRequiredBillType: 'MoveOrder'
		}
	}, {
		// 库存管理-盘点单
		path: 'takeStockOrder',
		name: 'takeStockOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/store-manage_take-stock-order/Index.vue')) }, 'takeStockOrder'),
		meta: {
			tagTitle: '盘点单',
			single: true,
			keepAlive: true,
			authModuleList: [
				'store-manage_take-stock-order',
				'basic-archives_support-archives_take-stock-class',
				'basic-archives_support-archives_bussiness-type'
			],
			orderRequiredBillType: 'TakeStockOrder'
		}
	}, {
		// 库存管理-盘点单详情
		path: 'takeStockOrderDetail',
		name: 'takeStockOrderDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/store-manage_take-stock-order/components/create-container/Index.vue')) }, 'takeStockOrderDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增盘点单'
				} else {
					return `盘点单:${query.sysBillCode || ''}`
				}
			},
			single: false,
			authModuleList: [
				'store-manage_take-stock-order',
				'basic-archives_support-archives_take-stock-class',
				'basic-archives_support-archives_bussiness-type'
			],
			parentMenuPath: 'takeStockOrder',
			orderRequiredBillType: 'TakeStockOrder',
			orderMistakeCheckBillType: 'TakeStockOrder'
		}
	}, {
		// 财务管理-采购发票
		path: 'purchaseInvoice',
		name: 'purchaseInvoice',
		component: r => require.ensure([], function (require) { r(require('@/views/invoice-manage_purchase-invoice/Index.vue')) }, 'purchaseInvoice'),
		meta: {
			tagTitle: '采购发票',
			single: true,
			keepAlive: true,
			authModuleList: ['financial-manage_invoice-manage_purchase-invoice']
		}
	}, {
		// 财务管理-采购发票新增
		path: 'purchaseInvoiceCreate',
		name: 'purchaseInvoiceCreate',
		component: r => require.ensure([], function (require) { r(require('@/views/invoice-manage_purchase-invoice/components/create-container/Index.vue')) }, 'purchaseInvoiceCreate'),
		meta: {
			tagTitle: '新增采购发票',
			single: false,
			authModuleList: ['financial-manage_invoice-manage_purchase-invoice']
		}
	}, {
		// 财务管理-采购发票详情
		path: 'purchaseInvoiceDetail',
		name: 'purchaseInvoiceDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/invoice-manage_purchase-invoice/components/edit-container/Index.vue')) }, 'purchaseInvoiceDetail'),
		meta: {
			tagTitle: (query = {}) => {
				return `采购发票:${query.invoicingCode || ''}`
			},
			single: false,
			authModuleList: ['financial-manage_invoice-manage_purchase-invoice']
		}
	}, {
		// 财务管理-存货核算-财务入库单
		path: 'financialInStore',
		name: 'financialInStore',
		component: r => require.ensure([], function (require) { r(require('@/views/financial-manage_inventory-accounting_financial-in-store/Index.vue')) }, 'financialInStore'),
		meta: {
			tagTitle: '财务入库单',
			single: true,
			authModuleList: ['store-manage_in-store-order']
		}
	}, {
		// 财务管理-存货核算-财务出库单
		path: 'financialOutStore',
		name: 'financialOutStore',
		component: r => require.ensure([], function (require) { r(require('@/views/financial-manage_inventory-accounting_financial-out-store/Index.vue')) }, 'financialInStore'),
		meta: {
			tagTitle: '财务出库单',
			single: true,
			authModuleList: ['store-manage_in-store-order']
		}
	}, {
		// 财务管理-资金管理-应付单
		path: 'payableOrder',
		name: 'payableOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/financial-manage_capital-manage_payable-order/Index.vue')) }, 'payableOrder'),
		meta: {
			tagTitle: '应付单',
			single: true,
			authModuleList: ['store-manage_in-store-order']
		}
	}, {
		// 财务管理-资金管理-付款单
		path: 'paymentOrder',
		name: 'paymentOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/financial-manage_capital-manage_payment-order/Index.vue')) }, 'paymentOrder'),
		meta: {
			tagTitle: '付款单',
			single: true,
			authModuleList: ['store-manage_in-store-order']
		}
	}, {
		// 财务管理-资金管理-预付单
		path: 'advancedOrder',
		name: 'advancedOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/financial-manage_capital-manage_advanced-order/Index.vue')) }, 'advancedOrder'),
		meta: {
			tagTitle: '预付单',
			single: true,
			authModuleList: ['store-manage_in-store-order']
		}
	}, {
		// 财务管理-资金管理-应付核销
		path: 'verificationOrder',
		name: 'verificationOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/financial-manage_capital-manage_verification-order/Index.vue')) }, 'verificationOrder'),
		meta: {
			tagTitle: '应付核销',
			single: true,
			authModuleList: ['store-manage_in-store-order']
		}
	}, {
		// 财务管理-资金管理-应收单
		path: 'receivableOrder',
		name: 'receivableOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/financial-manage_capital-manage_receivable-order/Index.vue')) }, 'receivableOrder'),
		meta: {
			tagTitle: '应收单',
			single: true,
			authModuleList: ['store-manage_in-store-order']
		}
	}, {
		// 财务管理-财务档案-结算方式
		path: 'settlementWay',
		name: 'settlementWay',
		component: r => require.ensure([], function (require) { r(require('@/views/financial-manage_financial-archives_settlement-way/Index.vue')) }, 'settlementWay'),
		meta: {
			tagTitle: '财务档案-结算方式',
			single: true
		}
	}, {
		// 财务管理-财务档案-机构管理
		path: 'financialOrganManage',
		name: 'financialOrganManage',
		component: r => require.ensure([], function (require) { r(require('@/views/financial-manage_financial-archives_financial-organ-manage/Index.vue')) }, 'financialOrganManage'),
		meta: {
			tagTitle: '财务档案-机构管理',
			single: true,
			authModuleList: ['basic-archives_organ-manage']
		}
	}, {
		// 财务管理-财务档案-供货商列表
		path: 'financialSupplierManage',
		name: 'financialSupplierManage',
		component: r => require.ensure([], function (require) { r(require('@/views/financial-manage_financial-archives_financial-supplier-manage/Index.vue')) }, 'financialSupplierManage'),
		meta: {
			tagTitle: '财务档案-供货商列表',
			single: true,
			authModuleList: ['basic-archives_organ-manage']
		}
	}, {
		// 财务管理-财务档案-客户列表
		path: 'financialCustomerManage',
		name: 'financialCustomerManage',
		component: r => require.ensure([], function (require) { r(require('@/views/financial-manage_financial-archives_financial-customer-manage/Index.vue')) }, 'financialCustomerManage'),
		meta: {
			tagTitle: '财务档案-客户列表',
			single: true,
			authModuleList: ['basic-archives_organ-manage']
		}
	}, {
		// 财务管理-会计期
		path: 'accountPeriod',
		name: 'accountPeriod',
		component: r => require.ensure([], function (require) { r(require('@/views/forward-manage_account-period/Index.vue')) }, 'accountPeriod'),
		meta: {
			tagTitle: '会计期',
			single: true,
			authModuleList: ['financial-manage_account-period']
		}

	}, {
		// 财务管理-月末结转
		path: 'carryForward',
		name: 'carryForward',
		component: r => require.ensure([], function (require) { r(require('@/views/forward-manage_carry-forward/Index.vue')) }, 'carryForward'),
		meta: {
			tagTitle: '月末结转',
			single: true,
			authModuleList: ['financial-manage_carry-forward']
		}
	}, {
		// 成本管理-BOM成本卡诊断
		path: 'bomDiagnosis',
		name: 'bomDiagnosis',
		component: r => require.ensure([], function (require) { r(require('@/views/store-account_bom-diagnosis/Index.vue')) }, 'bomDiagnosis'),
		meta: {
			tagTitle: 'BOM成本卡诊断',
			single: true
		}
	}, {
		// 成本管理-营业数据查询
		path: 'businessDataSearch',
		name: 'businessDataSearch',
		component: r => require.ensure([], function (require) { r(require('@/views/business-data_business-data-search/Index.vue')) }, 'businessDataSearch'),
		meta: {
			tagTitle: '营业数据查询',
			single: true,
			authModuleList: ['cost-manage_business-data-search']
		}
	}, {
		// 成本管理-菜品营业单据
		path: 'foodBusinessOrder',
		name: 'foodBusinessOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/business-data_food-business-order/Index.vue')) }, 'foodBusinessOrder'),
		meta: {
			tagTitle: '菜品营业单据',
			single: true,
			keepAlive: true,
			authModuleList: ['cost-manage_food-business-order', 'basic-archives_support-archives_bussiness-type']
		}
	}, {
		// 成本管理-菜品营业单据详情
		path: 'foodBusinessOrderDetail',
		name: 'foodBusinessOrderDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/business-data_food-business-order/components/create-container/Index.vue')) }, 'foodBusinessOrderDetail'),
		meta: {
			tagTitle: (query = {}) => {
				return `菜品营业单据:${query.sysBillCode || ''}`
			},
			single: false,
			parentMenuPath: 'foodBusinessOrder',
			authModuleList: ['cost-manage_food-business-order', 'basic-archives_support-archives_bussiness-type']
		}
	}, {
		// 成本管理-理论耗用单
		path: 'theoryCostOrder',
		name: 'theoryCostOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/business-data_theory-cost-order/Index.vue')) }, 'theoryCostOrder'),
		meta: {
			tagTitle: '理论耗用单',
			single: true,
			keepAlive: true,
			authModuleList: ['cost-manage_theory-cost-order', 'basic-archives_support-archives_bussiness-type']
		}
	}, {
		// 成本管理-理论耗用单详情
		path: 'theoryCostOrderDetail',
		name: 'theoryCostOrderDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/business-data_theory-cost-order/components/create-container/Index.vue')) }, 'theoryCostOrderDetail'),
		meta: {
			tagTitle: (query = {}) => {
				return `理论耗用单:${query.sysBillCode || ''}`
			},
			single: false,
			parentMenuPath: 'theoryCostOrder',
			authModuleList: ['cost-manage_theory-cost-order', 'basic-archives_support-archives_bussiness-type']
		}
	}, {
		// 生产管理-生产计划
		path: 'productionPlan',
		name: 'productionPlan',
		component: r => require.ensure([], function (require) { r(require('@/views/production-manage_production-plan/Index.vue')) }, 'productionPlan'),
		meta: {
			tagTitle: '生产计划',
			single: true,
			keepAlive: true,
			authModuleList: [
				'production-manage_production-plan'
			],
			orderRequiredBillType: 'productionPlan'
		}
	}, {
		// 生产管理-生产计划详情
		path: 'productionPlanDetail',
		name: 'productionPlanDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/production-manage_production-plan/components/create-container/Index.vue')) }, 'productionPlanDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增生产计划'
				} else {
					return `生产计划:${query.sysBillCode || ''}`
				}
			},
			single: false,
			authModuleList: [
				'production-manage_production-plan'
			],
			parentMenuPath: 'productionPlan',
			orderRequiredBillType: 'productionPlan'
		}
	}, {
		// 生产管理-领料单
		path: 'pickingList',
		name: 'pickingList',
		component: r => require.ensure([], function (require) { r(require('@/views/production-manage_picking-list/Index.vue')) }, 'pickingList'),
		meta: {
			tagTitle: '领料单',
			single: true,
			keepAlive: true,
			authModuleList: [
				'production-manage_picking-list'
			],
			orderRequiredBillType: 'pickingList'
		}
	}, {
		// 生产管理-领料单详情
		path: 'pickingListDetail',
		name: 'pickingListDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/production-manage_picking-list/components/create-container/Index.vue')) }, 'pickingListDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新增领料单'
				} else {
					return `领料单:${query.sysBillCode || ''}`
				}
			},
			single: false,
			authModuleList: [
				'production-manage_picking-list'
			],
			parentMenuPath: 'pickingList'
		}
	}, {
		// 生产管理-组合加工单
		path: 'machiningOrder',
		name: 'machiningOrder',
		component: r => require.ensure([], function (require) { r(require('@/views/production-manage_machining-order/Index.vue')) }, 'machiningOrder'),
		meta: {
			tagTitle: '组合加工单',
			single: true,
			keepAlive: true,
			authModuleList: [
				'production-manage_machining-order'
			],
			orderRequiredBillType: 'machiningOrder'
		}
	}, {
		// 生产管理-加工单详情
		path: 'machiningOrderDetail',
		name: 'machiningOrderDetail',
		component: r => require.ensure([], function (require) { r(require('@/views/production-manage_machining-order/components/create-container/Index.vue')) }, 'machiningOrderDetail'),
		meta: {
			tagTitle: (query = {}) => {
				if (query.openType === 'add') {
					return '新建组合加工单'
				} else {
					return `组合加工单:${query.sysBillCode || ''}`
				}
			},
			single: false,
			authModuleList: [
				'production-manage_machining-order'
			],
			parentMenuPath: 'pickingList'
		}
	}, {
		// 生产管理-默认仓库设置
		path: 'dosingDefaultHouse',
		name: 'dosingDefaultHouse',
		component: r => require.ensure([], function (require) { r(require('@/views/production-manage_dosing-default-house/Index.vue')) }, 'dosingDefaultHouse'),
		meta: {
			tagTitle: '默认仓库设置',
			single: true,
			authModuleList: ['production-manage_dosing-default-house']
		}
	}, {
		// 生产管理（MES）嵌入部分
		path: 'productionManage',
		name: 'productionManage',
		component: r => require.ensure([], function (require) { r(require('@/views/production-manage/Index.vue')) }, 'productionManage'),
		meta: {
			tagTitle: (query = {}) => {
				return query.tagTitle
			},
			single: false,
			authModuleList: [
				'production-manage_production-plan',
				'basic-archives_support-archives_bussiness-type'
			]
		}
	}, {
		// 报表
		path: 'report',
		name: 'report',
		component: r => require.ensure([], function (require) { r(require('@/views/report/Index.vue')) }, 'report'),
		meta: {
			tagTitle: '报表',
			single: false
		}
	}, {
		// 报表2.0
		path: 'reportNew',
		name: 'reportNew',
		component: r => require.ensure([], function (require) { r(require('@/views/reportNew/Index.vue')) }, 'report'),
		meta: {
			tagTitle: '报表2.0',
			keepAlive: true,
			single: true
		}
	}, {
		// 极速订商城
		path: 'biubiuorder',
		name: 'biubiuorder',
		component: r => require.ensure([], function (require) { r(require('@/views/biubiuorder/Index.vue')) }, 'biubiuorder'),
		meta: {
			tagTitle: '极速订商城',
			single: false
		}
	}]
}]
