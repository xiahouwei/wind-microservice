<template>
	<div class="step-container">
		<fx-list-virtual-table
			ref="detailsTable"
			:tableColumn="tableColumn"
			:listData="errorData"
			:canAdd="false"
			:selectable="false"
			:showTools="false"
			:showPagination="false"
			showIndex
		>
			<div slot="empty">无错误数据，可进行下一步数据迁移</div>
		</fx-list-virtual-table>
	</div>
</template>

<script>
export default {
	name: 'importStep2',
	props: {
		errorData: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'name', label: 'sheet页' },
				{ prop: 'value', label: '错误数据', width: '800px' }
			]
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.step-container {
	height 600px
	padding 25px 80px
}
</style>
