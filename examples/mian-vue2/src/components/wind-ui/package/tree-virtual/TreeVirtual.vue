<template>
	<w-scroll-bar ref="scroll-bar" class="wind-virtual-tree wind-virtual-tree__scroll-bar" wrapClass="wind-virtual-tree__wrap">
		<div class="wind-virtual-tree__phantom" :style="{ height: contentHeight }"></div>
		<div
			:class="['wind-virtual-tree__content', {
				'wind-virtual-tree__highlight-current': highlightCurrent
			}]"
			:style="{
				transform: `translate3d(0px, ${this.translateY}px, 0px)`
			}"
		>
			<div
				v-for="(item, index) in visibleData"
				:key="item.id"
				:class="['wind-virtual-tree__list-view', {
					'is-current': item[nodeKey]===currentNodeKey,
				}]"
				:style="{
					paddingLeft: indent * (item.level - 1) + 'px',
					height: listItemHeight + 'px'
				}"
				@mouseover="onTreeItemMouseOver(item)"
				@mouseleave="onTreeItemMouseLeave"
				@click.stop="handleClick(item)"
			>
				<span :class="{'is-expanded': item.expanded}" class="wind-tree-node__title-expand-icon">
					<Icon
						v-if="item[props.children] && item[props.children].length"
						type="tree-expand"
						svg
						stop
						class="expand-icon"
						@click="toggleExpand(item)"
					></Icon>
				</span>
				<slot :data="item" :index="index" :activeTreeItemId="activeTreeItemId" :node="{}"></slot>
			</div>
		</div>
		<div class="wind-virtual-tree__empty-block" v-if="isEmpty">
			<span class="wind-virtual-tree__empty-text">{{ emptyText }}</span>
		</div>
	</w-scroll-bar>
</template>
<script>
/**
 * tree-virtual by shang 2022/6/10
 * @desc tree-virtual 虚拟渲染树
 * @param {Array}  data - 展示数据
 * @param {String}  nodeKey - 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
 * @param {Object}  props - 配置选项
 * @param {String}  emptyText - 内容为空的时候展示的文本
 * @param {Boolean}  highlightCurrent - 是否高亮当前选中节点，默认值是 false
 * @param {Boolean}  defaultExpandAll - 是否默认展开所有节点
 * @param {Boolean}  expandOnClickNode - 是否在点击节点的时候展开或者收缩节点
 * @param {Boolean}  checkOnClickNode - 是否在点击节点的时候选中节点
 * @param {Boolean}  autoExpandParent - 展开子节点的时候是否自动展开父节点
 * @param {Array}  defaultExpandedKeys - 默认展开的子节点
 * @param {Boolean}  showCheckbox - 节点是否可被选择
 * @param {Boolean}  checkStrictly - 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
 * @param {Array}  defaultCheckedKeys - 默认勾选的节点的 key 的数组
 * @param {Function}  defaultFiter - 默认过滤
 * @param {Function}  filterNodeMethod - 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
 * @param {Boolean}  accordion - 是否每次只打开一个同级树节点展开
 * @param {Function}  defaultFiter - 默认过滤方法
 * @param {String}  indent - 相邻级节点间的水平缩进，单位为像素
*/
import Icon from '../icon'
import throttle from '../../js/utils/throttle.js'
const BUFFER_COUNT = 20
export default {
	name: 'w-tree-virtual',
	components: {
		Icon
	},
	props: {
		// 展示数据
		data: {
			type: Array,
			default () {
				return []
			}
		},
		// 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
		nodeKey: {
			type: String,
			default: 'id'
		},
		// 配置选项
		props: {
			type: Object,
			default: () => {
				return {
					children: 'children',
					label: 'name',
					related: 'related'
				}
			}
		},
		// 内容为空的时候展示的文本
		emptyText: {
			type: String,
			default: '当前数据为空'
		},
		// 是否高亮当前选中节点，默认值是 false
		highlightCurrent: Boolean,
		// @TODO 是否默认展开所有节点
		defaultExpandAll: Boolean,
		// @TODO 是否在点击节点的时候展开或者收缩节点
		expandOnClickNode: {
			type: Boolean,
			default: true
		},
		// @TODO 是否在点击节点的时候选中节点
		checkOnClickNode: Boolean,
		// @TODO 默认展开的节点的 key 的数组
		defaultExpandedKeys: Array,
		// @TODO 节点是否可被选择
		showCheckbox: {
			type: Boolean,
			default: false
		},
		// @TODO 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
		checkStrictly: Boolean,
		// @TODO 默认勾选的节点的 key 的数组
		defaultCheckedKeys: Array,
		// @TODO 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
		filterNodeMethod: Function,
		// @TODO 是否每次只打开一个同级树节点展开
		accordion: Boolean,
		// @TODO 默认过滤
		defaultFiter: Function,
		// 相邻级节点间的水平缩进，单位为像素
		indent: {
			type: Number,
			default: 18
		},
		timeout: {
			type: Number,
			default: 17
		},
		listItemHeight: {
			type: Number,
			default: 32
		}
	},
	data () {
		return {
			scrollThrottle: throttle(),
			translateY: 0,
			contentHeight: '0px',
			visibleData: [],
			activeTreeItemId: null,
			nodeParentMap: {},
			nodeTree: {},
			containerHeight: 0,
			bufferCount: BUFFER_COUNT,
			currentNode: {},
			currentNodeKey: ''
		}
	},
	computed: {
		flattenTree () {
			const flatten = (
				list,
				childKey = 'children',
				level = 1,
				parent = null,
				defaultExpand = true
			) => {
				const arr = []
				list.forEach(item => {
					item.level = level
					if (item.expanded === undefined) {
						item.expanded = defaultExpand
					}
					if (item.visible === undefined) {
						item.visible = true
					}
					if (!parent.visible || !parent.expanded) {
						item.visible = false
					}
					this.nodeParentMap[item[this.nodeKey]] = {
						id: item[this.nodeKey],
						parent
					}
					arr.push(item)
					if (item[childKey]) {
						arr.push(
							...flatten(
								item[childKey],
								childKey,
								level + 1,
								item,
								defaultExpand
							)
						)
					}
				})
				return arr
			}
			return flatten(this.data, this.props.children, 1, {
				level: 0,
				visible: true,
				expanded: true,
				children: this.data
			})
		},
		visibleCount () {
			return Math.floor(this.containerHeight / this.listItemHeight)
		},
		isEmpty () {
			return !Array.isArray(this.flattenTree) || this.flattenTree.length === 0
		}
	},
	mounted () {
		this.bindEvents()
		this.setContainerHeight()
		this.updateView()
	},
	destroyed () {
		this.unbindEvents()
	},
	watch: {
		data () {
			this.nodeParentMap = {}
			this.updateView()
		}
	},
	methods: {
		bindEvents () {
			const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-virtual-tree__wrap')
			wrap.addEventListener('scroll', this.handleScroll, { passive: true })
		},
		unbindEvents () {
			if (this.$refs['scroll-bar']) {
				const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-virtual-tree__wrap')
				wrap.removeEventListener('scroll', this.handleScroll, { passive: true })
			}
		},
		setContainerHeight () {
			this.containerHeight = this.$refs['scroll-bar'].$el.clientHeight
		},
		updateView () {
			this.getContentHeight()
			this.handleScroll()
		},
		handleScroll (e) {
			this.scrollThrottle(this.timeout, true).then(() => {
				this.$emit('on-scroll', e)
				let scrollTop = null
				if (e) {
					const ele = e.srcElement || e.target
					scrollTop = ele.scrollTop
				} else {
					const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-virtual-tree__wrap')
					scrollTop = wrap.scrollTop
				}
				this.updateVisibleData(scrollTop)
			})
		},
		updateVisibleData (scrollTop = 0) {
			const allVisibleData = (this.flattenTree || []).filter(item => item.visible)
			let start = Math.floor(scrollTop / this.listItemHeight) - Math.floor(this.visibleCount / 2)
			start = start < 0 ? 0 : start
			const end = Math.min(start + this.visibleCount + this.bufferCount, allVisibleData.length)
			this.visibleData = allVisibleData.slice(start, end)
			this.translateY = start * this.listItemHeight
		},
		getContentHeight () {
			this.contentHeight = (this.flattenTree || []).filter(item => item.visible).length * this.listItemHeight + 'px'
		},
		toggleExpand (item) {
			const isExpand = item.expanded
			if (isExpand) {
				this.collapse(item, true)
			} else {
				this.expand(item, true)
			}
			this.updateView()
		},
		// 展开节点
		expand (item) {
			item.expanded = true
			this.recursionVisible(item[this.props.children], true)
		},
		// 折叠节点
		collapse (item) {
			item.expanded = false
			this.recursionVisible(item[this.props.children], false)
		},
		// 折叠所有
		collapseAll (level = 1) {
			this.flattenTree.forEach(item => {
				item.expanded = false
				if (item.level !== level) {
					item.visible = false
				}
			})
			this.updateView()
		},
		// 展开所有
		expandAll () {
			this.flattenTree.forEach(item => {
				item.expanded = true
				item.visible = true
			})
			this.updateView()
		},
		// 递归节点
		recursionVisible (children, status) {
			children.forEach(node => {
				node.visible = status
				if (node[this.props.children]) {
					this.recursionVisible(node[this.props.children], status)
				}
			})
		},
		// 基于某一节点展开他的所有父节点
		bubbleVisible (node) {
			node.expanded = true
			node.visible = true
			if (node[this.nodeKey]) {
				const nodeMapItem = this.nodeParentMap[node[this.nodeKey]]
				if (nodeMapItem) {
					nodeMapItem.expanded = true
					nodeMapItem.visible = true
					if (nodeMapItem.parent.id) {
						this.bubbleVisible(nodeMapItem.parent)
					}
				}
			}
		},
		onTreeItemMouseOver (data) {
			this.activeTreeItemId = data.id
		},
		onTreeItemMouseLeave () {
			this.activeTreeItemId = null
		},
		handleClick (item) {
			this.currentNode = item
			this.currentNodeKey = item[this.nodeKey]
			this.$emit('node-click', item)
		},
		getNode (id) {
			return this.flattenTree.find(item => item[this.nodeKey] === id) || {}
		},
		setCurrentKey (key) {
			if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentKey')
			this.currentNodeKey = key
			this.currentNode = this.flattenTree.find(item => item[this.nodeKey] === key) || {}
		},
		doScrollViewByNodeKey (key) {
			const node = this.getNode(key)
			this.bubbleVisible(node)
			this.$nextTick(() => {
				const index = this.flattenTree.findIndex(item => item[this.nodeKey] === key)
				if (~index) {
					const allVisibleData = (this.flattenTree || []).filter(item => item.visible)
					let start = index - this.bufferCount
					start = start < 0 ? 0 : start
					const end = Math.min(start + this.visibleCount + this.bufferCount, allVisibleData.length)
					const beforeHeight = this.getHeightByRowIndex(index - 1, allVisibleData)
					const wrap = this.$refs['scroll-bar'].$el.querySelector('.wind-virtual-tree__wrap')
					const maxScrollTop = wrap.scrollHeight - wrap.clientHeight
					const scrollTop = beforeHeight > maxScrollTop ? maxScrollTop : beforeHeight
					wrap.scrollTop = scrollTop
					!index && this.$refs['scroll-bar'].handleScroll()
					this.visibleData = allVisibleData.slice(start, end)
					this.translateY = start * this.listItemHeight
				}
			})
		},
		getHeightByRowIndex (rowIndex, list) {
			if (rowIndex < 0) {
				return 0
			}
			let height = 0
			for (let i = 0; i < list.length; i++) {
				height += this.listItemHeight
				if (i === rowIndex) {
					return height
				}
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.wind-virtual-tree {
	position: relative;
	overflow: auto;
	height: 100%
	&__phantom {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		z-index: -1;
	}
	&__content {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		min-height: 100px;
	}
	&__list-view {
		display: flex;
		align-items: center;
		&:hover {
			background-color: #e6f7ff
		}
	}
	&__highlight-current {
		.wind-virtual-tree__list-view.is-current {
			background-color: #f0f7ff
		}
	}
	&__empty-block {
		text-align: center
		color: $wind-tree-empty-text-color
		margin-top: 50px
	}
	.wind-tree-node__title-expand-icon {
		display: inline-block;
		width: 24px;
		height: 24px;
		line-height: 24px;
		margin: 0;
		text-align: center;
		vertical-align: top;
		border: 0;
		outline: none;
		cursor: pointer;
		color: rgba(0,0,0,.45);
		transform: rotate(-90deg);
		font-weight: 700;
		transition: transform .3s;
		&.is-expanded {
			transform: rotate(0deg);
		}
		.expand-icon {
			width: 20px
			height: 20px
		}
	}
	&__scroll-bar {
		padding-right: 0
		padding-bottom: 0
	}
}
</style>
<style lang="stylus">
.wind-virtual-tree__wrap {
    position: relative;
    overflow: auto;
    overflow-anchor: none;
}
</style>
