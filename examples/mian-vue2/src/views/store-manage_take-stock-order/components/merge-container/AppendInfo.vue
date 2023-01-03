<template>
	<w-collapse v-model="collapseVisible" title="附加信息">
		<el-form size="mini" label-width="100px" inline>
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
		</el-form>
	</w-collapse>
</template>
<script>
export default {
	name: 'appendInfo',
	props: {
		visibleFlag: Boolean,
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
			tagSelectList: [{
				id: '1',
				label: '标签1'
			}, {
				id: '2',
				label: '标签2'
			}, {
				id: '3',
				label: '标签3'
			}, {
				id: '4',
				label: '标签4'
			}, {
				id: '5',
				label: '标签5'
			}]
		}
	},
	computed: {
		fileList () {
			return (this.organDetails.appendices || []).map(item => {
				return item.appendixUrl
			})
		}
	},
	watch: {
		visibleFlag: {
			immediate: true,
			handler (val) {
				if (!val) {
					this.collapseVisible = false
				}
			}
		}
	},
	methods: {
		onFileChange (list) {
			this.organDetails.appendices = list.map(item => {
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
}
.upload-content {
	width: 740px
}
</style>
