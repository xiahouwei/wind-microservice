<template>
	<w-dialog v-model="dialogVisible" title="小程序二维码" width="500px" @close="onCloseHandler">
		<div class="mini-qr-code">
			<img :src="imgUrl " class="mini-qr-code__img" />
		</div>
	</w-dialog>
</template>
<script>
export default {
	name: 'miniQrCodeDialog',
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
		onCloseHandler () {
			this.$emit('input', false)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.mini-qr-code{
	width: 100%
	height: 460px
	box-sizing: border-box
	display: flex
	align-items: center
	justify-content: center
}
</style>
