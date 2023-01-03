<template>
	<w-collapse v-model="collapseVisible" title="关联设置">
		<el-form size="mini" inline v-if="isOrganType(['supplier'])" class="form-rel">
			<el-form-item label="该供货商可关联品项：">
				<el-radio v-model="organDetails.relAllGoods" :label="true" :disabled="disabled">全部品项</el-radio>
				<el-radio v-model="organDetails.relAllGoods" :label="false" :disabled="disabled">自定义</el-radio>
				<transition name="el-zoom-in-center">
					<el-button type="primary" v-show="!organDetails.relAllGoods" @click="onConnectSetting">设置关联品项</el-button>
				</transition>
			</el-form-item>
		</el-form>
		<el-form size="mini" inline v-if="isOrganType(['supplier'])" class="form-rel">
			<el-form-item label="该供货商SRM账号：">
				<span v-if="organDetails.supplierSrm">
					{{ organDetails.supplierSrm.name }} - {{ organDetails.supplierSrm.code }}
				</span>
				<el-button
					type="primary"
					v-show="organDetails.isBindSrm === 0"
					:disabled="disabled"
					@click="onAccountBinding()"
				>点击绑定</el-button>
				<el-button
					type="primary"
					v-show="organDetails.isBindSrm === 1"
					:disabled="disabled"
					@click="onAccountBinding()"
				>重新绑定</el-button>
				<el-button v-show="organDetails.isBindSrm === 1" :disabled="disabled" @click="unBinding">解除绑定</el-button>
			</el-form-item>
		</el-form>
		<el-form size="mini" inline v-if="isOrganType(['store','section'])" class="form-rel">
			<el-form-item :label="`该${organLabel}可${organAbility}哪些品项：`">
				<el-radio v-model="organDetails.relAllGoods" :label="true" :disabled="disabled">全部品项</el-radio>
				<el-radio v-model="organDetails.relAllGoods" :label="false" :disabled="disabled">自定义</el-radio>
				<transition name="el-zoom-in-center">
					<el-button type="primary" v-show="!organDetails.relAllGoods" @click="onConnectSetting">设置关联品项</el-button>
				</transition>
			</el-form-item>
		</el-form>
		<el-form size="mini" inline v-if="isOrganType(['store'])">
			<fx-details-form-row>
			<el-form-item label="此供货商的默认入库仓库：" slot="left">
				<el-radio v-model="organDetails.defaultInFlag" :label="1" :disabled="!organDetails.enableFlag||disabled">是</el-radio>
				<el-radio v-model="organDetails.defaultInFlag" :label="0" :disabled="!organDetails.enableFlag||disabled">否</el-radio>
			</el-form-item>
			<el-form-item label="此供货商的默认出库仓库：" slot="right">
				<el-radio v-model="organDetails.defaultOutFlag" :label="1" :disabled="!organDetails.enableFlag||disabled">是</el-radio>
				<el-radio v-model="organDetails.defaultOutFlag" :label="0" :disabled="!organDetails.enableFlag||disabled">否</el-radio>
			</el-form-item>
			</fx-details-form-row>
		</el-form>
		<el-form size="mini" inline label-width="100px" v-if="false">
			<fx-details-form-row>
			<el-form-item label="默认入库仓库：" slot="left">
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
			<el-form-item label="默认出库仓库：" slot="right">
				<w-select
					ref="defaultOutHouseId"
					v-model="organDetails.defaultOutHouseId"
					v-fx-tab:loop.basic-archives_supplier-manage_details.connectSetting
					:optionlist="defaultHouseList"
					:disabled="disabled"
					clearable
				>
				</w-select>
			</el-form-item>
			</fx-details-form-row>
		</el-form>
		<connectItemDialog ref="connectItemDialog"></connectItemDialog>
		<srmAccountBindingDialog
			ref="srmAccountBindingDialog"
			:organDetails="organDetails"
			@update-details="updateDetails"
		></srmAccountBindingDialog>
	</w-collapse>
</template>
<script>
import connectItemDialog from '../connect-container/connect-item/connect-item.vue'
import srmAccountBindingDialog from '../srm-account-binding/index.vue'
export default {
	name: 'connectSetting',
	components: {
		connectItemDialog,
		srmAccountBindingDialog
	},
	props: {
		organType: String,
		organDetails: {
			type: Object,
			default: () => {
				return {}
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
			collapseVisible: false
		}
	},
	computed: {
		organLabel () {
			return this.isSupplierTypeMain ? '供货商' : '机构'
		},
		organAbility () {
			return this.organDetails.organType === '3' ? '存放' : '供货'
		},
		isOrganType (type = []) {
			return (type) => {
				return this.$fxTypeMiddleware.isCommonType('supplierType')(type)(this.organType)
			}
		},
		organTypeLabel () {
			return this.$fxTypeMiddleware.getCommonTypeItemById('supplierType')(this.organDetails.organType).label
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
		onConnectSetting () {
			if (!this.organDetails.id) {
				this.$fxMessage.warning('请先保存机构信息')
				return false
			}
			this.emitConnectClick().then(() => {
				this.$refs.connectItemDialog.open(this.organDetails)
			})
		},
		onAccountBinding () {
			if (!this.organDetails.id) {
				this.$fxMessage.warning('请先保存机构信息')
				return false
			}
			this.emitConnectClick().then(() => {
				this.$refs.srmAccountBindingDialog.open(this.organDetails)
			})
		},
		unBinding () {
			this.$fxConfirm('是否确定解除绑定当前SRM账号').then(() => {
				const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.unBinding', { supplier: this.organDetails.name, type: this.organTypeLabel, supplierSrm: this.organDetails.supplierSrm })
				this.$fxApi('supplier.unbinding', this.organDetails.id, true)({ logger }).then(res => {
					this.updateDetails()
					return Promise.resolve(res)
				})
			})
		},
		updateDetails () {
			this.$emit('update-details')
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
