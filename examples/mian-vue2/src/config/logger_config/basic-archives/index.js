import ORGAN_MANAGE from './organ-manage/index.js'
import SUPPLIER_MANAGE from './supplier-manage/index.js'
import EMPLOYEE_MANAGE from './employee-manage/index.js'
import CUSTOMER_MANAGE from './customer-manage/index.js'
import ITEM_MANAGE from './item-manage/index.js'
import GOODS_MANAGE from './goods-manage/index.js'
import ROLE_MANAGE from './role-manage/index.js'
import PRICE_PLAN from './price-plan/index.js'
import BOM from './bom/index.js'
import SUPPORT_ARCHIVES from './support-archives/index.js'
import UNIT_SETTING from './unit-setting/index.js'
import STORAGE_MANAGE from './storage-manage/index.js'
import QUICK_OUT_PLAN from './quick-out-plan/index.js'
export default {
	id: 'basic-archives',
	label: '基础档案',
	child: [
		ORGAN_MANAGE,
		SUPPLIER_MANAGE,
		CUSTOMER_MANAGE,
		EMPLOYEE_MANAGE,
		ITEM_MANAGE,
		GOODS_MANAGE,
		ROLE_MANAGE,
		PRICE_PLAN,
		BOM,
		SUPPORT_ARCHIVES,
		UNIT_SETTING,
		STORAGE_MANAGE,
		QUICK_OUT_PLAN
	]
}
