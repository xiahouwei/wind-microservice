export default {
	'financial-out-store': {
		details: {
			detailsInfo: {
				visiable () {
					return this.isUnSubmit && !this.authDisabled
				},
				focus () {
					return this.$refs.detailsInfo.defaultFocus()
				}
			},
			refreshBtn: {
				visiable: true,
				focus () {
					this.$refs.refreshBtn.$el.focus()
				}
			},
			queueTools: {
				visiable () {
					return this.showBillQueue
				},
				focus () {
					this.$refs.queueTools.defaultFocus()
				}
			},
			pushDownBtn: {
				visiable () {
					return this.showPushDownBtn && this.detailsAuthGetter('store-manage_in-store-order.recheck-instore')
				},
				focus () {
					this.$refs.pushDownBtn.$el.focus()
				}
			},
			unrecheckBtn: {
				visiable () {
					return this.showUnrecheckBtn && this.detailsAuthGetter('store-manage_in-store-order.unrecheck-instore')
				},
				focus () {
					this.$refs.unrecheckBtn.$el.focus()
				}
			},
			recheckBtn: {
				visiable () {
					return this.showRecheckBtn && this.detailsAuthGetter('store-manage_in-store-order.recheck-instore')
				},
				focus () {
					this.$refs.recheckBtn.$el.focus()
				}
			},
			uncheckBtn: {
				visiable () {
					return this.showUncheckBtn && this.detailsAuthGetter('store-manage_in-store-order.uncheck-instore')
				},
				focus () {
					this.$refs.uncheckBtn.$el.focus()
				}
			},
			checkBtn: {
				visiable () {
					return this.showCheckBtn && this.detailsAuthGetter('store-manage_in-store-order.check-instore')
				},
				focus () {
					this.$refs.checkBtn.$el.focus()
				}
			},
			returnBtn: {
				visiable () {
					return this.showReturnBtn && this.detailsAuthGetter('store-manage_in-store-order.back-instore')
				},
				focus () {
					this.$refs.returnBtn.$el.focus()
				}
			},
			submitBtn: {
				visiable () {
					return this.isUnSubmit && this.detailsAuthGetter('store-manage_in-store-order.submit-instore')
				},
				focus () {
					this.$refs.submitBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return this.isUnSubmit && this.detailsAuthGetter('store-manage_in-store-order.edit-instore')
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
