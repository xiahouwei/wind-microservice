<template>
	<el-input
		ref="input"
		v-model="currentValue"
		:type="type"
		:readonly="hidePassword"
		:disabled="disabled"
		:maxlength="30"
		placeholder="请输入密码"
		@input="onInput"
	>
		<i v-show="!disabled" slot="suffix" class="el-icon-circle-close" @click="onClearClick"></i>
	</el-input>
</template>
<script>
/**
 * password-input by shang 2020/8/27
 * @desc password-input 密码输入框插件
 * @params [any] value
 * @params [Boolean] disabled 禁用状态
 */
export default {
	name: 'wind-password-input',
	props: {
		value: null,
		disabled: Boolean
	},
	data () {
		return {
			currentValue: '******',
			hidePassword: true
		}
	},
	computed: {
		type () {
			return this.hidePassword ? 'password' : 'text'
		}
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				if (!val) {
					this.hidePassword = false
					this.currentValue = ''
				}
			}
		}
	},
	methods: {
		focus () {
			if (this.$refs.input) {
				this.$refs.input.$el.querySelector('input').focus()
			}
		},
		refresh () {
			this.hidePassword = true
			this.currentValue = '******'
		},
		onClearClick () {
			this.$emit('input', '')
		},
		onInput (val) {
			this.$emit('input', val)
		}
	}
}
</script>
<style lang="stylus" scoped>
</style>
