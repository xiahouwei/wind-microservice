<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" size="mini" label-width="100px" inline>
			<el-form-item label="系统单号：">
				<w-input
					:value="organDetails.sysBillCode"
					:class="[billSign,'form-item-input']"
					disabled
				></w-input>
			</el-form-item>
			<el-form-item label="手工单号：">
				<w-input
					:value="organDetails.userBillCode"
					disabled
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item label="单据类型：">
				<w-input
					:value="organDetails.billTypeName"
					:class="[billSign,'form-item-input']"
					disabled
				>
				</w-input>
			</el-form-item>
			<el-form-item label="业务类型：">
				<w-input
					:value="organDetails.billBizType && organDetails.billBizType.name"
					disabled
					class="form-item-input"
				>
				</w-input>
			</el-form-item>
			<el-form-item label="业务时间：">
				<el-date-picker
					:value="organDetails.businessDate"
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm:SS"
					format="yyyy-MM-dd HH:mm"
					placeholder="选择日期"
					disabled
					class="form-item-input"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="入库方：">
				<w-input
					:value="organDetails.organ.name"
					disabled
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item label=" 出库方：">
				<w-input
					:value="organDetails.otherOrgan.name"
					disabled
					class="form-item-input"
				>
				</w-input>
			</el-form-item>
			<el-form-item label="经办人：">
				<w-input
					:value="organDetails.operateMan.name"
					disabled
					class="form-item-input"
				>
				</w-input>
			</el-form-item>
			<el-form-item prop="memo" label="备注：">
				<w-input
					:value="organDetails.memo"
					:maxlength="$fxCommon.getFxInputMaxLength('memo')"
					:regType="$fxCommon.getFxInputReg('memo')"
					disabled
					class="form-item-input-memo"
				></w-input>
			</el-form-item>
		</el-form>
	</w-collapse>
</template>
<script>
export default {
	name: 'basicInfo',
	props: {
		visibleFlag: Boolean,
		isFullScreen: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		tableDetails: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			collapseVisible: true
		}
	},
	computed: {
		billSign () {
			switch (this.organDetails.billSign) {
			case 1:
				return 'blue-bill'
			case 2:
				return 'red-bill'
			default:
				return ''
			}
		}
	},
	watch: {
		visibleFlag (val) {
			if (val) {
				this.$nextTick(() => this.$refs.collapse.resize())
			}
		},
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
	width: 175px
}
.form-item-input-memo {
	width: 460px
}
.red-bill {
	>>>input:disabled, input[disabled] {
		-webkit-text-fill-color $fxRed
	}
}
.blue-bill {
	>>>input:disabled, input[disabled] {
		-webkit-text-fill-color $fxBlue
	}
}
</style>
