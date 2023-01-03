<template>
	<div>
		<w-simple-table :tableData="value">
			<w-simple-table-column prop="sourceName" label="来源系统名称"></w-simple-table-column>
			<w-simple-table-column prop="counterpartId" label="对方主键"></w-simple-table-column>
			<w-simple-table-column prop="counterpartCode" label="对方编号"></w-simple-table-column>
			<w-simple-table-column prop="counterpartName" label="对方名称">
				<el-tooltip slot-scope="scope" :content="scope.row.counterpartName" placement="top" :disabled="scope.row.counterpartName === '---'">
					<div class="fx-ellipsis">{{scope.row.counterpartName}}</div>
				</el-tooltip>
			</w-simple-table-column>
			<w-simple-table-column prop="createManName" label="写入人员"></w-simple-table-column>
			<w-simple-table-column prop="createDate" label="写入时间"></w-simple-table-column>
			<w-simple-table-column prop="modifyManName" label="更新人员"></w-simple-table-column>
			<w-simple-table-column prop="modifyDate" label="更新时间"></w-simple-table-column>
		</w-simple-table>
	</div>
</template>
<script>
export default {
	name: 'sourceManage',
	props: {
		value: {
			type: Array,
			default: () => {
				return []
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
