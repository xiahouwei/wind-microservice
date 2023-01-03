<template>
	<w-collapse ref="collapse" v-model="collapseVisible" title="附加信息">
		<el-form size="mini" label-width="100px" inline label-position="left">
			<fx-details-form-row>
				<el-form-item label="标签：">
					<w-select-mulity
						v-model="tag"
						class="form-item-input"
						disabled
						:showEmpty='false'
						:optionlist="tagSelectList"
						:optionProp="{name:'label'}"
					>
					</w-select-mulity>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item label="系统备注：">
					<w-input disabled v-model="organDetails.systemMemo" class="form-item-input"></w-input>
				</el-form-item>
			</fx-details-form-row>
			<el-form-item label="制单人：">
				<w-input
					:value="organDetails.createUserName"
					disabled
					class="form-item-input-readonly"
				></w-input>
			</el-form-item>
			<el-form-item label="制单时间：">
				<w-input
					:value="organDetails.createDate && $fxUtils.formatterDateTime(organDetails.createDate)"
					disabled
					class="form-item-input-readonly"
				>
				</w-input>
			</el-form-item>
			<el-form-item label="审核人：">
				<w-input
					:value="organDetails.checkMan && organDetails.checkMan.name"
					disabled
					class="form-item-input-readonly"
				></w-input>
			</el-form-item>
			<el-form-item label="审核时间：">
				<w-input
					:value="organDetails.checkDate && $fxUtils.formatterDateTime(organDetails.checkDate)"
					disabled
					class="form-item-input-readonly"
				>
				</w-input>
			</el-form-item>
		</el-form>
	</w-collapse>
</template>
<script>
export default {
	name: 'appendInfo',
	props: {
		isFullScreen: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		disabled: Boolean
	},
	data () {
		return {
			collapseVisible: false,
			tag: [],
			tagSelectList: []
		}
	},
	watch: {
		isFullScreen (val) {
			if (!val) {
				this.$nextTick(() => this.$refs.collapse.resize())
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width:740px
}
.upload-content {
	width: 740px
}
</style>
