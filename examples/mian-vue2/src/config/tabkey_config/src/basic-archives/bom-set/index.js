export default {
	'bom-set': {
		replace: {
			replaceMulityStep1: {
				visiable: true,
				focus () {
					return this.$refs.replaceMulityStep1.defaultFocus()
				}
			},
			confirmBtn: {
				visiable () {
					return true
				},
				focus () {
					this.$refs.confirmBtn.$el.focus()
				}
			},
			cancelBtn: {
				visiable: true,
				focus () {
					this.$refs.cancelBtn.$el.focus()
				}
			}
		}
	}
}
