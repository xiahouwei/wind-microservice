<template>
	<w-dialog
		v-model="dialogVisible"
		width="450px"
		:title="actionText"
		:beforeClose="onBeforeClose"
		@close="onClose"
	>
		<div class="create-area">
			<el-form ref="areaForm" :model="salesAreaDetails" :rules="rules" size="mini" label-width="125px">
				<el-form-item prop="organId" label="所属机构：">
					<w-select-tab
						v-model="salesAreaDetails.organId"
						:optionlist="organSelectList"
						:disabled="!canEdit"
						class="form-item-input"
					></w-select-tab>
				</el-form-item>
				<el-form-item prop="code" label="销售区域编号：">
					<w-input
						ref="code"
						v-model="salesAreaDetails.code"
						:maxlength="$fxCommon.getFxInputMaxLength('commonCode')"
						:regType="$fxCommon.getFxInputReg('commonCode')"
						:disabled="!canEdit"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="name" label="销售区域名称：">
					<w-input
						v-model="salesAreaDetails.name"
						:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
						:regType="$fxCommon.getFxInputReg('commonName')"
						:disabled="!canEdit"
						class="form-item-input"
						@blur="onSalesAreaNameChange"
					></w-input>
				</el-form-item>
				<el-form-item prop="pinYin" label="销售区域助记符：">
					<w-input
						v-model="salesAreaDetails.pinYin"
						:maxlength="$fxCommon.getFxInputMaxLength('commonName')"
						:regType="$fxCommon.getFxInputReg('commonName')"
						:disabled="!canEdit"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item prop="enableFlag" label="启停状态：">
					<el-switch
						v-model="salesAreaDetails.enableFlag"
						:active-value="1"
						:inactive-value="0"
						:disabled="switchDisabled"
					></el-switch>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button v-fx-auth:basic-archives_support-archives_sales-area.edit-sales-area|enable-sales-area|disable-sales-area type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
export default {
	name: 'createContainer',
	data () {
		return {
			dialogVisible: false,
			salesAreaDetails: {},
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			organSelectList: [],
			rules: {
				organId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				pinYin: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				enableFlag: [{ required: true, trigger: 'no' }]
			}
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isAdd () {
			return !this.salesAreaDetails.id
		},
		actionText () {
			return this.isAdd ? '新建销售区域' : '查看销售区域'
		},
		canEdit () {
			return this.salesAreaDetails.sourceType === 0 && this.hasEditAuth
		},
		hasEditAuth () {
			return this.detailsAuthGetter('basic-archives_support-archives_sales-area.edit-sales-area')
		},
		switchDisabled () {
			return ((!this.salesAreaDetails.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_sales-area.enable-sales-area')) || (!!this.salesAreaDetails.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_sales-area.disable-sales-area')))
		}
	},
	methods: {
		async add (treeNode) {
			await this.getOrganSelectList()
			const organId = treeNode.organId || ''
			this.salesAreaDetails = {
				organId,
				code: '',
				name: '',
				pinYin: '',
				enableFlag: 1,
				sourceType: 0
			}
			this.fxDataVerification.resetData(this.salesAreaDetails)
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.code.focus()
			})
		},
		async edit (salesAreaDetails) {
			await this.getOrganSelectList(salesAreaDetails)
			this.salesAreaDetails = salesAreaDetails
			this.fxDataVerification.resetData(this.salesAreaDetails)
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$refs.code.focus()
			})
		},
		getOrganSelectList (salesAreaDetails) {
			const ids = salesAreaDetails ? [salesAreaDetails.organId] : []
			const params = { ids, names: ['Shop', 'Center'] }
			return this.$fxApi(`${apiName}.getOrganSelectList`)({ data: params }).then(res => {
				this.organSelectList = res
			})
		},
		onClose () {
			this.$refs.areaForm.clearValidate()
			this.$emit('on-close')
		},
		onSaveClick () {
			this.onValidateFormData()
				.then(this.onSaveAreaHandler)
		},
		onValidateFormData () {
			return new Promise(resolve => {
				this.$refs.areaForm.validate().then(() => {
					resolve()
				}).catch(() => {
					this.$fxMessage.warning('请填写必填信息')
				})
			})
		},
		onSaveAreaHandler () {
			if (!this.salesAreaDetails.id) {
				const subOrganName = this.getOrganNameById(this.salesAreaDetails.organId, this.organSelectList)
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.sales-area.add', { name: this.salesAreaDetails.name, code: this.salesAreaDetails.code, subOrganName })
				return this.$fxApi(`${apiName}.add`)({ data: this.salesAreaDetails, logger }).then(res => {
					this.$set(this.salesAreaDetails, 'id', res.id)
					this.fxDataVerification.resetData(this.salesAreaDetails)
					return Promise.resolve()
				})
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.sales-area.update', this.createLoggerParams())
				return this.$fxApi(`${apiName}.save`, this.salesAreaDetails.id)({ data: this.salesAreaDetails, logger }).then(res => {
					this.fxDataVerification.resetData(this.salesAreaDetails)
					return Promise.resolve()
				})
			}
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.subOrganName = this.getOrganNameById(originData.organId, this.organSelectList)
			const salesAreaDetails = this.$fxUtils.deepClone(this.salesAreaDetails)
			salesAreaDetails.subOrganName = this.getOrganNameById(salesAreaDetails.organId, this.organSelectList)
			return {
				pre: originData,
				cur: salesAreaDetails,
				name: salesAreaDetails.name,
				code: salesAreaDetails.code
			}
		},
		getOrganNameById (id, list) {
			return this.$fxUtils.getSelectTagById(id, list).name || ''
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.salesAreaDetails)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
		},
		onSalesAreaNameChange (e) {
			const name = e.target.value
			if (!this.salesAreaDetails.pinYin) {
				const pinyin = this.$fxUtils.chinese2Pinyin(name, true)
				this.salesAreaDetails.pinYin = pinyin
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-area {
	flex: 1
	display: flex;
	flex-direction: column;
	overflow: auto;
	&__type {
		height: 30px
		line-height: 30px
		padding-left: 20px
		&-label {
			color: $fxDefaultColor
			font-size: 15px
			font-weight: 900
		}
	}
	&__content {
		flex: 1
		overflow:auto
		padding-right: 10px
	}
	.form-item-input {
		width 260px
	}
}
</style>
