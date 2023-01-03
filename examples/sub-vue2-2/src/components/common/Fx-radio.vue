<template>
	<el-radio
		v-model="radioValue"
		:label="label"
		@click.native="onRadioClick"
		@change="onRadioChange"
	>
	</el-radio>
</template>

<script>
/**
 * @name fx-radio
 * @desc 单据业务链组件
 * @author caicai
 * @date 2022/06/14
 *
 * @param {String, Number, Boolean} label - Radio 的 value
 * @param {Boolean} canCancel - 是否可以取消选择，默认不可以
 */
export default {
	name: 'fx-radio',
	props: {
		value: [String, Number, Boolean],
		label: [String, Number, Boolean],
		canCancel: Boolean
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				this.radioValue = val
			}
		}
	},
	data () {
		return {
			radioValue: ''
		}
	},
	methods: {
		onRadioClick () {
			if (event.target.tagName === 'INPUT') return
			if (this.value === this.label && this.canCancel) {
				setTimeout(() => {
					this.$emit('input', '')
				}, 17)
			}
		},
		onRadioChange (val) {
			this.$emit('input', val)
		}
	}
}
</script>

<style lang="stylus" scoped>

</style>
