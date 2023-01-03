<template>
	<img :src="imgSrc" :onerror="defaultImg">
</template>
<script>
export default {
	name: 'w-image',
	props: {
		src: [String, null],
		type: {
			type: String,
			default: ''
		}
	},
	data () {
		return {
			defaultImg: 'this.src="' + this.getDefaultImg() + '"'
		}
	},
	computed: {
		imgSrc () {
			return this.src || this.$fxCommon.getDefaultImg(this.type)
		}
	},
	methods: {
		getDefaultImg () {
			switch (this.type) {
			case 'preview':
				return require('@/assets/images/img/default-img-preview.png')
			default:
				return require('@/assets/images/img/default-img.png')
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
</style>
