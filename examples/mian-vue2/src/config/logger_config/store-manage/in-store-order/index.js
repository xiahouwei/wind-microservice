import library from './library.js'
export default {
	id: 'in-store-order',
	label: '入库单',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ orderData, type }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')},单据类型:${type}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ orderData }) {
			if (Array.isArray(orderData)) {
				return orderData.map(billData => {
					return `系统单号:${this.createCodeSpan(billData, 'InStore')},该单据上级单据为:${billData.parentBill ? this.createCodeSpan({
						id: billData.parentBill,
						sysBillCode: billData.parentBillCode
					}, billData.parentBillType) : '无'}`
				}).join(';')
			} else {
				return `系统单号:${this.createCodeSpan(orderData, 'InStore')},该单据上级单据为:${orderData.parentBill ? this.createCodeSpan(orderData.parentBill, orderData.parentBill.billClass) : '无'}`
			}
		}
	}, {
		id: 'recyclingDelete',
		label: '回收站删除',
		messageHandler ({ orderData }) {
			if (Array.isArray(orderData)) {
				return orderData.map(billData => {
					return `系统单号:${this.createCodeSpan(billData, 'InStore')},该单据上级单据为:${billData.parentBill ? this.createCodeSpan({
						id: billData.parentBill,
						sysBillCode: billData.parentBillCode
					}, billData.parentBillType) : '无'}`
				}).join(';')
			} else {
				return `系统单号:${this.createCodeSpan(orderData, 'InStore')},该单据上级单据为:${orderData.parentBill ? this.createCodeSpan(orderData.parentBill, orderData.parentBill.billClass) : '无'}`
			}
		}
	}, {
		id: 'recover',
		label: '回收站恢复',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'submit',
		label: '提交',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'return',
		label: '退回',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'check',
		label: '审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'supplierRate',
		label: '供货商评价',
		messageHandler ({ orderData, rateInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')},供货商:${orderData.otherOrgan.name},送货速度:${rateInfo.speed}分,
			货物质量:${rateInfo.quality}分,司机服务:${rateInfo.driverService}分,备注:${rateInfo.memo}`
		}
	}, {
		id: 'updateBusinessDate',
		label: '修改业务时间',
		messageHandler ({ orderData, result }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')},业务时间由${orderData.businessDate}改为当前审核时间${result.businessDate}`
		}
	}, {
		id: 'uncheck',
		label: '反审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'recheck',
		label: '复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'unrecheck',
		label: '取消复审',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'sendSrm',
		label: '发单至SRM',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'exportMulity',
		label: '批量导出',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'endcheck',
		label: '结束并审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'splitcheck',
		label: '分批并审核',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addMulityDetails',
		label: '批量新增明细',
		messageHandler ({ addItemListInfo, orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')},批量新增明细信息:${addItemListInfo}`
		}
	}, {
		id: 'addDetails',
		label: '新增明细',
		messageHandler ({ orderData, addItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')},新增明细信息:${addItemInfo}`
		}
	}, {
		id: 'deleteDetails',
		label: '删除明细',
		messageHandler ({ orderData, deleteItemInfo }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')},删除明细信息:${deleteItemInfo};该单据上级单据为:${orderData.parentBill ? this.createCodeSpan(orderData.parentBill, orderData.parentBill.billClass) : '无'}`
		}
	}, {
		id: 'clearDetails',
		label: '清空明细',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')};该单据上级单据为:${orderData.parentBill ? this.createCodeSpan(orderData.parentBill, orderData.parentBill.billClass) : '无'}`
		}
	}, {
		id: 'updateDetails',
		label: '修改明细',
		messageHandler ({ pre, cur, orderData, itemName }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')},品项名称:${itemName};修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'settingMulityDetails',
		label: '批量设置明细',
		messageHandler ({ settingInfo, orderData, itemNames }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')},品项名称:${itemNames.join(',')},批量设置明细信息:${settingInfo}`
		}
	}, {
		id: 'syncPrice',
		label: '同步最新价格',
		messageHandler ({ orderData, itemNames }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')},品项名称:${itemNames}`
		}
	}, {
		id: 'copy',
		label: '复制单据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'exportModel',
		label: '导出空白模板',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'exportData',
		label: '导出明细数据',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'importModel',
		label: '按模板导入',
		messageHandler ({ orderData, name }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')},文件名称:${name}`
		}
	}, {
		id: 'returnGoods',
		label: '退货',
		messageHandler ({ orderData, info }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')},退货明细信息:${info}`
		}
	}, {
		id: 'returnGoodsMulity',
		label: '批量退货',
		messageHandler ({ orderData }) {
			return orderData.map(item => {
				return `系统单号:${this.createCodeSpan(item, 'InStore')},退货明细信息:${item.info}`
			})
		}
	}, {
		id: 'createPutawayTask',
		label: '生成上架任务',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'clearShelf',
		label: '清空货位',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')}`
		}
	}, {
		id: 'importOutStoreOrder',
		label: '导入出库单生成入库',
		messageHandler ({ orderData }) {
			return `系统单号:${this.createCodeSpan(orderData, 'OutStore')}`
		}
	}, {
		id: 'importOutStoreDetails',
		label: '按明细导入生成入库',
		messageHandler ({ orderData, organName, details }) {
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')},入库方:${organName},明细:${details}`
		}
	}, {
		id: 'fastOutStore',
		label: '快速出库',
		messageHandler ({ selectRows, orderData }) {
			const message = selectRows.map(item => {
				return `仓库:${item.inHouse.name},品项:${item.item.name},快速出库数量:${item.quickAmount}`
			}).join(';')
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')};快速出库信息:${message}`
		}
	}, {
		id: 'fastMove',
		label: '快速调拨',
		messageHandler ({ selectRows, orderData }) {
			const message = selectRows.map(item => {
				return `仓库:${item.inHouse.name},品项:${item.item.name},快速出库数量:${item.quickAmount},调拨入库仓库:${item.fastMoveInHouse.name}`
			}).join(';')
			return `系统单号:${this.createCodeSpan(orderData, 'InStore')};快速调拨信息:${message}`
		}
	}]
}
