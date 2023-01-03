import { getStorageJson } from '../utils'
export default {
	// 用户设置单据必填设置
	appOrderRequiredConfig: getStorageJson('appOrderRequiredConfig', {})
}
