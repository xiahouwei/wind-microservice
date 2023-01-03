<template>
	<div class="biubiuorder">
		<iframe :src="iframeSrc" class="biubiuorder-iframe"></iframe>
	</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'biubiuorder',
	computed: {
		...mapState({
			token: state => state.loginer.token
		}),
		iframeSrc () {
			return this.$fxBiubiuorder.getRemote({ token: this.token, router: this.$route.query.router })
		}
	}
}
</script>
<style lang="stylus" scoped>
.biubiuorder {
	height: 100%;
	width: 100%
	.biubiuorder-iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
}
</style>

