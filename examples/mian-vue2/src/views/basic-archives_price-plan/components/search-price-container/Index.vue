<template>
	<w-dialog
		v-model="dialogVisible"
		title="查询价格"
		width="480px"
		footAlign="center"
		@close="onRefresh"
	>
		<div class="create-area">
			<el-form ref="form" :model="formData" :rules="rules" size="mini" inline>
				<el-form-item prop="workDate" label="查询时间：" label-width="110px" class="form-item">
					<el-date-picker
						v-model="formData.workDate"
						value-format="yyyy-MM-dd"
						type="date"
						placeholder="选择日期"
						class="form-item-input"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item prop="sellerOrgan" label="卖方机构：" label-width="110px" class="form-item">
					<w-select-tab
						v-model="formData.sellerOrgan"
						:optionlist="sellerList"
						clearable
						class="form-item-input"
					>
					</w-select-tab>
				</el-form-item>
				<el-form-item prop="buyerOrgan" label="买方机构：" label-width="110px" class="form-item">
					<w-select-tab
						v-model="formData.buyerOrgan"
						:optionlist="buyerList"
						clearable
						class="form-item-input"
					>
					</w-select-tab>
				</el-form-item>
				<el-form-item prop="item" label="品项名称：" label-width="110px" class="form-item">
					<w-select
						v-model="formData.itemId"
						:optionlist="itemList"
						class="form-item-input"
					>
					</w-select>
				</el-form-item>
			</el-form>
			<div class="btn-tools">
				<el-tooltip :disabled="!searchBtnDisabled" effect="dark" content="所有字段全部填写后可查询品项具体价格" placement="top">
					<el-button
						:class="{'btn-disabled': searchBtnDisabled}"
						type="primary"
						@click="onSearchClick"
					>查询</el-button>
				</el-tooltip>
				<el-tooltip effect="dark" content="查询时间必填，其余字段选填" placement="top">
					<el-button type="primary" @click="onExportClick">导出价格单</el-button>
				</el-tooltip>
				<el-tooltip effect="dark" content="查询时间非必填，其余字段必填" placement="top">
					<el-button type="primary" @click="onExportHistoryClick">导出价格履历</el-button>
				</el-tooltip>
			</div>
			<div v-show="searchResultShow" class="search-price">查询单价:  {{searchResult.price}} 元 / {{searchResult.unitName}}  获取时间 {{formData.workDate}}</div>
			<div v-show="showErrorMsg" class="search-price">无该品项价格信息</div>
		</div>
	</w-dialog>
</template>
<script>
export default {
	name: 'createFinancial',
	data () {
		return {
			dialogVisible: false,
			formData: {
				workDate: ''
			},
			rules: {},
			exportRule: {
				workDate: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				sellerOrgan: [{ required: false, trigger: 'no', validator: this.validateSeller }]
			},
			exportHistoryRule: {
				sellerOrgan: [{ required: true, trigger: 'no', validator: this.validateHistorySeller }],
				buyerOrgan: [{ required: true, message: '该字段不能为空', trigger: 'no' }],
				item: [{ required: true, validator: this.validateItem, trigger: 'no' }]
			},
			sellerList: [],
			buyerList: [],
			itemList: [],
			searchResult: {},
			showErrorMsg: ''
		}
	},
	computed: {
		searchBtnDisabled () {
			return !this.formData.workDate || !this.formData.sellerOrgan || !this.formData.buyerOrgan || !this.formData.itemId
		},
		searchResultShow () {
			return !this.$fxUtils.isEmptyObj(this.searchResult)
		}
	},
	methods: {
		open () {
			this.init().then(() => {
				this.formData = {
					workDate: '',
					sellerOrgan: '',
					buyerOrgan: '',
					itemId: ''
				}
				this.searchResult = {}
				this.showErrorMsg = false
				this.dialogVisible = true
				this.$nextTick(() => {
					this.$refs.form.clearValidate()
				})
			})
		},
		init () {
			return Promise.all([this.getSellerList(), this.getBuyerList(), this.getItemList()]).then(([seller, buyer, item]) => {
				this.sellerList = seller
				this.buyerList = buyer
				this.itemList = item
				return Promise.resolve()
			})
		},
		onRefresh () {
			this.rules = {}
			this.$emit('on-refresh')
		},
		validate () {
			return this.$refs.form.validate()
		},
		clearValidate () {
			return this.$refs.form.clearValidate()
		},
		getSellerList () {
			return this.$fxApi('planPrice.getSellerTabList')({ data: [] })
		},
		getBuyerList () {
			return this.$fxApi('planPrice.getBuyerTabList')({ data: [] })
		},
		getItemList () {
			return this.$fxApi('planPrice.getItemList')
		},
		onCancelClick () {
			this.dialogVisible = false
		},
		onSearchClick () {
			if (this.searchBtnDisabled) {
				return false
			}
			this.validate().then(() => {
				const params = {
					...this.formData,
					workDate: `${this.formData.workDate} 00:00:00`
				}
				return this.$fxApi('planPrice.searchPrice')({ data: params }).then(res => {
					if (!this.$fxUtils.isEmptyObj(res)) {
						this.searchResult = res
						this.showErrorMsg = false
					} else {
						this.searchResult = {}
						this.showErrorMsg = true
					}
				})
			})
		},
		onExportClick () {
			this.clearValidate()
			this.rules = this.exportRule
			this.$nextTick(() => {
				this.validate().then(() => {
					const params = {
						...this.formData,
						workDate: `${this.formData.workDate} 00:00:00`
					}
					return this.$fxApi('planPrice.exportPriceExcel', params).then(res => {
						this.$fxUtils.downloadFile(res)
					})
				})
			})
		},
		onExportHistoryClick () {
			this.clearValidate()
			this.rules = this.exportHistoryRule
			this.$nextTick(() => {
				this.validate().then(() => {
					const params = {
						sellerOrgan: this.formData.sellerOrgan,
						buyerOrgan: this.formData.buyerOrgan,
						itemId: this.formData.itemId
					}
					if (this.formData.workDate) {
						params.workDate = `${this.formData.workDate} 00:00:00`
					}
					return this.$fxApi('planPrice.exportPriceHistoryExcel', params).then(res => {
						this.$fxUtils.downloadFile(res)
					})
				})
			})
		},
		validateSeller (rule, value, callback) {
			if (this.formData.sellerOrgan === this.formData.buyerOrgan && !!this.formData.sellerOrgan) {
				callback(new Error('卖方机构与买方机构不能相同'))
			} else {
				callback()
			}
		},
		validateHistorySeller (rule, value, callback) {
			if (!this.formData.sellerOrgan) {
				callback(new Error('该字段不能为空'))
			} else if (this.formData.sellerOrgan === this.formData.buyerOrgan && !!this.formData.sellerOrgan) {
				callback(new Error('卖方机构与买方机构不能相同'))
			} else {
				callback()
			}
		},
		validateItem (rule, value, callback) {
			if (!this.formData.itemId) {
				callback(new Error('该字段不能为空'))
			} else {
				callback()
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.create-area {
	width: 100%
	height: 300px
	box-sizing: border-box
	.form-item-input {
		width:280px
	}
	.btn-tools {
		text-align: center
	}
	.search-price {
		font-size: 20px
		font-weight bolder
		text-align: center
		margin-top: 20px
	}
	.btn-disabled {
		opacity: 0.5
		cursor:not-allowed
	}
}
</style>
