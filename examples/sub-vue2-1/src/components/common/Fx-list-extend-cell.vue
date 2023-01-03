<template>
	<el-form-item :label="title" :class="classes" :label-width="labelWidth" @click.native="onClick">
		<div class="fx-list-extend-cell__container fx-ellipsis" :style="styles"><slot></slot></div>
	</el-form-item>
</template>
<script>
export default {
	name: 'fx-list-extend-cell',
	props: {
		title: String,
		width: {
			type: Number,
			default: 150
		},
		labelWidth: null,
		editColumn: Boolean,
		disabled: Boolean
	},
	computed: {
		styles () {
			return {
				width: `${this.width}px`
			}
		},
		classes () {
			const isEdit = (this.editColumn && !this.disabled) ? ' is-edit-cell' : ''
			return `fx-list-extend-cell${isEdit}`
		}
	},
	methods: {
		onClick () {
			if (this.disabled) {
				return false
			}
			this.$emit('click')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-list-extend-cell {
	margin-bottom: 0
	position:relative
	padding-left: 4px
	>>>.el-form-item__label {
		vertical-align: initial
	}
	&__container {
		display: inline-block
		font-size: 12px
		vertical-align: middle
		height 40px
		line-height 40px
	}
}
</style>

