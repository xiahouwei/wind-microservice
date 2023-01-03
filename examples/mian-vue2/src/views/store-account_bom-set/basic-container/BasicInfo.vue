<template>
	<w-app-container>
		<fx-page-header title="BOM基础信息"></fx-page-header>
		<el-form ref="form" :model="bomDetail" size="mini" :rules="rules" label-width="100px" inline :disabled='detailDisabled'>
			<el-form-item label="BOM名称：">
				<w-input
					v-model="bomDetail.name"
					disabled
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item label="成品名称：" v-if="setList.includes('itemName')">
				<w-input
					v-model="bomDetail.item.name"
					disabled
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item label="母材名称：" v-if="setList.includes('fatherName')">
				<w-input
					v-model="bomDetail.item.name"
					disabled
					class="form-item-input"
				></w-input>
			</el-form-item>
			<el-form-item  prop="recipeCount" label="配方数量：" v-if="setList.includes('amount')">
				<w-input-number
					v-model="bomDetail.recipeCount"
					:pointSize='this.sysPointSize'
					class="form-item-input"
				></w-input-number>
			</el-form-item>
			<el-form-item label="单位：" v-if="type==='food_bom'">
				<w-input
					v-model="bomDetail.unit.name"
					class="form-item-input"
					disabled
				></w-input>
			</el-form-item>
			<el-form-item prop="composeUnit" label="单位：" v-show="type==='compose_bom'">
				<w-select
					ref='composeUnit'
					:value="bomDetail.unit.id"
					:optionlist="unitList"
					class="form-item-input"
					@change='onUnitSelectChange'
				></w-select>
			</el-form-item>
			<el-form-item prop="processingCharge" label="加工费：" v-show="setList.includes('processingCharge')">
				<w-input-number
					v-model="bomDetail.processingCharge"
					:pointSize='this.sysMoneyPointSize'
					class="form-item-input"
				></w-input-number>
			</el-form-item>
			<el-form-item prop="outIntoYieldZoom" label="标准出成率：" v-show="setList.includes('outIntoYield')">
				<w-input-number
					v-model="bomDetail.outIntoYieldZoom"
					:pointSize='2'
					class="form-item-input outIntoYieldInput"
				></w-input-number>
				%
			</el-form-item>
			<el-form-item prop="fixAmount" label="固定费用：">
				<w-input-number
					v-model="bomDetail.fixAmount"
					:pointSize='this.sysMoneyPointSize'
					class="form-item-input"
				></w-input-number>
			</el-form-item>
			<el-form-item label="默认BOM：" v-show="!bomDetail.productionMethod">
				<w-switch
					class="form-item-input"
					v-model="bomDetail.isDefault"
					:active-value='true'
					:inactive-value='false'
					active-text="是"
					inactive-text="否"
					:width="50"
				>
				</w-switch>
			</el-form-item>
		</el-form>
		<template  v-if='type!=="food_bom"'>
			<fx-page-header title="BOM适用范围"></fx-page-header>
			<el-form size="mini" inline  :disabled='detailDisabled'  class="form-rel">
				<el-form-item label="适用机构：" class="connect-container">
					<el-radio v-model="bomDetail.isAllOrgan" :label="true">全部机构</el-radio>
					<el-radio v-model="bomDetail.isAllOrgan" :label="false">{{computedConnectText}}</el-radio>
					<transition name="el-zoom-in-center">
						<el-button type="primary" v-show="bomDetail.isAllOrgan === false" @click="onConnectSetting">设置适用机构</el-button>
					</transition>
				</el-form-item>
			</el-form>
		</template>
		<connectSetting ref='connectSetting' :type='type' :bomDetail='bomDetail' @refresh='refreshBomDetail'></connectSetting>
	</w-app-container>
</template>

<script>
import { mapState } from 'vuex'
import connectSetting from './connect-organ.vue'
export default {
	name: 'basicInfo',
	components: {
		connectSetting
	},
	props: {
		type: {
			type: String,
			default: () => {
				return 'food_bom'
			}
		},
		bomDetail: Object,
		unitList: {
			type: Array,
			default: () => {
				return []
			}
		},
		detailDisabled: Boolean
	},
	data () {
		return {
		}
	},
	mounted () {
	},
	computed: {
		...mapState({
			sysPointSize: state => state.system.sysPointSize,
			sysMoneyPointSize: state => state.system.sysMoneyPointSize
		}),
		setList () {
			switch (this.type) {
			case 'food_bom':
				return ['itemName', 'amount', 'unit']
			case 'compose_bom':
				return ['itemName', 'amount', 'unit', 'processingCharge']
			default:
				return ['fatherName', 'outIntoYield']
			}
		},
		rules () {
			switch (this.type) {
			case 'food_bom':
				return {
					recipeCount: [{ required: true, trigger: 'no', validator: this.validateRecipeCount }]
				}
			case 'compose_bom':
				return {
					composeUnit: [{ required: true, trigger: 'no', validator: this.validateComposeUnit }],
					recipeCount: [{ required: true, trigger: 'no', validator: this.validateRecipeCount }]
				}
			default:
				return {
					outIntoYieldZoom: [{ required: true, trigger: 'no', validator: this.validateOutIntoYieldZoom }]
				}
			}
		},
		computedConnectText () {
			const text = '自定义'
			if (this.bomDetail.isAllOrgan === false) {
				return text + `(${this.bomDetail.organCount || 0}个机构)`
			} else {
				return text
			}
		}
	},
	methods: {
		refreshBomDetail () {
			this.$emit('refreshBomDetail')
		},
		onConnectSetting () {
			this.$refs.connectSetting.open(this.bomDetail)
		},
		validate () {
			return new Promise(resolve => {
				this.$refs.form.validate().then(() => {
					resolve()
				})
			})
		},
		validateRecipeCount (rule, value, callback) {
			if (this.bomDetail.recipeCount === 0) {
				callback(new Error('配方数量不能为0'))
			} else {
				callback()
			}
		},
		validateOutIntoYieldZoom (rule, value, callback) {
			if (this.bomDetail.outIntoYieldZoom > 100) {
				callback(new Error('标准出成率不能大于100'))
			} else {
				callback()
			}
		},
		validateComposeUnit (rule, value, callback) {
			if (this.bomDetail.id && (!this.bomDetail.unit.id)) {
				callback(new Error('单位不能为空'))
			} else {
				callback()
			}
		},
		clearValidate () {
			this.$refs.form.clearValidate()
		},
		onUnitSelectChange (id, item) {
			this.bomDetail.unit = item
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.connect-container {
	margin-left 14px
}
.outIntoYieldInput {
	width 85%
}
.form-item-input {
	width: 167px
}
.form-rel {
	height 47px
}
</style>

