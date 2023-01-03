// 项目ui
import '@/assets/theme/element-orange/index.css'
import '@/assets/stylus/main.styl'
import ElementUI from 'element-ui'
import { Tabs, Tab } from 'vant'
import 'vant/lib/index.css'

export default function (Vue) {
	Vue.use(Tabs).use(Tab)
	Vue.use(ElementUI, { size: 'small' })
}

