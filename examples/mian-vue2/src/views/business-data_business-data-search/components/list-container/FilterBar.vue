<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="营业时间">
				<w-date-picker
					v-model="businessDate"
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
			<el-form-item label="营业机构">
				<w-select-tab-mulity
					v-model="organId"
					:optionlist="organIdList"
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
			<el-form-item label="状态">
				<w-select-mulity
					v-model="state"
					:optionlist="stateList"
					:optionProp="optionProp"
					:showEmpty='false'
					class="form-input"
				>
				</w-select-mulity>
			</el-form-item>
		</template>
		<template slot="tools">
			<el-button class="order-btn" type="primary" @click="onSearchClick">查询</el-button>
			<el-button class="order-btn" plain @click="onResetClick">重置</el-button>
		</template>
	</fx-list-filter>
</template>
<script>
import { apiName } from '../../Index.vue'
export default {
	name: 'filterBar',
	data () {
		return {
			businessDate: [],
			state: [],
			stateList: this.$fxStateMiddleware.getStateConfig('syncState'),
			organIdList: [],
			organId: [],
			optionProp: {
				name: 'label'
			},
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts('all')
		}
	},
	mounted () {
		this.getSelectData()
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		onResetClick () {
			this.state = []
			this.organId = []
			this.getAccountingPeriod()
		},
		getFilterParams () {
			let businessDate = []
			if (this.businessDate && this.businessDate.length) {
				businessDate = [this.businessDate[0], this.businessDate[1]]
			}
			return {
				'business.syncFlag': this.state,
				'business.createDate': businessDate,
				'business.organId': this.organId
			}
		},
		getSelectData () {
			this.getOrganList()
		},
		getOrganList () {
			this.$fxApi(`${apiName}.getOrganSelect`).then(res => {
				this.organIdList = res
			})
		},
		getAccountingPeriod () {
			return this.$fxApi(`${apiName}.getFilterAccountingPeriod`).then(res => {
				this.businessDate = [res.begin, res.end]
			})
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
