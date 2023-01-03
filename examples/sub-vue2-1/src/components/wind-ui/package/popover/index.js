/**
 * popover by shang 2021/5/6
 * @desc popover 弹出框
 * @param {Boolean}  scrollClose - 滚动自动关闭
 */
import { Popover } from 'element-ui'
import scrollHide from '../../js/utils/scroll-hide.js'
export default {
	name: 'w-popover',
	fxComponentName: 'w-popover',
	mixins: [Popover],
	props: {
		scrollClose: {
			type: Boolean,
			default: true
		}
	},
	provide () {
		return {
			initPopoverConnectTarget: (connectNode) => {
				this.fxConnectMap.set(connectNode, connectNode.$options.fxComponentName)
			},
			removePopoverConnectTarget: (connectNode) => {
				this.fxConnectMap.delete(connectNode)
			}
		}
	},
	data () {
		return {
			fxConnectMap: new Map()
		}
	},
	watch: {
		showPopper (val) {
			if (this.disabled) {
				return
			}
			if (val) {
				this.$emit('show')
				if (this.scrollClose) {
					scrollHide.add(this)
				}
			} else {
				this.$emit('hide')
				if (this.scrollClose) {
					scrollHide.remove(this)
				}
			}
		}
	},
	methods: {
		isConnectPopover (target) {
			let flag = false
			if (this.fxConnectMap.size > 0) {
				for (const [key, value] of this.fxConnectMap) {
					if (value === 'w-date-picker' && key.picker && key.picker.$el.contains(target)) {
						flag = true
						break
					} else if (value === 'w-select') {
						flag = true
						break
					}
				}
			}
			return flag
		}
	}
}
