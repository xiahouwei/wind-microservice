<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" size="mini" label-width="120px" inline>
			<el-form-item label="客户编号：">
				<w-input
					:value="organDetails.code"
					disabled
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item label="客户名称：">
				<w-input
					:value="organDetails.name"
					disabled
					class="form-item-input"
				/>
			</el-form-item>
			<el-form-item label="客户类别：">
				<w-input
					:value="organDetails.cwCustomerType.name"
					disabled
					class="form-item-input"
				>
				</w-input>
			</el-form-item>
			<el-form-item label="启停状态：">
				<w-switch
					ref="enableFlag"
					v-model="organDetails.enableFlag"
					activeColor="blue"
					:active-value="1"
					:inactive-value="0"
					:inclusion="false"
					:width="40"
					:disabled="enableSwitchDisable"
				></w-switch>
			</el-form-item>
		</el-form>
	</w-collapse>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'basicInfo',
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
			collapseVisible: true
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		enableSwitchDisable () {
			return this.disabled || (this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_organ-manage.disable-organ')) || (!this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_organ-manage.enable-organ'))
		}
	},
	watch: {
		visibleFlag (val) {
			if (val) {
				this.$nextTick(() => this.$refs.collapse.resize())
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 200px
	box-sizing: border-box
}
</style>
