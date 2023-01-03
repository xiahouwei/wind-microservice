<template>
	<div v-if="visible" class="wind-simple-table__column" :style="columnStyle">
		<div class="wind-simple-table__th"><slot name="label">{{label}}</slot></div>
	</div>
</template>

<script>
export default {
	name: 'wind-simple-table-column',
	props: {
		prop: String,
		label: String,
		width: String || Number,
		align: {
			type: String,
			default: 'left'
		},
		formatter: Function,
		visible: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			table: null
		}
	},
	computed: {
		columnStyle () {
			let width = ''
			if (this.width === null || this.width === undefined) {
				return { flex: 1 }
			}
			if (typeof this.width === 'string') {
				width = this.width
			} else if (typeof this.width === 'number') {
				width = `${this.width}px`
			}
			return { width: width, 'text-align': this.align }
		}
	},
	mounted () {
		this.table = this.findParent('wind-simple-table')
		this.table.addColumn(this)
	},
	destroyed () {
		if (this.table) {
			this.table.delColumn(this)
		}
	},
	methods: {
		findParent (name) {
			let parent = this.$parent
			while (parent) {
				if (parent.$options.name === name) {
					return parent
				}
				parent = parent.$parent
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
.wind-simple-table__column {
	overflow:hidden
	box-sizing:border-box
	.wind-simple-table__th {
		width:100%
		height:36px
		line-height:36px
		overflow:hidden
		padding:0 10px
		box-sizing: border-box
	}
	// &:not(:last-child) {
	// 	border-right: 1px solid #eee
	// }
}
</style>
