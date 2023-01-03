export default {
	'verification-order': {
		details: {
			basicInfo: {
				visiable () {
					return !(!this.isState(['unWrittenOff']) || this.authDisabled)
				},
				focus () {
					return this.$refs.basicInfo.defaultFocus()
				}
			},
			payableVerificationDetails: {
				visiable () {
					return !(!this.isState(['unWrittenOff']) || this.authDisabled) && this.$refs.payableVerificationDetails.tableDetails.length
				},
				focus () {
					return this.$refs.payableVerificationDetails.defaultFocus()
				}
			},
			paymentVerificationDetails: {
				visiable () {
					return !(!this.isState(['unWrittenOff']) || this.authDisabled) && this.$refs.paymentVerificationDetails.tableDetails.length
				},
				focus () {
					return this.$refs.paymentVerificationDetails.defaultFocus()
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
			queueTools: {
				visiable () {
					return this.showBillQueue
				},
				focus () {
					this.$refs.queueTools.defaultFocus()
				}
			},
			unverificationBtn: {
				visiable () {
					return this.showUnverificationBtn && this.detailsAuthGetter('store-manage_in-store-order.uncheck-instore')
				},
				focus () {
					this.$refs.unverificationBtn.$el.focus()
				}
			},
			diffVerificationBtn: {
				visiable () {
					return this.showVerificationBtn && this.detailsAuthGetter('store-manage_in-store-order.check-instore')
				},
				focus () {
					this.$refs.diffVerificationBtn.$el.focus()
				}
			},
			handVerificationBtn: {
				visiable () {
					return this.showVerificationBtn && this.detailsAuthGetter('store-manage_in-store-order.uncheck-instore')
				},
				focus () {
					this.$refs.handVerificationBtn.$el.focus()
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
