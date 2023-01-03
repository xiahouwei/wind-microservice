import utilsArray from './src/array'
import { fxCache } from './src/cache'
import utilsDate from './src/date'
import utilsDebounce from './src/debounce'
import { fxDebug } from './src/debug'
import utilsNumber from './src/number'
import utilsPlatform from './src/platform'
import utilsPolling from './src/polling'
import utilsReg from './src/reg'
import { fxRequestAnimationFrame, cancelAnimationFrame } from './src/requestAnimationFrame'
import utilsScroll from './src/scrollTop'
import utilsString from './src/string'
import utilsTable from './src/table'
import utilsThrottle from './src/throttle'
import utilsType from './src/type'
import utilsFunc from './src/utils'
import { fxDataVerification } from './src/verification'
import vueUtils from './src/vueUtils'

export default {
	fxRequestAnimationFrame,
	cancelAnimationFrame,
	fxDataVerification,
	fxCache,
	fxDebug,
	...utilsArray,
	...utilsDate,
	...utilsDebounce,
	...utilsNumber,
	...utilsPlatform,
	...utilsPolling,
	...utilsReg,
	...utilsScroll,
	...utilsString,
	...utilsTable,
	...utilsThrottle,
	...utilsType,
	...utilsFunc,
	...vueUtils
}
