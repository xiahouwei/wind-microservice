<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-row>
				<el-form-item label="付款机构">
					<w-input
						:value="organName"
						disabled
						class="form-input"
					/>
				</el-form-item>
				<el-form-item label="收款机构">
					<w-input
						:value="otherOrganName"
						disabled
						class="form-input"
					/>
				</el-form-item>
			</el-row>
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
			<el-form-item label="入库单号">
				<w-input
					v-model="filter.userBillCode"
					placeholder="请输入"
					class="form-input"
				/>
			</el-form-item>
		</template>
		<template slot="tools">
			<fx-button class="order-btn" type="primary" @click="onSearchClick">查询</fx-button>
			<fx-button class="order-btn" plain @click="onResetClick">重置</fx-button>
		</template>
	</fx-list-filter>
</template>
<script>
export default {
	name: 'filterBar',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			filter: {
				dateRang: [],
				userBillCode: '',
				sysBillCode: '',
				organId: '',
				otherOrganId: '',
				businessDate: [],
				billState: [2, 4]
			},
			pickerOptions: this.$fxGetDatePickerOptionsShortcuts(['thisMonth', 'lastMonth', 'last3Month'])
		}
	},
	computed: {
		organName () {
			return this.organDetails.organ.name
		},
		otherOrganName () {
			return this.organDetails.otherOrgan.name
		}
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search')
		},
		onResetClick () {
			this.filter.dateRang = []
			this.filter.businessDate = []
			this.filter.userBillCode = ''
			this.filter.sysBillCode = ''
		},
		getFilterParams () {
			if (this.filter.dateRang && this.filter.dateRang.length) {
				this.filter.businessDate = [this.filter.dateRang[0], this.filter.dateRang[1]]
			} else {
				this.filter.businessDate = []
			}
			this.filter.organId = [this.organDetails.organ.id]
			this.filter.otherOrganId = [this.organDetails.otherOrgan.id]
			this.filter.sysBillCode = this.filter.userBillCode
			return this.filter
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
