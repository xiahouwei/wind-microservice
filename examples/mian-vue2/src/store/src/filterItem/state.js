import { FILTER_SETTING_CONFIG } from '@/config/filter_item_config'
import { getStorageJson } from '../utils'
export default {
	// 单据展示设置基础配置
	filterSettingConfig: FILTER_SETTING_CONFIG,
	// 用户设置单据展示设置
	appFilterConfig: getStorageJson('appFilterConfig', {})
}
