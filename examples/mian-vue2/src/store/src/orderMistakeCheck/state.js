import { getStorageJson } from '../utils'
export default {
	// 用户设置单据异常警告设置
	appOrderMistakeCheckConfig: getStorageJson('appOrderMistakeCheckConfig', {})
}
