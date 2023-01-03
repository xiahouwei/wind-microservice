<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="基础信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="120px" inline>
			<fx-details-form-row>
				<el-form-item slot="left" prop="organId" label="所属机构：">
					<w-select-tab
						ref="organId"
						v-model="organDetails.organId"
						v-fx-tab:focus.houseId
						:optionlist="organSelectList"
						:disabled="disabled"
						class="form-item-input"
						@change="onOrganChange"
					>
					</w-select-tab>
				</el-form-item>
				<el-form-item slot="right" label="上架顺序：">
					<w-input
						ref="shelfOrder"
						v-model="organDetails.shelfOrder"
						v-fx-tab:focus.pickingOrder
						placeholder="请输入"
						:maxlength="9"
						:regType="$fxCommon.getFxInputReg('phone')"
						class="form-item-input"
						:disabled="disabled"
					></w-input>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" prop="houseId" label="所属仓库：">
					<w-select
						ref="houseId"
						v-model="organDetails.houseId"
						v-fx-tab:focus.shelfId
						:optionlist="houseSelectList"
						:disabled="disabled"
						class="form-item-input"
						@change="onHouseChange"
					>
					</w-select>
				</el-form-item>
				<el-form-item slot="right" label="拣货顺序：">
					<w-input
						ref="pickingOrder"
						v-model="organDetails.pickingOrder"
						v-fx-tab:focus.locationCategory
						placeholder="请输入"
						:maxlength="9"
						:regType="$fxCommon.getFxInputReg('phone')"
						class="form-item-input"
						:disabled="disabled"
					></w-input>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" prop="shelfId" label="货架编码：">
					<w-select
						ref="shelfId"
						v-model="organDetails.shelfId"
						v-fx-tab:focus.code
						:optionlist="storageRackList"
						:optionProp="codeOptionProp"
						:disabled="disabled"
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
				<el-form-item slot="right" label="货位类型：">
					<w-select
						ref="locationCategory"
						v-model="organDetails.locationCategory"
						v-fx-tab="locationCategoryTabHandler"
						:optionlist="storageSpaceTypeList"
						:optionProp="optionProp"
						:disabled="disabled"
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item slot="left" prop="code" label="货位编码：">
					<w-input
						ref="code"
						v-model="organDetails.code"
						v-fx-tab:focus.shelfOrder
						:maxlength="$fxCommon.getFxInputMaxLength('storageCode')"
						:regType="$fxCommon.getFxInputReg('storageCode')"
						:disabled="disabled"
						placeholder="请输入"
						class="form-item-input"
					></w-input>
				</el-form-item>
				<el-form-item slot="right" label="货位状态：">
					<w-select
						ref="enableFlag"
						v-model="organDetails.enableFlag"
						v-fx-tab:loop.basic-archives_storage-manage_details.basicInfo
						:optionlist="enableStateList"
						:optionProp="optionProp"
						:disabled="enableFlagDisabled"
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
			</fx-details-form-row>
			<fx-details-form-row>
				<el-form-item label="管理品项：">
					<el-radio v-model="organDetails.relAllItem" :label="true" :disabled="disabled">全部品项</el-radio>
					<el-radio v-model="organDetails.relAllItem" :label="false" :disabled="disabled">自定义</el-radio>
					<transition name="el-zoom-in-center">
						<el-button type="primary" v-show="organDetails.relAllItem === false" :disabled="disabled" @click="onConnectSetting">设置关联品项</el-button>
					</transition>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
	</w-collapse>
</template>
<script>
import { mapGetters } from 'vuex'
import { apiName } from '../../Index.vue'
export default {
	name: 'basicInfo',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		organSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		houseSelectList: {
			type: Array,
			default: () => {
				return []
			}
		},
		storageRackList: {
			type: Array,
			default: () => {
				return []
			}
		},
		disabled: Boolean
	},
	data () {
		return {
			collapseVisible: true,
			rules: {
				organId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				houseId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				shelfId: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				code: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			},
			storageSpaceTypeList: this.$fxTypeMiddleware.getCommonTypeList('storageSpaceTypeList'),
			enableStateList: this.$fxStateMiddleware.getStateConfig('enableState'),
			optionProp: {
				name: 'label'
			},
			codeOptionProp: {
				name: 'code'
			}
		}
	},
	computed: {
		...mapGetters(['detailsAuthGetter']),
		enableFlagDisabled () {
			return this.disabled || (this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_storage-manage.disable-space')) || (!this.organDetails.enableFlag && !this.detailsAuthGetter('basic-archives_storage-manage.enable-space'))
		}
	},
	methods: {
		getHouseList () {
			if (!this.organDetails.organId) return false
			const ids = this.organDetails.houseId ? [this.organDetails.houseId] : []
			return this.$fxApi(`${apiName}.getHouseList`, this.organDetails.organId)({ data: ids }).then(res => {
				this.$emit('update:houseSelectList', res)
				return Promise.resolve(res)
			})
		},
		getRackList () {
			if (!this.organDetails.houseId) return false
			return this.$fxApi(`${apiName}.getRackList`, this.organDetails.houseId, this.organDetails.shelfId).then(res => {
				this.$emit('update:storageRackList', res)
				return Promise.resolve(res)
			})
		},
		onOrganChange () {
			this.organDetails.houseId = ''
			this.organDetails.shelfId = ''
			this.getHouseList()
		},
		onHouseChange () {
			this.organDetails.shelfId = ''
			this.getRackList()
		},
		validate () {
			return this.$refs.form.validate()
		},
		onConnectSetting () {
			this.$emit('on-connect-setting')
		},
		defaultFocus (refName = 'organId') {
			this.$fxUtils.vDoRefFocus(this, refName)
		},
		locationCategoryTabHandler ({ focus, loop }) {
			this.enableFlagDisabled ? loop('basic-archives_storage-manage_details', 'basicInfo') : focus('enableFlag')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-item-input {
	width: 175px
	box-sizing: border-box
}
.no-margin-right{
	>>>.details-form-row__left{
		margin-right 10px
	}
}
>>>.details-form-row {
	height 47px
}
</style>
