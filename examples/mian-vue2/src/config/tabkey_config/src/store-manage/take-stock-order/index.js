export default {
	'take-stock-order': {
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
					return this.isRechecked && this.detailsAuthGetter('store-manage_take-stock-order.unrecheck-order')
				},
				focus () {
					this.$refs.unrecheckBtn.$el.focus()
				}
			},
			recheckBtn: {
				visiable () {
					return this.isState(['checked']) && !this.isRechecked && this.detailsAuthGetter('store-manage_take-stock-order.recheck-order')
				},
				focus () {
					this.$refs.recheckBtn.$el.focus()
				}
			},
			uncheckBtn: {
				visiable () {
					return this.isState(['checked']) && !this.isRechecked && this.detailsAuthGetter('store-manage_take-stock-order.uncheck-order')
				},
				focus () {
					this.$refs.uncheckBtn.$el.focus()
				}
			},
			checkBtn: {
				visiable () {
					return this.isState(['unSubmit', 'unChecked']) && this.detailsAuthGetter('store-manage_take-stock-order.check-order')
				},
				focus () {
					this.$refs.checkBtn.$el.focus()
				}
			},
			returnBtn: {
				visiable () {
					return this.isState(['unChecked']) && this.detailsAuthGetter('store-manage_take-stock-order.back-order')
				},
				focus () {
					this.$refs.returnBtn.$el.focus()
				}
			},
			submitBtn: {
				visiable () {
					return this.isState(['unSubmit']) && this.detailsAuthGetter('store-manage_take-stock-order.submit-order')
				},
				focus () {
					this.$refs.submitBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return !this.isRechecked && this.isState(['unSubmit']) && this.detailsAuthGetter('store-manage_take-stock-order.edit-order')
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
		},
		merge: {
			basicInfo: {
				visiable: true,
				focus () {
					return this.$refs.basicInfo.defaultFocus()
				}
			},
			saveBtn: {
				visiable: true,
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
