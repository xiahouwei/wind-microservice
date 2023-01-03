<template>
	<fx-list-filter @on-enter="onSearchClick">
		<template slot="row-1">
			<el-form-item label="会计年">
				<w-select
					v-model="year"
					:optionlist="yearList"
					:loading="yearLoading"
					class="form-input"
					@visible-change="onYearVisibleChange"
				>
				</w-select>
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
			year: '',
			yearList: [],
			yearLoading: false
		}
	},
	methods: {
		onSearchClick () {
			this.$emit('on-search', this.getFilterParams())
		},
		onResetClick () {
			this.year = ''
		},
		getFilterParams () {
			return {
				year: this.year
			}
		},
		getYearList () {
			this.yearLoading = true
			return this.$fxApi('account.getAccountYears').then(res => {
				this.yearList = res
				this.yearLoading = false
				return Promise.resolve()
			})
		},
		onYearVisibleChange (flag) {
			if (flag) {
				this.getYearList()
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-input {
	width: 140px
}
</style>
