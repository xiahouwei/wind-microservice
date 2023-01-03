export default {
	'storage-manage': {
		details: {
			basicInfo: {
				visiable: true,
				focus () {
					return this.$refs.basicInfo.defaultFocus()
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
					return this.detailsAuthGetter('basic-archives_storage-manage.add-space')
				},
				focus () {
					this.$refs.saveAndAddBtn.$el.focus()
				}
			},
			saveBtn: {
				visiable () {
					return this.detailsAuthGetter('basic-archives_storage-manage.edit-space')
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
