import { getLocalStorage } from '../utils'
export default {
	// 主题颜色: 可选择[scm8 srm]
	appTheme: getLocalStorage('scm8', 'scm8')
}
