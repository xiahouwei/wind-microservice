<template>
	<div class="tree-container">
		<component
			ref="tree"
			:is="currentTreeComponent"
			:treeData="treeData"
			:showCheckbox="showCheckbox"
			:showTreeWidthExtendBtn="showTreeWidthExtendBtn"
			:defaultFiter="defaultFiter"
			:defaultProps='defaultProps'
			@node-click="onTreeItemClick"
			:tipFormatter="tipFormatter"
			@check="onTreeCheck"
			:defaultExpandAll='true'
		>
			<template v-if="!readonly && ((data.nodeFlag==='bom' && (canEdit || canDelete)) || canAdd) && !data.productionMethod" slot-scope="{ data, activeTreeItemId }">
				<el-popover placement="right" trigger="hover" popper-class="fx-tree-tools-popover">
					<w-link
						v-show="data.nodeFlag==='item'"
						icon="tree-node-add"
						type="default"
						:inline="false"
						@click="onTreeAddClick(data)"
					>添加</w-link>
					<w-link
						v-show="data.nodeFlag==='bom' && canEdit"
						icon="tree-node-edit"
						type="default"
						:inline="false"
						@click="onTreeEditClick(data)"
					>编辑</w-link>
					<w-link
						v-show="data.nodeFlag==='bom' && canDelete"
						icon="tree-node-delete"
						type="default"
						:inline="false"
						@click="onTreeDelClick(data)"
					>删除</w-link>
					<w-icon
						slot="reference"
						v-show="activeTreeItemId===data.id"
						type="tree-node-tools"
						class="tree-node-tools-btn"
						pointer
						stop
					></w-icon>
				</el-popover>
			</template>
		</component>
		<createDailog ref="createDailog" @refresh="onUpdate" :type='type'></createDailog>
	</div>
</template>
<script>
import createDailog from './CreateItem.vue'
export default {
	name: 'treeContainer',
	components: {
		createDailog
	},
	props: {
		readonly: Boolean,
		data: {
			type: Array,
			default: () => {
				return []
			}
		},
		showCheckbox: Boolean,
		showTreeWidthExtendBtn: {
			type: Boolean,
			default: false
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
		type: String,
		canAdd: {
			type: Boolean,
			default: true
		},
		canEdit: {
			type: Boolean,
			default: true
		},
		canDelete: {
			type: Boolean,
			default: true
		},
		virtual: Boolean
	},
	data () {
		return {
			treeData: []
		}
	},
	computed: {
		currentTreeComponent () {
			return this.virtual ? 'fx-tree-virtual' : 'fx-tree'
		}
	},
	watch: {
		data: {
			immediate: true,
			handler (val) {
				this.treeData = val
			}
		}
	},
	methods: {
		onTreeAddClick (data) {
			this.$refs.createDailog.add(data)
		},
		onTreeEditClick (data) {
			const cloneData = this.$fxUtils.deepClone(data)
			this.$refs.createDailog.edit(cloneData)
		},
		onTreeDelClick (data) {
			this.$fxConfirm('确定删除当前BOM？').then(() => {
				this.onBomDelHandler(data.id, data.code, data.name)
			})
		},
		onBomDelHandler (id, code, name) {
			const logger = this.$fxLogger.createInfo('basic-archives.bom.delete', { code, name })
			return this.$fxApi('bom.deleteBom', this.type, id)({ logger }).then(res => {
				this.onUpdate('', 'del')
				return Promise.resolve(res)
			})
		},
		getTreeLv (data) {
			if (data.treeType === 'root') {
				return ''
			} else {
				return `${data.organLevel}-${data.id}`
			}
		},
		onTreeItemClick (data, node) {
			this.$emit('on-tree-item-click', this.getTreeLv(data), data)
		},
		getCurrentNode () {
			return this.$refs.tree.getCurrentNode()
		},
		getCurrentNodeTreeLv () {
			const node = this.$refs.tree.getCurrentNode()
			return node ? this.getTreeLv(node) : ''
		},
		onTreeCheck (data, treeCheckData) {
			this.$emit('check', data, treeCheckData)
		},
		clearSearchInput () {
			this.$refs.tree.clearSearchInput()
		},
		onUpdate (id, type = 'add') {
			return this.$emit('refresh', id, type)
		},
		updateTreeChild () {
			this.$refs.tree.updateTreeChild()
		},
		defaultFiter () {
			return this.showAll
		},
		tipFormatter (data) {
			const code = data.code ? `(${data.code})` : ''
			return `${data.name}${code}`
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.tree-container {
	display: flex
}
.tree-node-tools-btn {
	margin-top 6px
}
>>>.organ-manage-tree__bottom {
	margin-bottom 0
}
</style>
<style lang="stylus">
.fx-tree-tools-popover {
	min-width: 90px
}
</style>

