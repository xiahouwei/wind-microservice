export default {
	'financial-supplier-manage': {
		details: {
			invoiceInfo: {
				visiable: true,
				focus () {
					return this.$refs.invoiceInfo.defaultFocus()
				}
			},
			settlementInfo: {
				visiable () {
					return this.detailsAuthGetter('basic-archives_organ-manage.edit-organ') && this.tableDetails.length !== 0
				},
				focus () {
					return this.$refs.settlementInfo.defaultFocus()
				}
			},
			saveBtn: {
				visiable () {
					return this.detailsAuthGetter('basic-archives_organ-manage.edit-organ')
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
