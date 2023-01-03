<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item prop="dateRang" label="入库时间">
				<el-date-picker
					v-model="filter.dateRang"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					format="yyyy 年 MM 月 dd 日"
					value-format="yyyy-MM-dd HH:mm:ss"
					:default-time="['00:00:00', '23:59:59']"
					class="form-date-input"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="单据号">
				<w-input
					v-model="filter.userBillCode"
					placeholder="请输入"
					class="form-input"
				/>
			</el-form-item>
			<el-form-item required label="入库方">
				<w-select-tab-mulity
					v-model="filter.organId"
					:optionlist="organIdList"
					:clearable="false"
					class="form-input"
					@change='organIdChange'
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="出库方">
				<w-select-tab-mulity
					v-model="filter.otherOrganId"
					:optionlist="otherOrganIdList"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="品项">
				<w-select-mulity
					v-model="filter.item"
					:optionlist="itemList"
					class="form-input"
					:showEmpty='false'
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="业务类型">
				<w-select-mulity
					v-model="filter.billBizTypeId"
					:optionlist="billBizTypeList"
					class="form-input"
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="单据类型">
				<w-select-mulity
					v-model="filter.billType"
					:optionlist="billtypeSelect"
					class="form-input"
					:showEmpty='false'
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="入库仓库">
				<w-select-tab-mulity
					v-model="filter.inHouse"
					:optionlist="inHouseList"
					:filterKeys="tabStoreFilterKeys"
					:optionRender="optionRender"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="批次号">
				<w-input
					v-model="filter.batchCode"
					placeholder="请输入"
					class="form-input"
				/>
			</el-form-item>
			<el-form-item label="备注">
				<w-input v-model="filter.memo" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="明细备注">
				<w-input v-model="filter.bdmemo" placeholder="请输入" class="form-input"/>
			</el-form-item>
		</template>
		<template slot="tools">
			<el-button class="order-btn" type="primary" @click="onSearchClick">查询</el-button>
			<el-button class="order-btn" plain @click="onResetClick">重置</el-button>
		</template>
	</fx-list-filter>
</template>
<script>
export default {
	name: 'filterBar',
	data () {
		return {
			inStoreBillTypeList: this.$fxTypeMiddleware.getCommonTypeList('inStoreBillType'),
			billCreateTypeList: this.$fxTypeMiddleware.getCommonTypeList('billCreateType'),
			organIdList: [],
			otherOrganIdList: [],
			itemList: [],
			billTypeList: [],
			billBizTypeList: [],
			inHouseList: [],
			outHouseList: [],
			billtypeSelect: [],
			filter: {
				dateRang: [],
				userBillCode: '',
				sysBillCode: '',
				organId: [],
				otherOrganId: [],
				item: [],
				billBizTypeId: [],
				billType: [],
				inHouse: [],
				memo: '',
				bdmemo: '',
				batchCode: ''
			},
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName']
		}
	},
	watch: {
		'filter.userBillCode' (val) {
			this.filter.sysBillCode = val
		}
	},
	methods: {
		onSearchClick () {
			if (this.filter.organId.length) {
				this.$emit('on-search', this.filter)
			} else {
				this.$fxMessage.warning('请选择入库方')
			}
		},
		async getAccountingPeriod () {
			const { currentOrgan } = await this.getCurrentUser()
			return this.$fxApi('inStoreAssign.getAccountingPeriod').then(res => {
				this.filter.dateRang = [res.begin, res.end]
				this.filter.organId = currentOrgan.id ? [currentOrgan.id] : [this.organIdList[0].listData[0].id]
				return Promise.resolve()
			})
		},
		async initSelectData () {
			await this.getOrganList()
			await this.onResetClick()
			return Promise.resolve()
		},
		getCurrentUser () {
			return this.$fxApi('inStore.getCurrentUser')
		},
		async onResetClick () {
			this.filter = {
				dateRang: [],
				userBillCode: '',
				sysBillCode: '',
				organId: [],
				otherOrganId: [],
				item: [],
				billBizTypeId: [],
				billType: [],
				inHouse: [],
				memo: '',
				bdmemo: '',
				businessDate: [],
				batchCode: ''
			}
			await this.getAccountingPeriod()
			this.getInHouseList()
		},
		getFilterParams () {
			if (this.filter.dateRang && this.filter.dateRang.length) {
				this.filter.businessDate = [this.filter.dateRang[0], this.filter.dateRang[1]]
			} else {
				this.filter.businessDate = []
			}
			this.filter['detail-memo'] = this.filter.bdmemo
			this.filter['detail-itemId'] = this.filter.item
			this.filter['detail-inHouseId'] = this.filter.inHouse
			this.filter['detail-batchCode'] = this.filter.batchCode
			return this.filter
		},
		getSelectData () {
			this.getOtherOrganList()
			this.$fxApi('inStore.getItemSelect').then(res => {
				this.itemList = res
			})
			this.$fxApi('inStore.getBillBizTypeSelect')({ data: [] }).then(res => {
				this.billBizTypeList = res
			})
			this.$fxApi('inStore.getBilltypeSelect').then(res => {
				this.billtypeSelect = res.map(item => {
					item.visibleFlag = true
					return item
				})
			})
			return Promise.resolve()
		},
		organIdChange () {
			this.filter.inHouse = []
			this.getInHouseList()
		},
		getInHouseList () {
			const params = {
				organIdList: this.filter.organId
			}
			return this.$fxApi('inStore.getInhouseSelect')({ data: params, loading: false }).then(res => {
				this.inHouseList = res
				return Promise.resolve()
			})
		},
		getOrganList () {
			return this.$fxApi('inStore.getOrganSelectTab').then(res => {
				this.organIdList = res
				return Promise.resolve()
			})
		},
		getOtherOrganList () {
			return this.$fxApi('inStore.getOtherOrganSelect').then(res => {
				this.otherOrganIdList = res
			})
		},
		optionRender (h, { item }) {
			h = this.$createElement
			return <div class="fx-common__cell-select__option fx-ellipsis">
				<span class="fx-common__cell-select__option-left fx-ellipsis" title={item.name}>{ item.name }</span>
				<span class="fx-common__cell-select__option-right fx-ellipsis" title={item.organName}>{ item.organName }</span>
			</div>
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-date-input {
	width: 380px
}
.form-input {
	width: 150px
}
</style>
