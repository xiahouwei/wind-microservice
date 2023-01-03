<template>
	<div ref="teleportFather" class="fx-teleport-father"></div>
</template>
<script>
export default {
	name: 'fx-teleport-father',
	props: {
		teleportKey: String
	},
	data () {
		return {
			currentTab: ''
		}
	},
	created () {
		this.$fxEventBus.initEvent(this, 'teleport-append', this.teleportAppendHandler)
	},
	methods: {
		teleportAppendHandler (teleportKey, el) {
			if (this.teleportKey === teleportKey) {
				this.$refs.teleportFather.innerHTML = ''
				this.$refs.teleportFather.appendChild(...el.childNodes)
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-teleport-father {
}
</style>

