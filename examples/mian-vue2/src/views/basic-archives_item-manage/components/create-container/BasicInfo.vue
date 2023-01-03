<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="100px" inline>
			<fx-details-form-row>
				<el-form-item prop="itemTypeAll" label="所属类别：">
					<w-cascader
						ref="cascaderOrgan"
						v-model="organDetails.itemTypeAll"
						v-fx-tab:focus.code
						:options="organCascaderData"
						:optionProps="organProps"
						:disabled="disabled"
						class="form-item-organ"
						@change="onItemTypeChange"
					>
					</w-cascader>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="品项图片：" class="avatar-block form-item-image">
					<fx-upload
						type="image"
						:fileList="avatarList"
						:limit="1"
						:notes="false"
						:disabled="disabled"
						class="avatar-upload-content"
						@on-change="onAvatarChange"
					></fx-upload>
				</el-form-item>
				<template slot="right">
					<div class="form-item-vertical">
						<el-form-item prop="code" label="品项编号：">
							<w-input
								ref='code'
								v-model="organDetails.code"
								v-fx-tab:focus.name
								:disabled="disabled || isOnlyFromMiddleground"
								:maxlength="$fxCommon.getFxInputMaxLength('commonCode')"
								placeholder="请输入品项编号"
								:regType="$fxCommon.getFxInputReg('commonCode')"
								class="form-item-input"
							></w-input>
						</el-form-item>
						<el-form-item prop="name" label="品项名称：">
							<w-input
								ref='name'
								v-model="organDetails.name"
								v-fx-tab:focus.spec
								:maxlength="100"
								:disabled="disabled || isOnlyFromMiddleground"
								placeholder="请输入品项名称"
								class="form-item-input"
								@blur="onNameChange"
							/>
						</el-form-item>
						<el-form-item label="品项规格：" class="form-item-spec">
							<w-input
								ref="spec"
								v-model="organDetails.spec"
								v-fx-tab:focus.pinYin
								:maxlength="50"
								:disabled="disabled"
								placeholder="请输入品项规格"
								class="form-item-input"
							/>
						</el-form-item>
					</div>
				</template>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" label="助记符：" prop="pinYin">
					<w-input
						ref="pinYin"
						v-model="organDetails.pinYin"
						v-fx-tab:focus.offsetMethod
						:maxlength="50"
						placeholder="请输入"
						:disabled="disabled"
						class="form-item-input"
					/>
				</el-form-item>
				<el-form-item slot="right" required prop="itemCategoryListSelect" label="品项类型：" class="form-item-category">
					<el-checkbox-group
						v-model="organDetails.itemCategoryListSelect"
						:disabled="disabled"
					>
						<el-checkbox :label=0 :disabled='label0disabled'>原料/物料</el-checkbox>
						<el-checkbox :label=1 :disabled='label1disabled'>菜品</el-checkbox>
						<el-checkbox :label=2 :disabled='label2disabled'>商品</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" prop="offsetMethod" label="耗用方式：">
					<w-select
						ref="offsetMethod"
						v-model="organDetails.offsetMethod"
						v-fx-tab="offsetMethodTabHandler"
						:disabled="disabled"
						:optionlist="offsetMethodList"
						:optionProp="optionProp"
						class="form-item-input"
						@change='offsetMethodChange'
					>
					</w-select>
				</el-form-item>
				<el-form-item
					slot="right"
					prop="consumptionMethod"
					label="冲减方式："
					:class="{'is-write-down-cost': consumptionMethodDisabled}"
				>
					<w-select
						ref="consumptionMethod"
						v-model="organDetails.consumptionMethod"
						v-fx-tab="consumptionMethodTabHandler"
						:optionlist="consumptionMethodList"
						:optionProp="optionProp"
						:disabled="consumptionMethodDisabled || disabled"
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" prop="enableFlag" label="启停状态：">
					<w-switch
						ref="enableFlag"
						v-model="organDetails.enableFlag"
						v-fx-tab="enableFlagTabHandler"
						:disabled="fDisabledEnableFlagSwitch"
						:active-value="1"
						:inactive-value="0"
						:inclusion="false"
						:width="40"
					></w-switch>
				</el-form-item>
				<el-form-item slot="right" label="保质期天数：" class="form-item-shelf-life">
					<w-switch
						ref="shelfLifeFlag"
						v-model="organDetails.shelfLifeFlag"
						v-fx-tab="shelfLifeFlagTabHandler"
						:disabled="disabled"
						activeText="开启"
						inactiveText="关闭"
					></w-switch>
					<w-input-number
						ref="shelfLife"
						v-model="organDetails.shelfLife"
						v-fx-tab="shelfLifeTabHandler"
						:max="9999"
						:disabled="!organDetails.shelfLifeFlag || disabled"
						intLength="4"
						placeholder="请输入"
						integer
						class="form-item-input"
					></w-input-number>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row class="finance-content">
				<el-form-item label="财务分类：" class="form-item-finance">
					<el-radio v-model="organDetails.relAllFinances" :label="true" :disabled="disabled">全部</el-radio>
					<w-select
						ref="financeSortId"
						v-model="organDetails.financeSortId"
						v-fx-tab:loop.basic-archives_item-manage_details.basicInfo
						:disabled="disabled || !organDetails.relAllFinances"
						:optionlist="financialClassList"
						clearable
						class="form-item-input"
					>
					</w-select>
					<w-icon v-fx-auth:basic-archives_support-archives_financial-class.add-financial type="add-round" :disabled="disabled" class="form-input-add-btn" pointer @click="onAddFinancialClick"></w-icon>
					<el-radio v-model="organDetails.relAllFinances" :label="false" :disabled="disabled" class="custom-radio">自定义</el-radio>
					<transition name="el-zoom-in-center">
						<fx-button
							ref="financeSortSetting"
							v-fx-tab:loop.basic-archives_item-manage_details.basicInfo
							v-show="!organDetails.relAllFinances"
							type="primary"
							@click="onFinanceSortSetting"
						>
							设置财务分类
						</fx-button>
					</transition>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" prop="itemUnitList" label-width="100px">
					<span slot="label">
						<span>品项单位：</span>
						<el-popover
							placement="top-start"
							width="520"
							trigger="hover"
							:content="`注意事项：\n1.一种品项可有多个计量单位，每个单位可用于多种不同的业务，但每种业务下不能有同名单位\n2.被选定为辅助的单位不允许同时为其他类型的单位，且不允许建立成本卡\n3.除最小单位外，其他单位在有单据被使用时，也可以进行换算系数修改注意事项\n辅助单位切换原则：\n1.如果品项已有辅助单位时\n若该品项在单据中被使用过，则不允许切换辅助单位；\n若该品项未在单据中被使用过，但切换后，新的辅助单位在BOM或价格方案中被使用过，则不允许切换该单位为新辅助单位\n2.如果品项没有辅助单位时\n选定为新的辅助单位，若在单据或价格档案或BOM使用过，则不允许选定为新辅助单位`"
						>
							<w-icon slot="reference" type="question-active" class="unit-mark-icon"></w-icon>
						</el-popover>
					</span>
					<w-link v-if="showUnitSetBtn" class="unit-set-btn fx-cursor" @click="onUnitSetClick">设置单据单位</w-link>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
		<unitManageList
			ref="unitManageList"
			v-model="organDetails.itemUnitList"
			:disabled="disabled"
			:showCostCardFlag="showCostCardFlag"
			:beforeDeleteUnit="beforeDeleteUnitHandler"
		></unitManageList>
		<settingFinance ref="settingFinance"></settingFinance>
		<createFinancial ref="createFinancial" :disabled="disabled" @on-refresh="onRefreshFinancialList"></createFinancial>
	</w-collapse>
</template>
<script>
import { mapGetters } from 'vuex'
import createFinancial from '@/components/financial-manage/FinancialCreateDialog.vue'
import unitManageList from '@/components/unit-manage/UnitManageList.vue'
import settingFinance from '../setting-container/SettingFinance.vue'
export default {
	name: 'createOrgan',
	components: {
		createFinancial,
		unitManageList,
		settingFinance
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		disabled: Boolean,
		systemParam: Boolean,
		organCascaderData: {
			type: Array,
			default: () => {
				return []
			}
		},
		financialClassList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		const validateIgnore = (rule, value, callback) => {
			callback()
		}
		return {
			collapseVisible: true,
			rules: {
				itemTypeAll: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				name: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				pinYin: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				consumptionMethod: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: this.consumptionMethodValidator }],
				offsetMethod: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				itemUnitList: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }],
				enableFlag: [{ required: true, message: '该字段不能为空', trigger: 'no', validator: validateIgnore }]
			},
			organProps: {
				value: 'id',
				label: 'name',
				children: 'children',
				checkStrictly: true
			},
			consumptionMethodList: this.$fxTypeMiddleware.getCommonTypeList('consumptionMethodType'),
			offsetMethodList: this.$fxTypeMiddleware.getCommonTypeList('offsetMethodType'),
			avatarList: [],
			optionProp: {
				name: 'label'
			}
		}
	},
	watch: {
		'organDetails.imageUrl' () {
			this.avatarList = this.organDetails.imageUrl ? [this.organDetails.imageUrl] : []
		},
		'organDetails.itemCategoryListSelect' (val) {
			this.$emit('itemCategoryListSelectChange', val.indexOf(1) > -1)
			const itemCategory = this.organDetails.itemCategoryListSelect.map(item => {
				return {
					category: item
				}
			})
			this.organDetails.itemCategoryList = itemCategory
		},
		'organDetails.offsetMethod': {
			immediate: true,
			handler (val) {
				this.setConsumptionMethodRequire(this.$fxTypeMiddleware.isCommonType('offsetMethodType')(['deductToCost'])(val))
			}
		},
		'organDetails.relAllFinances' (val) {
			if (!val) {
				this.organDetails.financeSortId = ''
			}
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter', 'moduleAuthGetter']),
		label0disabled () {
			return JSON.stringify(this.organDetails.itemCategoryListSelect) === JSON.stringify([0])
		},
		label1disabled () {
			return JSON.stringify(this.organDetails.itemCategoryListSelect) === JSON.stringify([1])
		},
		label2disabled () {
			return JSON.stringify(this.organDetails.itemCategoryListSelect) === JSON.stringify([2])
		},
		consumptionMethodDisabled () {
			return this.organDetails.offsetMethod === '1'
		},
		showCostCardFlag () {
			return this.organDetails.itemCategoryListSelect.includes(1) || this.organDetails.itemCategoryListSelect.includes(2)
		},
		fDisabledEnableFlagSwitch () {
			return this.disabled || (this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_item-manage.disable-item')) || (!this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_item-manage.enable-item'))
		},
		isOnlyFromMiddleground () {
			return this.organDetails.id && this.organDetails.sourceList.length === 1 && this.organDetails.sourceType === 1
		},
		showUnitSetBtn () {
			return this.moduleAuthGetter('basic-archives_unit-setting')
		}
	},
	methods: {
		offsetMethodChange (e) {
			if (e === '1') {
				this.organDetails.consumptionMethod = ''
			} else {
				this.organDetails.consumptionMethod = '1'
			}
		},
		onRefreshFinancialList () {
			this.$emit('on-refresh-financial-list')
		},
		onAddFinancialClick () {
			this.$refs.createFinancial.add()
		},
		validate () {
			return new Promise(resolve => {
				this.$refs.form.validate().then(() => {
					this.$refs.unitManageList.validate().then(resolve)
				}).catch(() => {
					this.$fxMessage.warning('请填写必填信息')
				})
			})
		},
		onAvatarChange (list) {
			this.organDetails.imageUrl = list[0] || ''
		},
		onItemTypeChange (ids) {
			const id = ids[ids.length - 1]
			this.organDetails.itemType = id
			if (!this.organDetails.id && id) {
				this.getItemCode()
			}
		},
		getItemCode () {
			const data = {
				itemType: this.organDetails.itemType
			}
			return this.$fxApi('item.getItemCode')({ data }).then(res => {
				this.organDetails.code = res
			})
		},
		onNameChange (e) {
			const name = e.target.value
			if (!this.organDetails.pinYin) {
				const pinyin = this.$fxUtils.chinese2Pinyin(name, true)
				this.organDetails.pinYin = pinyin
			}
		},
		consumptionMethodValidator (rule, value, callback) {
			if (!this.consumptionMethodDisabled && !this.organDetails.consumptionMethod) {
				callback(new Error('该字段不能为空'))
			} else {
				callback()
			}
		},
		beforeDeleteUnitHandler (unit) {
			return unit.id ? this.$fxApi('item.getItemUsingState', this.organDetails.id, unit.id) : Promise.resolve()
		},
		setConsumptionMethodRequire (flag) {
			this.$set(this.rules.consumptionMethod[0], 'required', flag)
		},
		defaultFocus (refName = 'cascaderOrgan') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		offsetMethodTabHandler ({ focus }) {
			this.consumptionMethodDisabled ? this.consumptionMethodTabHandler({ focus }) : focus('consumptionMethod')
		},
		consumptionMethodTabHandler ({ focus }) {
			this.fDisabledEnableFlagSwitch ? this.enableFlagTabHandler({ focus }) : focus('enableFlag')
		},
		enableFlagTabHandler ({ focus }) {
			this.shelfLifeDisabled ? this.shelfLifeTabHandler({ focus }) : focus('shelfLifeFlag')
		},
		shelfLifeFlagTabHandler ({ focus }) {
			!this.organDetails.shelfLifeFlag ? this.shelfLifeTabHandler({ focus }) : focus('shelfLife')
		},
		shelfLifeTabHandler ({ focus }) {
			this.organDetails.relAllFinances ? focus('financeSortId') : focus('financeSortSetting')
		},
		onUnitSetClick () {
			this.$fxAppTabs.tabsPush({ path: 'unitSetting' })
		},
		onFinanceSortSetting () {
			if (!this.organDetails.id) {
				this.$fxMessage.warning('请先保存品项')
				return false
			}
			this.emitCustomSetting().then(() => {
				this.$refs.settingFinance.open(this.organDetails)
			})
		},
		emitCustomSetting () {
			return new Promise(resolve => {
				this.$emit('on-custom-setting-click', resolve)
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-organ {
	width:522.5px
}
.avatar-upload-content {
	width: 190px
}
.avatar-block {
	margin-bottom: 0
}
.form-item-input {
	width: 200px
	box-sizing: border-box
}
.form-item-vertical {
	display flex
	flex-direction column
}
.form-input-add-btn {
	position: relative
	top: 5px
	left: 5px
}
.form-item-spec, .form-item-finance, .form-item-image, .form-item-enable, .form-item-shelf-life {
	>>>.el-form-item__label {
		padding-left:10px
	}
}
.unit-mark-icon {
	width:16px
	height: 16px
	position: relative
	top: 4px
}
>>>.el-checkbox{
	margin-right 5px
}
>>>.wind-upload__item{
	width: 120px
	height: 120px
}
>>>.el-checkbox__input.is-disabled+span.el-checkbox__label {
	color: #409EFF
}
.form-item-category {
	margin-bottom 13px
}
.is-write-down-cost {
	>>>.el-form-item__label {
		padding-left: 10px
	}
}
.form-item-shelf-life {
	.form-item-input {
		width 130px
	}
	&.el-form-item {
		display: flex
		>>> .el-form-item__content {
			display: flex
			.form-item-input {
			margin-left: 10px
			}
		}
	}
}
.finance-content {
	height 45px
	>>>.el-radio {
		margin-right 10px
	}
	.custom-radio {
		margin-left 30px
	}
}
</style>
<style lang="stylus">
.el-popover {
	white-space pre-wrap
}
</style>
