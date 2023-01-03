const LENTH_TYPE = {
	normal: 50,
	large: 100,
	max: 300
}
// 项目通用正则设置
export const APP_INPUT_CONFIG = {
	// 通用编号
	commonCode: {
		regType: 'english,number',
		maxLenth: LENTH_TYPE.normal
	},
	// 通用名称
	commonName: {
		regType: 'english,chinese,number,punctCH,punct',
		maxLenth: LENTH_TYPE.normal
	},
	// 用户名
	userName: {
		regType: 'english,chinese,number',
		maxLenth: 30
	},
	// 单位名称
	unitName: {
		regType: 'english,chinese,number',
		maxLenth: 10
	},
	// 条码
	barcode: {
		regType: 'english,number',
		maxLenth: 13
	},
	// 备注
	memo: {
		regType: 'english,chinese,number,punctCH,punct',
		maxLenth: LENTH_TYPE.max
	},
	// 长度20的编号
	shortCode: {
		regType: 'english,number',
		maxLenth: 20
	},
	// 联系电话
	phone: {
		regType: 'number',
		maxLenth: 30
	},
	// 发票号码
	invoicingCode: {
		regType: 'number',
		maxLenth: 8
	},
	// 联系人
	linkMan: {
		regType: 'english,chinese,number,punctCH,punct',
		maxLenth: 10
	},
	// 送货地址
	deliveryAddr: {
		regType: 'english,chinese,number,punctCH,punct',
		maxLenth: 200
	}
}
