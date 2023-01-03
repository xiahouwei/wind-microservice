<template>
	<div class="organ-manage-tree" :class="treeContainerClass">
		<div v-show="showTreeSearchBar" class="organ-manage-tree__searchBar">
			<w-input
				v-model="treeSearchKey"
				placeholder="请输入内容"
				prefix-icon="el-icon-search"
				size="mini"
				class="organ-manage-tree__searchBar-input"
				@keyup.enter.native="onSearchInputEnter"
				@input="onSearchInput">
			</w-input>
			<transition name="el-zoom-in-top">
				<div v-show="warningShow" class="organ-manage-tree__searchBar-warning">无符合条件的内容！</div>
			</transition>
			<w-icon
				type="tree-search-arrow-left"
				class="tree-search-arrow-icon"
				pointer
				@click="onTreeSearchArrowClick('pre')"
			></w-icon>
			<w-icon
				type="tree-search-arrow-right"
				class="tree-search-arrow-icon"
				pointer
				@click="onTreeSearchArrowClick('next')"
			></w-icon>
			<w-icon
				v-show="showTreeWidthExtendBtn"
				:type="treeContainerExtendFlag?'tree-width-extend':'tree-width-unextend'"
				class="tree-width-icon"
				pointer
				@click="onTreeContainerExtendClick"
			></w-icon>
		</div>
		<w-tree-virtual
			ref="organTree"
			:data="currentTreeData"
			:props="defaultProps"
			:expand-on-click-node="false"
			:filter-node-method="treeFilterNode"
			:default-checked-keys="defaultCheckedKeys"
			:default-expand-all="defaultExpandAll"
			:auto-expand-parent="false"
			:default-expanded-keys="defaultExpanedeKeys"
			:defaultFiter="defaultFiter"
			node-key="id"
			highlight-current
			class="organ-manage-tree__container"
			:class="{'is-extend': treeContainerExtendFlag}"
			@node-click="onTreeItemClick"
			@node-expand="onNodeExpand"
			@node-collapse="onNodeCollapse"
			@check-change="onTreeCheckChange"
			@check="onTreeCheck"
			@current-change="onCurrentChange"
		>
			<div
				:ref="`ref-node-item-${data.id}`"
				:class="{
					'is-filter-tree-node': isSearchFilterTreeNode(data),
					'is-filter-tree-node-acitve': searchFilterTreeNodeList[searchFilterTreeIndex]&&searchFilterTreeNodeList[searchFilterTreeIndex].id===data.id
				}"
				class="organ-manage-tree__node-item"
				slot-scope="{ data, activeTreeItemId }"
			>
				<w-icon
					v-if="showTreeNodeIcon"
					:type="treeNodeIconComputed(data)"
				></w-icon>
				<el-tooltip :content="tipFormatter?tipFormatter(data):data[defaultProps.label]" placement="top-start" offset="-100" :enterable="false">
					<fx-render-dom
						v-if="labelRender"
						:render="labelRender"
						:backValue="data"
					></fx-render-dom>
					<span
						v-else
						class="organ-manage-tree__node-item-label fx-ellipsis safari-tips-hide"
						:class="{'is-extend': treeContainerExtendFlag, 'disable-class': data.related===0}"
					>{{ data[defaultProps.label] }}</span>
				</el-tooltip>
				<slot :data="data" :activeTreeItemId="activeTreeItemId"></slot>
			</div>
		</w-tree-virtual>
		<div class="organ-manage-tree__bottom">
			<slot name="tree-bottom"></slot>
		</div>
	</div>
</template>
<script>
export default {
	name: 'fx-tree-virtual',
	props: {
		treeData: {
			type: Array,
			default: () => {
				return []
			}
		},
		defaultProps: {
			type: Object,
			default: () => {
				return {
					children: 'children',
					label: 'name',
					related: 'related'
				}
			}
		},
		// 过滤方法
		filterNode: Function,
		// 显示树节点icon
		showTreeNodeIcon: Boolean,
		// 自定义树节点icon
		treeNodeIcon: {
			type: [String, Function],
			default: 'organ-type-group'
		},
		// 显示搜索栏
		showTreeSearchBar: {
			type: Boolean,
			default: true
		},
		// 显示展开按钮
		showTreeWidthExtendBtn: {
			type: Boolean,
			default: true
		},
		// 默认勾选
		defaultChecked: {
			type: [Array, Function],
			default: () => {
				return []
			}
		},
		// 搜索prop
		searchProps: {
			type: Array,
			default: () => {
				return ['name', 'code', 'pinYin', 'pinYinList']
			}
		},
		// 是否默认选中第一个元素 或 自定义默认选中元素
		setFirstNode: {
			type: [Boolean, Function],
			default: true
		},
		// 默认过滤
		defaultFiter: Function,
		// 默认展开全部节点  默认为 false
		defaultExpandAll: {
			type: Boolean,
			default: false
		},
		// 节点渲染器
		labelRender: Function,
		// tip格式化
		tipFormatter: Function
	},
	data () {
		return {
			currentTreeData: [],
			treeContainerExtendFlag: false,
			treeSearchKey: '',
			searchFilterTreeIndex: -1,
			defaultCheckedKeys: [],
			defaultExpanedeKeys: [],
			defaultExpanedeKeysMap: {},
			currentKey: '',
			warningShow: false
		}
	},
	computed: {
		treeContainerClass () {
			return {
				'is-extend': this.treeContainerExtendFlag
			}
		},
		treeNodeIconComputed (data, node) {
			return (data, node) => {
				if (typeof this.treeNodeIcon === 'function') {
					return this.treeNodeIcon(data, node)
				} else {
					return this.treeNodeIcon
				}
			}
		},
		isSearchFilterTreeNode (data, node) {
			return (data) => {
				return this.treeSearchKey && this.$fxUtils.fuzzyQueryObj(data, this.treeSearchKey, this.searchProps) && data.visible
			}
		},
		searchFilterTreeNodeList () {
			const treeDataList = this.tree2Array(this.currentTreeData)
			return treeDataList.filter(item => {
				if (this.$refs.organTree) {
					return this.treeSearchKey && this.$fxUtils.fuzzyQueryObj(item, this.treeSearchKey, this.searchProps)
				}
				return this.treeSearchKey && this.$fxUtils.fuzzyQueryObj(item, this.treeSearchKey, this.searchProps)
			})
		}
	},
	watch: {
		treeData: {
			immediate: true,
			handler (val) {
				if (val[0] && !this.$fxUtils.isDef(val[0].id)) {
					val[0].id = ''
				}
				this.currentTreeData = val
				this.setDefaultExpandedKeys(val)
				this.setDefaultChecked(val)
				this.$nextTick(() => {
					if (typeof this.setFirstNode === 'function') {
						const currentKey = this.setFirstNode()
						this.currentKey = currentKey
						this.setCurrentKey(currentKey)
					} else if (this.setFirstNode) {
						this.setFirstNodeSelected(this.currentTreeData)
					}
				})
			}
		}
	},
	methods: {
		getTreeRef () {
			return this.$refs.organTree
		},
		onTreeContainerExtendClick () {
			this.treeContainerExtendFlag = !this.treeContainerExtendFlag
		},
		onTreeItemClick (data, node) {
			this.$emit('node-click', data, node)
		},
		getCurrentNode () {
			return this.$refs.organTree.getCurrentNode()
		},
		onTreeExtendClick (node) {
			node.expanded = !node.expanded
			event.stopPropagation()
		},
		clearSrearchFilterTreeIndex () {
			this.searchFilterTreeIndex = -1
		},
		onSearchInput () {
			this.warningShow = false
			this.searchFilterTreeIndex = -1
			if (this.treeSearchKey === '') {
				this.clearSrearchFilterTreeIndex()
			}
		},
		clearSearchInput () {
			this.treeSearchKey = ''
			this.warningShow = false
		},
		onSearchInputEnter () {
			this.$fxUtils.fxDebounce(400).then(() => {
				if (this.treeSearchKey === '') {
					return false
				}
				if (this.searchFilterTreeNodeList.length === 0) {
					this.warningShow = true
					return false
				}
				if (this.searchFilterTreeNodeList.length === 1 && this.searchFilterTreeIndex === 0) {
					this.expandTreeNode(this.searchFilterTreeNodeList[0])
					this.setCurrentKey(this.searchFilterTreeNodeList[0].id)
					return false
				}
				if (this.searchFilterTreeIndex === this.searchFilterTreeNodeList.length - 1) {
					this.searchFilterTreeIndex = 0
				} else {
					this.searchFilterTreeIndex = this.searchFilterTreeIndex + 1
				}
				const node = this.searchFilterTreeNodeList[this.searchFilterTreeIndex]
				this.expandTreeNode(node)
				this.setCurrentKey(node.id)
				this.$nextTick(() => {
					this.onTreeItemClick(node)
				})
			})
		},
		expandTreeNode (treeNodeData) {
			this.$refs.organTree.doScrollViewByNodeKey(treeNodeData.id)
		},
		scrollTopNode (key) {
			this.$fxUtils.doScrollTop(this.$refs[`ref-node-item-${key}`], 20, this.$refs.organTree.$el)
		},
		tree2Array (tree) {
			return this.$fxUtils.arrFlatten(tree, item => {
				return item[this.defaultProps.children]
			})
		},
		onTreeSearchArrowClick (action) {
			if (this.treeSearchKey === '') {
				return false
			}
			if (this.searchFilterTreeNodeList.length === 0) {
				this.warningShow = true
				return false
			}
			if (this.searchFilterTreeNodeList.length === 1 && this.searchFilterTreeIndex === 0) {
				return false
			}
			if (action === 'next') {
				if (this.searchFilterTreeIndex === this.searchFilterTreeNodeList.length - 1) {
					this.searchFilterTreeIndex = 0
				} else {
					this.searchFilterTreeIndex = this.searchFilterTreeIndex + 1
				}
			} else {
				if (this.searchFilterTreeIndex === 0) {
					this.searchFilterTreeIndex = this.searchFilterTreeNodeList.length - 1
				} else {
					this.searchFilterTreeIndex = this.searchFilterTreeIndex - 1
				}
			}
			const node = this.searchFilterTreeNodeList[this.searchFilterTreeIndex]
			this.expandTreeNode(node)
			this.setCurrentKey(node.id)
			this.$nextTick(() => {
				this.onTreeItemClick(node)
			})
		},
		treeFilterNode (value, data) {
			if (typeof this.filterNode === 'function') {
				return this.filterNode(value, data)
			}
			return true
		},
		setFirstNodeSelected (treeData) {
			if (treeData[0]) {
				const currentKey = treeData[0].id
				this.currentKey = currentKey
				this.setCurrentKey(currentKey)
			} else {
				this.currentKey = ''
			}
		},
		filter (flag) {
			this.$refs.organTree.filter(flag)
			this.resetSearch()
		},
		resetSearch () {
			this.searchFilterTreeIndex = -1
		},
		onTreeCheckChange (data, checked, indeterminate) {
			this.$emit('check-change', data, checked, indeterminate)
		},
		onTreeCheck (data, treeCheckData, flag) {
			this.$emit('check', data, treeCheckData, flag)
		},
		setDefaultChecked (treeData) {
			if (this.$fxUtils.toRawType(this.defaultChecked) === 'Array') {
				this.defaultCheckedKeys = this.defaultChecked
			} else if (this.$fxUtils.toRawType(this.defaultChecked) === 'Function') {
				this.defaultCheckedKeys = this.filterDefaultCheckedKeys(this.$fxUtils.deepClone(treeData), this.defaultChecked).map(item => {
					return item.id
				})
			} else {
				this.defaultCheckedKeys = []
			}
		},
		setDefaultExpandedKeys (treeData) {
			this.defaultExpanedeKeys = treeData.map(item => {
				return item.id
			})
			this.defaultExpanedeKeysMap = {}
			this.defaultExpanedeKeys.forEach(item => {
				this.defaultExpanedeKeysMap[item] = true
			})
		},
		filterDefaultCheckedKeys (treeData, fn) {
			const deepGetChild = function (child, fn) {
				return child.every(item => {
					if (item.children) {
						return fn(item) && deepGetChild(item.children, fn)
					} else {
						return fn(item)
					}
				})
			}
			const list = treeData.reduce((pre, cur) => {
				let child = cur[this.defaultProps.children] || []
				if (fn(cur) && (child.length === 0 || (deepGetChild(child, fn) && child.length > 0))) {
					cur = [cur]
				} else {
					cur = []
				}
				cur = cur.concat(child = this.filterDefaultCheckedKeys(child, fn))
				return pre.concat(cur)
			}, [])
			return list
		},
		getCheckedKeys (leafOnly = false, includeHalfChecked = false, filterFn) {
			let checkeds = this.getTreeRef().getCheckedNodes(leafOnly, includeHalfChecked)
			if (filterFn) {
				checkeds = checkeds.filter(filterFn)
			}
			return checkeds.map(item => {
				return item.id
			})
		},
		getAllCheckedKeys (fn) {
			return this.getCheckedKeys(false, true, fn)
		},
		setCurrentKey (key) {
			return this.$refs.organTree.setCurrentKey(key)
		},
		updateTreeChild (data) {
			return new Promise(resolve => {
				this.currentTreeData = data
				this.defaultExpanedeKeys = Object.keys(this.defaultExpanedeKeysMap)
				this.$nextTick(() => {
					this.setCurrentKey(this.currentKey)
					resolve()
				})
			})
		},
		onNodeExpand (data) {
			this.defaultExpanedeKeysMap[data.id] = true
		},
		onNodeCollapse (data) {
			delete this.defaultExpanedeKeysMap[data.id]
		},
		onCurrentChange (key) {
			this.currentKey = key
		},
		setChecked (data, checked, deep) {
			this.$refs.organTree.setChecked(data, checked, deep)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.organ-manage-tree {
	background-color: $fxWhite
	width: 200px
	display: flex
	flex-direction: column
	transition: width 0.2s
	&.is-extend {
		width: 350px
		transition: width 0.2s
	}
	&__searchBar {
		display: flex
		position: relative
		flex-direction: row
		padding: 0 5px
		align-items: center;
		margin-bottom: 15px
		height: 40px
		&-input {
			flex: 1
		}
		&-warning {
			position: absolute;
			top: 35px;
			color: $fxRed
		}
		.tree-width-icon, .tree-search-arrow-icon {
			margin-left: 5px
			width: 15px
			height: 15px
		}
	}
	&__container {
		flex: 1
		overflow: auto;
		.organ-manage-tree__content {
			display: inline-block
			min-width: 200px
			&.is-extend {
				min-width: 350px;
			}
		}
		.organ-manage-tree__node-item {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding-right: 60px
			&-label {
				overflow: hidden
				max-width: 150px;
				flex: 1;
				&.is-extend {
					max-width: 300px;
				}
			}
			.tree-node-tools-btn {
				width: 20px
				height: 20px
				margin: 0px 5px
			}
		}
		.tree-extend-icon {
			width: 14px
			height: 14px
			margin-right:5px
			margin-left: 5px
			box-sizing: border-box
		}
		.is-filter-tree-node {
			.organ-manage-tree__node-item-label {
				color: $fxDefaultColor
			}
		}
		.is-filter-tree-node-acitve {
			.organ-manage-tree__node-item-label {
				font-weight: 900
				font-size: 13px
			}
		}
	}
	&__bottom {
		margin-bottom 10px
	}
}
.disable-class {
	color: #ccc
}
</style>
