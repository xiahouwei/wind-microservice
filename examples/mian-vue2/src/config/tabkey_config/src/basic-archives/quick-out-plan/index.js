export default {
	'quick-out-plan': {
		details: {
			basicInfo: {
				visiable () {
					return !this.billDisabled && !this.isFullScreen
				},
				focus () {
					return this.$refs.basicInfo.defaultFocus()
				}
			},
			detailsInfo: {
				visiable () {
					return !this.billDisabled
				},
				focus () {
					return this.$refs.detailsInfo.defaultFocus()
				}
			},
			refreshBtn: {
				visiable () {
					return !this.isAdd
				},
				focus () {
					this.$refs.refreshBtn.$el.focus()
				}
			},
			uncheckBtn: {
				visiable () {
					return this.isChecked && !this.isDeleted && this.detailsAuthGetter('basic-archives_quick-out-plan.uncheck-quick-out')
				},
				focus () {
					this.$refs.uncheckBtn.$el.focus()
				}
			},
			checkBtn: {
				visiable () {
					return (!this.isChecked && !this.isAdd && !this.isDeleted) && this.detailsAuthGetter('basic-archives_quick-out-plan.check-quick-out')
				},
				focus () {
					this.$refs.checkBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return !this.isDeleted && this.detailsAuthGetter('basic-archives_quick-out-plan.edit-quick-out|enable-quick-out|disable-quick-out')
				},
				focus () {
					this.$refs.saveBtn.$el.focus()
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
