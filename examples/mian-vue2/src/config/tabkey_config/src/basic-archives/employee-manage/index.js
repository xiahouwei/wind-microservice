export default {
	'employee-manage': {
		details: {
			basicInfo: {
				visiable: true,
				focus () {
					return this.$refs.basicInfo.defaultFocus()
				}
			},
			otherInfo: {
				visiable () {
					return this.$refs.otherInfo.isCollapse()
				},
				focus () {
					return this.$refs.otherInfo.defaultFocus()
				}
			},
			alertSetting: {
				visiable () {
					return this.$refs.alertSetting.isCollapse()
				},
				focus () {
					return this.$refs.alertSetting.defaultFocus()
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
					return this.detailsAuthGetter('basic-archives_employee-manage.add-employee') && !this.isSystemUser
				},
				focus () {
					this.$refs.saveAndAddBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return this.detailsAuthGetter('basic-archives_employee-manage.edit-employee')
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
