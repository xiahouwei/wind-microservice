<template>
	<div class="setting-step1-container">
		<el-form ref="form" :model="replaceInfo" :rules="rules" size="mini" label-width="100px" inline>
			<el-form-item prop="oldItemId" label="选择配料：">
				<w-select-tab
					ref="oldItemId"
					v-fx-tab:focus.itemId
					:value="replaceInfo.oldItemId"
					:optionlist="itemList"
					class="form-item-input"
					@change="changeOldItemId"
				></w-select-tab>
			</el-form-item>
			<el-form-item prop="replaceAll" label="选择BOM：">
				<el-radio v-model="replaceInfo.replaceAll" :label="true">全部</el-radio>
				<el-radio v-model="replaceInfo.replaceAll" :label="false">自定义</el-radio>
				<transition name="el-zoom-in-center">
					<el-button type="primary" v-show="!replaceInfo.replaceAll" @click="selectBom">选择BOM</el-button>
				</transition>
			</el-form-item>
			<el-form-item prop="itemId" label="更换配料：">
				<w-select-tab
					ref="itemId"
					v-fx-tab:focus.unitId
					:value="replaceInfo.itemId"
					:optionlist="itemList"
					class="form-item-input"
					@change="changeItemId"
				></w-select-tab>
			</el-form-item>
			<el-form-item prop="spec" label="规格：">
				<w-input
					ref="spec"
					v-model="replaceInfo.spec"
					disabled
					class="form-item-input"
				>
				</w-input>
			</el-form-item>
			<el-form-item prop="unitId" label="单位：">
				<w-select
					ref="unitId"
					v-fx-tab="unitIdTabHandler"
					v-model="replaceInfo.unitId"
					:optionlist="itemUnitList"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item prop="modUse" label="用量：">
				<el-radio v-model="replaceInfo.modUse" :label="true">修改用量</el-radio>
				<el-radio v-model="replaceInfo.modUse" :label="false">保持不变</el-radio>
			</el-form-item>
			<el-form-item v-if="isType('food_bom') || isType('compose_bom')" prop="materialDosage" label="净料用量：">
				<w-input-number
					ref='materialDosage'
					v-fx-tab:focus.materialRate
					v-model="replaceInfo.materialDosage"
					intLength="4"
					:pointSize="sysPointSize"
					placeholder="请输入"
					class="form-item-input"
					@change="onMaterialDosageChange"
				></w-input-number>
			</el-form-item>
			<el-form-item v-if="isType('food_bom') || isType('compose_bom')" prop="materialRate" label="净料率：">
				<w-input-number
					ref='materialRate'
					v-fx-tab:focus.rawMaterialDosage
					v-model="replaceInfo.materialRateZoom"
					:max="1000"
					:pointSize="sysMoneyPointSize"
					placeholder="请输入"
					class="form-item-input"
					@change="onMaterialRateChange"
				></w-input-number>%
			</el-form-item>
			<el-form-item v-if="isType('food_bom') || isType('compose_bom')" prop="rawMaterialDosage" label="毛料用量：">
				<w-input-number
					ref='rawMaterialDosage'
					v-fx-tab="rawMaterialDosageTabHandler"
					v-model="replaceInfo.rawMaterialDosage"
					intLength="4"
					:pointSize="sysPointSize"
					placeholder="请输入"
					class="form-item-input"
					@change="onRawMaterialDosageChange"
				></w-input-number>
			</el-form-item>
			<el-form-item v-if="isType('food_bom')" prop="ingredientsType" label="配料类型：">
				<w-select
					ref="ingredientsType"
					v-fx-tab:focus.beginDate
					v-model="replaceInfo.ingredientsType"
					:optionlist="ingredientsTypeList"
					class="form-item-input"
				>
				</w-select>
			</el-form-item>
			<el-form-item v-if="isType('split_bom')" prop="outputYield" label="标准产出率：">
				<w-input-number
					ref='outputYield'
					v-fx-tab:focus.beginDate
					v-model="replaceInfo.outputYieldZoom"
					intLength="8"
					:pointSize="sysMoneyPointSize"
					placeholder="请输入"
					class="form-item-input"
					@change="onOutputYieldChange"
				></w-input-number>%
			</el-form-item>
			<el-form-item prop="beginDate" label="生效日期：">
				<w-date-picker
					ref="beginDate"
					v-fx-tab:focus.endDate
					v-model="replaceInfo.beginDate"
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm:SS"
					format="yyyy-MM-dd HH:mm"
					:clearable="false"
					placeholder="选择日期"
					class="form-item-input"
				></w-date-picker>
			</el-form-item>
			<el-form-item prop="endDate" label="失效日期：">
				<w-date-picker
					ref="endDate"
					v-model="replaceInfo.endDate"
					v-fx-tab:loop.basic-archives_bom-set_replace.replaceMulityStep1
					type="datetime"
					align="right"
					value-format="yyyy-MM-dd HH:mm:SS"
					format="yyyy-MM-dd HH:mm"
					:clearable="false"
					placeholder="选择日期"
					class="form-item-input"
				></w-date-picker>
			</el-form-item>
		</el-form>
		<selectBom
			ref="selectBom"
			:type="type"
			:replaceInfo="replaceInfo"
			:bomIdLists.sync="bomIdLists"
		></selectBom>
	</div>
</template>
<script>
import { mapState } from 'vuex'
import selectBom from './SelectBom.vue'
export default {
	name: 'replaceMulityStep1',
	components: {
		selectBom
	},
	props: {
		type: String
	},
	data () {
		const replaceAllValidator = (rule, value, callback) => {
			if (!value && this.bomIdLists.length <= 0) {
				callback(new Error('请选择BOM'))
			} else {
				callback()
			}
		}
		const materialDosageValidator = (rule, value, callback) => {
			if ((this.isType('food_bom') || this.isType('compose_bom')) && value <= 0) {
				callback(new Error('净料用量必须大于0'))
			} else {
				callback()
			}
		}
		const materialRateValidator = (rule, value, callback) => {
			if ((this.isType('food_bom') || this.isType('compose_bom')) && this.replaceInfo.materialRateZoom <= 0) {
				callback(new Error('净料率必须大于0%'))
			} else if ((this.isType('food_bom') || this.isType('compose_bom')) && this.replaceInfo.materialRateZoom > 1000) {
				callback(new Error('净料率不能大于1000%'))
			} else {
				callback()
			}
		}
		const rawMaterialDosageValidator = (rule, value, callback) => {
			if ((this.isType('food_bom') || this.isType('compose_bom')) && value <= 0) {
				callback(new Error('毛料用量必须大于0'))
			} else {
				callback()
			}
		}
		const beginDateValidator = (rule, value, callback) => {
			if (!value) {
				callback(new Error('该字段不能为空'))
			} else {
				if (this.$fxUtils.compareDate(this.replaceInfo.endDate, this.replaceInfo.beginDate)) {
					callback()
				} else {
					callback(new Error('生效日期不能大于失效日期'))
				}
			}
		}
		const endDateValidator = (rule, value, callback) => {
			if (!value) {
				callback(new Error('该字段不能为空'))
			} else {
				if (this.$fxUtils.compareDate(this.replaceInfo.endDate, this.replaceInfo.beginDate)) {
					callback()
				} else {
					callback(new Error('生效日期不能大于失效日期'))
				}
			}
		}
		return {
			rules: {
				oldItemId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				replaceAll: [{ required: true, trigger: 'no', validator: replaceAllValidator }],
				itemId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				unitId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				modUse: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				materialDosage: [{ required: true, trigger: 'no', validator: materialDosageValidator }],
				materialRate: [{ required: true, trigger: 'no', validator: materialRateValidator }],
				rawMaterialDosage: [{ required: true, trigger: 'no', validator: rawMaterialDosageValidator }],
				ingredientsType: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				outputYield: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				beginDate: [{ required: true, trigger: 'no', validator: beginDateValidator }],
				endDate: [{ required: true, trigger: 'no', validator: endDateValidator }]
			},
			bomIdLists: [],
			replaceInfo: {
				oldItemId: '',
				oldItemName: '',
				replaceAll: true,
				itemId: '',
				itemName: '',
				spec: '',
				unitId: '',
				modUse: false,
				materialDosage: 1,
				materialRate: 1,
				materialRateZoom: 100,
				rawMaterialDosage: 1,
				ingredientsType: 0,
				outputYield: 1,
				outputYieldZoom: 100,
				beginDate: `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getDate()} 00:00:00`,
				endDate: `${(new Date()).getFullYear() + 99}-${(new Date()).getMonth() + 1}-${(new Date()).getDate()} 00:00:00`
			},
			itemList: [],
			itemUnitList: [],
			ingredientsTypeList: this.$fxTypeMiddleware.getCommonTypeList('ingredientsType'),
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			fxCalculation: this.$fxCalculation('bomSet')
		}
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize,
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		isType () {
			return (type) => {
				return this.type === type
			}
		}
	},
	methods: {
		open () {
			this.getItemList().then(() => {
				this.defaultFocus('oldItemId')
			})
			this.fxDataVerification.resetData(this.replaceInfo)
		},
		unitIdTabHandler ({ focus }) {
			this.isType('food_bom') || this.isType('compose_bom') ? focus('materialDosage') : focus('outputYield')
		},
		rawMaterialDosageTabHandler ({ focus }) {
			this.isType('food_bom') ? focus('ingredientsType') : focus('beginDate')
		},
		defaultFocus (refName = 'oldItemId') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		getItemList () {
			return this.$fxApi('bom.getItemSelectTab', this.type).then(res => {
				this.itemList = res
				return Promise.resolve()
			})
		},
		changeOldItemId (val, item) {
			this.replaceInfo.oldItemId = val
			this.replaceInfo.oldItemName = item.name
		},
		async changeItemId (val, item) {
			this.replaceInfo.itemId = val
			this.replaceInfo.itemName = item.name
			this.replaceInfo.spec = item.spec
			this.replaceInfo.unitId = ''
			this.itemUnitList = await this.getUnitList(item.id)
		},
		onMaterialDosageChange () {
			this.fxCalculation.changeMaterialDosage(this.replaceInfo)
		},
		onMaterialRateChange (val) {
			this.fxCalculation.changeMaterialRate(val, this.replaceInfo)
		},
		onRawMaterialDosageChange () {
			this.fxCalculation.changeRawMaterialDosage(this.replaceInfo)
		},
		onOutputYieldChange (item) {
			this.replaceInfo.outputYield = item / 100
		},
		getUnitList (itemId) {
			return this.$fxApi('bom.getUnitList', this.type, itemId).then(res => {
				return Promise.resolve(res)
			})
		},
		selectBom () {
			if (!this.replaceInfo.oldItemId) {
				return this.$fxMessage.warning('请选择配料')
			}
			this.$refs.selectBom.open()
		},
		confirmHandler () {
			return this.$refs.form.validate().then(this.replaceMulity)
		},
		replaceMulity () {
			const data = this.replaceInfo
			data.bomIdLists = this.bomIdLists
			return this.$fxApi('bom.replaceMulity', this.type)({ data }).then(res => {
				const logger = this.$fxLogger.createInfo('basic-archives.bom.replaceMulity', { success: res.success, replaceInfo: this.replaceInfo })
				const loggerInfo = this.$fxLogger.actionInfo(logger)
				loggerInfo.success()
				return Promise.resolve(res)
			})
		},
		onClose () {
			this.replaceInfo = {
				oldItemId: '',
				replaceAll: true,
				itemId: '',
				spec: '',
				unitId: '',
				modUse: false,
				materialDosage: 1,
				materialRate: 1,
				materialRateZoom: 100,
				rawMaterialDosage: 1,
				ingredientsType: 0,
				outputYield: 1,
				outputYieldZoom: 100,
				beginDate: `${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1}-${(new Date()).getDate()} 00:00:00`,
				endDate: `${(new Date()).getFullYear() + 99}-${(new Date()).getMonth() + 1}-${(new Date()).getDate()} 00:00:00`
			}
			this.itemUnitList = []
			this.$refs.selectBom.selectIds = []
			this.$refs.form.clearValidate()
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.replaceInfo)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width 200px
}
</style>
