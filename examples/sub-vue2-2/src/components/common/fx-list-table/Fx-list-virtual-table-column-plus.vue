<template>
	<w-virtual-table-column-plus
		:prop="$attrs.item.prop"
		:type="$attrs.item.type||'default'"
		:label="$attrs.item.label"
		:align="$attrs.item.align"
		:headerAlign="$attrs.item.headerAlign"
		:fixed="this.$fxUtils.isDef($attrs.fixed) ? $attrs.fixed : $attrs.item.fixed"
		:width="$attrs.item.width"
		:sortable="$attrs.item.sortable && 'custom'"
		:renderHeader="$attrs.item.renderHeader"
		:class-name="`fx-list-table__td ${$attrs.item.className || ''}`"
		:labelClassName="`${$attrs.item.labelClassName || ''}`"
		:headerClick="$attrs.item.headerClick"
		:diagonal="$attrs.item.diagonal"
		:item="$attrs.item"
	>
		<template v-for="childItem in $attrs.item.child">
			<fx-list-virtual-table-column
				v-if="childItem.visible"
				:key="childItem.porp"
				:item="childItem"
				:fixed='$attrs.item.fixed'
			></fx-list-virtual-table-column>
		</template>
		<template slot-scope="scope">
			<fx-render-dom
				v-if="$attrs.item.fxRender"
				:render="$attrs.item.fxRender"
				:backValue="scope"
			></fx-render-dom>
			<span v-else class="fx-list-table__cell-span">
				{{$attrs.item.formatter ? $attrs.item.formatter(scope.row):getCellText(scope.row, $attrs.item.prop)}}
			</span>
		</template>
	</w-virtual-table-column-plus>
</template>
<script>
export default {
	name: 'fx-list-virtual-table-column-plus',
	inheritAttrs: false,
	methods: {
		getCellText (row, prop) {
			if (~prop.indexOf('.')) {
				return prop.split('.').reduce((pre, cur) => {
					return pre === undefined ? pre : pre[cur]
				}, row)
			}
			return row[prop]
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>

