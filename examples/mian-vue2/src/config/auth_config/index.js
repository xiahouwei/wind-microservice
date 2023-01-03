import BASIC_ARCHIVES from './src/basic-archives/index.js'
import SYSTEM_SETTING from './src/system-setting/index.js'
import STORE_MANAGE from './src/store-manage/index.js'
import STOCK_SALE_MANAGE from './src/stock-sale-manage/index.js'
import PRODUCTION_MANAGE from './src/production-manage/index.js'
import FINANCIAL_MANAGE from './src/financial-manage/index.js'
import REPORT_CENTRE from './src/report-centre/index.js'
import COST_MANAGE from './src/cost-manage/index.js'
import SHOPPING_ONLINE from './src/shopping-online/index.js'
import { firstButton } from './src/enum.js'
/**
 * 权限配置
 * @id {String} 权限id
 * @label {String} 权限名称
 * @code {String} 权限码
 * @decision {String[]} 控制权限联动, 当勾选当前权限, decision内的权限也被勾选,且不可取消勾选
 * @controlled {String(可解析|&规则)} 控制权限联动, 当前权限, 被controlled内的权限控制
 * controlled内的权限勾选, 当前权限也被勾选,且不可取消勾选
 * @connectDetails {String[]} 控制权限联动, 通常用在权限模块, 而非权限明细, 当勾线当前权限模块,
 * connectDetails内的权限明细都会被勾线, 而connectDetails内的权限全部取消勾选, 则当前权限模块也会取消勾选
 * example:
 * 'basic-archives': {
		id: 'basic-archives',
		label: '基础档案',
		code: '0001',
		child: {
			'organ-manage': {
				id: 'organ-manage',
				label: '机构管理',
				code: '0001_0001',
				child: {
					'add-region': {
						id: 'add-region',
						label: '添加区域',
						code: '0001_0001_001_002',
						decision: ['edit-region']
					}
				}
			}
		}
*/
export const AUTH_CONFIG = {
	...BASIC_ARCHIVES,
	...SYSTEM_SETTING,
	...STORE_MANAGE,
	...STOCK_SALE_MANAGE,
	...PRODUCTION_MANAGE,
	...FINANCIAL_MANAGE,
	...REPORT_CENTRE,
	...COST_MANAGE,
	...SHOPPING_ONLINE
}
/*
 * enum.js文件用于定义权限行为例如, add(添加) edit(编辑)
 * 我们常常可以通过权限行为, 来判断某一个权限是否符合, 也就意味着, 每个权限都应有权限行为
 * 且 每个权限的命名要参照行为而命名, 禁止在权限配置中随意命名权限行为
*/
export const FIRST_BUTTON_ENUM = firstButton
