<template>
	<div
		ref="node"
		v-show="node.visible"
		:class="{
			'is-expanded': expanded,
			'is-current': node.isCurrent,
			'is-hidden': !node.visible,
			'is-focusable': !node.disabled,
			'is-checked': !node.disabled && node.checked,
			'show-line-long': showLine && node.childNodes && node.childNodes.length>1,
			'unshow-line-long': !expanded
		}"
		class="wind-tree-node hidden-line"
		role="treeitem"
		tabindex="-1"
		@contextmenu="($event) => this.handleContextMenu($event)"
		@click.stop="handleClick"
	>
		<div
			class="wind-tree-node__title"
			:class="{
			'show-line-short': showLine && node.childNodes && node.childNodes.length===1,
			'unshow-line-short': !expanded}"
		>
			<span v-if="!showLine" :class="{'is-expanded': expanded}" class="wind-tree-node__title-expand-icon">
				<Icon
					v-if="node.childNodes&&node.childNodes.length>0"
					type="tree-expand"
					svg
					stop
					class="expand-icon"
					@click="handleExpandIconClick"
				></Icon>
			</span>
			<span v-else class="wind-tree-node__title-expand-icon-show-line">
				<div
					v-if="node.childNodes&&node.childNodes.length>0"
					class="expand-icon-container"
				>
					<div
						v-if="node.level!==1"
						class="expand-icon-line"
					>
					</div>
					<Icon
						:type="expandIconType"
						stop
						class="expand-icon"
						@click="handleExpandIconClick"
					></Icon>
				</div>
				<div
					v-else
					class="expand-line"
				>
					<span class="line-across"></span>
				</div>
			</span>
			<el-checkbox
				v-if="showCheckbox"
				v-model="node.checked"
				:indeterminate="node.indeterminate"
				:disabled="!!node.disabled"
				class="wind-tree-node__checkbox"
				@click.native.stop
				@change="handleCheckChange"
			>
			</el-checkbox>
			<span
				v-if="node.loading"
				class="el-tree-node__loading-icon el-icon-loading">
			</span>
			<node-content :node="node"></node-content>
		</div>
		<transition name="collapse">
			<div
				v-if="!renderAfterExpand || childNodeRendered"
				v-show="expanded"
				class="wind-tree-node__child"
				role="group"
			>
				<tree-node
					v-for="item in node.childNodes"
					:key="item.id"
					:node="item"
					:props="props"
					:render-after-expand="renderAfterExpand"
					:render-content="renderContent"
					:show-checkbox="showCheckbox"
					@node-expand="handleChildNodeExpand"
				></tree-node>
			</div>
		</transition>
	</div>
</template>
<script>
/**
 * tree-node by shang 2021/5/14
 * @desc tree 树
 * @param {listData}  [Array] - 列表数据
 */
import Icon from '../icon'
import emitter from '../../js/mixins/emitter'
export default {
	name: 'treeNode',
	componentName: 'treeNode',
	components: {
		Icon,
		NodeContent: {
			props: {
				node: {
					required: true
				}
			},
			render (h) {
				h = this.$createElement
				const parent = this.$parent
				const tree = parent.tree
				const node = this.node
				const { data, store } = node
				return typeof parent.renderContent === 'function'
					? parent.renderContent(h, { node, data, store })
					: tree.$scopedSlots.default
						? tree.$scopedSlots.default({ node, data })
						: <span>{ node.data[parent.props.label] }</span>
			}
		}
	},
	mixins: [emitter],
	props: {
		node: {
			type: Object,
			default: () => {
				return {}
			}
		},
		props: {},
		renderContent: Function,
		renderAfterExpand: {
			type: Boolean,
			default: true
		},
		showCheckbox: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			tree: null,
			expanded: false,
			childNodeRendered: false,
			oldChecked: null,
			oldIndeterminate: null,
			showLine: false
		}
	},
	created () {
		const parent = this.$parent
		if (parent.isTree) {
			this.tree = parent
		} else {
			this.tree = parent.tree
		}
		const tree = this.tree
		if (!tree) {
			console.warn('Can not find node\'s tree.')
		}
		const props = tree.props || {}
		const childrenKey = props.children || 'children'
		this.$watch(`node.data.${childrenKey}`, () => {
			this.node.updateChildren()
		})
		if (this.node.expanded) {
			this.expanded = true
			this.childNodeRendered = true
		}
		if (this.tree.accordion) {
			this.$on('tree-node-expand', node => {
				if (this.node !== node) {
					this.node.collapse()
				}
			})
		}
		this.showLine = this.tree.showLine
	},
	computed: {
		expandIconType () {
			return this.expanded ? 'tree-unextend' : 'tree-extend'
		}
	},
	watch: {
		'node.indeterminate' (val) {
			this.handleSelectChange(this.node.checked, val)
		},
		'node.checked' (val) {
			this.handleSelectChange(val, this.node.indeterminate)
		},
		'node.expanded' (val) {
			this.$nextTick(() => {
				this.expanded = val
			})
			if (val) {
				this.childNodeRendered = true
			}
		}
	},
	methods: {
		handleSelectChange (checked, indeterminate) {
			if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
				this.tree.$emit('check-change', this.node.data, checked, indeterminate)
			}
			this.oldChecked = checked
			this.indeterminate = indeterminate
		},
		handleContextMenu (event) {
			if (this.tree._events['node-contextmenu'] && this.tree._events['node-contextmenu'].length > 0) {
				event.stopPropagation()
				event.preventDefault()
			}
			this.tree.$emit('node-contextmenu', event, this.node.data, this.node, this)
		},
		handleClick () {
			const store = this.tree.store
			store.setCurrentNode(this.node)
			this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode)
			this.tree.currentNode = this
			if (this.tree.expandOnClickNode) {
				this.handleExpandIconClick()
			}
			if (this.tree.checkOnClickNode && !this.node.disabled) {
				this.handleCheckChange(null, {
					target: { checked: !this.node.checked }
				})
			}
			this.tree.$emit('node-click', this.node.data, this.node, this)
		},
		handleExpandIconClick () {
			if (this.node.isLeaf) return
			if (this.expanded) {
				this.tree.$emit('node-collapse', this.node.data, this.node, this)
				this.node.collapse()
			} else {
				this.node.expand()
				this.$emit('node-expand', this.node.data, this.node, this)
			}
		},
		handleCheckChange (value, ev) {
			this.node.setChecked(ev.target.checked, !this.tree.checkStrictly)
			this.$nextTick(() => {
				const store = this.tree.store
				this.tree.$emit('check', this.node.data, {
					checkedNodes: store.getCheckedNodes(),
					checkedKeys: store.getCheckedKeys(),
					halfCheckedNodes: store.getHalfCheckedNodes(),
					halfCheckedKeys: store.getHalfCheckedKeys()
				}, value)
			})
		},
		handleChildNodeExpand (nodeData, node, instance) {
			this.broadcast('treeNode', 'tree-node-expand', node)
			this.tree.$emit('node-expand', nodeData, node, instance)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '../../style/varsty.styl'
.wind-tree-node {
	position: relative;
	box-sizing: border-box;
	&.is-current>.wind-tree-node__title {
		background-color: #f0f7ff
	}
	&.show-line-long:before {
		position: absolute;
		left: 12px;
		width: 1px;
		height: calc(100% - 22px)
		margin: 22px 0 0;
		border-left: 1px dashed #d9d9d9;
		content: " ";
		box-sizing: border-box;
		will-change: height
		transition: height .5s
	}
	&.unshow-line-long:before {
		height: 0
	}
	.show-line-short {
		position relative
	}
	.show-line-short:before {
		position: absolute;
		left: 12px;
		width: 1px;
		height: calc(100% - 5px)
		margin: 18px 0 0;
		border-left: 1px dashed #d9d9d9;
		content: " ";
		box-sizing: border-box;
		will-change: height
		transition: height .5s
	}
	.unshow-line-short:before {
		height: 0
	}
	.hidden-line:last-child:not(:first-child):after {
		position: absolute;
		left: -6px;
		top: 0;
		width: 1px;
		height: 100%
		margin: 17px 0 0;
		border-left: 1px solid #fff;
		content: " ";
		box-sizing: border-box;
	}
	&__title {
		display: flex
		height: 24px
		line-height: 24px
		margin: 0;
		white-space: nowrap;
		list-style: none;
		outline: 0;
		padding: 4px 0;
		&-expand-icon {
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
		&-expand-icon-show-line {
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
			.expand-icon-container {
				position relative
				display flex
				width 24px
				height 24px
				align-items center
				justify-content center
				.expand-icon-line {
					position absolute
					left -5px
					width 11px
					height 1px
					border-bottom: 1px dashed #d9d9d9;
				}
				.expand-icon {
					width: 15px
					height: 15px
				}
			}
			.expand-line {
				display flex
				width 30px
				height 24px
				align-items center
				.line-across {
					position relative
					left -5px
					width 30px
					height 1px
					border-bottom: 1px dashed #d9d9d9;
					box-sizing: border-box
				}
			}
		}
	}
	&__checkbox {
		margin-right: 5px
	}
	&__child {
		margin: 0
		padding: 0 0 0 18px
		box-sizing: border-box;
		transition: all .3s;
		overflow: hidden;
	}
}
.collapse-enter-active, .collapse-leave-active {
	max-height: 2500px;
}
.collapse-enter, .collapse-leave-to {
	max-height: 0px;
}
</style>
