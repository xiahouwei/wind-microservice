<template>
	<w-collapse v-model="collapseVisible" title="其他信息">
		<el-form size="mini" label-width="100px" inline>
			<fx-details-form-row>
				<el-form-item slot="left" label="E-mail地址：">
					<w-input
						ref="email"
						v-model="organDetails.email"
						v-fx-tab:focus.position
						placeholder="请输入"
						:disabled="disabled"
						class="form-item-input"
					/>
				</el-form-item>
				<el-form-item slot="right" label="职位：">
					<w-input
						ref="position"
						v-model="organDetails.position"
						v-fx-tab:focus.idCard
						placeholder="请输入"
						:disabled="disabled"
						class="form-item-input"
					/>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="身份证号：">
					<w-input
						ref="idCard"
						v-model="organDetails.idCard"
						v-fx-tab:focus.bankCard
						placeholder="请输入"
						:disabled="disabled"
						:maxlength="$fxCommon.getFxInputMaxLength('commonCode')"
						:regType="$fxCommon.getFxInputReg('commonCode')"
						class="form-item-input"
					/>
				</el-form-item>
				<el-form-item slot="right" label="银行卡号：">
					<w-input
						ref="bankCard"
						v-model="organDetails.bankCard"
						v-fx-tab:focus.bankName
						placeholder="请输入"
						:disabled="disabled"
						:maxlength="$fxCommon.getFxInputMaxLength('commonCode')"
						:regType="$fxCommon.getFxInputReg('commonCode')"
						class="form-item-input"
					/>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="开户银行：">
					<w-input
						ref="bankName"
						v-model="organDetails.bankName"
						v-fx-tab:focus.bankCardName
						placeholder="请输入"
						:disabled="disabled"
						class="form-item-input"
					/>
				</el-form-item>
				<el-form-item slot="right" label="账号名：">
					<w-input
						ref="bankCardName"
						v-model="organDetails.bankCardName"
						v-fx-tab:focus.address
						placeholder="请输入"
						:disabled="disabled"
						class="form-item-input"
					/>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item label="住址：">
					<w-input
						ref="address"
						v-model="organDetails.address"
						v-fx-tab:loop.basic-archives_employee-manage_details.otherInfo
						placeholder="请输入"
						:disabled="disabled"
						:maxlength="$fxCommon.getFxInputMaxLength('deliveryAddr')"
						:regType="$fxCommon.getFxInputReg('deliveryAddr')"
						class="form-item-input-long"
					/>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
	</w-collapse>
</template>
<script>
export default {
	name: 'otherInfo',
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
			collapseVisible: false
		}
	},
	computed: {
		contactList () {
			return this.organDetails.contactList || []
		},
		resourceList () {
			return this.organDetails.resourceList || []
		}
	},
	methods: {
		isCollapse () {
			return this.collapseVisible
		},
		defaultFocus () {
			this.$fxUtils.vDoRefFocus(this, 'email')
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
.form-item-input-long {
	width: 535px
	box-sizing: border-box
}
</style>
