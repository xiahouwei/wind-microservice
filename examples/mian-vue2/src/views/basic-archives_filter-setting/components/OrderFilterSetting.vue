<template>
	<div ref="orderFilterSetting" class="order-filter-setting">
		<div class="order-filter-setting__container">
			<div class="order-filter-setting__title">默认显示</div>
			<div class="order-filter-setting__preview">
				<w-draggable
					v-model="basicFilterList"
					group="filterItem"
					animation="300"
					handle=".fx-drag-filter-item"
					filter=".fx-drag-disable"
					class="item-tag-preview__main"
					:move="onFilterItemMove"
					@choose="onFilterItemChoose"
					@unchoose="onFilterItemUnchoose"
				>
					<transition-group class="item-tag-preview__main-container">
						<div
							v-for="item in basicFilterList"
							:key="item.id"
							:class="['order-filter-setting__item-tag', {
								'fx-drag-disable': item.disable
							}]"
							@mouseenter="onFilterItemMouseenter(item)"
							@mouseleave="onFilterItemMouseLeave(item)"
						>
							<fx-render-dom :backValue="{ item, mouseenterFilter }" :render="filterItemRender"></fx-render-dom>
							<i
								v-show="mouseenterFilter===item.id&&!isChooseFilterItem&&!item.disable"
								class="el-icon-error item-tag-delete-btn"
								@click="onBasicFilterTagDelete(item)"
							></i>
						</div>
					</transition-group>
				</w-draggable>
				<div class="item-tag-preview__sub">将下方字段拖动到此区域显示默认筛选条件</div>
			</div>
			<div class="order-filter-setting__title">更多条件</div>
			<div class="order-filter-setting__preview">
				<w-draggable
					v-model="moreFilterList"
					group="filterItem"
					animation="300"
					handle=".fx-drag-filter-item"
					filter=".fx-drag-disable"
					class="item-tag-preview__main"
					:move="onFilterItemMove"
					@choose="onFilterItemChoose"
					@unchoose="onFilterItemUnchoose"
				>
					<transition-group class="item-tag-preview__main-container">
						<div
							v-for="item in moreFilterList"
							:key="item.id"
							:class="['order-filter-setting__item-tag', {
								'fx-drag-disable': item.disable
							}]"
							@mouseenter="onFilterItemMouseenter(item)"
							@mouseleave="onFilterItemMouseLeave(item)"
						>
							<fx-render-dom :backValue="{ item, mouseenterFilter }" :render="filterItemRender"></fx-render-dom>
							<i
								v-show="mouseenterFilter===item.id&&!isChooseFilterItem&&!item.disable"
								class="el-icon-error item-tag-delete-btn"
								@click="onMoreFilterTagDelete(item)"
							></i>
						</div>
					</transition-group>
				</w-draggable>
				<div class="item-tag-preview__sub">将下方字段拖动到此区域显示更多筛选条件并隐藏默认</div>
			</div>
			<w-draggable
				v-model="filterItemPond"
				group="filterItem"
				animation="300"
				dragClass="is-drag"
				ghostClass="is-drag"
				chosenClass="is-drag"
				class="order-filter-setting__pond"
				:forceFallback="false"
				:move="onFilterItemMove"
				@choose="onFilterItemChoose"
				@unchoose="onFilterItemUnchoose"
			>
				<transition-group class="item-tag-preview__pond-container">
					<div
						v-for="item in filterItemPond"
						:key="item.id"
						:class="['order-filter-setting__item-tag-pond', {
							'is-hover': item.id===mouseenterFilter
						}]"
						@mouseenter="onFilterItemMouseenter(item)"
						@mouseleave="onFilterItemMouseLeave(item)"
					>{{item.name}}</div>
				</transition-group>
			</w-draggable>
			<div class="order-filter-setting__title">列表展示</div>
			<div class="order-filter-setting__preview">
				<w-draggable
					v-model="tableColumList"
					group="tableColumn"
					animation="300"
					handle=".fx-drag-colunm-item"
					filter=".fx-drag-disable"
					class="item-tag-preview__table"
					:move="onTableColumnMove"
					@choose="onFilterItemChoose"
					@unchoose="onFilterItemUnchoose"
				>
					<transition-group class="item-tag-preview__table-container">
						<div
							v-for="item in tableColumList"
							:key="item.id"
							class="order-filter-setting__column-cell"
						>
							<fx-render-dom
								:backValue="{ item }"
								:render="tableColumnRender"
							></fx-render-dom>
							<i
								v-show="mouseenterFilter===item.id&&!isChooseFilterItem&&!item.disable"
								class="el-icon-error item-tag-delete-btn"
								@click="onTableColumnTagDelete(item)"
								@mouseenter="onFilterItemMouseenter(item)"
								@mouseleave="onFilterItemMouseLeave(item)"
							></i>
							<el-tooltip content="当前列不可移动" placement="top">
								<i
									v-show="mouseenterFilter===item.id&&!isChooseFilterItem&&item.disable"
									class="el-icon-warning-outline table-column-disable-icon"
									@mouseenter="onFilterItemMouseenter(item)"
									@mouseleave="onFilterItemMouseLeave(item)"
								></i>
							</el-tooltip>
						</div>
					</transition-group>
				</w-draggable>
				<div class="fx-table__column-resize-proxy"></div>
				<div class="item-tag-preview__sub">将下方字段拖动到此区域显示表格列</div>
			</div>
			<w-draggable
				v-model="tableColumnPond"
				group="tableColumn"
				animation="300"
				dragClass="is-drag"
				ghostClass="is-drag"
				chosenClass="is-drag"
				class="order-filter-setting__pond"
				:forceFallback="false"
				:move="onTableColumnMove"
				@choose="onFilterItemChoose"
				@unchoose="onFilterItemUnchoose"
			>
				<transition-group class="item-tag-preview__pond-container">
					<div
						v-for="item in tableColumnPond"
						:key="item.id"
						:class="['order-filter-setting__item-tag-pond', {
							'is-hover': item.id===mouseenterFilter
						}]"
						@mouseenter="onFilterItemMouseenter(item)"
						@mouseleave="onFilterItemMouseLeave(item)"
					>{{item.name}}</div>
				</transition-group>
			</w-draggable>
		</div>
		<div class="order-filter-setting__bottom">
			<el-button
				v-fx-auth:system-setting_filter-setting.edit-filter
				@click="onResetClick"
			>恢复默认</el-button>
			<el-button
				v-fx-auth:system-setting_filter-setting.edit-filter
				type="primary"
				@click="onSaveClick"
			>保存</el-button>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { filterItemRender, tableColumnRender } from '@/components/filter-item-render'
export default {
	name: 'orderManage',
	props: {
		options: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			basicFilterList: [],
			moreFilterList: [],
			filterItemPond: [],
			tableColumList: [],
			tableColumnPond: [],
			mouseenterFilter: null,
			isChooseFilterItem: false,
			alwaysColumn: [{
				id: 'selectable',
				name: '选择框',
				type: 'selectable'
			}, {
				id: 'serialNumber',
				name: '序号',
				type: 'serialNumber'
			}],
			isTableColumnResizing: false
		}
	},
	computed: {
		...mapGetters(['mainFilterItemGetter', 'mainTableColumnGetter']),
		alwaysColumnKeys () {
			return this.alwaysColumn.map(item => item.type)
		}
	},
	created () {
		this.initFilterData()
	},
	methods: {
		...mapActions(['saveFilterConfigAction', 'resetFilterConfigAction']),
		initFilterData () {
			const { basic: basicFilterList, more: moreFilterList, hidden: filterItemPond } = this.mainFilterItemGetter(this.options.billType)
			this.basicFilterList = basicFilterList
			this.moreFilterList = moreFilterList
			this.filterItemPond = filterItemPond
			const { basic: tableColumList, hidden: tableColumnPond } = this.mainTableColumnGetter(this.options.billType)
			this.tableColumList = this.$fxUtils.deepClone(tableColumList)
			this.tableColumList.unshift(...this.alwaysColumn)
			this.tableColumnPond = tableColumnPond
		},
		filterItemRender (h, { item, mouseenterFilter }) {
			h = this.$createElement
			return filterItemRender[item.type].call(this, h, { item, mouseenterFilter })
		},
		onBasicFilterTagDelete (filterItem) {
			const index = this.basicFilterList.findIndex(item => item.id === filterItem.id)
			this.basicFilterList.splice(index, 1)
			this.filterItemPond.push(filterItem)
		},
		onMoreFilterTagDelete (filterItem) {
			const index = this.moreFilterList.findIndex(item => item.id === filterItem.id)
			this.moreFilterList.splice(index, 1)
			this.filterItemPond.push(filterItem)
		},
		onFilterItemMouseenter (filterItem) {
			if (this.isChooseFilterItem) {
				return false
			}
			this.mouseenterFilter = filterItem.id
		},
		onFilterItemMouseLeave () {
			if (this.isChooseFilterItem) {
				return false
			}
			this.mouseenterFilter = null
		},
		onFilterItemChoose () {
			this.isChooseFilterItem = true
		},
		onFilterItemUnchoose () {
			this.isChooseFilterItem = false
		},
		tableColumnRender (h, { item }) {
			h = this.$createElement
			return tableColumnRender[item.type || 'normal'].call(this, h, { item })
		},
		onFilterItemMove (e, originalEvent) {
			if (e.relatedContext.element && e.relatedContext.element.disable && e.draggedContext.futureIndex <= e.relatedContext.index) {
				return false
			}
		},
		onTableColumnMove (e, originalEvent) {
			if (e.relatedContext.element && this.alwaysColumnKeys.includes(e.relatedContext.element.type) && e.draggedContext.futureIndex < 2) {
				return false
			}
		},
		onTableColumnTagDelete (columnItem) {
			const index = this.tableColumList.findIndex(item => item.id === columnItem.id)
			this.tableColumList.splice(index, 1)
			this.tableColumnPond.push(columnItem)
		},
		onResetClick () {
			this.$fxConfirm('确定恢复默认设置？').then(() => {
				this.resetFilterConfigAction(this.options.billType).then(this.initFilterData)
			})
		},
		onSaveClick () {
			const basicColumn = this.tableColumList.filter(item => !this.alwaysColumnKeys.includes(item.type))
			const params = {
				billType: this.options.billType,
				basicFilter: this.basicFilterList,
				moreFilter: this.moreFilterList,
				hiddenFilter: this.filterItemPond,
				basicColumn: basicColumn,
				hiddenColumn: this.tableColumnPond
			}
			this.saveFilterConfigAction(params)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.order-filter-setting {
	flex: 1
	height: 100%
	display: flex;
	flex-direction: column;
	padding-left:30px
	padding-right: 30px
	&__container {
		flex: 1
		overflow: auto
	}
	&__bottom {
		height: 50px
		line-height: 50px
		text-align: center
	}
	&__title {
		height: 50px
		line-height: 50px
		font-size: 12px
		font-weight: bolder
		padding-left: 16px
	}
	&__preview {
		position relative
		min-height: 100px
		border: 1px dashed $fxGray1
		border-radius: 4px
		display: flex;
		flex-direction: column;
		.item-tag-preview__main {
			flex: 1
			display: flex
			&-container {
				flex: 1
			}
		}
		.item-tag-preview__sub {
			display: flex
			align-items: center
			justify-content: center
			height: 30px
			color: $fxGray1
		}
		.fx-table__column-resize-proxy {
			display: none
			position: absolute;
			left: 200px;
			top: 0;
			bottom: 0;
			width: 0;
			border-left: 1px solid $fxElementBorder
			z-index: 99;
		}
		.item-tag-preview__table {
			flex: 1
			display: flex
			&-container {
				flex: 1
				white-space: nowrap
				overflow-x: auto
				padding-top: 10px
				padding-right: 5px;
				width: 500px;
			}
		}
	}
	&__pond {
		display: flex
		min-height: 100px
		background-color: #F2F7FA
		margin-top: 20px
		border-radius: 4px
		.item-tag-preview__pond-container {
			flex: 1
		}
	}
	&__item-tag {
		display: inline-block
		margin: 10px 10px 10px 0
		position: relative
	}
	&__item-tag-pond {
		display: inline-block
		width: 100px
		height: 30px
		line-height: 30px
		border-radius: 2px
		margin: 10px 0 10px 40px
		text-align: center
		border: 1px solid $fxWhite1
		background-color: $fxWhite1
		&.is-hover {
			border: 1px dashed $fxBlue
			color: $fxBlue
			font-weight: bolder
			cursor: move
		}
		&.is-drag {
			border: 1px dashed $fxBlue !important
			background-color: $fxWhite1
			color: $fxBlue
			font-weight: bolder
		}
	}
	&__column-cell {
		display: inline-block
		white-space: nowrap;
		position: relative
		.table-column-disable-icon {
			color: $fxRed
			position: absolute
			top:16px
			right: 2px
			font-size: 14px
			z-index: 10
		}
	}
	.item-tag-delete-btn {
		color: $fxRed
		position: absolute
		top:-4px
		right: -4px
		font-size: 14px
		z-index: 10
		background-color: $fxWhite
		&:hover {
			cursor: pointer
		}
	}
}
</style>

