<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="送货信息">
		<el-form ref="form" :model="organDetails" size="mini" label-width="100px" inline>
			<el-form-item label="联系人：">
				<w-input
					ref="linkman"
					v-model="organDetails.linkman"
					v-fx-tab:focus.phone
					:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
					:regType="$fxCommon.getFxInputReg('commonName')"
					:disabled="disabled"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item label="联系电话：">
				<w-input
					ref="phone"
					v-model="organDetails.phone"
					v-fx-tab:focus.deliveryAddr
					:maxlength="$fxCommon.getFxInputMaxLength('phone')"
					:regType="$fxCommon.getFxInputReg('phone')"
					:disabled="disabled"
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item label="送货地址：">
				<w-input
					ref="deliveryAddr"
					v-model="organDetails.deliveryAddr"
					v-fx-tab:loop.stock-sale-manage_sale-order_details.sendInfo
					:maxlength="$fxCommon.getFxInputMaxLength('memo')"
					:regType="$fxCommon.getFxInputReg('memo')"
					:disabled="disabled"
					class="form-item-input-address"
				></w-input>
			</el-form-item>
		</el-form>
	</w-collapse>
</template>
<script>
export default {
	name: 'sendInfo',
	props: {
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
	methods: {
		defaultFocus (refName = 'linkman') {
			this.$fxUtils.vDoRefFocus(this, refName)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 175px
}
.form-item-input-address {
	width: 460px
}
</style>
