<template>
	<div>
		<fx-list-virtual-table
			ref="detailsTable"
			:tableColumn="tableColumn"
			:listData="detailData"
			:canAdd="false"
			:selectable="false"
			:showTools="false"
			:showPagination="false"
			showIndex
			minHeight="500px"
		>
			<div slot="empty">暂无表格数据</div>
		</fx-list-virtual-table>
		<fx-button type="save" @click="onBackClick">返回查看更多进度</fx-button>
	</div>
</template>
<script>
export default {
	name: 'detailPage',
	props: {
		visible: Boolean,
		detailData: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			tableColumn: [
				{ prop: 'CheckOrganName', label: '盘点机构', width: '160px', align: 'center' },
				{ prop: 'CheckStoreName', label: '盘点仓库', width: '160px', align: 'center' },
				{ prop: 'havingCheckFlag', label: '是否盘点', width: '80px', align: 'center', fxRender: this.isCheckedRender },
				{ prop: 'more', label: '更多操作', width: '313px', align: 'center', fxRender: this.moreRender }
			]
		}
	},
	watch: {
		detailData () {
			this.scrollToIndex(0)
		}
	},
	methods: {
		onBackClick	() {
			this.$emit('update:visible', true)
		},
		isCheckedRender (h, { row, $index }) {
			h = this.$createElement
			return <i class={row.havingCheckFlag ? 'el-icon-check' : 'el-icon-close'}></i>
		},
		moreRender (h, { row, $index }) {
			h = this.$createElement
			return <div>
				{
					row.billCodeList.length ? <div class="fx-ellipsis">
						<span>盘点单：</span>
						{row.billCodeList.map((item, index) => {
							if (index === row.billCodeList.length - 1) {
								return <w-link on-click={() => this.onJumpLink(item.id)}>{item.sysBillCode}</w-link>
							}
							return <w-link on-click={() => this.onJumpLink(item.id)}>{item.sysBillCode}、</w-link>
						})}
					</div> : <w-link icon="exclamation-mark-active" class="remind-btn">提醒该机构</w-link>
				}
			</div>
		},
		onJumpLink (checkOrderId) {
			this.$fxGoToBillBlank('CheckBill', { id: checkOrderId }, 'detail')
		},
		scrollToIndex (index) {
			return this.$refs.detailsTable.scrollToIndex(index)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-button {
	float: right !important ;
	margin-top: 19px;
}
.el-icon-check {
	color: $fxGreen2;
	font-weight: 700;
}
.el-icon-close {
	color: $fxRed2;
	font-weight: 700;
}
.remind-btn {
	color:#606266
	&:hover {
	color:#606266
	}
}
>>>.wind-virtual-table__cell {
	text-align center !important
}
</style>
