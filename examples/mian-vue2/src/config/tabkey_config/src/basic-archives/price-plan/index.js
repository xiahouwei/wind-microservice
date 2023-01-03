export default {
	'price-plan': {
		details: {
			basicInfo: {
				visiable () {
					return !this.isChecked && this.detailsAuthGetter('basic-archives_price-plan.edit-price') && !this.isFullScreen
				},
				focus () {
					return this.$refs.basicInfo.defaultFocus()
				}
			},
			detailsInfo: {
				visiable () {
					return !this.isChecked && this.detailsAuthGetter('basic-archives_price-plan.edit-price')
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
					return this.isChecked && this.detailsAuthGetter('basic-archives_price-plan.uncheck-price')
				},
				focus () {
					this.$refs.uncheckBtn.$el.focus()
				}
			},
			checkBtn: {
				visiable () {
					return (!this.isChecked && !this.isAdd) && this.detailsAuthGetter('basic-archives_price-plan.check-price')
				},
				focus () {
					this.$refs.checkBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return !this.isChecked && this.detailsAuthGetter('basic-archives_price-plan.edit-price')
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
