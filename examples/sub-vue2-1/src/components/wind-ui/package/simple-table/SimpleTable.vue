<template>
	<div class="wind-simple-table">
		<div ref="tableContainer" class="wind-simple-table__container fx-custom-scroll">
			<div class="wind-simple-table__main-table" :style="{'width': tableWidthComputed}">
				<div class="wind-simple-table__title">
					<slot></slot>
				</div>
				<div class="wind-simple-table__body">
					<div v-for="(item, index) in tableData" :key="index" class="wind-simple-table__tr" @click="rowClick(item, index)">
						<div
							v-for="(colItem, colindex) in columnArr"
							v-show="colItem.visible"
							:key="colindex"
							class="wind-simple-table__td"
							:style="columnStyle(colItem)"
							@click="cellClick(item, index, colItem)">
								<rendDom v-if="colItem.$scopedSlots.default" :rendNode="colItem.$scopedSlots.default({row:item,index})"></rendDom>
								<rendDom v-else-if="colItem.$slots.default" :rendNode="colItem.$slots.default"></rendDom>
								<span v-else>{{typeof colItem.formatter === 'function'?colItem.formatter(item, colItem, item[colItem.prop], index):item[colItem.prop]}}</span>
						</div>
					</div>
				</div>
				<div v-show="showSummary" class="wind-simple-table__sumTr">
					<div
						v-for="(sumItem, sumIndex) in columnArr"
						:key="sumIndex"
						class="wind-simple-table__sumTd"
						:style="sumColumnStyle(sumItem, sumIndex)"
					>{{sumComputed(sumItem.prop, sumIndex)}}</div>
				</div>
			</div>
		</div>
		<div v-show="showBottomBtn" class="wind-simple-table__bottom fx-cursor" @click="onBottomBtnClick">{{bottomBtnText}}</div>
	</div>
</template>

<script>
import rendDom from '../../js/libs/RendDom.js'
export default {
	name: 'wind-simple-table',
	components: {
		rendDom
	},
	props: {
		tableData: {
			type: Array,
			default: () => []
		},
		showSummary: Boolean,
		summaryMethod: Function,
		bottomBtnText: String,
		showBottomBtn: Boolean,
		absolutewidth: Boolean

	},
	data () {
		return {
			columnArr: []
		}
	},
	computed: {
		tableWidthComputed () {
			const width = this.$fxUtils.arrSum(this.columnArr, item => {
				return item.visible ? (item.width || 100) : 0
			}, 0)
			return this.absolutewidth ? `${width}px` : '100%'
		},
		columnStyle (colItem) {
			return (colItem) => {
				const colStyle = this.createdCellStyleObj(colItem)
				colStyle['text-align'] = colItem.align || 'center'
				return colStyle
			}
		},
		sumColumnStyle (colItem, colIndex) {
			return (colItem, colIndex) => {
				const colStyle = this.createdCellStyleObj(colItem)
				colStyle['text-align'] = colIndex === 0 ? 'left' : colItem.align || 'center'
				return colStyle
			}
		},
		sumComputed (prop, index) {
			return (prop, index) => {
				if (typeof this.summaryMethod === 'function') {
					const columns = this.columnArr.map(item => {
						return {
							property: item.prop,
							label: item.label
						}
					})
					const sumArr = this.summaryMethod({
						columns,
						data: this.tableData
					})
					return sumArr[index]
				} else {
					if (index === 0) {
						return '合计'
					}
					const sum = this.tableData.reduce((pre, cur) => {
						return pre + (cur[prop] - 0)
					}, 0)
					return sum
				}
			}
		}
	},
	methods: {
		createdCellStyleObj (colItem) {
			const colStyle = {}
			if (typeof colItem.width === 'string') {
				colStyle.width = colItem.width
			} else if (typeof colItem.width === 'number') {
				colStyle.width = `${colItem.width}px`
			} else {
				colStyle.flex = 1
			}
			return colStyle
		},
		rowClick (item, index) {
			this.$emit('rowClick', item, index)
		},
		cellClick (item, index, colItem) {
			this.$emit('cellClick', item, index, colItem)
		},
		onBottomBtnClick () {
			this.$emit('on-bottom-btn-click')
		},
		addColumn (column) {
			const index = this.$slots.default.findIndex(vnode => {
				return vnode.child && vnode.child.prop === column.prop
			})
			if (~index) {
				this.columnArr.splice(index, 0, column)
			}
		},
		delColumn () {
			const index = this.$slots.default.findIndex(vnode => {
				return !vnode.child
			})
			if (~index) {
				this.columnArr.splice(index, 1)
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
.wind-simple-table {
	display: flex
	flex-direction: column
	&__container {
		display: flex
		flex-direction: column
		flex:1
		overflow: auto;
	}
	&__main-table {
		display: flex
		flex-direction: column
		flex:1
	}
	&__title {
		display:flex
		background-color:#F7F8FA
		flex-shrink: 0
	}
	&__body {
		flex:1
		overflow:auto
		.wind-simple-table__tr {
			display:flex
			border-bottom: 1px solid #eee
			font-size:12px
			// &:nth-child(2n) {
			// 	background-color:#f0f2f7
			// }
			.wind-simple-table__td {
				height:32px
				line-height:32px
				overflow:hidden
				padding-left: 5px
				padding-right: 5px
				box-sizing: border-box
				// &:not(:last-child) {
				// 	border-right: 1px solid #eee
				// }
			}
		}
	}
	&__sumTr {
		display:flex
		border-bottom: 1px solid #eee
		border-top: 1px solid #eee
		font-size:12px
		.wind-simple-table__sumTd {
			height:40px
			line-height:40px
			overflow:hidden
			padding-left: 5px
			padding-right: 5px
			box-sizing: border-box;
			// &:not(:last-child) {
			// 	border-right: 1px solid #eee
			// }
		}
	}
	&__bottom {
		height: 32px;
		line-height: 30px;
		text-align: center;
		border: 1px dashed #c0ccda
		box-sizing: border-box;
		margin-top:5px
		margin-bottom: 5px
	}
}
</style>
