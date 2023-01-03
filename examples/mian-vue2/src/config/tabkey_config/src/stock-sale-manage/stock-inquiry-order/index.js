export default {
	'stock-inquiry-order': {
		details: {
			basicInfo: {
				visiable () {
					return !(this.isDisable || this.authDisabled) && !this.isFullScreen
				},
				focus () {
					return this.$refs.basicInfo.defaultFocus()
				}
			},
			detailsInfo: {
				visiable () {
					return !(this.isDisable || this.authDisabled) && this.$refs.detailsInfo.tableEditColumnProp.length
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
			unrecheckBtn: {
				visiable () {
					return this.isRechecked && this.detailsAuthGetter('stock-sale-manage_stock-inquiry-order.unrecheck-stock-inquiry')
				},
				focus () {
					this.$refs.unrecheckBtn.$el.focus()
				}
			},
			recheckBtn: {
				visiable () {
					return this.isState(['checked']) && !this.isRechecked && this.detailsAuthGetter('stock-sale-manage_stock-inquiry-order.recheck-stock-inquiry')
				},
				focus () {
					this.$refs.recheckBtn.$el.focus()
				}
			},
			uncheckBtn: {
				visiable () {
					return this.isState(['checked']) && !this.isRechecked && this.detailsAuthGetter('stock-sale-manage_stock-inquiry-order.uncheck-stock-inquiry')
				},
				focus () {
					this.$refs.uncheckBtn.$el.focus()
				}
			},
			checkBtn: {
				visiable () {
					return this.isState(['unSubmit', 'unChecked']) && this.detailsAuthGetter('stock-sale-manage_stock-inquiry-order.check-stock-inquiry')
				},
				focus () {
					this.$refs.checkBtn.$el.focus()
				}
			},
			returnBtn: {
				visiable () {
					return this.isState(['unChecked']) && this.detailsAuthGetter('stock-sale-manage_stock-inquiry-order.back-stock-inquiry')
				},
				focus () {
					this.$refs.returnBtn.$el.focus()
				}
			},
			submitBtn: {
				visiable () {
					return this.isState(['unSubmit']) && this.detailsAuthGetter('stock-sale-manage_stock-inquiry-order.submit-stock-inquiry')
				},
				focus () {
					this.$refs.submitBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return !this.isDisable && this.detailsAuthGetter('stock-sale-manage_stock-inquiry-order.edit-stock-inquiry')
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
