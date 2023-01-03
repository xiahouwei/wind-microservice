import { get, post } from '@/js/api/dataSource'
export default {
	// BOM成本卡诊断
	bomDiagnosis: {
		// 查询按Bom冲减的菜品
		getFoodsSelectList () {
			return get({ url: 'archive/item/v1/foods/bom-offset', loading: false })
		},
		// 查询按Bom冲减的菜品
		onBomDiagnose () {
			return post({ url: 'archive/food_bom/v1/diagnosis', loading: false })
		}
	}
}
