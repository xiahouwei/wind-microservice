import VueI18n from 'vue-i18n'

export default function (Vue) {
	Vue.use(VueI18n)
	const i18n = new VueI18n({
		locale: 'zh-CN',
		messages: {
			'zh-CN': require('@/lang/zh/index.js')
		}
	})
	return i18n
}
