<template>
	<w-dialog
		v-model="dialogVisible"
		title="设置"
		:width="computedWidth"
		top="15vh"
		:beforeClose="onBeforeClose"
	>
		<div class="custom-setting-container">
			<w-scroll-bar>
				<el-form ref="form" :model="customSettingData" size="mini" label-width="100px" inline label-position="left">
					<div v-for="(item,index) in customSettingData.data" :key="index">
						<el-form-item :prop="`data[${index}].bigUnitId`" :label="selectUnitLabel" :rules="rules.bigUnitId" :class="['unit-form-item', `unit-form-item-${index}`,{'is-double-unit-input': !isSingleUnit}]">
							<w-select
								v-model="customSettingData.data[index].bigUnitId"
								:optionlist="computedBigUnitList(index, customSettingData.data[index].smallUnitId)"
								:placeholder="selectUnitPlaceholder"
								class="form-unit-input"
							>
							</w-select>
						</el-form-item>
						<el-form-item v-if="!isSingleUnit" :prop="`data[${index}].smallUnitId`" :rules="rules.smallUnitId" class="unit-form-item">
							<w-select
								v-model="customSettingData.data[index].smallUnitId"
								:optionlist="computedSmallUnitList(index, customSettingData.data[index].bigUnitId)"
								placeholder="请选择小单位"
								class="form-unit-input"
							>
							</w-select>
						</el-form-item>
						<el-form-item :prop="`data[${index}].organIds`" :label="selectLabel" :rules="rules.organIds">
							<w-select-mulity
								v-model="customSettingData.data[index].organIds"
								:optionlist="computedOrganList(index)"
								:showEmpty="false"
								:clearable="false"
								:syncSortOption="false"
								class="form-organ-input"
							>
							</w-select-mulity>
						</el-form-item>
						<w-link v-show="showDel" icon="spec-del" @click="onDelClick(index)" :key="index"></w-link>
					</div>
				</el-form>
			</w-scroll-bar>
			<div v-show="showAdd" :class="['add-btn', {'is-double-unit': !isSingleUnit}]" @click="onAddClick">+添加</div>
			<div v-show="!isSingleUnit" :class="['check-bill-tip', {'is-double-unit': !isSingleUnit}]">温馨提示：1.盘点小单位必须选择换算系数小于等于盘点大单位换算系数的单位/或者选择最小单位；2.大单位不允许选择最小单位；</div>
		</div>
		<template slot="footer-right">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="onSaveClick">保存</el-button>
		</template>
	</w-dialog>
</template>

<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'customSettingCheckBill',
	props: {
		unitList: {
			type: Array,
			default: () => {
				return []
			}
		},
		billClass: String,
		itemName: String
	},
	data () {
		return {
			customSettingData: { data: [] },
			dialogVisible: false,
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			organType: 1,
			billType: '',
			setType: 1,
			id: '',
			organList: [],
			rules: {
				bigUnitId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				smallUnitId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				organIds: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			}
		}
	},
	computed: {
		computedBigUnitList () {
			return (index, unitIdSmall) => {
				const selectedUnitIds = this.getSelectedUnitIds(index)
				if (unitIdSmall) {
					const unitSmall = this.unitList.find(unit => unit.id === unitIdSmall)
					return this.unitList.filter(unit => {
						return unit.ratio >= unitSmall.ratio && !unit.assistFlag && unit.id !== unitIdSmall && !unit.mainFlag
					})
				} else if (this.isSingleUnit) {
					return this.unitList.filter(unit => {
						return !unit.assistFlag && !selectedUnitIds.includes(unit.id)
					})
				} else {
					return this.unitList.filter(unit => {
						return !unit.assistFlag && !unit.mainFlag
					})
				}
			}
		},
		computedSmallUnitList () {
			return (index, unitIdBig) => {
				if (unitIdBig) {
					const unitBig = this.unitList.find(unit => unit.id === unitIdBig)
					return this.unitList.filter(unit => {
						return unit.ratio <= unitBig.ratio && !unit.assistFlag && unit.id !== unitIdBig
					})
				} else {
					return this.unitList.filter(unit => {
						return !unit.assistFlag
					})
				}
			}
		},
		computedOrganList () {
			return (index) => {
				const selectedOrganIds = []
				this.customSettingData.data.forEach((item, _index) => {
					if (_index !== index) {
						selectedOrganIds.push(...item.organIds)
					}
				})
				return this.organList.filter(item => {
					return !selectedOrganIds.includes(item.id)
				})
			}
		},
		selectLabel () {
			return this.organType === 1 ? '选择中心：' : '选择门店：'
		},
		selectUnitLabel () {
			return this.isSingleUnit ? '选择大单位：' : '选择单位：'
		},
		selectUnitPlaceholder () {
			return !this.isSingleUnit ? '请选择大单位' : '请选择'
		},
		showAdd () {
			const unitListLength = this.unitList.filter(item => !item.assistFlag).length
			if (this.isSingleUnit) {
				return unitListLength >= 2 && this.customSettingData.data.length < unitListLength
			} else {
				return true
			}
		},
		showDel () {
			return this.customSettingData.data.length > 1
		},
		isSingleUnit () {
			return this.setType === 1
		},
		computedWidth () {
			return this.isSingleUnit ? '655px' : '795px'
		}
	},
	methods: {
		open (id, organType, billType, setType) {
			this.id = id
			this.organType = organType
			this.billType = billType
			this.setType = setType
			this.getOragnList().then(this.getCustomSetting).then(() => {
				this.$refs.form && this.$refs.form.clearValidate()
				this.dialogVisible = true
				this.fxDataVerification.resetData(this.customSettingData.data)
			})
		},
		getCustomSetting () {
			return this.$fxApi(`${apiName}.getCustomSetting`, this.id).then(res => {
				const resKeyArr = Object.keys(res)
				if (resKeyArr.length) {
					this.customSettingData.data = resKeyArr.map(key => {
						const unitArr = key.split('_')
						if (this.isSingleUnit) {
							return {
								bigUnitId: unitArr[0],
								organIds: res[key]
							}
						} else {
							return {
								bigUnitId: unitArr[0],
								smallUnitId: unitArr[1],
								organIds: res[key]
							}
						}
					})
				} else {
					this.customSettingData.data = [{ bigUnitId: '', smallUnitId: '', organIds: [] }]
				}
				return Promise.resolve()
			})
		},
		getOragnList () {
			let data = {}
			if (this.organType === 1) {
				data = { organTypeList: ['1'] }
			} else {
				data = { organTypeList: ['2'] }
			}
			return this.$fxApi(`${apiName}.getOragnList`)({ data }).then(res => {
				this.organList = res[0].listData
				return Promise.resolve()
			})
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSaveClick () {
			return this.$refs.form.validate().then(this.onSaveHandler)
		},
		onSaveHandler () {
			const isChanged = !this.fxDataVerification.checkData(this.customSettingData.data)
			if (isChanged) {
				const logger = this.$fxLogger.createInfo('basic-archives.unit-setting.customSetting', { itemName: this.itemName, data: this.customSettingData.data, billClass: this.billClass, billType: this.billType, organType: this.organType, unitList: this.unitList, organList: this.organList, setType: this.setType })
				return this.$fxApi(`${apiName}.saveCustomSetting`, this.id)({ data: this.customSettingData.data, logger }).then(() => {
					this.$fxMessage.success('保存成功！')
					this.dialogVisible = false
				})
			} else {
				this.$fxMessage.success('保存成功！')
				this.dialogVisible = false
			}
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.customSettingData.data)
		},
		onBeforeClose (close) {
			this.verificationDetails().then(close)
		},
		onAddClick () {
			this.customSettingData.data.push({ bigUnitId: '', smallUnitId: '', organIds: [] })
			this.$nextTick(() => {
				const target = this.$el.querySelector(`.unit-form-item-${this.customSettingData.data.length - 1}`)
				this.$fxUtils.doScrollTop(target)
			})
		},
		onDelClick (index) {
			this.customSettingData.data.splice(index, 1)
		},
		getSelectedUnitIds (index) {
			const selectedUnitIds = []
			this.customSettingData.data.forEach((item, _index) => {
				if (_index !== index) {
					selectedUnitIds.push(item.bigUnitId)
					selectedUnitIds.push(item.smallUnitId)
				}
			})
			return selectedUnitIds
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.custom-setting-container {
	padding-left 15px
	.unit-form-item {
		margin-right 30px
		&.is-double-unit-input {
			margin-right 10px
		}
		.form-unit-input {
			width 130px
		}
	}
	>>>.el-scrollbar__wrap {
		max-height: 282px
	}
	.form-organ-input {
		width 180px
	}
	.add-btn {
		width 540px
		line-height 45px
		font-size 14px
		color $fxRed
		text-align center
		border 1px dashed $fxGray1
		box-sizing border-box
		border-radius 5px
		cursor pointer
	}
	.check-bill-tip {
		width 540px
		margin-top 20px
		font-size 12px
		color $fxRed
		&.is-double-unit {
			width 700px
		}
	}
	.is-double-unit {
		width 680px
	}
}
</style>
