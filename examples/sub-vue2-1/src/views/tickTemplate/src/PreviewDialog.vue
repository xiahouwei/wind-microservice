<template>
	<w-dailog
		v-model="dialogVisible"
		heightFullscreen
		title="小票预览"
		width="450px"
	>
		<div class="preview-dialog__content">
			<img :src="imgUrl " class="preview-dialog__img" />
		</div>
		<template slot="footer">
			<el-button
				type="primary"
				@click="onConfirmClick"
			>确定</el-button>
		</template>
	</w-dailog>
</template>
<script>
export default {
	props: {
		value: Boolean,
		imgUrl: {
			type: String,
			default: ''
		}
	},
	data () {
		return {
			dialogVisible: false
		}
	},
	watch: {
		value (val) {
			this.dialogVisible = val
		},
		dialogVisible (val) {
			this.$emit('input', val)
		}
	},
	methods: {
		onConfirmClick () {
			this.dialogVisible = false
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.preview-dialog__content {
	height: 100%
	overflow: auto
}
</style>
