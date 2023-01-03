import { APP_INPUT_CONFIG } from '@/config/app_input_config.js'
import utils from '@/js/lib/utils'
export default {
	// 获取正则体
	getFxInputReg (type) {
		return APP_INPUT_CONFIG[type].regType
	},
	// 获取输入框最大值
	getFxInputMaxLength (type) {
		return APP_INPUT_CONFIG[type].maxLenth
	},
	// 补零操作
	toFixedAutoZeroFill (val, len) {
		return utils.toFixed(val, len, true)
	}
}
