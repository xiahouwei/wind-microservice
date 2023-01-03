// 项目通用状态设置
const STATE_MODULE = {
	// 启停状态 0. 已停用 1. 已启用
	enableState: [{
		id: 0,
		label: '已停用',
		icon: 'red'
	}, {
		id: 1,
		label: '已启用',
		icon: 'green'
	}],
	// 门店、配送中心参与冲减状态 0. 不冲减 1. 冲减
	offsetState: [{
		id: 0,
		label: '不冲减',
		icon: 'red'
	}, {
		id: 1,
		label: '冲减',
		icon: 'green'
	}],
	// 菜品营业单据冲减状态
	billOffsetState: [{
		id: 0,
		label: '未冲减',
		icon: 'black'
	}, {
		id: 1,
		label: '已冲减',
		icon: 'green'
	}, {
		id: 2,
		label: '无需冲减',
		icon: 'orange'
	}],
	// 结转状态 0. 未使用 1. 使用中 2. 已结转
	accountingState: [{
		id: 0,
		label: '未使用',
		icon: 'black'
	}, {
		id: 1,
		label: '使用中',
		icon: 'blue'
	}, {
		id: 2,
		label: '已月结',
		icon: 'green'
	}, {
		id: 3,
		label: '月结中',
		icon: 'orange'
	}, {
		id: 4,
		label: '反月结中',
		icon: 'red'
	}],
	// 方案通用状态
	planState: [{
		id: 0,
		label: '未审核',
		type: 'unChecked',
		icon: 'blue'
	}, {
		id: 1,
		label: '已审核',
		type: 'checked',
		icon: 'green'
	}, {
		id: 2,
		label: '已删除',
		type: 'deleted',
		icon: 'red'
	}],
	// 方案通用状态
	planSearchState: [{
		id: 0,
		label: '未审核',
		type: 'unChecked',
		icon: 'blue'
	}, {
		id: 1,
		label: '已审核',
		type: 'checked',
		icon: 'green'
	}],
	// 采购方案状态
	stockPlanState: [{
		id: 0,
		label: '未审核',
		type: 'unChecked',
		icon: 'blue'
	}, {
		id: 1,
		label: '已审核',
		type: 'checked',
		icon: 'green'
	}],
	// 单据通用状态
	billState: [{
		id: 0,
		label: '待提交',
		type: 'unSubmit',
		icon: 'black'
	}, {
		id: 1,
		label: '待审核',
		type: 'unChecked',
		icon: 'blue'
	}, {
		id: 2,
		label: '已审核',
		type: 'checked',
		icon: 'green'
	}, {
		id: 3,
		label: '已删除',
		type: 'deleted',
		icon: 'red'
	}, {
		id: 4,
		label: '已复审',
		type: 'rechecked',
		icon: 'deep-green'
	}],
	// 财务单据通用状态
	financialOrderState: [{
		id: 0,
		label: '待提交',
		type: 'unSubmit',
		icon: 'black'
	}, {
		id: 1,
		label: '待审核',
		type: 'unChecked',
		icon: 'blue'
	}, {
		id: 2,
		label: '已审核',
		type: 'checked',
		icon: 'green'
	}, {
		id: 3,
		label: '已删除',
		type: 'deleted',
		icon: 'red'
	}, {
		id: 4,
		label: '已复审',
		type: 'rechecked',
		icon: 'deep-green'
	}, {
		id: 5,
		label: '已勾稽',
		type: 'Articulation',
		icon: 'orange'
	}],
	// 单据通用复审状态
	recheckState: [{
		id: 1,
		label: '已复审',
		type: 'rechecked',
		icon: 'deep-green'
	}],
	// 单据查询通用状态
	billSearchState: [{
		id: 0,
		label: '待提交'
	}, {
		id: 1,
		label: '待审核'
	}, {
		id: 2,
		label: '已审核'
	}, {
		id: 4,
		label: '已复审'
	}],
	// 财务单据查询通用状态
	financialOrderSearchState: [{
		id: 0,
		label: '待提交'
	}, {
		id: 1,
		label: '待审核'
	}, {
		id: 2,
		label: '已审核'
	}, {
		id: 4,
		label: '已复审'
	}, {
		id: 5,
		label: '已勾稽'
	}],
	// 财务应付核销单据状态
	verificationOrderState: [{
		id: 0,
		label: '未核销',
		type: 'unWrittenOff',
		icon: 'black'
	}, {
		id: 1,
		label: '已核销',
		type: 'writtenOff',
		icon: 'green'
	}],
	// 财务-应付核销查询状态
	verificationBillSearchState: [{
		id: 0,
		label: '未核销'
	}, {
		id: 1,
		label: '已核销'
	}],
	// 财务-应付核销-核销方式查询
	verificationWayFilter: [{
		id: 1,
		label: '自动核销'
	}, {
		id: 2,
		label: '手动核销'
	}, {
		id: 3,
		label: '差异核销'
	}],
	// 财务-应付核销-核销方式显示
	verificationWay: [{
		id: 0,
		label: ''
	}, {
		id: 1,
		label: '自动核销'
	}, {
		id: 2,
		label: '手动核销'
	}, {
		id: 3,
		label: '差异核销'
	}],
	// 菜品营业单据查询用状态
	foodBusinessBillSearchState: [{
		id: 0,
		label: '待提交',
		icon: 'black'
	}, {
		id: 1,
		label: '待审核',
		icon: 'blue'
	}, {
		id: 2,
		label: '已审核',
		icon: 'green'
	}],
	// 分派状态
	assignState: [{
		id: 0,
		label: '未分派',
		type: 'unassign',
		icon: 'black'
	}, {
		id: 1,
		label: '分派中',
		type: 'assigning',
		icon: 'blue'
	}, {
		id: 2,
		label: '已分派',
		type: 'assigned',
		icon: 'green'
	}, {
		id: 3,
		label: '已放弃',
		type: 'abandoned',
		icon: 'gray'
	}],
	// 入库分派状态
	inAssignState: [{
		id: 0,
		label: '可入库',
		type: 'unassign',
		icon: 'black'
	}, {
		id: 1,
		label: '待入库',
		type: 'assigning',
		icon: 'blue'
	}, {
		id: 2,
		label: '入库结束',
		type: 'assigned',
		icon: 'green'
	}, {
		id: 3,
		label: '无需分派',
		type: 'noassign',
		icon: 'green'
	}],
	// 出库分派状态
	outAssignState: [{
		id: 1,
		label: '待出库',
		type: 'assigning',
		icon: 'blue'
	}, {
		id: 2,
		label: '出库结束',
		type: 'assigned',
		icon: 'green'
	}],
	// 打印状态
	printState: [{
		id: 0,
		label: '未打印',
		type: 'unprint',
		icon: 'blue'
	}, {
		id: 1,
		label: '已打印',
		type: 'printed',
		icon: 'green'
	}],
	// 发单至srm状态
	sendSrmState: [{
		id: 0,
		label: '未发单',
		type: 'unsend',
		icon: 'gray'
	}, {
		id: 1,
		label: '已发单',
		type: 'sended',
		icon: 'green'
	}],
	// 采购报价单发单状态
	stockOffersendState: [{
		id: 2,
		label: '未发单',
		type: 'unsend',
		icon: 'gray'
	}, {
		id: 1,
		label: '已发单',
		type: 'sended',
		icon: 'green'
	}],
	// 发单状态
	sendState: [{
		id: 0,
		label: '未发单',
		type: 'unsend',
		icon: 'red'
	}, {
		id: 1,
		label: '无法发单',
		type: 'cantSend',
		icon: 'red'
	}, {
		id: 2,
		label: '已发单',
		type: 'sended',
		icon: 'green'
	}, {
		id: 3,
		label: '已同意',
		type: 'agreen',
		icon: 'green'
	}, {
		id: 4,
		label: '已拒绝',
		type: 'reject',
		icon: 'green'
	}, {
		id: 5,
		label: '已结束',
		type: 'finish',
		icon: 'green'
	}],
	// 生成报价单状态
	stockOfferState: [{
		id: 0,
		label: '未生成',
		type: 'uncreate',
		icon: 'black'
	}, {
		id: 1,
		label: '已生成',
		type: 'created',
		icon: 'green'
	}],
	// 单据查询生成报价单状态
	billSearchOfferState: [{
		id: 0,
		label: '未生成'
	}, {
		id: 1,
		label: '已生成'
	}],
	// 加急状态
	urgentState: [{
		id: 0,
		label: '不加急',
		type: 'unurgent',
		icon: 'green'
	}, {
		id: 1,
		label: '加急',
		type: 'urgented',
		icon: 'red'
	}],
	// 调拨单同意状态
	moveState: [{
		id: 0,
		label: '待同意',
		type: 'untreated',
		icon: 'blue'
	}, {
		id: 1,
		label: '已同意',
		type: 'agreen',
		icon: 'green'
	}, {
		id: 2,
		label: '已拒绝',
		type: 'reject',
		icon: 'red'
	}],
	// 日志状态
	logState: [{
		id: 0,
		label: '失败',
		type: 'fail',
		icon: 'black'
	}, {
		id: 1,
		label: '成功',
		type: 'success',
		icon: 'green'
	}, {
		id: 2,
		label: '异常',
		type: 'abnormal',
		icon: 'red'
	}],
	// 发票状态
	invoiceState: [{
		id: 0,
		label: '未勾稽',
		type: 'unArticulation',
		icon: 'black'
	}, {
		id: 1,
		label: '已勾稽',
		type: 'Articulation',
		icon: 'green'
	}, {
		id: 2,
		label: '已红冲',
		type: 'cancellation',
		icon: 'red'
	}, {
		id: 3,
		label: '红字',
		type: 'redMark',
		icon: 'red'
	}],
	// 结转状态
	carryForwardState: [
		{
			id: 1,
			label: '未结转',
			icon: 'black'
		}, {
			id: 3,
			label: '结转中',
			icon: 'blue'
		}, {
			id: 4,
			label: '反结转中',
			icon: 'blue'
		}, {
			id: 5,
			label: '结转失败',
			icon: 'red'
		}
	],
	// 营业数据 同步状态
	syncState: [
		{
			id: 1,
			label: '已导入',
			icon: 'green'
		}, {
			id: 0,
			label: '未同步',
			icon: 'red'
		}
	],
	// 生产计划 是否生成领用单，加工单，工序任务 查询通用状态
	processSearchState: [
		{
			id: 1,
			label: '已生成',
			icon: 'green'
		}, {
			id: 0,
			label: '未生成',
			icon: 'red'
		}
	],
	// 领料完成状态
	pickCompleteState: [
		{
			id: 1,
			label: '已完成',
			type: 'completed',
			icon: 'green'
		},
		{
			id: 0,
			label: '未完成',
			type: 'uncomplete',
			icon: 'black'
		}
	],
	// 工序任务单状态
	productionState: [{
		id: 2,
		label: '待认领',
		icon: 'black'
	}, {
		id: 3,
		label: '待开工',
		icon: 'orange'
	}, {
		id: 4,
		label: '进行中',
		icon: 'blue'
	}, {
		id: 5,
		label: '已完成',
		icon: 'green'
	}],

	// SRM对接-采购订单接单状态
	srmReceiveState: [{
		id: 0,
		label: '待接单',
		icon: 'black'
	}, {
		id: 1,
		label: '待发货',
		icon: 'blue'
	}, {
		id: 2,
		label: '已放弃',
		icon: 'red'
	}, {
		id: 3,
		label: '已发货',
		icon: 'green'
	}]

}
export default STATE_MODULE
