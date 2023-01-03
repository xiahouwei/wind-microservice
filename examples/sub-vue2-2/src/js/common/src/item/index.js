// 获取默认图片 by shw
const getDefaultImg = function (type) {
	switch (type) {
	case 'item':
		return require('@/assets/images/img/no-item-img.png')
	default:
		return require('@/assets/images/img/default-img.png')
	}
}
const QINGSTOR_BASE_URL = 'http://fx-ygyl.pek3a.qingstor.com'
// 默认品项图片路径 by shw
const errorImg = function (type) {
	return 'this.src="' + getDefaultImg(type) + '"'
}
// 默认图片前缀
const getImgBaseUrl = function () {
	return QINGSTOR_BASE_URL
}
// 查询当前品项默认单位 by shw
// const findCurrentUnit = function (units) {
// 	if (!units) {
// 		return {}
// 	}
// 	return units.find(item => !!item.is_default)
// }
// 查询当前品项默认单位索引 by shw
// const findCurrentUnitIndex = function (units) {
// 	return units.findIndex(item => !!item.is_default)
// }
// 过滤掉数量/辅助数量为0的品项
// const filterItemByEmptyAmount = function (details) {
// 	return details.filter(item => {
// 		return item.assist_unit_flag ? !!item.assist_amount : !!item.main_amount
// 	})
// }

export default {
	getDefaultImg,
	errorImg,
	getImgBaseUrl
}
