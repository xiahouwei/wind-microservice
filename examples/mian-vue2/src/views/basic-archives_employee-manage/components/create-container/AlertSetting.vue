<template>
	<w-collapse v-model="collapseVisible" title="提醒设置">
		<el-form size="mini" label-width="100px" inline>
			<fx-details-form-row>
				<el-form-item slot="left" label="选择提醒模板：">
					<w-select
						ref="alertTemplate"
						v-model="organDetails.alertTemplate"
						v-fx-tab:loop.basic-archives_employee-manage_details.alertSetting
						:optionlist="alertTemplateList"
            :disabled="disabled"
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
	</w-collapse>
</template>
<script>
export default {
	name: 'alertSetting',
	props: {
		disabled: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			collapseVisible: false,
			alertTemplateList: [{
				id: '1',
				name: '模板1'
			}, {
				id: '2',
				name: '模板2'
			}, {
				id: '3',
				name: '模板3'
			}]
		}
	},
	methods: {
		isCollapse () {
			return this.collapseVisible
		},
		defaultFocus () {
			this.$fxUtils.vDoRefFocus(this, 'alertTemplate')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 186px
	box-sizing: border-box
}
</style>
