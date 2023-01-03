<template>
	<el-pagination
		ref="pagination"
		:current-page.sync="currentPage"
		:page-sizes="pageSizes"
		:page-size="pageSize"
		:total="total"
		layout="total, sizes, prev, pager, next, jumper"
		@size-change="onSizeChange"
		@current-change="onCurrentChange">
	</el-pagination>
</template>
<script>
const PAGE_SIZES = [20, 150, 200]
export default {
	name: 'wind-pagination',
	props: {
		total: {
			type: Number,
			default: 0
		}
	},
	data () {
		return {
			currentPage: 1,
			pageSizes: PAGE_SIZES,
			pageSize: PAGE_SIZES[0]
		}
	},
	methods: {
		onSizeChange (size) {
			this.pageSize = size
			const maxPage = Math.ceil(this.total / size)
			if (this.currentPage <= maxPage) {
				this.$emit('on-size-change', size)
			}
		},
		onCurrentChange (page) {
			this.$emit('on-current-change', page)
		},
		getCurrentPage () {
			return this.currentPage
		},
		setPageRows (size) {
			this.pageSize = size
		},
		getPageRows () {
			return this.pageSize
		},
		setCurrentPage (page) {
			this.currentPage = page
		},
		getPaginationParams () {
			return {
				page: this.currentPage,
				limit: this.pageSize
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
.wind-scroll-bar {
	flex: 1
}
.wind-scroll-bar-y {
	>>>.el-scrollbar__wrap{
		overflow-x: hidden
	}
}
.wind-scroll-bar-x {
	>>>.el-scrollbar__wrap{
		overflow-y: hidden
	}
}
</style>

