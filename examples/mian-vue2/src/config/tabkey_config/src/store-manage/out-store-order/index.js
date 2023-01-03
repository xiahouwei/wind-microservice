export default {
	'out-store-order': {
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
					return this.showUnrecheckBtn && this.detailsAuthGetter('store-manage_out-store-order.unrecheck-outstore')
				},
				focus () {
					this.$refs.unrecheckBtn.$el.focus()
				}
			},
			recheckBtn: {
				visiable () {
					return this.showRecheckBtn && this.detailsAuthGetter('store-manage_out-store-order.recheck-outstore')
				},
				focus () {
					this.$refs.recheckBtn.$el.focus()
				}
			},
			uncheckBtn: {
				visiable () {
					return this.showUncheckBtn && this.detailsAuthGetter('store-manage_out-store-order.uncheck-outstore')
				},
				focus () {
					this.$refs.uncheckBtn.$el.focus()
				}
			},
			checkBtn: {
				visiable () {
					return this.isState(['unSubmit', 'unChecked']) && this.detailsAuthGetter('store-manage_out-store-order.check-outstore')
				},
				focus () {
					this.$refs.checkBtn.$el.focus()
				}
			},
			returnBtn: {
				visiable () {
					return this.isState(['unChecked']) && this.detailsAuthGetter('store-manage_out-store-order.back-outstore')
				},
				focus () {
					this.$refs.returnBtn.$el.focus()
				}
			},
			submitBtn: {
				visiable () {
					return this.isState(['unSubmit']) && this.detailsAuthGetter('store-manage_out-store-order.submit-outstore')
				},
				focus () {
					this.$refs.submitBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return this.isState(['unSubmit']) && this.detailsAuthGetter('store-manage_out-store-order.edit-outstore')
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
