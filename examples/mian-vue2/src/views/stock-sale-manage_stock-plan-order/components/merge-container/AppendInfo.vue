<template>
	<w-collapse v-model="collapseVisible" title="附加信息">
		<el-form size="mini" label-width="100px" inline>
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
			collapseVisible: false
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
.upload-content {
	width: 740px
}
</style>
