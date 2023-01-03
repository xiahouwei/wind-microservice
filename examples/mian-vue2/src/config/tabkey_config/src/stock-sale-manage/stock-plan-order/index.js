export default {
	'stock-plan-order': {
		details: {
			basicInfo: {
				visiable () {
					return !(this.isDisable || this.authDisabled) && !this.isFullScreen
				},
				focus () {
					return this.$refs.basicInfo.defaultFocus()
				}
			},
			sendInfo: {
				visiable () {
					return !(this.isDisable || this.authDisabled) && !this.isFullScreen
				},
				focus () {
					return this.$refs.sendInfo.defaultFocus()
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
					return this.isRechecked && this.detailsAuthGetter('stock-sale-manage_stock-plan-order.unrecheck-stock-plan')
				},
				focus () {
					this.$refs.unrecheckBtn.$el.focus()
				}
			},
			recheckBtn: {
				visiable () {
					return this.isState(['checked']) && !this.isRechecked && this.detailsAuthGetter('stock-sale-manage_stock-plan-order.recheck-stock-plan')
				},
				focus () {
					this.$refs.recheckBtn.$el.focus()
				}
			},
			uncheckBtn: {
				visiable () {
					return this.isState(['checked']) && !this.isRechecked && this.detailsAuthGetter('stock-sale-manage_stock-plan-order.uncheck-stock-plan')
				},
				focus () {
					this.$refs.uncheckBtn.$el.focus()
				}
			},
			checkBtn: {
				visiable () {
					return this.isState(['unSubmit', 'unChecked']) && this.detailsAuthGetter('stock-sale-manage_stock-plan-order.check-stock-plan')
				},
				focus () {
					this.$refs.checkBtn.$el.focus()
				}
			},
			returnBtn: {
				visiable () {
					return this.isState(['unChecked']) && this.detailsAuthGetter('stock-sale-manage_stock-plan-order.back-stock-plan')
				},
				focus () {
					this.$refs.returnBtn.$el.focus()
				}
			},
			submitBtn: {
				visiable () {
					return this.isState(['unSubmit']) && this.detailsAuthGetter('stock-sale-manage_stock-plan-order.submit-stock-plan')
				},
				focus () {
					this.$refs.submitBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return !this.isDisable && this.detailsAuthGetter('stock-sale-manage_stock-plan-order.edit-stock-plan')
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
