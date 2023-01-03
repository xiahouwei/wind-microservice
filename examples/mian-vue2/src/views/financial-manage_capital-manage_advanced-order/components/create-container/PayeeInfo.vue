<template>
	<w-collapse v-model="collapseVisible" contentHeight="107px" title="收款方信息">
		<el-form class="payee-form" ref="payeeForm" :model="organDetails" size="mini" inline>
			<el-form-item class="item-border-rtght" label="收款方名称">
				<w-input
					ref="otherOrganName"
					v-fx-tab:focus.otherOrganBank
					v-model="organDetails.otherOrganName"
					:disabled="disabled"
					:maxlength="100"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item class="item-border-rtght" label="收款方开户银行">
				<w-input
					ref="otherOrganBank"
					v-fx-tab:focus.otherOrganAccount
					v-model="organDetails.otherOrganBank"
					:disabled="disabled"
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item class="item-border-rtght" label="收款银行账户名称">
				<w-input
					ref="otherOrganAccount"
					v-fx-tab:focus.otherOrganBankNum
					v-model="organDetails.otherOrganAccount"
					:disabled="disabled"
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item label="收款银行账号">
				<w-input
					ref="otherOrganBankNum"
					v-fx-tab:loop.financial-manage_advanced-order_details.payeeInfo
					v-model="organDetails.otherOrganBankNum"
					:disabled="disabled"
					:maxlength="20"
					class="form-item-input"
				></w-input>
			</el-form-item>
		</el-form>
	</w-collapse>
</template>
<script>
export default {
	name: 'payeeInfo',
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
		isState () {
			return (type) => {
				return this.$fxStateMiddleware.isState('billState')(type)(this.organDetails.billState)
			}
		}
	},
	watch: {
		visibleFlag: {
			immediate: true,
			handler (val) {
				if (val) {
					this.collapseVisible = true
				}
			}
		}
	},
	methods: {
		defaultFocus (refName = 'otherOrganName') {
			this.$fxUtils.vDoRefFocus(this, refName)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
/deep/ .payee-form {
	border: 1px solid $fxGray5
	.el-form-item{
		width: 25%!important
		margin: 0!important
		.el-form-item__label {
			position: relative
			height: 45px!important
			display: block!important
			margin: 0!important
			padding: 0 10px
			line-height: 45px
			text-align: left
		}
		.el-form-item__content{
			height: 45px!important
			display: flex!important
			align-items: center
			padding: 0 10px
			border-top: 1px solid $fxGray5
			background: #fafafa
			.el-form-item__error{
				padding-left: 10px
			}
		}
		.el-form-item__label:before {
			display: none!important
		}
	}
	.item-border-rtght {
		.el-form-item__label::after{
			content: ''
			position: absolute
			background-color: #eee
			width: 1px
			height: 50%
			top: 25%
			right: 0
		}
	}
}
</style>
