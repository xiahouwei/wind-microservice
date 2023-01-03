<template>
	<w-collapse v-model="collapseVisible" title="关联设置">
		<el-form size="mini" inline v-if="isOrganType(['store','section'])" class="form-rel">
			<el-form-item :label="`该${organTypeLabel}可存放哪些品项：`">
				<el-radio v-model="organDetails.relAllGoods" :label="true">全部品项</el-radio>
				<el-radio v-model="organDetails.relAllGoods" :label="false">自定义</el-radio>
				<transition name="el-zoom-in-center">
					<el-button type="primary" v-show="!organDetails.relAllGoods" @click="onConnectSetting">设置关联品项</el-button>
				</transition>
			</el-form-item>
		</el-form>
		<el-form size="mini" inline v-if="isOrganType(['store'])">
			<fx-details-form-row>
			<el-form-item label="此客户的默认入库仓库：" slot="left">
				<el-radio v-model="organDetails.defaultInFlag" :label="1" :disabled="!organDetails.enableFlag||disabled">是</el-radio>
				<el-radio v-model="organDetails.defaultInFlag" :label="0" :disabled="!organDetails.enableFlag||disabled">否</el-radio>
			</el-form-item>
			<el-form-item label="此客户的默认出库仓库：" slot="right">
				<el-radio v-model="organDetails.defaultOutFlag" :label="1" :disabled="!organDetails.enableFlag||disabled">是</el-radio>
				<el-radio v-model="organDetails.defaultOutFlag" :label="0" :disabled="!organDetails.enableFlag||disabled">否</el-radio>
			</el-form-item>
			</fx-details-form-row>
		</el-form>
		<el-form ref="formCustomer" :model="organDetails" size="mini" inline label-width="120px" v-if="isOrganType(['customer'])" :rules="rules">
			<fx-details-form-row>
				<el-form-item label="是否关联订货方案：" slot="left">
					<el-radio-group v-model="organDetails.relStockPlanFlag" @change="changeRelStockPlanFlag">
						<el-radio :label="0">不关联</el-radio>
						<el-radio :label="1">关联</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-show="organDetails.relStockPlanFlag===1" prop="stockPlanId" slot="left">
					<w-select
						ref="stockPlanId"
						v-model="organDetails.stockPlanId"
						v-fx-tab:loop.basic-archives_customer-manage_details.connectSetting
						:optionlist="relStockPlanList"
						clearable
					>
					</w-select>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
			<el-form-item v-if="false" label="默认入库仓库：" slot="left">
				<w-select
					ref="defaultInHouseId"
					v-model="organDetails.defaultInHouseId"
					v-fx-tab:focus.defaultOutHouseId
					:optionlist="defaultHouseList"
					:disabled="disabled"
					clearable
				>
				</w-select>
			</el-form-item>
			<el-form-item v-if="false" label="默认出库仓库：" slot="right">
				<w-select
					ref="defaultOutHouseId"
					v-model="organDetails.defaultOutHouseId"
					v-fx-tab:loop.basic-archives_customer-manage_details.connectSetting
					:optionlist="defaultHouseList"
					:disabled="disabled"
					clearable
				>
				</w-select>
			</el-form-item>
			</fx-details-form-row>
		</el-form>
		<connectItemDialog ref="connectItemDialog"></connectItemDialog>
	</w-collapse>
</template>
<script>
import connectItemDialog from '../connect-container/connect-item.vue'
export default {
	name: 'connectSetting',
	components: {
		connectItemDialog
	},
	props: {
		organType: String,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		relStockPlanList: {
			type: Array,
			default: () => {
				return []
			}
		},
		defaultHouseList: {
			type: Array,
			default: () => {
				return []
			}
		},
		disabled: Boolean
	},
	data () {
		return {
			rules: {
				stockPlanId: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: this.validateStockPlanId }]
			},
			collapseVisible: false
		}
	},
	computed: {
		isCustomerMain () {
			return this.$fxTypeMiddleware.isCommonType('customerOrganType')(['customer'])(this.organDetails.organType)
		},
		organTypeLabel () {
			return this.isCustomerMain ? '客户' : '机构'
		},
		isOrganType (type = []) {
			return (type) => {
				return this.$fxTypeMiddleware.isCommonType('customerOrganType')(type)(this.organType)
			}
		}
	},
	watch: {
		'organDetails.enableFlag' (val) {
			if (!val) {
				this.organDetails.defaultInFlag = 0
				this.organDetails.defaultOutFlag = 0
			}
		}
	},
	methods: {
		validateStockPlanId (rule, value, callback) {
			if (this.organDetails.relStockPlanFlag && !value) {
				callback(new Error(rule.message))
			}
			callback()
		},
		validate () {
			return this.$refs.formCustomer.validate()
		},
		changeRelStockPlanFlag (val) {
			if (val === 0) {
				this.organDetails.stockPlanId = ''
				this.$refs.formCustomer.clearValidate()
			}
		},
		onConnectSetting () {
			if (!this.organDetails.id) {
				this.$fxMessage.warning('请先保存机构信息')
				return false
			}
			this.emitConnectClick().then(() => {
				this.$refs.connectItemDialog.open(this.organDetails)
			})
		},
		emitConnectClick () {
			return new Promise(resolve => {
				this.$emit('on-connect-click', resolve)
			})
		},
		isCollapse () {
			return this.collapseVisible
		},
		defaultFocus () {
			this.$fxUtils.vDoRefFocus(this, 'defaultInHouseId')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-rel {
	height 47px
}
</style>
