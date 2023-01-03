<template>
	<div
		role="tree"
		class="wind-tree"
		:class="{
			'wind-tree__highlight-current': highlightCurrent
		}"
	>
		<tree-node
			v-for="item in root.childNodes"
			:key="item[nodeKey]"
			:node="item"
			:props="props"
			:render-after-expand="renderAfterExpand"
			:render-content="renderContent"
			:show-checkbox="showCheckbox"
			@node-expand="handleNodeExpand"
		></tree-node>
		<div class="wind-tree__empty-block" v-if="isEmpty">
			<span class="wind-tree__empty-text">{{ emptyText }}</span>
		</div>
	</div>
</template>
<script>
/**
 * tree by shang 2021/5/14
 * @desc tree 树
 * @param {Array}  data - 展示数据
 * @param {String}  emptyText - 内容为空的时候展示的文本
 * @param {String}  nodeKey - 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
 * @param {Object}  props - 配置选项
 * @param {Boolean}  renderAfterExpand - 是否在第一次展开某个树节点后才渲染其子节点
 * @param {Function}  load - 加载子树数据的方法，仅当 lazy 属性为true 时生效
 * @param {Function}  renderContent - 树节点的内容区的渲染 Function
 * @param {Boolean}  highlightCurrent - 是否高亮当前选中节点，默认值是 false
 * @param {Boolean}  defaultExpandAll - 是否默认展开所有节点
 * @param {Boolean}  expandOnClickNode - 是否在点击节点的时候展开或者收缩节点
 * @param {Boolean}  checkOnClickNode - 是否在点击节点的时候选中节点
 * @param {Boolean}  autoExpandParent - 展开子节点的时候是否自动展开父节点
 * @param {Array}  defaultExpandedKeys - 展开子节点的时候是否自动展开父节点
 * @param {Boolean}  showCheckbox - 节点是否可被选择
 * @param {Boolean}  checkStrictly - 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
 * @param {Array}  defaultCheckedKeys - 默认勾选的节点的 key 的数组
 * @param {Function}  defaultFiter - 默认过滤
 * @param {Boolean}  showLine - 是否显示连接线

 * @event node-click 节点被点击时的回调
 * @event node-contextmenu 当某一节点被鼠标右键点击时会触发该事件
 * @event check-change 节点选中状态发生变化时的回调
 * @event check 当复选框被点击的时候触发
 * @event current-change 当前选中节点变化时触发的事件
 * @event node-expand 节点被展开时触发的事件
 * @event node-collapse 节点被关闭时触发的事件
 * @event node-drag-start @TODO 节点开始拖拽时触发的事件
 * @event node-drag-enter @TODO 拖拽进入其他节点时触发的事件
 * @event node-drag-leave @TODO 拖拽离开某个节点时触发的事件
 * @event node-drag-over @TODO 在拖拽节点时触发的事件（类似浏览器的 mouseover 事件）
 * @event node-drag-end @TODO 拖拽结束时（可能未成功）触发的事件
 * @event node-drop @TODO 拖拽成功完成时触发的事件

 * @method filter 对树节点进行筛选操作
 * @method updateKeyChildren 通过 keys 设置节点子元素，使用此方法必须设置 node-key 属性
 * @method getCheckedNodes 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组
 * @method setCheckedNodes 设置目前勾选的节点，使用此方法必须设置 node-key 属性
 * @method getCheckedKeys 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
 * @method setCheckedKeys 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性
 * @method setChecked 通过 key / data 设置某个节点的勾选状态，使用此方法必须设置 node-key 属性
 * @method getHalfCheckedNodes 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所组成的数组
 * @method getHalfCheckedKeys 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
 * @method getCurrentKey 获取当前被选中节点的 key，使用此方法必须设置 node-key 属性，若没有节点被选中则返回 null
 * @method getCurrentNode 获取当前被选中节点的 data，若没有节点被选中则返回 null
 * @method setCurrentKey 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性
 * @method setCurrentNode 通过 node 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性
 * @method getNode 根据 data 或者 key 拿到 Tree 组件中的 node
 * @method remove 删除 Tree 中的一个节点，使用此方法必须设置 node-key 属性
 * @method append 为 Tree 中的一个节点追加一个子节点
 * @method insertBefore 为 Tree 的一个节点的前面增加一个节点
 * @method insertAfter 为 Tree 的一个节点的后面增加一个节点
 * @method updateTreeNode 根据data,更新tree节点
 */
import treeNode from './TreeNode.vue'
import TreeStore from './src/tree-store'
import emitter from '../../js/mixins/emitter'
export default {
	name: 'tree',
	components: {
		treeNode
	},
	mixins: [emitter],
	props: {
		// 展示数据
		data: {
			type: Array,
			default: () => {
				return []
			}
		},
		// 内容为空的时候展示的文本
		emptyText: {
			type: String,
			default: '当前数据为空'
		},
		// 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
		nodeKey: {
			type: String,
			default: 'id'
		},
		// 配置选项
		props: {
			type: Object,
			default () {
				return {
					children: 'children',
					label: 'label',
					disabled: 'disabled'
				}
			}
		},
		// 是否在第一次展开某个树节点后才渲染其子节点
		renderAfterExpand: {
			type: Boolean,
			default: true
		},
		// @TODO 加载子树数据的方法，仅当 lazy 属性为true 时生效
		load: Function,
		// 树节点的内容区的渲染 Function
		renderContent: Function,
		// 是否高亮当前选中节点，默认值是 false
		highlightCurrent: Boolean,
		// 是否默认展开所有节点
		defaultExpandAll: Boolean,
		// 是否在点击节点的时候展开或者收缩节点
		expandOnClickNode: {
			type: Boolean,
			default: true
		},
		// 是否在点击节点的时候选中节点
		checkOnClickNode: Boolean,
		// 展开子节点的时候是否自动展开父节点
		autoExpandParent: {
			type: Boolean,
			default: true
		},
		// 默认展开的节点的 key 的数组
		defaultExpandedKeys: Array,
		// 节点是否可被选择
		showCheckbox: {
			type: Boolean,
			default: false
		},
		// 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
		checkStrictly: Boolean,
		// 默认勾选的节点的 key 的数组
		defaultCheckedKeys: Array,
		// 当前选中的节点
		currentNodeKey: [String, Number],
		// 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
		filterNodeMethod: Function,
		// 是否每次只打开一个同级树节点展开
		accordion: Boolean,
		// 默认过滤
		defaultFiter: Function,
		// @TODO 相邻级节点间的水平缩进，单位为像素
		indent: {
			type: Number,
			default: 18
		},
		// @TODO 自定义树节点的图标
		iconClass: String,
		// @TODO 是否懒加载子节点，需与 load 方法结合使用
		lazy: {
			type: Boolean,
			default: false
		},
		// @TODO 是否开启拖拽节点功能
		draggable: {
			type: Boolean,
			default: false
		},
		// @TODO 判断节点能否被拖拽
		allowDrag: Function,
		// @TODO 拖拽时判定目标节点能否被放置。
		allowDrop: Function,
		// 是否显示连接线段
		showLine: Boolean
	},
	data () {
		return {
			store: null,
			root: null,
			currentNode: null,
			treeItems: null,
			checkboxItems: []
		}
	},
	computed: {
		isEmpty () {
			return !Array.isArray(this.data) || this.data.length === 0
		}
	},
	created () {
		this.isTree = true
		this.store = new TreeStore({
			key: this.nodeKey,
			data: this.data,
			lazy: this.lazy,
			props: this.props,
			load: this.load,
			currentNodeKey: this.currentNodeKey,
			checkStrictly: this.checkStrictly,
			checkDescendants: this.checkDescendants,
			defaultCheckedKeys: this.defaultCheckedKeys,
			defaultExpandedKeys: this.defaultExpandedKeys,
			autoExpandParent: this.autoExpandParent,
			defaultExpandAll: this.defaultExpandAll,
			filterNodeMethod: this.filterNodeMethod,
			defaultFiter: this.defaultFiter
		})
		this.root = this.store.root
	},
	mounted () {
		this.initTabIndex()
	},
	updated () {
		this.treeItems = this.$el.querySelectorAll('[role=treeitem]')
		this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]')
	},
	watch: {
		defaultCheckedKeys (newVal) {
			this.store.setDefaultCheckedKey(newVal)
		},
		defaultExpandedKeys (newVal) {
			this.store.defaultExpandedKeys = newVal
			this.store.setDefaultExpandedKeys(newVal)
		},
		data (newVal) {
			this.store.setData(newVal)
		},
		checkboxItems (val) {
			Array.prototype.forEach.call(val, (checkbox) => {
				checkbox.setAttribute('tabindex', -1)
			})
		},
		checkStrictly (newVal) {
			this.store.checkStrictly = newVal
		}
	},
	methods: {
		initTabIndex () {
			this.treeItems = this.$el.querySelectorAll('.is-focusable[role=treeitem]')
			this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]')
			const checkedItem = this.$el.querySelectorAll('.is-checked[role=treeitem]')
			if (checkedItem.length) {
				checkedItem[0].setAttribute('tabindex', 0)
				return
			}
			this.treeItems[0] && this.treeItems[0].setAttribute('tabindex', 0)
		},
		handleNodeExpand (nodeData, node, instance) {
			this.broadcast('treeNode', 'tree-node-expand', node)
			this.$emit('node-expand', nodeData, node, instance)
		},
		filter (value) {
			if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter')
			this.store.filter(value)
		},
		updateKeyChildren (key, data) {
			if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in updateKeyChild')
			this.store.updateChildren(key, data)
		},
		getCheckedNodes (leafOnly, includeHalfChecked) {
			return this.store.getCheckedNodes(leafOnly, includeHalfChecked)
		},
		setCheckedNodes (nodes, leafOnly) {
			if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes')
			this.store.setCheckedNodes(nodes, leafOnly)
		},
		getCheckedKeys (leafOnly) {
			return this.store.getCheckedKeys(leafOnly)
		},
		setCheckedKeys (keys, leafOnly) {
			if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedKeys')
			this.store.setCheckedKeys(keys, leafOnly)
		},
		setChecked (data, checked, deep) {
			this.store.setChecked(data, checked, deep)
		},
		getHalfCheckedNodes () {
			return this.store.getHalfCheckedNodes()
		},
		getHalfCheckedKeys () {
			return this.store.getHalfCheckedKeys()
		},
		getCurrentKey () {
			if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in getCurrentKey')
			const currentNode = this.getCurrentNode()
			return currentNode ? currentNode[this.nodeKey] : null
		},
		getCurrentNode () {
			const currentNode = this.store.getCurrentNode()
			return currentNode ? currentNode.data : null
		},
		setCurrentNode (node) {
			if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentNode')
			this.store.setUserCurrentNode(node)
		},
		setCurrentKey (key) {
			if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentKey')
			this.store.setCurrentNodeKey(key)
		},
		getNode (data) {
			return this.store.getNode(data)
		},
		remove (data) {
			this.store.remove(data)
		},
		// @TODO 没有进行去重处理
		append (data, parentNode) {
			this.store.append(data, parentNode)
		},
		insertBefore (data, refNode) {
			this.store.insertBefore(data, refNode)
		},
		insertAfter (data, refNode) {
			this.store.insertAfter(data, refNode)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.wind-tree {
	position: relative
	&__empty-block {
		text-align: center
		color: $wind-tree-empty-text-color
		margin-top: 50px
	}
}
</style>
<style lang="stylus">
.wind-tree__highlight-current {
	.wind-tree-node__title {
		&:hover {
			background-color: #e6f7ff
		}
	}
}
</style>
