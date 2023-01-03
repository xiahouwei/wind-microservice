<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item prop="dateRang" label="入库时间">
				<w-date-picker
					v-model="filter.dateRang"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					format="yyyy 年 MM 月 dd 日"
					value-format="yyyy-MM-dd HH:mm:ss"
					:default-time="['00:00:00', '23:59:59']"
					:picker-options="pickerOptions"
					class="form-date-input"
				></w-date-picker>
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
			organIdList: [],
			otherOrganIdList: [],
			itemList: [],
			billBizTypeList: [],
			inHouseList: [],
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
			currentOrgan: {},
			tabStoreFilterKeys: ['name', 'code', 'pinYin', 'organName'],
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all')
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
			this.currentOrgan = await this.getCurrentUser()
			return this.$fxApi('inStore.getFilterAccountingPeriod').then(res => {
				this.filter.dateRang = [res.begin, res.end]
				const defaultOrganId = this.organIdList[0].listData.length > 0 ? [this.organIdList[0].listData[0].id] : []
				this.filter.organId = this.hasCurrentOrgan() ? [this.currentOrgan.id] : defaultOrganId
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
		hasCurrentOrgan () {
			if (this.currentOrgan.id) {
				const currentOrganTypeList = this.organIdList.find(item => item.id === this.currentOrgan.organType)
				const currentOrganTypeIdList = currentOrganTypeList.listData.map(item => item.id)
				return currentOrganTypeIdList.includes(this.currentOrgan.id)
			} else {
				return !!this.currentOrgan.id
			}
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
			this.$fxApi('inStore.getReturnBilltypeSelect').then(res => {
				this.billtypeSelect = res
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
			const typeList = [2, 1]
			return this.$fxApi('inStore.getInhouseSelect', typeList)({ data: params, loading: false }).then(res => {
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
			return this.$fxApi('inStore.getOtherOrganSelectNoEmpty').then(res => {
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
