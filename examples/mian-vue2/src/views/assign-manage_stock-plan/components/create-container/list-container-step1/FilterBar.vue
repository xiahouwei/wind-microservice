<template>
	<fx-list-filter label-width="90px" @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item prop="dateRang" label="申请时间">
				<w-date-picker
					v-model="dateRang"
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
				<w-input v-model="billCode" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="分派状态">
				<w-select-mulity
					v-model="assignStatus"
					:optionlist="inAssignStateList"
					class="form-input"
					:showEmpty='false'
					:optionProp='{name: "label"}'
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="买方机构">
				<w-select-tab-mulity
					v-model="buyerOrgan"
					:optionlist="organIdList"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="订货方案">
				<w-select-mulity
					v-model="stockPlanId"
					:optionlist="purchasePlanList"
					class="form-input"
				>
				</w-select-mulity>
			</el-form-item>
		</template>
		<template slot="row-2">
			<el-form-item label="品项">
				<w-select-mulity
					v-model="item"
					:optionlist="itemList"
					class="form-input"
					:showEmpty='false'
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="加急状态">
				<w-select-mulity
					v-model="urgent"
					:optionlist="urgentStateList"
					class="form-input"
					:showEmpty='false'
					:optionProp='{name: "label"}'
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="业务类型">
				<w-select-mulity
					v-model="billBizType"
					:optionlist="billBizTypeList"
					class="form-input"
				>
				</w-select-mulity>
			</el-form-item>
			<el-form-item label="备注">
				<w-input v-model="memo" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="明细备注">
				<w-input v-model="pdMemo" placeholder="请输入" class="form-input"/>
			</el-form-item>
			<el-form-item label="标签">
				<w-input disabled v-model="tagKey" placeholder="请输入" class="form-input"/>
			</el-form-item>
		</template>
		<template slot="tools">
			<el-button class="order-btn" type="primary" @click="onSearchClick">查询</el-button>
			<el-button class="order-btn" plain @click="onResetClick">重置</el-button>
		</template>
	</fx-list-filter>
</template>
<script>
import { apiName } from '../Index.vue'
export default {
	name: 'filterBar',
	data () {
		return {
			dateRang: [],
			billCode: '',
			buyerOrgan: [],
			sellerOrgan: [],
			item: [],
			billBizType: [],
			stockPlanId: [],
			state: [],
			billKind: [],
			assignStatus: [],
			supplierState: [],
			urgent: [],
			tagKey: '',
			memo: '',
			pdMemo: '',
			stateSearchList: this.$fxStateMiddleware.getStateConfig('billSearchState'),
			inAssignStateList: this.$fxStateMiddleware.getStateConfig('assignState').slice(0, -2),
			sendStateList: this.$fxStateMiddleware.getStateConfig('sendState'),
			urgentStateList: this.$fxStateMiddleware.getStateConfig('urgentState'),
			otherOrganIdList: [],
			organIdList: [],
			itemList: [],
			billBizTypeList: [],
			purchasePlanList: [],
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all')
		}
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		onResetClick ({ businessDate, clearDate, organId }) {
			return this.getAccountingPeriod(businessDate, clearDate).then(() => {
				this.billCode = ''
				this.state = []
				this.buyerOrgan = organId ? [organId] : []
				this.sellerOrgan = []
				this.item = []
				this.billBizType = []
				this.stockPlanId = []
				this.billKind = []
				this.assignStatus = []
				this.supplierState = []
				this.urgent = []
				this.tagKey = ''
				this.memo = ''
				this.pdMemo = ''
				return Promise.resolve()
			})
		},
		getAccountingPeriod (businessDate, clearDate) {
			if (clearDate) {
				return Promise.resolve()
			}
			if (businessDate) {
				this.dateRang = [businessDate + ' 00:00:00', businessDate + ' 23:59:59']
				return Promise.resolve()
			} else {
				return this.$fxApi(`${apiName}.getAccountingPeriod`).then(res => {
					this.dateRang = [res.begin, res.end]
					return Promise.resolve()
				})
			}
		},
		getFilterParams () {
			return {
				businessDate: this.dateRang,
				userBillCode: this.billCode,
				sysBillCode: this.billCode,
				billState: this.state,
				organId: this.buyerOrgan,
				'detail-itemId': this.item,
				billBizTypeId: this.billBizType,
				billType: this.billKind,
				stockPlanId: this.stockPlanId,
				assignStatus: this.assignStatus,
				srmState: this.supplierState,
				urgent: this.urgent,
				tagKey: this.tagKey,
				memo: this.memo,
				'detail-memo': this.pdMemo
			}
		},
		initSelect () {
			this.getOrganSelect()
			this.getOtherOrganSelect()
			this.getItemSelect()
			this.getBillBizTypeSelect()
			this.getPurchasePlanSelect()
		},
		getOrganSelect () {
			return this.$fxApi(`${apiName}.getOrganSelectTab`).then(res => {
				this.organIdList = res
			})
		},
		getOtherOrganSelect () {
			return this.$fxApi(`${apiName}.getOrganSelectTab`).then(res => {
				this.otherOrganIdList = res
			})
		},
		getItemSelect () {
			return this.$fxApi(`${apiName}.getItemSelect`).then(res => {
				this.itemList = res
			})
		},
		getBillBizTypeSelect () {
			return this.$fxApi(`${apiName}.getBusinessList`)({ data: [] }).then(res => {
				this.billBizTypeList = res
			})
		},
		getPurchasePlanSelect () {
			return this.$fxApi(`${apiName}.getPurchasePlanSelect`).then(res => {
				this.purchasePlanList = res
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-date-input {
	width: 400px
}
.form-input {
	width: 150px
}
</style>
