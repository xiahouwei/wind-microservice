<script>
export default {
	name: 'fx-teleport-child',
	props: {
		to: String
	},
	data () {
		return {
			currentTab: ''
		}
	},
	mounted () {
		this.$fxEventBus.$emit('teleport-append', this.to, this.$el)
	},
	render (h) {
		h = this.$createElement
		return <div class="fx-teleport-child">{this.$scopedSlots.default()}</div>
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-teleport-father {
}
</style>
