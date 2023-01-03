import library from './library.js'
import app from '@/main.js'
export default {
	id: 'price-plan',
	label: '价格方案',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ name }) {
			return `方案名称:${name}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'recover',
		label: '恢复',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'recyclingDelete',
		label: '回收站删除',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'copy',
		label: '复制方案',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'enable',
		label: '启用',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'disable',
		label: '停用',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'check',
		label: '审核',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'uncheck',
		label: '反审核',
		messageHandler ({ names }) {
			return `方案名称:${names}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name }) {
			return `方案名称:${name};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addMulityDetails',
		label: '批量新增明细',
		messageHandler ({ selectRows, name }) {
			const _name = selectRows.map(item => item.item.name).join(',')
			return `方案名称:${name},品项名称:${_name}`
		}
	}, {
		id: 'addDetails',
		label: '新增明细',
		messageHandler ({ name, details }) {
			return `方案名称:${name},品项名称:${details.item.name}`
		}
	}, {
		id: 'deleteDetails',
		label: '删除明细',
		messageHandler ({ name, select }) {
			const itemNames = select.map(item => {
				return item.item.name
			}).join(',')
			return `方案名称:${name},品项名称:${itemNames}`
		}
	}, {
		id: 'updateDetails',
		label: '修改明细',
		messageHandler ({ pre, cur, name, itemName }) {
			return `方案名称:${name},品项名称:${itemName};修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'settingMulityDetails',
		label: '批量设置明细',
		messageHandler ({ name, select, type, params }) {
			const itemNames = select.map(item => {
				return item.item.name
			}).join(',')
			let settingInfo
			if (type === 0) {
				const strategy = app.vue.$fxTypeMiddleware.getCommonTypeItemById('strategyType')(params.strategy).label
				settingInfo = `价格策略修改为${strategy}`
				if (params.priceFlag) {
					settingInfo += `,非税单价修改为${params.price}`
				}
				if (params.taxRateFlag) {
					settingInfo += `,税率修改为${app.vue.$fxUtils.toFixed(params.taxRate * 100)}%`
				}
				if (params.taxPriceFlag) {
					settingInfo += `,含税单价修改为${params.taxPrice}`
				}
			} else if (type === 1) {
				settingInfo = `税率修改为${app.vue.$fxUtils.toFixed(params.taxRate * 100)}%`
			} else if (type === 2) {
				settingInfo = `明细备注修改为${params.memo}`
			}
			return `方案名称:${name},品项名称:${itemNames},${settingInfo}`
		}
	}, {
		id: 'mistakeDeleteDetails',
		label: '异常警告删除明细',
		messageHandler ({ name, select }) {
			const itemNames = select.map(item => {
				return item.item.name
			}).join(',')
			return `方案名称:${name},品项名称:${itemNames}`
		}
	}, {
		id: 'exportModel',
		label: '导出空白模板',
		messageHandler ({ name }) {
			return `方案名称:${name}`
		}
	}, {
		id: 'exportData',
		label: '导出明细数据',
		messageHandler ({ name }) {
			return `方案名称:${name}`
		}
	}, {
		id: 'importModel',
		label: '按模板导入',
		messageHandler ({ name, fileName }) {
			return `方案名称:${name},文件名称:${fileName}`
		}
	}]
}
