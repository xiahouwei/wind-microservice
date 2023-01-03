<template>
	<w-dialog
		v-model="dialogVisible"
		:title="`${dialogTitle}盘点分类`"
		width="910px"
		:showMoreBtn="showMoreBtn"
		:beforeClose="onBeforeClose"
		@close="onRefresh"
	>
		<template slot="tools">
			<w-link
				v-fx-auth:basic-archives_support-archives_take-stock-class.delete-take-stock-class
				icon="delete-trash"
				type="default"
				@click="onDeleteClick"
			>删除</w-link>
			<w-link
				v-fx-auth:basic-archives_support-archives_take-stock-class.edit-take-stock-class
				icon="export-data"
				type="default"
				@click="exportData"
			>导出明细数据</w-link>
		</template>
		<div class="create-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline>
				<fx-details-form-row textAlign="right">
					<el-form-item slot="left" prop="code" label="分类编号：" label-width="100px">
						<w-input
							ref="code"
							v-model="formData.code"
							v-fx-tab:focus.name
							:maxlength="$fxCommon.getFxInputMaxLength('shortCode')"
							placeholder="请输入"
							:regType="$fxCommon.getFxInputReg('shortCode')"
							:disabled="!hasEditAuth"
							class="form-item-input"
						></w-input>
					</el-form-item>
					<el-form-item slot="right" prop="name" label="分类名称：" label-width="100px">
						<w-input
							ref="name"
							v-model="formData.name"
							v-fx-tab:focus.selectCycle
							:maxlength="50"
							class="form-item-input"
							:disabled="!hasEditAuth"
							placeholder="方案分类名称"
						/>
					</el-form-item>
				</fx-details-form-row>
				<fx-details-form-row textAlign="right">
					<el-form-item prop="cycle" label="盘点周期：" label-width="100px">
						<w-select-cycle
							ref="selectCycle"
							v-model="cycleData"
							v-fx-tab:focus.memo
							actionLabel="盘点"
							class="form-item-input"
							:disabled="!hasEditAuth"
						></w-select-cycle>
					</el-form-item>
				</fx-details-form-row>
				<fx-details-form-row textAlign="right">
					<el-form-item prop="relAllHouses" label="适用仓库：" label-width="100px">
						<el-radio :disabled="!hasEditAuth" v-model="formData.relAllHouses" :label="1">全部仓库</el-radio>
						<el-radio :disabled="!hasEditAuth" v-model="formData.relAllHouses" :label="0">自定义</el-radio>
						<el-button type="primary" :disabled="!!formData.relAllHouses || !hasEditAuth" @click="onSettingStore">设置适用仓库</el-button>
					</el-form-item>
				</fx-details-form-row>
				<fx-details-form-row textAlign="right">
					<el-form-item slot="left" prop="relAllItems" label="适用品项：" label-width="100px">
						<el-radio :disabled="!hasEditAuth" v-model="formData.relAllItems" :label="1">全部品项</el-radio>
						<el-radio :disabled="!hasEditAuth" v-model="formData.relAllItems" :label="0">自定义</el-radio>
						<el-button type="primary" :disabled="!!formData.relAllItems || !hasEditAuth" @click="onSettingItem">设置适用品项</el-button>
						<w-link></w-link>
					</el-form-item>
					<el-form-item slot="right" label="必盘品项：" label-width="100px">
						<w-link :disabled="!hasEditAuth" @click="onSettingMustItem">点击设置</w-link>
					</el-form-item>
				</fx-details-form-row>
				<fx-details-form-row textAlign="right">
					<el-form-item slot="right" label="盘点顺序：" label-width="100px">
						<w-link :disabled="!hasEditAuth" @click="onSettingTakeStockSort">点击设置</w-link>
					</el-form-item>
				</fx-details-form-row>
				<fx-details-form-row textAlign="right">
					<el-form-item label="备注：" label-width="100px">
						<el-input
							ref="memo"
							type="textarea"
							v-model="formData.memo"
							v-fx-tab="memoTabHandler"
							:rows="5"
							:maxlength="400"
							placeholder="请输备注"
							class="form-item-input-memo"
							show-word-limit
							resize="none"
							:disabled="!hasEditAuth"
						/>
					</el-form-item>
				</fx-details-form-row>
				<fx-details-form-row textAlign="right">
					<el-form-item  prop="enableFlag" label="启停状态：" label-width="100px">
						<w-switch
							ref="enableFlag"
							v-model="formData.enableFlag"
							v-fx-tab="enableFlagTabHandler"
							:active-value="1"
							:inactive-value="0"
							:disabled="switchDisabled"
							:inclusion="false"
							:width="40"
						></w-switch>
					</el-form-item>
				</fx-details-form-row>
			</el-form>
		</div>
		<template slot="footer">
			<el-button
				ref="cancelBtn"
				v-fx-tab="cancelBtnTabHandler"
				@click="onCancelClick"
			>取消</el-button>
			<el-button
				ref="saveBtn"
				type="primary"
				v-fx-auth:basic-archives_support-archives_take-stock-class.edit-take-stock-class|enable-take-stock-class|disable-take-stock-class
				v-fx-tab:focus.cancelBtn
				@click="onSaveClick"
			>保存</el-button>
			<el-button
				ref="saveAndAddBtn"
				type="primary"
				v-show="isAdd"
				v-fx-tab:focus.saveBtn
				@click="onSaveAndAddClick"
			>保存并新建</el-button>
		</template>
		<settingStore ref="settingStore"></settingStore>
		<settingItem ref="settingItem"></settingItem>
		<settingMustItem ref="settingMustItem"></settingMustItem>
		<settingTakeStockSort ref="settingTakeStockSort"></settingTakeStockSort>
	</w-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import settingStore from './SettingStore.vue'
import settingItem from './connect-item/connect-item.vue'
import settingMustItem from './SettingMustItem.vue'
import settingTakeStockSort from './SettingTakeStockSort.vue'
export const apiName = 'takeStockClass'
export default {
	name: 'createTakeStockClass',
	components: {
		settingStore,
		settingItem,
		settingMustItem,
		settingTakeStockSort
	},
	data () {
		const validateIgnore = (rule, value, callback) => {
			callback()
		}
		return {
			dialogVisible: false,
			formData: {
				code: '',
				name: '',
				relAllHouses: 0,
				relAllItems: 0,
				memo: '',
				enableFlag: '',
				cycleWay: 1,
				checkCycle: ''
			},
			cycleData: {
				cycleWay: '',
				cycleDay: ''
			},
			rules: {
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				cycle: [{ required: true, trigger: 'no', validator: validateIgnore }],
				relAllHouses: [{ required: true, trigger: 'no', validator: validateIgnore }],
				relAllItems: [{ required: true, trigger: 'no', validator: validateIgnore }],
				enableFlag: [{ required: true, trigger: 'no', validator: validateIgnore }]
			},
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			billDeleteFlag: false
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		isAdd () {
			return !this.formData.id
		},
		dialogTitle () {
			return this.isAdd ? '新建' : '编辑'
		},
		hasEditAuth () {
			return this.detailsAuthGetter('basic-archives_support-archives_take-stock-class.edit-take-stock-class')
		},
		showMoreBtn () {
			return !this.isAdd &&
			(this.detailsAuthGetter('basic-archives_support-archives_take-stock-class.delete-take-stock-class') ||
			this.detailsAuthGetter('basic-archives_support-archives_take-stock-class.edit-take-stock-class'))
		},
		switchDisabled () {
			return ((!this.formData.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_take-stock-class.enable-take-stock-class')) || (!!this.formData.enableFlag && !this.detailsAuthGetter('basic-archives_support-archives_take-stock-class.disable-take-stock-class')))
		}
	},
	watch: {
		cycleData: {
			deep: true,
			handler (val) {
				this.formData.cycleWay = val.cycleWay
				this.formData.checkCycle = val.cycleDay
			}
		}
	},
	created () {
		this.$fxTabkey.init('basic-archives_support-archives_take-stock-class_details', this)
	},
	methods: {
		async add () {
			this.billDeleteFlag = false
			const code = await this.getArchiveCode()
			this.formData = {
				code,
				name: '',
				relAllHouses: 1,
				relAllItems: 1,
				memo: '',
				enableFlag: 1,
				cycleWay: 1,
				checkCycle: ''
			}
			this.cycleData = {
				cycleWay: 1,
				cycleDay: ''
			}
			this.dialogVisible = true
			this.$nextTick(() => {
				this.$fxUtils.vDoRefFocus(this, 'name')
				this.$refs.form.clearValidate()
				this.fxDataVerification.resetData(this.formData)
			})
		},
		edit (details) {
			this.billDeleteFlag = false
			this.formData = details
			this.cycleData = {
				cycleWay: details.cycleWay,
				cycleDay: details.checkCycle
			}
			this.dialogVisible = true
			this.$nextTick(() => {
				if (this.hasEditAuth) {
					this.$fxUtils.vDoRefFocus(this, 'name')
				} else if (!this.switchDisabled) {
					this.$fxUtils.vDoRefFocus(this, 'enableFlag')
				} else {
					this.$fxUtils.vDoRefFocus(this, 'cancelBtn')
				}
				this.$refs.form.clearValidate()
				this.fxDataVerification.resetData(this.formData)
			})
		},
		getArchiveCode () {
			return this.$fxApi('archiveCode.get', 'CheckClass')
		},
		onRefresh () {
			this.$emit('on-refresh', this.billDeleteFlag)
		},
		onSaveClick () {
			return this.onValidateFormData().then(this.onSaveHandler)
		},
		onSaveAndAddClick () {
			this.onValidateFormData().then(this.onSaveHandler).then(() => {
				this.add()
			})
		},
		onValidateFormData () {
			return new Promise(resolve => {
				this.$refs.form.validate().then(() => {
					if (this.cycleData.cycleWay === 5 && this.cycleData.cycleDay === '') {
						this.$fxMessage.warning('请输入盘点周期')
					} else {
						resolve()
					}
				})
			})
		},
		onSaveHandler () {
			if (this.isAdd) {
				return this.onSaveFormHandler()
			} else {
				if (this.fxDataVerification.checkData(this.formData)) {
					this.$fxMessage.success('保存成功')
					return Promise.resolve()
				} else {
					return this.onSaveFormHandler()
				}
			}
		},
		onSaveFormHandler () {
			const params = {
				id: this.formData.id,
				code: this.formData.code,
				name: this.formData.name,
				memo: this.formData.memo,
				relAllHouses: this.formData.relAllHouses,
				relAllItems: this.formData.relAllItems,
				cycleWay: this.cycleData.cycleWay,
				checkCycle: this.cycleData.cycleDay,
				enableFlag: this.formData.enableFlag
			}
			if (this.isAdd) {
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.take-stock-class.add', { name: this.formData.name, code: this.formData.code })
				return this.$fxApi(`${apiName}.add`)({ data: params, logger }).then(res => {
					this.formData = res
					this.fxDataVerification.resetData(this.formData)
					return Promise.resolve()
				})
			} else {
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.take-stock-class.update', this.createLoggerParams())
				return this.$fxApi(`${apiName}.save`, this.formData.id)({ data: params, logger }).then(res => {
					this.fxDataVerification.resetData(this.formData)
					return Promise.resolve()
				})
			}
		},
		getCycleValue (cycleWay, cycleDay) {
			if (cycleWay === 5 || cycleWay === 3) {
				const cycleWayValue = this.$refs.selectCycle.cycleList.filter(item => item.id === cycleWay)[0].name
				return `${cycleWayValue} : ${cycleDay}`
			} else {
				const cycleWayValue = this.$refs.selectCycle.cycleList.filter(item => item.id === cycleWay)[0].name
				const cycleDayValue = this.$fxUtils.getSelectMulityById(cycleDay.split(','), this.$refs.selectCycle.weekList).map(i => i.name).join(',')
				return cycleDayValue ? `${cycleWayValue} : ${cycleDayValue}` : cycleWayValue
			}
		},
		getName (list) {
			return list.map(item => {
				return item.name
			}).join(',')
		},
		createLoggerParams () {
			const originData = this.fxDataVerification.getOriginData()
			originData.cycle = this.getCycleValue(originData.cycleWay, originData.checkCycle)
			const organDetails = this.$fxUtils.deepClone(this.formData)
			organDetails.cycle = this.getCycleValue(organDetails.cycleWay, organDetails.checkCycle)
			return {
				pre: originData,
				cur: organDetails,
				name: organDetails.name
			}
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.dialogVisible = false
			})
		},
		onDeleteClick () {
			this.$fxConfirm('是否确定删除盘点分类？').then(() => {
				this.onDeleteHandler().then(this.onCancelClick)
			})
		},
		onDeleteHandler () {
			return this.$fxApi(`${apiName}.del`, this.formData.id).then(res => {
				this.billDeleteFlag = true
				this.fxDataVerification.resetData(this.formData)
				return Promise.resolve()
			})
		},
		exportData () {
			this.onSaveClick().then(() => {
				const logger = this.$fxLogger.createInfo('basic-archives.support-archives.take-stock-class.exportData', { name: this.formData.name, code: this.formData.code })
				const id = this.formData.id
				return this.$fxApi(`${apiName}.exportData`, id)({ logger }).then(res => {
					const fileName = `盘点分类: ${this.formData.code}-${this.formData.name}`
					this.$fxUtils.downloadFile(res, fileName)
				})
			})
		},
		onSettingStore () {
			this.onSaveClick().then(() => {
				this.$refs.settingStore.open(this.formData)
			})
		},
		onSettingItem () {
			this.onSaveClick().then(() => {
				this.$refs.settingItem.open(this.formData)
			})
		},
		onSettingMustItem () {
			this.onSaveClick().then(() => {
				this.$refs.settingMustItem.open(this.formData)
			})
		},
		onSettingTakeStockSort () {
			this.onSaveClick().then(() => {
				this.$refs.settingTakeStockSort.open(this.formData)
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.formData)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
		},
		memoTabHandler ({ focus }) {
			this.switchDisabled ? this.isAdd ? focus('saveAndAddBtn') : focus('saveBtn') : focus('enableFlag')
		},
		enableFlagTabHandler ({ focus }) {
			this.isAdd ? focus('saveAndAddBtn') : focus('saveBtn')
		},
		cancelBtnTabHandler ({ focus }) {
			this.hasEditAuth ? focus('code') : this.switchDisabled ? focus('saveBtn') : focus('enableFlag')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-area {
	width: 100%
	height: 400px
	box-sizing: border-box
	.form-item-input {
		width:296px
	}
	.form-item-input-memo {
		width:750px
	}
}
</style>
