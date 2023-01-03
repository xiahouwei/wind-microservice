export default {
	'item-manage': {
		details: {
			basicInfo: {
				visiable: true,
				focus () {
					return this.$refs.basicInfo.defaultFocus()
				}
			},
			connectSetting: {
				visiable () {
					return this.$refs.connectSetting.isCollapse()
				},
				focus () {
					return this.$refs.connectSetting.defaultFocus()
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
					return this.detailsAuthGetter('basic-archives_item-manage.add-item') && !this.isDel
				},
				focus () {
					this.$refs.saveAndAddBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return this.detailsAuthGetter('basic-archives_item-manage.edit-item') && !this.isDel
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
