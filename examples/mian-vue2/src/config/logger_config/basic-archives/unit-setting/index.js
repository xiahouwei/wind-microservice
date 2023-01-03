import app from '@/main.js'
import { COMMON_TYPE_CONFIG } from '@/config/app_common_type_config.js'
const unitSettingBillClassList = COMMON_TYPE_CONFIG.unitSettingBillClassList
export default {
	id: 'unit-setting',
	label: '单位使用设置',
	actions: [{
		id: 'setting',
		label: '设置',
		messageHandler ({ itemName, data, unitList }) {
			const billClassObj = unitSettingBillClassList.find(item => item.id === data.billClass)
			const messageArr = []
			billClassObj.billtype.forEach(type => {
				const rdcData =	data.params[type.id][0]
				const shopData =	data.params[type.id][1]
				const billTypeMessage = `单据类型：${type.name}`
				if (billClassObj.id === 'CheckBill') {
					const rdcDataBigUnitName = (unitList.find(item => item.id === rdcData.unitIdBig) || {}).name || '/'
					const rdcDataSmallUnitName = (unitList.find(item => item.id === rdcData.unitIdSmall) || {}).name || '/'
					const rdcDataMessage = rdcData.customFlag ? `全部，大单位：${rdcDataBigUnitName}，小单位：${rdcDataSmallUnitName}` : '自定义'
					const rdcSetTypeMessage = rdcData.setType === 1 ? '单单位盘点' : '双单位盘点'
					const shopDataBigUnitName = 	(unitList.find(item => item.id === shopData.unitIdBig) || {}).name || '/'
					const shopDataSmallUnitName = (unitList.find(item => item.id === shopData.unitIdSmall) || {}).name || '/'
					const shopDataMessage = shopData.customFlag ? `全部，大单位：${shopDataBigUnitName}，小单位：${shopDataSmallUnitName}` : '自定义'
					const shopSetTypeMessage = shopData.setType === 1 ? '单单位盘点' : '双单位盘点'
					messageArr.push(`${billTypeMessage}，配送中心设置：${rdcSetTypeMessage}，${rdcDataMessage}，门店设置：${shopSetTypeMessage}，${shopDataMessage}`)
				} else {
					const rdcDataUnitName = (unitList.find(item => item.id === rdcData.unitId) || {}).name || '/'
					const rdcDataMessage = rdcData.customFlag ? `全部，单位：${rdcDataUnitName}` : '自定义'
					const shopDataUnitName = (unitList.find(item => item.id === shopData.unitId) || {}).name || '/'
					const shopDataMessage = shopData.customFlag ? `全部，单位：${shopDataUnitName}` : '自定义'
					messageArr.push(`${billTypeMessage}，配送中心设置：${rdcDataMessage}，门店设置：${shopDataMessage}`)
				}
			})
			return `品项名称:${itemName}, 单据种类:${billClassObj.name}, 设置信息：${messageArr.join('；')}`
		}
	}, {
		id: 'delete',
		label: '删除',
		messageHandler ({ item }) {
			return `品项名称:${item}`
		}
	}, {
		id: 'customSetting',
		label: '自定义设置',
		messageHandler ({ itemName, data, billClass, billType, organType, unitList, organList, setType }) {
			const billClassObj = unitSettingBillClassList.find(item => item.id === billClass)
			const billTypeName = billClassObj.billtype.find(item => item.id === billType).name
			const messageArr = []
			data.forEach(item => {
				const unitName = (unitList.find(unit => unit.id === item.unitId) || {}).name || '/'
				const unitBigName = (unitList.find(unit => unit.id === item.bigUnitId) || {}).name || '/'
				const unitSmallName = (unitList.find(unit => unit.id === item.smallUnitId) || {}).name || '/'
				const organNames = app.vue.$fxUtils.getSelectMulityById(item.organIds, organList).map(item => item.name).join('，')
				const unitSetTypeMessage = billClass !== 'CheckBill' ? '' : `${setType === 1 ? '单单位盘点' : '双单位盘点'}，`
				const unitMessage = billClass !== 'CheckBill' ? `单位：${unitName}` : `大单位：${unitBigName}，小单位：${unitSmallName}`
				messageArr.push(`${unitSetTypeMessage}${unitMessage}，${organType === 1 ? '配送中心' : '门店'}：${organNames}`)
			})
			return `品项名称:${itemName}, 单据种类:${billClassObj.name}, 单据类型:${billTypeName}, 设置信息：${messageArr.join('；')}`
		}
	}, {
		id: 'importModel',
		label: '导入',
		messageHandler ({ name }) {
			return `文件名称:${name}`
		}
	}, {
		id: 'exportModel',
		label: '导出空白模板',
		messageHandler () {
			return '导出空白模板'
		}
	}]
}
