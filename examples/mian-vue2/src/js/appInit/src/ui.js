// 项目ui
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/stylus/main.styl'
import fxUi from '@/components/wind-ui'
import fxCommonUi from '@/components'
import ElementUI from 'element-ui'

export default function (Vue) {
	Vue.use(fxUi)
	Vue.use(fxCommonUi)
	Vue.use(ElementUI, { size: 'small' })
}

