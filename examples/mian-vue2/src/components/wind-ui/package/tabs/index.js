import { Tabs } from 'element-ui'
import scrollHide from '../../js/utils/scroll-hide.js'
export default {
	name: 'w-tabs',
	mixins: [Tabs],
	props: {
		beforeTabClick: {
			type: Function,
			default: () => {
				return Promise.resolve({})
			}
		}
	},
	watch: {
		value (value) {
			this.setCurrentName(value)
			scrollHide.closeAllPopper()
		}
	},
	methods: {
		handleTabClick (tab, tabName, event) {
			if (tab.disabled || this.value === tabName) return
			this.beforeTabClick().then(() => {
				this.setCurrentName(tabName)
				this.$emit('tab-click', tab, event)
			}).catch(() => {})
		}
	}
}
