export default {
	'move-order': {
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
					return !(this.isDisable || this.authDisabled) && this.$refs.detailsInfo.computedEditColumn.length
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
			queueTools: {
				visiable () {
					return this.showBillQueue
				},
				focus () {
					this.$refs.queueTools.defaultFocus()
				}
			},
			rejectBtn: {
				visiable () {
					return (this.isState(['checked']) && this.btnAuth.reject) && this.detailsAuthGetter('store-manage_move-order.reject-move')
				},
				focus () {
					this.$refs.rejectBtn.$el.focus()
				}
			},
			agreeBtn: {
				visiable () {
					return (this.isState(['checked']) && this.btnAuth.agree) && this.detailsAuthGetter('store-manage_move-order.agree-move')
				},
				focus () {
					this.$refs.agreeBtn.$el.focus()
				}
			},
			unrecheckBtn: {
				visiable () {
					return this.isRechecked && this.detailsAuthGetter('store-manage_move-order.unrecheck-move')
				},
				focus () {
					this.$refs.unrecheckBtn.$el.focus()
				}
			},
			recheckBtn: {
				visiable () {
					return (this.isState(['checked']) && this.btnAuth.recheck) && this.detailsAuthGetter('store-manage_move-order.recheck-move')
				},
				focus () {
					this.$refs.recheckBtn.$el.focus()
				}
			},
			uncheckBtn: {
				visiable () {
					return (this.isState(['checked']) && this.btnAuth.uncheck) && this.detailsAuthGetter('store-manage_move-order.uncheck-move')
				},
				focus () {
					this.$refs.uncheckBtn.$el.focus()
				}
			},
			checkBtn: {
				visiable () {
					return this.isState(['unSubmit', 'unChecked']) && this.detailsAuthGetter('store-manage_move-order.check-move')
				},
				focus () {
					this.$refs.checkBtn.$el.focus()
				}
			},
			returnBtn: {
				visiable () {
					return this.isState(['unChecked']) && this.detailsAuthGetter('store-manage_move-order.back-move')
				},
				focus () {
					this.$refs.returnBtn.$el.focus()
				}
			},
			submitBtn: {
				visiable () {
					return this.isState(['unSubmit']) && this.detailsAuthGetter('store-manage_move-order.submit-move')
				},
				focus () {
					this.$refs.submitBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return (!this.btnAuth.recheck && !this.isRechecked) && this.detailsAuthGetter('store-manage_move-order.edit-move')
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
