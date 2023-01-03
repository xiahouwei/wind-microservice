// 项目常用函数
import service, { fxLoading } from '@/js/service/index'
import utils from '@/js/lib/utils'
import common from '@/js/common'
import fxApi, { downloadFile } from '@/js/api/index'

export default (vue) => {
	vue.prototype.$fxHttp = service
	vue.prototype.$fxLoading = fxLoading
	vue.prototype.$fxUtils = utils
	vue.prototype.$fxCommon = common
	vue.prototype.$fxApi = fxApi
	vue.prototype.$fxApiDownload = downloadFile
}
