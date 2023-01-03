<template>
	<w-collapse v-model="collapseVisible" title="权限设置">
		<el-form size="mini" inline label-width="160px">
			<fx-details-form-row>
				<el-form-item label="该员工可管理哪些机构：">
					<el-radio :disabled="disabled" v-model="organDetails.manageAllOrgan" :label="1">全部机构</el-radio>
					<el-radio v-model="organDetails.manageAllOrgan" :label="2" :disabled="!['1','2'].includes(organDetails.organType)||disabled||isSystemUser">该员工直属机构</el-radio>
					<el-radio :disabled="disabled||isSystemUser" v-model="organDetails.manageAllOrgan" :label="0">自定义</el-radio>
					<transition name="el-zoom-in-center">
						<el-button :disabled="disabled" type="primary" v-show="organDetails.manageAllOrgan===0" @click="onOrganSetting">设置可管理机构</el-button>
					</transition>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item label="该员工可管理哪些供货商：">
					<el-radio :disabled="disabled" v-model="organDetails.manageAllSupplier" :label="1">全部供货商</el-radio>
					<el-radio v-model="organDetails.manageAllSupplier" :label="2" :disabled="organDetails.organType!== '5'||disabled||isSystemUser">该员工直属供货商</el-radio>
					<el-radio :disabled="disabled||isSystemUser" v-model="organDetails.manageAllSupplier" :label="0">自定义</el-radio>
					<transition name="el-zoom-in-center">
						<el-button :disabled="disabled" type="primary" v-show="organDetails.manageAllSupplier===0" @click="onSupplierSetting">设置可管理供货商</el-button>
					</transition>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item label="该员工可管理哪些客户：">
					<el-radio :disabled="disabled" v-model="organDetails.manageAllCustom" :label="1">全部客户</el-radio>
					<el-radio v-model="organDetails.manageAllCustom" :label="2" :disabled="organDetails.organType!== '6'||disabled||isSystemUser">该员工直属客户</el-radio>
					<el-radio :disabled="disabled||isSystemUser" v-model="organDetails.manageAllCustom" :label="0">自定义</el-radio>
					<transition name="el-zoom-in-center">
						<el-button :disabled="disabled" v-show="organDetails.manageAllCustom===0" type="primary" @click="onCustomerSetting">设置可管理客户</el-button>
					</transition>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row class="todo-form-item">
				<el-form-item label="待办工作接受范围：">
					<el-radio :disabled="disabled" v-model="organDetails.toDealWorkType" :label="1">同管理机构+供货商+客户</el-radio>
					<el-radio :disabled="disabled||isSystemUser||organDetails.organType==='0'" v-model="organDetails.toDealWorkType" :label="3">该员工直属机构</el-radio>
					<el-radio :disabled="disabled" v-model="organDetails.toDealWorkType" :label="5" class="todo-form-disallow">不接受待办工作提醒</el-radio>
				</el-form-item>
			</fx-details-form-row>
			<!-- <fx-details-form-row>
				<el-form-item label="待办工作提醒类型：">
					<el-button :disabled="disabled" type="primary">点击设置</el-button>
				</el-form-item>
			</fx-details-form-row> -->
			<fx-details-form-row>
				<el-form-item slot="left" label="可见成本金额：">
					<el-switch :disabled="disabled" v-model="organDetails.haveCostPower" :active-value="1" :inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item slot="right" label="可见销售金额：">
					<el-switch :disabled="disabled" v-model="organDetails.haveMoneyPower" :active-value="1" :inactive-value="0"></el-switch>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
		<connectOrganDialog ref="connectOrganDialog"></connectOrganDialog>
		<connectSupplierDialog ref="connectSupplierDialog"></connectSupplierDialog>
		<connectCustomerDialog ref="connectCustomerDialog"></connectCustomerDialog>
	</w-collapse>
</template>
<script>
import connectOrganDialog from '../connect-container-organ/connect-organ.vue'
import connectSupplierDialog from '../connect-container-supplier/connect-organ.vue'
import connectCustomerDialog from '../connect-container-customer/connect-organ.vue'
export default {
	name: 'authSetting',
	components: {
		connectOrganDialog,
		connectSupplierDialog,
		connectCustomerDialog
	},
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
		isSystemUser () {
			return !!this.organDetails.systemFlag
		}
	},
	methods: {
		onOrganSetting () {
			this.emitConnectClick().then(() => {
				this.$refs.connectOrganDialog.open(this.organDetails)
			})
		},
		onSupplierSetting () {
			this.emitConnectClick().then(() => {
				this.$refs.connectSupplierDialog.open(this.organDetails)
			})
		},
		onCustomerSetting () {
			this.emitConnectClick().then(() => {
				this.$refs.connectCustomerDialog.open(this.organDetails)
			})
		},
		emitConnectClick () {
			return new Promise(resolve => {
				this.$emit('on-connect-click', resolve)
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.todo-form-item {
	height 85px !important
	>>>.el-form-item__content {
		width: 400px
	}
	.todo-organ {
		margin-right: 10px
	}
	.todo-form-disallow {
		display block
		line-height 45px
	}
}
>>>.details-form-row {
	height 47px
}
</style>
