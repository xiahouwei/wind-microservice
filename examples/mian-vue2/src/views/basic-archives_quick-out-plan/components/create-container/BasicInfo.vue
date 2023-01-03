<template>
	<w-collapse ref="collapse" v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
			<el-form-item prop="code" label="方案编号：" class="form-item-unrequire">
				<w-input
					v-model="organDetails.code"
					disabled
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="name" label="方案名称：">
				<w-input
					ref="name"
					v-model="organDetails.name"
					v-fx-tab="nameTabHandler"
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					:disabled="disabled"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item prop="enableFlag" label="启停状态：">
				<div class="switch-container">
					<w-switch
						ref="enableFlag"
						v-model="organDetails.enableFlag"
						v-fx-tab:focus.memo
						:active-value="1"
						:inactive-value="0"
						:disabled="enableSwitchDisable"
						:inclusion="false"
						:width="40"
					>
					</w-switch>
				</div>
			</el-form-item>
			<el-form-item label="备注：" class="form-item-unrequire">
				<w-input
					ref="memo"
					v-model="organDetails.memo"
					v-fx-tab:loop.basic-archives_quick-out-plan_details.basicInfo
					:maxlength="$fxCommon.getFxInputMaxLength('memo')"
					:regType="$fxCommon.getFxInputReg('memo')"
					:disabled="disabled"
					class="form-item-input"
				></w-input>
			</el-form-item>
		</el-form>
	</w-collapse>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'createPlan',
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
		const validateIgnore = (rule, value, callback) => {
			callback()
		}
		return {
			collapseVisible: true,
			rules: {
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				enableFlag: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }]
			}
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isDeleted () {
			return this.$fxStateMiddleware.isState('planState')(['deleted'])(this.organDetails.billState)
		},
		enableSwitchDisable () {
			return this.isDeleted || (this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_quick-out-plan.disable-quick-out')) || (!this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_quick-out-plan.enable-quick-out'))
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
		validate () {
			return this.$refs.form.validate()
		},
		defaultFocus (refName = 'name') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		nameTabHandler ({ focus }) {
			this.enableSwitchDisable ? focus('memo') : focus('enableFlag')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 275px
	box-sizing: border-box
}
.form-item-unrequire {
	>>>.el-form-item__label {
		padding-left:10px
	}
}
.switch-container {
	width 100px
}
</style>
