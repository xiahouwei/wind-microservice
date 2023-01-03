<template>
	<w-dialog v-model="dialogVisible" title="设置业务类型对应关系" width="480px" top="25vh" @close="close">
		<div class="create-area">
			<el-form ref="form" :model="formData" size="mini" inline label-width="120px">
				<el-form-item :label="bizTypeInfo.label">
					<w-select
						ref="selectBillBizTypeId"
						v-model="selectBillBizTypeId"
						v-fx-tab:focus.saveBtn
						:optionlist="billBizTypeList"
						clearable
						class="form-input"
					>
					</w-select>
				</el-form-item>
			</el-form>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				v-fx-tab:focus.selectBillBizTypeId
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-tab:focus.cancelBtn
				@click="onSaveClick"
			>保存</el-button>
		</template>
	</w-dialog>
</template>
<script>
export default {
	name: 'settingCorrespondingRelation',
	data () {
		return {
			dialogVisible: false,
			detailsInfo: {},
			billBizTypeList: [],
			selectBillBizTypeId: '',
			formData: {
				billBizTypeFirstId: '',
				billBizTypeSecondId: ''
			},
			bizTypeInfo: {
				label: ''
			},
			bizTypeInfoList: [
				{
					pid: '101',
					type: 'outStore',
					label: '对应入库单业务类型',
					getBillBizTypeApi: 'inStore.getBillBizTypeSelect',
					addApi: 'bussinessType.addOutCorrespondingRelation',
					editApi: 'bussinessType.editOutCorrespondingRelation'
				}
			]
		}
	},
	methods: {
		open (detailsInfo) {
			this.detailsInfo = detailsInfo
			this.bizTypeInfo = this.bizTypeInfoList && (this.bizTypeInfoList.filter((item) => {
				return item.pid === detailsInfo.pid
			})[0] || {})
			this.echoSelectBillBizTypeId(this.bizTypeInfo.type, detailsInfo)
			this.getBillBizTypeSelect()
			this.dialogVisible = true
		},
		echoSelectBillBizTypeId (type = 'outStore', detailsInfo) {
			if (type === 'outStore') {
				this.selectBillBizTypeId = detailsInfo.outInBizTypeRelation && detailsInfo.outInBizTypeRelation.inBillBizTypeId
			}
		},
		close () {
			this.selectBillBizTypeId = ''
		},
		getBillBizTypeSelect () {
			const data = this.selectBillBizTypeId ? [this.selectBillBizTypeId] : []
			this.$fxApi(this.bizTypeInfo.getBillBizTypeApi)({ data }).then(res => {
				this.billBizTypeList = res
			})
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			this.setParams()
		},
		setParams () {
			const params = {}
			if (this.bizTypeInfo.type === 'outStore') {
				params.outBillBizTypeId = this.detailsInfo.id
				params.inBillBizTypeId = this.selectBillBizTypeId
			}
			if (this.detailsInfo.outInBizTypeRelation && this.detailsInfo.outInBizTypeRelation.id) {
				params.id = this.detailsInfo.outInBizTypeRelation.id
				this.onEditHandler(params)
			} else {
				if (!this.selectBillBizTypeId) {
					this.dialogVisible = false
					return
				}
				this.onAddHandler(params)
			}
		},
		onAddHandler (params) {
			const loggerParams = {
				cur: this.selectBillBizTypeId ? this.arrFind(this.billBizTypeList, this.selectBillBizTypeId).name : '',
				name: this.detailsInfo.name
			}
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.bussiness-type.addCorrespondingRelation', loggerParams)
			return this.$fxApi(this.bizTypeInfo.addApi)({ data: params, logger }).then(res => {
				this.dialogVisible = false
				this.$emit('again-get-list')
				return Promise.resolve()
			})
		},
		onEditHandler (params) {
			const loggerParams = {
				pre: this.arrFind(this.billBizTypeList, this.detailsInfo.outInBizTypeRelation.inBillBizTypeId).name,
				cur: this.selectBillBizTypeId ? this.arrFind(this.billBizTypeList, this.selectBillBizTypeId).name : '',
				name: this.detailsInfo.name
			}
			const logger = this.$fxLogger.createInfo('basic-archives.support-archives.bussiness-type.editCorrespondingRelation', loggerParams)
			return this.$fxApi(this.bizTypeInfo.editApi)({ data: params, logger }).then(res => {
				this.dialogVisible = false
				this.$emit('again-get-list')
				return Promise.resolve()
			})
		},
		arrFind (arr, attr) {
			return arr.find(item => item.id === attr)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-area {
	width: 100%
	height: 100px
	padding-top: 30px
	box-sizing: border-box
	/deep/.el-form-item__label{
		margin-left: 20px
	}
	.form-input {
		width:275px
	}
}
</style>
