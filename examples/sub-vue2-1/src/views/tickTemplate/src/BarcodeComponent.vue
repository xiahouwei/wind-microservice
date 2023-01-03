<template>
    <div>{{text}}{{fatherName}}.{{title}}></div>
</template>
<script>
export default {
	name: 'print-props-editer-barcode',
	props: {
		title: {
			type: String,
			default: ''
		},
		fatherName: {
			type: String,
			default: ''
		}
	},
	data () {
		return {
			text: '<'
		}
	}
}
export function barcodeComponentFunction (sourceData) {
	const { barcodeHeight, barcodeWidth, barcodeStyle, content } = sourceData
	const con = document.createElement('div')
	if (!content) {
		return con
	}
	if (barcodeStyle !== 1) {
		this.barcode = content
		this.$refs.barcode.$el.style.height = barcodeHeight - 18 + 'px'
		this.$refs.barcode.$el.style.width = barcodeWidth + 'px'
		this.$refs.barcode.$el.style.display = 'block'
		this.$refs.barcode.$el.style.margin = '0 auto'
		con.appendChild(this.$refs.barcode.$el)
	}
	if (barcodeStyle !== 2) {
		const divNode = document.createElement('div')
		divNode.innerText = content
		divNode.style['text-align'] = 'center'
		divNode.style['z-index'] = '99'
		con.appendChild(divNode)
	}
	return con
}
</script>
<style scoped lang="stylus">
</style>
