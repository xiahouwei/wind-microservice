<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'app',
	computed: {
		...mapState({
			appTheme: state => state.stylusDynamic.appTheme
		})
	},
	mounted () {
		this.$fxStylusDynamic.setStyle('appTheme', this.appTheme)
	}
}
</script>
<style lang="stylus" scoped>
#app
	height 100%
</style>
