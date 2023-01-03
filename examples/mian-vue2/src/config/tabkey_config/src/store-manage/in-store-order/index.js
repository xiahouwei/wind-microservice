export default {
	'in-store-order': {
		details: {
			basicInfo: {
				visiable () {
					return !(!this.isState(['unSubmit']) || this.authDisabled) && !this.isFullScreen
				},
				focus () {
					return this.$refs.basicInfo.defaultFocus()
				}
			},
			detailsInfo: {
				visiable () {
					return !(!this.isState(['unSubmit']) || this.authDisabled) && this.$refs.detailsInfo.tableEditColumnProp.length
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
			splitAndcheckBtn: {
				visiable () {
					return this.showSplitCheckBtn && this.detailsAuthGetter('store-manage_in-store-order.check-instore')
				},
				focus () {
					this.$refs.splitAndcheckBtn.$el.focus()
				}
			},
			endAndcheckBtn: {
				visiable () {
					return this.showEndCheckBtn && this.detailsAuthGetter('store-manage_in-store-order.check-instore')
				},
				focus () {
					this.$refs.endAndcheckBtn.$el.focus()
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
					return this.isState(['unChecked']) && this.detailsAuthGetter('store-manage_in-store-order.back-instore')
				},
				focus () {
					this.$refs.returnBtn.$el.focus()
				}
			},
			submitBtn: {
				visiable () {
					return this.isState(['unSubmit']) && this.detailsAuthGetter('store-manage_in-store-order.submit-instore')
				},
				focus () {
					this.$refs.submitBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return this.isState(['unSubmit']) && this.detailsAuthGetter('store-manage_in-store-order.edit-instore')
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
