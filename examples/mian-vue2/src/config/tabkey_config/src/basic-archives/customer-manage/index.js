export default {
	'customer-manage': {
		details: {
			basicInfo: {
				visiable: true,
				focus () {
					return this.$refs.basicInfo.defaultFocus()
				}
			},
			connectSetting: {
				visiable () {
					return this.$refs.connectSetting.isCollapse() && this.$refs.connectSetting.isOrganType(['customer'])
				},
				focus () {
					return this.$refs.connectSetting.defaultFocus()
				}
			},
			financialSetting: {
				visiable () {
					return this.$refs.financialSetting.isCollapse() && this.$refs.financialSetting.isMonthBalance()
				},
				focus () {
					return this.$refs.financialSetting.defaultFocus()
				}
			},
			appendInfo: {
				visiable () {
					return this.$refs.appendInfo.isCollapse()
				},
				focus () {
					return this.$refs.appendInfo.defaultFocus()
				}
			},
			saveAndAddBtn: {
				visiable () {
					return !this.isDel && this.detailsAuthGetter(`basic-archives_customer-manage.add-${this.organTypeName}`)
				},
				focus () {
					this.$refs.saveAndAddBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return !this.isDel && this.detailsAuthGetter('basic-archives_customer-manage.edit-customer')
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
