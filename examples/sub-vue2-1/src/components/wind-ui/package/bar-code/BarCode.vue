<template>
	<img ref="barcode" id="barcode" class="code-preview__img"/>
</template>
<script>
/**
 * QrCode by shang 2020/3/3
 * @desc QrCode 条形码生成器
 * @param {String} sourceCode 条形码文本
 * @param {Number} width 宽度
 */
import JsBarcode from 'jsbarcode'
export default {
	name: 'wind-bar-code',
	props: {
		sourceCode: String,
		width: {
			type: Number,
			default: 2
		},
		height: {
			type: Number,
			default: 50
		},
		fontSize: {
			type: Number,
			default: 14
		},
		format: {
			type: String,
			default: 'CODE128'
		},
		displayValue: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			barCodeInstance: null
		}
	},
	watch: {
		sourceCode: {
			immediate: true,
			handler (val) {
				if (val) {
					this.$nextTick(() => {
						this.createBarCode()
					})
				}
			}
		}
	},
	methods: {
		createBarCode () {
			this.$refs.barcode.innerHTML = ''
			this.barCodeInstance = JsBarcode(this.$refs.barcode, this.sourceCode, {
				format: this.format,
				fontSize: this.fontSize,
				displayValue: this.displayValue,
				height: this.height,
				width: this.width
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.code-preview__img {
	display: inline-block
}
</style>
