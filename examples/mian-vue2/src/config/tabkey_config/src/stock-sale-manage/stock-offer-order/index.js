export default {
	'stock-offer-order': {
		details: {
			basicInfo: {
				visiable () {
					return !(this.isDisable || this.authDisabled) && !this.isFullScreen
				},
				focus () {
					return this.$refs.basicInfo.defaultFocus()
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
			unrecheckBtn: {
				visiable () {
					return this.isRechecked && this.detailsAuthGetter('stock-sale-manage_stock-offer-order.unrecheck-stock-offer')
				},
				focus () {
					this.$refs.unrecheckBtn.$el.focus()
				}
			},
			recheckBtn: {
				visiable () {
					return this.isState(['checked']) && !this.isRechecked && this.detailsAuthGetter('stock-sale-manage_stock-offer-order.recheck-stock-offer')
				},
				focus () {
					this.$refs.recheckBtn.$el.focus()
				}
			},
			uncheckBtn: {
				visiable () {
					return this.isState(['checked']) && !this.isRechecked && this.detailsAuthGetter('stock-sale-manage_stock-offer-order.uncheck-stock-offer')
				},
				focus () {
					this.$refs.uncheckBtn.$el.focus()
				}
			},
			checkBtn: {
				visiable () {
					return this.isState(['unSubmit', 'unChecked']) && this.detailsAuthGetter('stock-sale-manage_stock-offer-order.check-stock-offer')
				},
				focus () {
					this.$refs.checkBtn.$el.focus()
				}
			},
			returnBtn: {
				visiable () {
					return this.isState(['unChecked']) && this.detailsAuthGetter('stock-sale-manage_stock-offer-order.back-stock-offer')
				},
				focus () {
					this.$refs.returnBtn.$el.focus()
				}
			},
			submitBtn: {
				visiable () {
					return this.isState(['unSubmit']) && this.detailsAuthGetter('stock-sale-manage_stock-offer-order.submit-stock-offer')
				},
				focus () {
					this.$refs.submitBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return !this.isDisable && this.detailsAuthGetter('stock-sale-manage_stock-offer-order.edit-stock-offer')
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
