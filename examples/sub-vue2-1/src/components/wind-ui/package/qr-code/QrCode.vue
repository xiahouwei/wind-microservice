<template>
	<div ref="qrCodeRef" class="wind-qr-code" ></div>
</template>
<script>
/**
 * QrCode by shang 2020/2/25
 * @desc QrCode 而为am生成器
 * @param {String} sourceText 二维码文本
 * @param {Number} width 宽度
 */
import QRCode from 'qrcodejs2'
export default {
	name: 'wind-qr-code',
	props: {
		sourceText: String,
		width: {
			type: Number,
			default: 200
		}
	},
	data () {
		return {
			qrCodeInstance: null
		}
	},
	watch: {
		sourceText: {
			immediate: true,
			handler (val) {
				if (val) {
					this.$nextTick(() => {
						this.createQrCode()
					})
				}
			}
		}
	},
	methods: {
		createQrCode () {
			this.$refs.qrCodeRef.innerHTML = ''
			this.qrCodeInstance = new QRCode(this.$refs.qrCodeRef, {
				text: this.sourceText,
				width: this.width,
				height: this.width,
				colorDark: '#000000',
				colorLight: '#ffffff',
				correctLevel: QRCode.CorrectLevel.H
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.wind-app-container {
	flex: 1
	display:flex
	text-align: left
	background-color: $wind-app-container-background-color
	&__direction-column {
		flex-direction: column
	}
	&__direction-row {
		flex-direction: row
	}
}
</style>
