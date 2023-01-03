<template>
	<w-dialog
		v-model='dialogVisible'
		width='600px'
		top="15vh"
		title='绑定SRM账号'
		@close="close"
	>
		<div class="form-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline label-width="90px">
				<el-form-item prop="phone" label="SRM手机号">
					<w-input
						ref='phone'
						v-model="formData.phone"
						v-fx-tab:focus.searchBtn
						:maxlength="$fxCommon.getFxInputMaxLength('phone')"
						placeholder="请输入"
						:regType="$fxCommon.getFxInputReg('phone')"
						class="form-item-input"
					></w-input>
					<el-button
						ref="searchBtn"
						class="query-btn"
						type="primary"
						v-fx-tab:focus.searchBtn
						@click="queryInfo"
					>查询信息</el-button>
				</el-form-item>
			</el-form>
			<businessList ref="businessList" :tableData="tableData"></businessList>
		</div>
		<template slot="footer-right">
			<fx-button
				ref="bindingBtn"
				type="save"
				v-fx-tab:focus.priceOrgan
				@click="onBindingClick"
			>点击验证并绑定</fx-button>
		</template>
	</w-dialog>
</template>

<script>
import businessList from './businessList.vue'
export default {
	name: 'accountBinding',
	components: {
		businessList
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			rules: {
				phone: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			formData: {
				phone: ''
			},
			dialogVisible: false,
			tableData: [],
			fxDataVerification: this.$fxUtils.fxDataVerification()
		}
	},
	computed: {
		organTypeLabel () {
			return this.$fxTypeMiddleware.getCommonTypeItemById('supplierType')(this.organDetails.organType).label
		}
	},
	methods: {
		open (organDetails) {
			this.dialogVisible = true
			if (organDetails.supplierSrm) {
				this.fxDataVerification.resetData(organDetails.supplierSrm)
			}
		},
		close () {
			this.formData.phone = ''
			this.tableData = []
			this.$refs.businessList.clearSelectedRow()
		},
		onValidateFormData () {
			return this.$refs.form.validate()
		},
		queryInfo () {
			this.onValidateFormData().then(this.getSupplierBusinessList)
		},
		getSupplierBusinessList () {
			this.$fxApi('supplier.getSupplierBusinessList', this.formData.phone).then(res => {
				this.tableData = res
				return Promise.resolve(res)
			})
		},
		onBindingClick () {
			this.$refs.businessList.getSelectedRow().then(this.bindingSrm).then((res) => {
				if (res.result === 1) {
					this.$emit('update-details')
					this.dialogVisible = false
				}
			})
		},
		createLoggerParams (pre, cur) {
			return {
				pre,
				cur,
				name: this.organDetails.name,
				type: this.organTypeLabel
			}
		},
		bindingSrm (selectRow) {
			if (this.organDetails.isBindSrm === 0) {
				const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.firstBinding', { supplier: this.organDetails.name, type: this.organTypeLabel, supplierSrm: selectRow })
				return this.$fxApi('supplier.binding', this.organDetails.id)({ data: selectRow, logger }).then(res => {
					this.fxDataVerification.resetData(selectRow)
					return Promise.resolve(res)
				})
			} else if (this.organDetails.isBindSrm === 1) {
				const logger = this.$fxLogger.createInfo('basic-archives.supplier-manage.againBinding', this.createLoggerParams(this.fxDataVerification.getOriginData(), selectRow))
				return this.$fxApi('supplier.unbinding', this.organDetails.id, false).then(res => {
					return this.$fxApi('supplier.binding', this.organDetails.id)({ data: selectRow, logger }).then(res => {
						this.fxDataVerification.resetData(selectRow)
						return Promise.resolve(res)
					})
				})
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-area {
	width: 100%
	max-height: 500px
	box-sizing: border-box
	padding: 0 15px
	.form-item-input {
		width: 235px
	}
	.query-btn {
		margin-left: 10px
	}
}
</style>
