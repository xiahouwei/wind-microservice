export default {
	'organ-manage': {
		details: {
			basicInfo: {
				visiable: true,
				focus () {
					return this.$refs.basicInfo.defaultFocus()
				}
			},
			connectSetting: {
				visiable () {
					return this.$refs.connectSetting.isCollapse() && this.$refs.connectSetting.isOrganType(['shop', 'rdc'])
				},
				focus () {
					return this.$refs.connectSetting.defaultFocus()
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
					return !this.isDel && this.detailsAuthGetter(`basic-archives_organ-manage.add-${this.organTypeName}`)
				},
				focus () {
					this.$refs.saveAndAddBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return !this.isDel && this.detailsAuthGetter('basic-archives_organ-manage.edit-organ')
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
