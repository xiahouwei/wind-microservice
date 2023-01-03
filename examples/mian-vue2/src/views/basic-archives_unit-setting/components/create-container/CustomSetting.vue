<template>
	<w-dialog
		v-model="dialogVisible"
		title="设置"
		width="655px"
		top="15vh"
		:beforeClose="onBeforeClose"
	>
		<div class="custom-setting-container">
			<el-form ref="form" :model="customSettingData" size="mini" label-width="100px" inline label-position="left">
				<template v-for="(item,index) in customSettingData.data">
					<el-form-item :prop="`data[${index}].unitId`" label="选择单位：" :key="index" :rules="rules.unitId"	class="unit-form-item">
						<w-select
							v-model="customSettingData.data[index].unitId"
							:optionlist="computedUnitList(index)"
							class="form-unit-input"
						>
						</w-select>
					</el-form-item>
					<el-form-item :prop="`data[${index}].organIds`" :label="selectLabel" :key="index" :rules="rules.organIds">
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
				</template>
			</el-form>
			<div v-show="showAdd" class="add-btn" @click="onAddClick">+添加</div>
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
	name: 'customSetting',
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
			id: '',
			organList: [],
			rules: {
				unitId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				organIds: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			}
		}
	},
	computed: {
		computedUnitList () {
			return (index) => {
				const selectedUnitIds = []
				this.customSettingData.data.forEach((item, _index) => {
					if (_index !== index) {
						selectedUnitIds.push(item.unitId)
					}
				})
				return this.unitList.filter(item => {
					if (this.isInOrOutStoreBill) {
						return !selectedUnitIds.includes(item.id) && !item.assistFlag
					} else {
						return !selectedUnitIds.includes(item.id)
					}
				})
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
		showAdd () {
			if (this.isInOrOutStoreBill) {
				return this.unitList.filter(item => !item.assistFlag).length > this.customSettingData.data.length
			} else {
				return this.unitList.length > this.customSettingData.data.length
			}
		},
		showDel () {
			return this.customSettingData.data.length > 1
		},
		isInOrOutStoreBill () {
			return ['InStore', 'OutStore'].includes(this.billClass)
		}
	},
	methods: {
		open (id, organType, billType) {
			this.id = id
			this.organType = organType
			this.billType = billType
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
						return {
							unitId: key,
							organIds: res[key]
						}
					})
				} else {
					this.customSettingData.data = [{ unitId: '', organIds: [] }]
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
				const logger = this.$fxLogger.createInfo('basic-archives.unit-setting.customSetting', { itemName: this.itemName, data: this.customSettingData.data, billClass: this.billClass, billType: this.billType, organType: this.organType, unitList: this.unitList, organList: this.organList })
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
			this.customSettingData.data.push({ unitId: '', organIds: [] })
		},
		onDelClick (index) {
			this.customSettingData.data.splice(index, 1)
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.custom-setting-container {
	padding 0 15px
	.unit-form-item {
		margin-right 40px
		.form-unit-input {
			width 120px
		}
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
}
</style>
