import app from '@/main.js'
const createSpecMessage = function (row) {
	function isTrue (flag) { return flag ? '是' : '否' }
	const specOne = row.spec_value_name_one ? `规格1: ${row.spec_value_name_one},` : ''
	const specTwo = row.spec_value_name_two ? ` 规格2: ${row.spec_value_name_two},` : ''
	const specThree = row.spec_value_name_three ? ` 规格3: ${row.spec_value_name_three},` : ''
	return `${specOne}${specTwo}${specThree}建议售价:${row.price}, 关联品项档案:${row.sku_name} ${row.sku_code}, 
	单位:${row.sku_unit}, 规格主图: ${row.pic}, 是否售卖: ${isTrue(row.sale_flag)}`
}
const createFileMessage = function (file) {
	return file.appendixUrl
}
const createVideoMessage = function (file) {
	return file
}
export default {
	main: [{
		id: 'name',
		label: '商品名称',
		type: 'basic'
	}, {
		id: 'secondary_name',
		label: '副名称',
		type: 'basic'
	}, {
		id: 'code',
		label: '商品编码',
		type: 'basic'
	}, {
		id: 'pic',
		label: '商品主图',
		type: 'basic',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '商品主图',
				pre,
				cur,
				msgHandler: createFileMessage
			})
		}
	}, {
		id: 'enable_flag',
		label: '启停状态',
		type: 'basic',
		handler ({ pre, cur }) {
			const getEnableState = app.vue.$fxStateMiddleware.getStateObj('enableState')
			const preState = getEnableState(pre ? 1 : 0).label
			const curState = getEnableState(cur ? 1 : 0).label
			return `启停状态由"${preState}"改为"${curState}"`
		}
	}, {
		id: 'video',
		label: '商品视频',
		type: 'basic',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '商品视频',
				pre,
				cur,
				msgHandler: createVideoMessage
			})
		}
	}, {
		id: 'spu_sku',
		label: '规格信息',
		type: 'detail',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '规格信息',
				pre,
				cur,
				msgHandler: createSpecMessage
			})
		}
	}]
}
