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
		},
		handleDocumentClick (e) {
			let reference = this.reference || this.$refs.reference
			const popper = this.popper || this.$refs.popper

			if (!reference && this.$slots.reference && this.$slots.reference[0]) {
				reference = this.referenceElm = this.$slots.reference[0].elm
			}
			if (!this.$el ||
        !reference ||
        this.$el.contains(e.target) ||
        reference.contains(e.target) ||
        !popper ||
        popper.contains(e.target) ||
				// 增加对于点击对象为body的判断，避免在屏幕高度过窄时，点击批量设置popover里面的其他弹窗导致批量设置popover消失的问题
				e.target.tagName === 'BODY') return
			this.showPopper = false
		}
	}
}
