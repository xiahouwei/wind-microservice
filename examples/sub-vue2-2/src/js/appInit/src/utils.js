// 项目常用函数
import service from '@/js/service/index'
import utils from '@/js/lib/utils'
import common from '@/js/common'
import stateMiddleware from '@/js/stateMiddleware'
import typeMiddleware from '@/js/typeMiddleware'
import fxApi, { downloadFile } from '@/js/api/index'
import calculation from '@/js/lib/calculation'
// import { fxAuth, fxSysAuth, fxAuthModule } from '@/js/auth/index'

export default (vue) => {
	vue.prototype.$fxHttp = service
	vue.prototype.$fxUtils = utils
	vue.prototype.$fxCommon = common
	vue.prototype.$fxStateMiddleware = stateMiddleware
	vue.prototype.$fxTypeMiddleware = typeMiddleware
	vue.prototype.$fxApi = fxApi
	vue.prototype.$fxApiDownload = downloadFile
	vue.prototype.$fxCalculation = calculation
	// vue.prototype.$fxAuth = fxAuth
	// vue.prototype.$fxSysAuth = fxSysAuth
	// vue.prototype.$fxAuthModule = fxAuthModule
}
