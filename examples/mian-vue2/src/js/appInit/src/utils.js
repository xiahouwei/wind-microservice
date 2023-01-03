// 项目常用函数
import service, { fxLoading } from '@/js/service/index'
import utils from '@/js/lib/utils'
import common from '@/js/common'
import stateMiddleware from '@/js/stateMiddleware'
import typeMiddleware from '@/js/typeMiddleware'
import fxApi, { downloadFile } from '@/js/api/index'
import calculation from '@/js/lib/calculation'
import fxAuth from '@/js/auth/index'
import { createLablePrint } from '@/js/labelPrint'
import { createFastReport } from '@/js/lib/fastReport'
import fxAppTabs from '@/js/lib/appTabs/index'
const echarts = require('echarts')

export default (vue) => {
	vue.prototype.$fxHttp = service
	vue.prototype.$fxLoading = fxLoading
	vue.prototype.$fxUtils = utils
	vue.prototype.$fxCommon = common
	vue.prototype.$fxStateMiddleware = stateMiddleware
	vue.prototype.$fxTypeMiddleware = typeMiddleware
	vue.prototype.$fxApi = fxApi
	vue.prototype.$fxApiDownload = downloadFile
	vue.prototype.$fxCalculation = calculation
	vue.prototype.$fxAuth = fxAuth
	vue.prototype.$fxLablePrint = createLablePrint()
	vue.prototype.$fxFastReport = createFastReport()
	vue.prototype.$fxAppTabs = fxAppTabs
	vue.prototype.$fxEcharts = echarts
}
