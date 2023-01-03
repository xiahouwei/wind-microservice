import library from './library.js'
export default {
	id: 'bom',
	label: 'BOM设置',
	actions: [{
		id: 'add',
		label: '新增',
		messageHandler ({ code, name }) {
			return `BOM编号:${code}，BOM名称：${name}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ code, name }) {
			return `BOM编号:${code}，BOM名称：${name}`
		}
	}, {
		id: 'update',
		label: '修改',
		messageHandler ({ pre, cur, name }) {
			return `BOM名称:${name};修改信息为:` + this.createUpdateMessageByLibrary(library.main)(pre, cur)
		}
	}, {
		id: 'addDetail',
		label: '新增明细',
		messageHandler ({ code, name, addItemInfo }) {
			return `BOM编号:${code}，BOM名称：${name}，新增明细信息:${addItemInfo}`
		}
	}, {
		id: 'addMulityDetails',
		label: '批量新增明细',
		messageHandler ({ code, name, addItemInfo }) {
			return `BOM编号:${code}，BOM名称：${name}，新增明细信息:${addItemInfo}`
		}
	}, {
		id: 'manageOrgan',
		label: '适用机构',
		messageHandler ({ pre, cur, name, code }) {
			return `BOM名称:${name},BOM编号:${code};` + this.createUpdateMessageByLibrary(library.manage)({ manageOrgan: pre }, { manageOrgan: cur })
		}
	}, {
		id: 'updateDetails',
		label: '修改明细',
		messageHandler ({ pre, cur, code, name }) {
			return `BOM名称:${name},BOM编号:${code};一级配料名称:${cur.item.name},修改信息为:` + this.createUpdateMessageByLibrary(library.details)(pre, cur)
		}
	}, {
		id: 'deleteDetails',
		label: '删除明细',
		messageHandler ({ code, name, deleteItemInfo }) {
			return `BOM名称:${name},BOM编号:${code}; 删除明细信息:${deleteItemInfo}`
		}
	}, {
		id: 'copy',
		label: '复制到其他BOM',
		messageHandler ({ selectRows, name, code }) {
			const _name = selectRows.map(item => item.name).join(',')
			return `BOM名称:${name},BOM编号:${code};复制BOM名称:"${_name}"`
		}
	}, {
		id: 'copyWithBom',
		label: '与其他BOM一致',
		messageHandler ({ copyName, name, code }) {
			return `BOM名称:${name},BOM编号:${code};BOM明细与":${copyName}"一致`
		}
	}, {
		id: 'saveOffset',
		label: '保存品项的冲减设置',
		messageHandler ({ name, loggerInfo }) {
			return `BOM名称:${name},参与冲减品项由: ${loggerInfo.orignStr}; 修改为:${loggerInfo.cardStr}`
		}
	}, {
		id: 'importModel',
		label: '导入',
		messageHandler ({ name }) {
			return `文件名称:${name}`
		}
	}, {
		id: 'exportModel',
		label: '导出',
		messageHandler () {
			return '导出空白模板'
		}
	}, {
		id: 'exportDetail',
		label: '导出',
		messageHandler ({ type }) {
			return `导出${type}成本卡明细数据`
		}
	}, {
		id: 'pushMiddleGround',
		label: '推送中台',
		messageHandler ({ code, name }) {
			return `BOM名称:${name},BOM编号:${code};`
		}
	}, {
		id: 'replaceMulity',
		label: '批量替换配料',
		messageHandler ({ success, replaceInfo }) {
			let bomInfo = ''
			success.forEach(item => {
				bomInfo += `BOM名称:${item.bomName},BOM编号:${item.bomCode};`
			})
			return `${bomInfo}批量替换配料信息:将品项名称:“${replaceInfo.oldItemName}”替换为“${replaceInfo.itemName}”;`
		}
	}]
}
