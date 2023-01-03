export default {
	'stock-plan': {
		details: {
			basicInfo: {
				visiable () {
					return !this.isChecked && this.detailsAuthGetter('stock-sale-manage_stock-plan.edit-stock') && !this.isFullScreen
				},
				focus () {
					return this.$refs.basicInfo.defaultFocus()
				}
			},
			detailsInfo: {
				visiable () {
					return !this.isChecked && this.detailsAuthGetter('stock-sale-manage_stock-plan.edit-stock')
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
					return this.isChecked && this.detailsAuthGetter('stock-sale-manage_stock-plan.uncheck-stock')
				},
				focus () {
					this.$refs.uncheckBtn.$el.focus()
				}
			},
			checkBtn: {
				visiable () {
					return (!this.isChecked && !this.isAdd) && this.detailsAuthGetter('stock-sale-manage_stock-plan.check-stock')
				},
				focus () {
					this.$refs.checkBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return !this.isChecked && this.detailsAuthGetter('stock-sale-manage_stock-plan.edit-stock')
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
