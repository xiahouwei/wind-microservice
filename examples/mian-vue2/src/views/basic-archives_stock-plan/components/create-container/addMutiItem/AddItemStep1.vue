<template>
	<w-dialog v-model="dialogVisible" width='1200px' heightFullscreen :beforeClose="onBeforeClose">
		<template slot='title'>
			<span class="dialogTitle">添加品项</span>
			<span>第1步</span>
		</template>
		<div class="create-organ">
			<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="确定供货类型">
				<el-form ref="form" :rules="rules" size="mini" label-width="100px" inline>
					<fx-details-form-row>
						<el-form-item class='form-item-full' prop="buyMethod" label="订货方式：">
							<el-radio-group v-model="buyMethod">
								<el-radio-button
									v-for="item in buyMethodOptions"
									:key="item.value"
									:label="item.value"
								>{{item.label}}</el-radio-button>
							</el-radio-group>
						</el-form-item>
					</fx-details-form-row>
				</el-form>
			</w-collapse>
			<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="确定供货类型" >
				<el-form ref="form" :rules="rules" size="mini" label-width="100" inline class='supplyType'>
					<fx-details-form-row>
						<el-form-item slot='left' prop="seller" label="卖方机构：" label-width="100px">
							<el-button type="primary" @click='setSellerOrgan(0)'>点击设置</el-button>
						</el-form-item>
						<el-form-item
							v-show='sellerTableData.length'
							slot='left'
							class='table-class'
						>
							<fx-list-virtual-table
								:listData="sellerTableData"
								:tableColumn="sellerTableColumn"
								:showPagination="false"
								:showTools="false"
								:selectable="false"
								:stripe="false"
								minHeight="520px"
								showIndex
								border
								class="listTable"
							>
							</fx-list-virtual-table>
						</el-form-item>
						<el-form-item v-show='buyMethod===2' slot='right' prop="seller" label="越库实际供货方：" label-width="160px">
							<el-button type="primary" @click='setSellerOrgan(1)'>点击设置</el-button>
						</el-form-item>
						<el-form-item
							v-show='buyMethod===2 && crossTableData.length'
							slot='right'
							class='table-class'
						>
							<fx-list-virtual-table
								:listData="crossTableData"
								:tableColumn="crossTableColumn"
								:showPagination="false"
								:showTools="false"
								:selectable="false"
								:stripe="false"
								minHeight="520px"
								showIndex
								border
								class="listTable"
							>
							</fx-list-virtual-table>
						</el-form-item>
					</fx-details-form-row>
				</el-form>
			</w-collapse>
		</div>
		<settingSeller
			ref="settingSeller"
			:listData="sellerSelectList"
			@on-save-click="onSaveSettingSeller(arguments)"
			:organDetails='organDetails'
		></settingSeller>
		<template slot="footer">
			<el-button @click="onCancelClick">取消</el-button>
			<el-button type="primary" @click="nextStep">下一步</el-button>
		</template>
	</w-dialog>
</template>
<script>
import settingSeller from '../SettingSeller.vue'

export default {
	name: 'addItemStep1',
	components: {
		settingSeller
	},
	props: {
		visibleFlag: Boolean,
		organType: String,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		stepsList: {
			type: Array,
			default: () => {
				return []
			}
		},
		sellerSelectList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			name: 'addItemStep1',
			collapseVisible: true,
			dialogVisible: false,
			buyMethodOptions: [{
				value: 1,
				label: '直发'
			}, {
				value: 2,
				label: '越库'
			}],
			rules: {
				buyMethod: [{ required: true, trigger: 'no' }]
			},
			buyMethod: 1,
			sellerTableData: [],
			sellerIds: [],
			crossTableData: [],
			fxDataVerification: this.$fxUtils.fxDataVerification(),
			crossIds: [],
			defaultCrossOrgan: '',
			sellerTableColumn: [
				{ prop: 'code', label: '机构编号', width: '118' },
				{ prop: 'name', label: '机构名称', width: '170' },
				{ prop: 'sellerHouseName', label: '出库仓库', width: '170' }
			],
			crossTableColumn: [
				{ prop: 'code', label: '机构编号', width: '90' },
				{ prop: 'name', label: '机构名称', width: '135' },
				{
					prop: 'defaultCrossOrgan',
					label: '默认供货机构',
					width: '95',
					align: 'center',
					formatter: (row) => {
						return row.id === this.defaultCrossOrgan ? '√' : ''
					}
				},
				{ prop: 'crossHouseName', label: '出库仓库', width: '135' }
			]
		}
	},
	computed: {
		checkData () {
			return {
				buyMethod: this.buyMethod,
				sellerTableData: this.sellerTableData,
				crossTableData: this.crossTableData
			}
		}
	},
	watch: {
		buyMethod (val) {
			if (val === 1) {
				this.$refs.settingSeller.initSelectedCrossOrgans()
				this.crossTableData = []
				this.crossIds = []
				this.defaultCrossOrgan = ''
			}
		}
	},
	methods: {
		setSellerOrgan (key) {
			const ids = [this.sellerIds, this.crossIds][key]
			this.$refs.settingSeller.open(key, ids, this.defaultCrossOrgan)
		},
		onSaveSettingSeller (data) {
			if (data[0] === 0) {
				this.sellerIds = data[1]
				this.sellerTableData = data[2]
			} else {
				this.crossIds = data[1]
				this.crossTableData = data[2]
				this.defaultCrossOrgan = data[3]
			}
		},
		open () {
			this.dialogVisible = true
			this.fxDataVerification.resetData(this.checkData)
		},
		hide () {
			this.dialogVisible = false
		},
		nextStep () {
			if (!this.sellerIds.length) {
				this.$fxMessage.warning('请选择卖方机构')
				return false
			}
			if (this.buyMethod === 2 && !this.crossIds.length) {
				this.$fxMessage.warning('请选择越库实际供货方')
				return false
			}
			this.$emit('step1ToStep2', this.sellerTableData, this.crossTableData, this.buyMethod, this.defaultCrossOrgan)
		},
		onCancelClick () {
			this.verificationDetails().then(() => {
				this.$emit('clearStep3TableDataMap')
				return this.hide()
			})
		},
		verificationDetails () {
			return this.fxDataVerification.checkComfirm(this.checkData)
		},
		onBeforeClose (close) {
			this.$emit('clearStep3TableDataMap')
			this.verificationDetails().then(close)
		},
		refresh () {
			this.initOutStore()
			this.initSelectedOrgans()
			this.buyMethod = 1
			this.sellerTableData = []
			this.sellerIds = []
			this.crossTableData = []
			this.crossIds = []
			this.defaultCrossOrgan = ''
		},
		initOutStore () {
			this.$refs.settingSeller && this.$refs.settingSeller.initOutStore()
		},
		initSelectedOrgans () {
			this.$refs.settingSeller && this.$refs.settingSeller.initSelectedOrgans()
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
	.dialogTitle {
		font-size 15px
		font-weight 700
		margin-right 10px
	}
	.form-item-full{
		width 645px
	}
	.supplyType{
		width 920px
	}
	.create-organ {
		flex: 1
		width: 100%
		display: flex;
		flex-direction: column;
		overflow: auto;
	}
	.table-class {
		width 520px
		>>>.el-form-item__content {
			width 100%
		}
		.listTable {
			font-size 12px
		}
	}
</style>
