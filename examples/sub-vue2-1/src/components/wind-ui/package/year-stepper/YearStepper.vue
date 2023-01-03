<template>
	<el-input-number
		ref="yearStepper"
		v-model="year"
		:min="min"
		:max="max"
		size="mini"
		class="wind-year-stepper"
	></el-input-number>
</template>
<script>
/**
 * YearStepper by shang 2020/10/10
 * @desc YearStepper 年步进器
 * @params value[any] value
 * @params min[number] 最小可选择年
 * @params max[number] 最大可选择年
 */
export default {
	name: 'wind-year-stepper',
	props: {
		value: null,
		min: {
			type: Number,
			default: 2000
		},
		max: {
			type: Number,
			default: 2050
		}
	},
	data () {
		return {
			year: ''
		}
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				this.year = val
			}
		},
		year (val) {
			this.$emit('input', val)
		}
	},
	mounted () {
		this.$refs.yearStepper.$el.getElementsByClassName('el-input__inner')[0].readOnly = true
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.wind-year-stepper {
}
</style>
