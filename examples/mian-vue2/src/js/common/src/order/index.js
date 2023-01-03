// 单据通用方法
import app from '@/main.js'
const billVersionMap = new Map()

/**
 * @name getVersionMap
 * @desc 获取版本号Map
 * @author shw
 * @date 2021/9/22
 * @param {String} billType 单据类型
 */
function getVersionMap (billType) {
	let versionMap = billVersionMap.get(billType)
	if (!versionMap) {
		billVersionMap.set(billType, (versionMap = new Map()))
	}
	return versionMap
}

/**
 * @name normalizationBillUpdateVersion
 * @desc 格式化单据版本号
 * @author shw
 * @date 2021/9/22
 * @param {String} billType 单据类型
 * @param {Object} billData 单据 数据对象
 */
function normalizationBillUpdateVersion (billType, billData) {
	const { id, version = null } = billData
	delete billData.version
	const versionMap = getVersionMap(billType)
	versionMap.set(id, version)
	return billData
}

/**
 * @name normalizationBillDetailUpdateVersion
 * @desc 格式化单据明细版本号
 * @author shw
 * @date 2021/9/22
 * @param {String} billType 单据类型
 * @param {Object} billDetailData 单据明细 数据对象
 */
function normalizationBillDetailUpdateVersion (billType, billDetailData, billId) {
	const { billVersion = null } = billDetailData
	delete billDetailData.billVersion
	const versionMap = getVersionMap(billType)
	versionMap.set(billId, billVersion)
	return billDetailData
}


function getBillUpdateVersion (billType, key) {
	return { version: baseGetBillVersion(billType, key) }
}

function getBillDetailUpdateVersion (billType, key) {
	return { billVersion: baseGetBillVersion(billType, key) }
}

/**
 * @name baseGetBillVersion
 * @desc 获取单据版本号
 * @author shw
 * @date 2021/9/22
 * @param {String} billType 单据类型
 * @param {String} key  单据 id
 */
function baseGetBillVersion (billType, key) {
	return getVersionMap(billType).get(key)
}

/**
 * @name getTenantIdParam
 * @desc 获取tenantId 用于保存单据传参
 * @author shw
 * @date 2021/9/28
 */
function getTenantIdParam () {
	return {
		tenantId: app.vue.$store.state.loginer.tenantId
	}
}

/**
 * @name syncBillVersionByMistakeDetails
 * @desc 获取异常警告明细版本号 用于保存单据传参
 * @author shw
 * @date 2022/7/19
 * @param {String} billType 单据类型
 * @param {String} billId 单据id
 * @param {Array, Object} res 异常警告明细list
 */
function syncBillVersionByMistakeDetails (billType, billId, res) {
	const { errorDetailList } = res
	if (errorDetailList) {
		const errorList = app.vue.$fxUtils.isArray(errorDetailList) ? errorDetailList : errorDetailList.details
		if (errorList.length) {
			const { billVersion } = errorList[0]
			const versionMap = getVersionMap(billType)
			versionMap.set(billId, billVersion)
		}
	}
}

export default {
	normalizationBillUpdateVersion,
	normalizationBillDetailUpdateVersion,
	getBillUpdateVersion,
	getBillDetailUpdateVersion,
	getTenantIdParam,
	syncBillVersionByMistakeDetails
}
