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
				<el-form-item label="附件资料：">
					<fx-upload :fileList="fileList" :limit="9" :disabled="disabled" class="upload-content" @on-change="onFileChange"></fx-upload>
				</el-form-item>
			</fx-details-form-row>
			<el-form-item label="制单人：">
				<w-input
					:value="organDetails.createManName"
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
					:value="organDetails.checkManName"
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
	computed: {
		fileList () {
			return (this.organDetails.appendixList || []).map(item => {
				return item.appendixUrl
			})
		}
	},
	watch: {
		isFullScreen (val) {
			if (!val) {
				this.$nextTick(() => this.$refs.collapse.resize())
			}
		}
	},
	methods: {
		onFileChange (list) {
			this.organDetails.appendixList = list.map(item => {
				return {
					appendixUrl: item
				}
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width:740px
	&-readonly {
		width 175px
	}
}
.upload-content {
	width: 740px
}
</style>
