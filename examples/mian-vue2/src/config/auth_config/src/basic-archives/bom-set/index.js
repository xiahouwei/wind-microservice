import FOOD_BOM from './food-bom/index.js'
import COMPOSE_BOM from './compose-bom/index.js'
import SPLIT_BOM from './split-bom/index.js'
export default {
	'bom-set': {
		id: 'bom-set',
		label: 'BOM设置',
		code: '0001_0009',
		child: {
			...FOOD_BOM,
			...COMPOSE_BOM,
			...SPLIT_BOM
		}
	}
}
