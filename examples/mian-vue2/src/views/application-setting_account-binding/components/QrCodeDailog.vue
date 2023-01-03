<template>
	<w-dialog v-model="dialogVisible" title="扫码绑定" width="500px" @close="onCloseHandler">
		<div class="qr-code">
			<w-qr-code :sourceText="qrCodeText" :width="400" class="qr-code__content"></w-qr-code>
		</div>
	</w-dialog>
</template>
<script>
export default {
	name: 'qrCodeDialog',
	data () {
		return {
			dialogVisible: false,
			qrCodeText: ''
		}
	},
	methods: {
		open (qrCodeText) {
			this.qrCodeText = qrCodeText
			this.dialogVisible = true
			return Promise.resolve()
		},
		close () {
			this.dialogVisible = false
		},
		onCloseHandler () {
			this.$emit('on-close')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.qr-code{
	width: 100%
	height: 460px
	box-sizing: border-box
	display: flex
	align-items: center
	justify-content: center
}
</style>
