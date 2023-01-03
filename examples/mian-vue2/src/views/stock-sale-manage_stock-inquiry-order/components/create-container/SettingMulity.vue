<template>
	<div class="setting-mulity">
		<el-form size="mini" label-width="80px" class="setting-mulity_form">
			<el-form-item label="将字段：" class="form-item">
				<w-select
					v-model="settingKey"
					class="form-input"
					:optionlist="columnSelectList"
					:optionProp="{name:'label'}"
				>
				</w-select>
			</el-form-item>
			<div class="form-edit-text">修改为</div>
			<div class="form-content">
				<div v-show="settingKey===1">
					<w-select-tab
						v-model="otherOrganId"
						:optionlist="sellerSelectList"
						clearable
						class="form-input-date"
						@change="changeOrgan"
					>
					</w-select-tab>
				</div>
				<div v-show="settingKey===2" class="memo-container">
					<w-input-number
						ref='taxPrice'
						v-model="taxPrice"
						:pointSize="sysPricePointSize"
						class="form-input-tax"
					></w-input-number>
					<div class="tax-memo fx-warn-font">注：批量修改含税单价后，会利用新含税单价，按照原税率，重新计算新的非税单价</div>
				</div>
				<div v-show="settingKey===3" class="memo-container">
					<w-select
						ref="taxRate"
						v-model="taxRate"
						:optionlist="taxesList"
						class="form-input-tax"
					>
					</w-select>
					<div class="tax-memo fx-warn-font">注：批量修改税率后，会利用原含税单价，按照修改后的税率，重新计算新的非税单价</div>
				</div>
				<div v-show="settingKey===4" class="memo-container">
					<w-input-number
						ref='price'
						v-model="price"
						:pointSize="sysPricePointSize"
						class="form-input-tax"
					></w-input-number>
					<div class="tax-memo fx-warn-font">注：批量修改非税单价后，会利用新非税单价，按照原税率，重新计算新的含税单价</div>
				</div>
			</div>
			<div class="form-footer">
				<el-button type="danger" plain @click="onCancelClick">取消</el-button>
				<el-button type="primary" plain @click="onSaveClick">保存</el-button>
			</div>
		</el-form>
	</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'settingMulity',
	props: {
		visible: Boolean,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		sellerSelectList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			columnSelectList: [{
				id: 1,
				label: '卖方机构'
			}, {
				id: 2,
				label: '含税单价'
			}, {
				id: 3,
				label: '税率'
			}, {
				id: 4,
				label: '非税单价'
			}],
			settingKey: 1,
			otherOrganId: '',
			otherOrgan: {},
			taxPrice: 0,
			taxRate: 0,
			price: 0,
			sellerList: []
		}
	},
	computed: {
		...mapState({
			sysPricePointSize: state => state.system.sysPricePointSize,
			taxesList: state => state.system.taxesList
		})
	},
	watch: {
		visible () {
			this.refreshFormData()
		}
	},
	methods: {
		onSaveClick () {
			const params = {
				type: this.settingKey,
				otherOrganId: this.otherOrganId,
				otherOrgan: this.otherOrgan,
				taxPrice: this.taxPrice,
				taxRate: this.taxRate,
				price: this.price
			}
			this.$emit('on-save-click', params)
		},
		onCancelClick () {
			this.$emit('on-cancel-click')
		},
		refreshFormData () {
			this.settingKey = 1
			this.otherOrganId = ''
			this.otherOrgan = {}
			this.taxPrice = 0
			this.taxRate = 0
			this.price = 0
		},
		changeOrgan (val, item) {
			this.otherOrgan = item
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.setting-mulity {
	display: flex
	flex-direction: column
	height: 300px
	font-size: 12px
	.setting-mulity_form {
		display: flex
		flex-direction: column
		flex: 1
		.form-input {
			width: 150px
		}
		.form-item {
			margin-bottom: 10px
		}
		.form-input-tax {
			margin-top: 20px
			margin-left: 40px
			width: 200px
		}
		.form-input-date {
			margin-top: 20px
			margin-left: 40px
			width: 200px
		}
		.form-edit-text {
			height: 26px
			line-height:26px
			padding-left: 20px
		}
		.form-content {
			flex: 1
			border: 1px solid #eee
			.tax-memo {
				padding: 0 20px
				margin-top: 50px
			}
			.memo-container {
				padding: 5px
			}
		}
		.form-footer {
			text-align: right
			margin-top: 10px
			margin-bottom: 5px
		}
	}
}
</style>
