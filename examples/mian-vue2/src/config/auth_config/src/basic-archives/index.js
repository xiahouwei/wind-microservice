import CUSTOMER_MANAGE from './customer-manage/index.js'
import EMPLOYEE_MANAGE from './employee-manage/index.js'
import ITEM_MANAGE from './item-manage/index.js'
import GOODS_MANAGE from './goods-manage/index.js'
import ORGAN_MANAGE from './organ-manage/index.js'
import PRICE_PLAN from './price-plan/index.js'
import ROLE_MANAGE from './role-manage/index.js'
import SUPPLIER_MANAGE from './supplier-manage/index.js'
import SUPPORT_ARCHIVES from './support-archives/index.js'
import UNIT_SETTING from './unit-setting/index.js'
import STORAGE_MANAGE from './storage-manage/index.js'
import BOM_SET from './bom-set/index.js'
import QUICK_OUT_PLAN from './quick-out-plan/index.js'
export default {
	'basic-archives': {
		id: 'basic-archives',
		label: '基础档案',
		code: '0001',
		child: {
			...CUSTOMER_MANAGE,
			...EMPLOYEE_MANAGE,
			...ITEM_MANAGE,
			...GOODS_MANAGE,
			...ORGAN_MANAGE,
			...PRICE_PLAN,
			...ROLE_MANAGE,
			...SUPPLIER_MANAGE,
			...SUPPORT_ARCHIVES,
			...UNIT_SETTING,
			...STORAGE_MANAGE,
			...BOM_SET,
			...QUICK_OUT_PLAN
		}
	}
}
