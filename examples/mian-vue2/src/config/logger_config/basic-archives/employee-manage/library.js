import app from '@/main.js'
const createFileMessage = function (file) {
	return file.appendixUrl
}
const createManageOrganMessage = function (item) {
	return `机构名称:${item.name}`
}
const createManageSupplierMessage = function (item) {
	return `供货商名称:${item.name}`
}
const createManageCustomerMessage = function (item) {
	return `客户名称:${item.name}`
}
const createManageStoreMessage = function (item) {
	return `店铺名称:${item.name}`
}
const createManageSubordinateMessage = function (item) {
	return `下属名称:${item.name}`
}
export default {
	main: [{
		id: 'organName',
		label: '直属机构',
		type: 'basic'
	}, {
		id: 'imageUrl',
		label: '员工图片',
		type: 'basic'
	}, {
		id: 'code',
		label: '员工编号',
		type: 'basic'
	}, {
		id: 'name',
		label: '员工名称',
		type: 'basic'
	}, {
		id: 'username',
		label: '用户名',
		type: 'basic'
	}, {
		id: 'password',
		label: '密码',
		type: 'basic',
		handler ({ pre, cur }) {
			return '密码修改'
		}
	}, {
		id: 'phone',
		label: '联系电话',
		type: 'basic'
	}, {
		id: 'enableFlag',
		label: '启停状态',
		type: 'basic',
		handler ({ pre, cur }) {
			const getEnableState = app.vue.$fxStateMiddleware.getStateObj('enableState')
			const preState = getEnableState(pre).label
			const curState = getEnableState(cur).label
			return `启停状态由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'roleList',
		label: '所属角色',
		type: 'basic'
	}, {
		id: 'manageAllOrgan',
		label: '该员工可管理哪些机构',
		type: 'connect',
		handler ({ pre, cur }) {
			const getManageAllOrgan = app.vue.$fxTypeMiddleware.getCommonTypeItemById('manageAllOrganType')
			const preState = getManageAllOrgan(pre).label
			const curState = getManageAllOrgan(cur).label
			return `该员工可管理哪些机构由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'manageAllSupplier',
		label: '该员工可管理哪些供货商',
		type: 'connect',
		handler ({ pre, cur }) {
			const getManageAllSupplier = app.vue.$fxTypeMiddleware.getCommonTypeItemById('manageAllSupplierType')
			const preState = getManageAllSupplier(pre).label
			const curState = getManageAllSupplier(cur).label
			return `该员工可管理哪些供货商由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'manageAllCustom',
		label: '该员工可管理哪些客户',
		type: 'connect',
		handler ({ pre, cur }) {
			const getManageAllCustom = app.vue.$fxTypeMiddleware.getCommonTypeItemById('manageAllCustomerType')
			const preState = getManageAllCustom(pre).label
			const curState = getManageAllCustom(cur).label
			return `该员工可管理哪些客户由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'toDealWorkType',
		label: '待办工作接受范围',
		type: 'connect',
		handler ({ pre, cur }) {
			const getManageAllOrgan = app.vue.$fxTypeMiddleware.getCommonTypeItemById('toDealWorkType')
			const preState = getManageAllOrgan(pre).label
			const curState = getManageAllOrgan(cur).label
			return `待办工作接受范围由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'haveCostPower',
		label: '可见成本金额',
		type: 'connect',
		handler ({ pre, cur }) {
			const preState = pre ? '是' : '否'
			const curState = cur ? '是' : '否'
			return `可见成本金额由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'haveMoneyPower',
		label: '可见销售额和利润',
		type: 'connect',
		handler ({ pre, cur }) {
			const preState = pre ? '是' : '否'
			const curState = cur ? '是' : '否'
			return `可见销售额和利润由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'email',
		label: 'E-mail地址',
		type: 'other'
	}, {
		id: 'position',
		label: '职位',
		type: 'other'
	}, {
		id: 'idCard',
		label: '身份证号',
		type: 'other'
	}, {
		id: 'bankCard',
		label: '银行卡号',
		type: 'other'
	}, {
		id: 'bankName',
		label: '开户银行',
		type: 'other'
	}, {
		id: 'bankCardName',
		label: '开户账号名',
		type: 'other'
	}, {
		id: 'address',
		label: '住址',
		type: 'other'
	}, {
		id: 'employeeType',
		label: '员工类型',
		type: 'shoppingOnline',
		handler ({ pre, cur }) {
			const preState = pre ? '业务' : '内控'
			const curState = cur ? '业务' : '内控'
			return `员工类型由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'autoPrint',
		label: '自动打印',
		type: 'shoppingOnline',
		handler ({ pre, cur }) {
			const preState = pre ? '启用' : '停用'
			const curState = cur ? '启用' : '停用'
			return `自动打印由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'isReceiveInformation',
		label: '接收信息',
		type: 'shoppingOnline',
		handler ({ pre, cur }) {
			const preState = pre ? '接收' : '不接收'
			const curState = cur ? '接收' : '不接收'
			return `接收信息由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'jsdAppId',
		label: '绑定微信',
		type: 'shoppingOnline',
		handler ({ pre, cur }) {
			const preState = pre ? '已绑定' : '未绑定'
			const curState = cur ? '已绑定' : '未绑定'
			return `绑定微信由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'applyStore',
		label: '适用店铺',
		type: 'shoppingOnline',
		handler ({ pre, cur }) {
			const preState = pre ? '全部店铺' : '自定义店铺'
			const curState = cur ? '全部店铺' : '自定义店铺'
			return `适用店铺由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'manageSubordinates',
		label: '管理下属',
		type: 'shoppingOnline',
		handler ({ pre, cur }) {
			const preState = pre ? '可管理' : '不可管理'
			const curState = cur ? '可管理' : '不可管理'
			return `管理下属由"${preState}"改为"${curState}"`
		}
	},
	// {
	// 	id: 'alertTemplate',
	// 	label: '提醒模板',
	//  type: 'alert',
	// 	handler ({ pre, cur }) {
	// 		const preState = pre ? '是' : '否'
	// 		const curState = cur ? '是' : '否'
	// 		return `提醒模板由"${preState}"改为"${curState}"`
	// 	}
	// },
	{
		id: 'memo',
		label: '备注',
		type: 'append'
	}, {
		id: 'appendixList',
		label: '附件资料',
		type: 'append',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '附件资料',
				pre,
				cur,
				msgHandler: createFileMessage
			})
		}
	}],
	manage: [{
		id: 'manageOrgan',
		label: '可管理机构',
		type: 'connect',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '可管理机构',
				pre,
				cur,
				msgHandler: createManageOrganMessage
			})
		}
	}, {
		id: 'manageSupplier',
		label: '可管理供货商',
		type: 'connect',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '可管理供货商',
				pre,
				cur,
				msgHandler: createManageSupplierMessage
			})
		}
	}, {
		id: 'manageCustomer',
		label: '可管理客户',
		type: 'connect',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '可管理客户',
				pre,
				cur,
				msgHandler: createManageCustomerMessage
			})
		}
	}, {
		id: 'manageStore',
		label: '适用店铺',
		type: 'shoppingOnline',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '适用店铺',
				pre,
				cur,
				msgHandler: createManageStoreMessage
			})
		}
	}, {
		id: 'manageSubordinate',
		label: '可管理下属',
		type: 'shoppingOnline',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '可管理下属',
				pre,
				cur,
				msgHandler: createManageSubordinateMessage
			})
		}
	}]
}
