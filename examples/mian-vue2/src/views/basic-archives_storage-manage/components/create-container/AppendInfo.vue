<template>
	<w-collapse v-model="collapseVisible" :title="moreText">
		<el-form size="mini" label-width="120px" inline>
			<fx-details-form-row>
				<el-form-item slot="left" label="体积限制（M3）：">
					<w-input
						ref="volumeLimit"
						v-model="organDetails.volumeLimit"
						v-fx-tab:focus.weightLimit
						placeholder="请输入"
						:maxlength="10"
						:regType="$fxCommon.getFxInputReg('phone')"
						class="form-item-input"
						:disabled="disabled"
					></w-input>
				</el-form-item>
				<el-form-item slot="right" label="货位长（M）：">
					<w-input
						ref="length"
						v-model="organDetails.length"
						v-fx-tab:focus.width
						placeholder="请输入"
						:maxlength="10"
						:regType="$fxCommon.getFxInputReg('phone')"
						class="form-item-input"
						:disabled="disabled"
					></w-input>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="重量限制（KG）：">
					<w-input
						ref="weightLimit"
						v-model="organDetails.weightLimit"
						v-fx-tab:focus.amountLimit
						placeholder="请输入"
						:maxlength="10"
						:regType="$fxCommon.getFxInputReg('phone')"
						class="form-item-input"
						:disabled="disabled"
					></w-input>
				</el-form-item>
				<el-form-item slot="right" label="货位宽（M）：">
					<w-input
						ref="width"
						v-model="organDetails.width"
						v-fx-tab:focus.height
						placeholder="请输入"
						:maxlength="10"
						:regType="$fxCommon.getFxInputReg('phone')"
						class="form-item-input"
						:disabled="disabled"
					></w-input>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="数量限制：">
					<w-input
						ref="amountLimit"
						v-model="organDetails.amountLimit"
						v-fx-tab:focus.length
						placeholder="请输入"
						:maxlength="10"
						:regType="$fxCommon.getFxInputReg('phone')"
						class="form-item-input"
						:disabled="disabled"
					></w-input>
				</el-form-item>
				<el-form-item slot="right" label="货位高（M）：">
					<w-input
						ref="height"
						v-model="organDetails.height"
						v-fx-tab:loop.basic-archives_storage-manage_details.appendInfo
						placeholder="请输入"
						:maxlength="10"
						:regType="$fxCommon.getFxInputReg('phone')"
						class="form-item-input"
						:disabled="disabled"
					></w-input>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
	</w-collapse>
</template>
<script>
export default {
	name: 'appendInfo',
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
			collapseVisible: false
		}
	},
	computed: {
		moreText () {
			return this.collapseVisible ? '收起' : '更多'
		}
	},
	methods: {
		isCollapse () {
			return this.collapseVisible
		},
		defaultFocus () {
			this.$fxUtils.vDoRefFocus(this, 'volumeLimit')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 175px
}
</style>
