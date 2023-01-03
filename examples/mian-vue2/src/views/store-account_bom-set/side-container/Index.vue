<template>
	<div class="sideContainer">
		<el-radio-group v-model="type" size="medium" class="typeContainer" @change='onTypeChange'>
			<el-radio-button
				v-for="item in computedRadioList"
				:key="item.id"
				:label="item.label"
				border
			>{{item.name}}</el-radio-button>
		</el-radio-group>
		<div class="border">
			<treeContainer
				ref="classTreeContainer"
				class="tree"
				:data="typeTreeData"
				readonly
				@on-tree-item-click="getItem"
			></treeContainer>
		</div>
		<div class="border">
			<treeContainer
				ref="itemTreeContainer"
				class="tree"
				:data="itemTreeData"
				:defaultProps="bomTreeDefaultProps"
				:type='type'
				:canAdd="computedAuth.addAuth"
				:canEdit="computedAuth.editAuth"
				:canDelete="computedAuth.delAuth"
				virtual
				@refresh='itemTreeContainerRefresh'
				@on-tree-item-click="showBom"
			></treeContainer>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
import treeContainer from '@/components/tree-container/tree-bom/Index.vue'
export default {
	name: 'sideContainer',
	components: {
		treeContainer
	},
	data () {
		return {
			typeTreeData: [],
			itemTreeData: [],
			type: 'food_bom',
			bomTreeDefaultProps: {
				children: 'bomList',
				label: 'name',
				related: 'related'
			},
			pre_type: 'food_bom',
			radioList: [
				{
					id: 'food_bom',
					label: 'food_bom',
					name: '菜品/商品',
					auth: 'basic-archives_bom-set_food-bom'
				},
				{
					id: 'compose_bom',
					label: 'compose_bom',
					name: '组合',
					auth: 'basic-archives_bom-set_compose-bom'
				},
				{
					id: 'split_bom',
					label: 'split_bom',
					name: '拆分',
					auth: 'basic-archives_bom-set_split-bom'
				}
			]
		}
	},
	props: {
		bomDetail: Object
	},
	computed: {
		...mapGetters(['detailsAuthGetter', 'moduleAuthGetter']),
		foodBomAuth () {
			return this.moduleAuthGetter('basic-archives_bom-set_food-bom')
		},
		composeBomAuth () {
			return this.moduleAuthGetter('basic-archives_bom-set_compose-bom')
		},
		splitBomAuth () {
			return this.moduleAuthGetter('basic-archives_bom-set_split-bom')
		},
		computedRadioList () {
			return this.radioList.filter(item => {
				return this.moduleAuthGetter(item.auth)
			})
		},
		computedAuth () {
			const authObj = {
				food_bom: {
					addAuth: false,
					editAuth: this.detailsAuthGetter('basic-archives_bom-set_food-bom.edit-food-bom'),
					delAuth: false
				},
				compose_bom: {
					addAuth: this.detailsAuthGetter('basic-archives_bom-set_compose-bom.add-compose-bom'),
					editAuth: this.detailsAuthGetter('basic-archives_bom-set_compose-bom.edit-compose-bom'),
					delAuth: this.detailsAuthGetter('basic-archives_bom-set_compose-bom.delete-compose-bom')
				},
				split_bom: {
					addAuth: this.detailsAuthGetter('basic-archives_bom-set_split-bom.add-split-bom'),
					editAuth: this.detailsAuthGetter('basic-archives_bom-set_split-bom.edit-split-bom'),
					delAuth: this.detailsAuthGetter('basic-archives_bom-set_split-bom.delete-split-bom')
				}
			}
			return authObj[this.type] || {}
		}
	},
	mounted () {
		this.initType()
		this.initTree().then(() => {
			// 初始发送空值，默认查出全部品项
			this.getItem('qb- ')
		})
	},
	methods: {
		initType () {
			if (this.foodBomAuth) {
				this.type = 'food_bom'
			} else if (!this.foodBomAuth && this.composeBomAuth) {
				this.type = 'compose_bom'
			} else if (!this.foodBomAuth && !this.composeBomAuth && this.splitBomAuth) {
				this.type = 'split_bom'
			} else {
				this.type = ''
			}
			this.$emit('onTypeChange', this.type)
		},
		initTree () {
			return this.$fxApi('bom.getTypeTree', this.type).then(res => {
				this.typeTreeData = [res]
				this.itemTreeData = []
				return Promise.resolve()
			})
		},
		getItem (e) {
			const id = e.split('-')[1]
			this.itemTypeId = id
			this.$refs.itemTreeContainer.clearSearchInput()
			this.getListData(id)
		},
		getListData (id) {
			return this.$fxApi('bom.getBomTree', this.type, id).then(res => {
				this.itemTreeData = res
				return Promise.resolve(res)
			})
		},
		onTypeChange (e) {
			this.initTree().then(() => {
			// 初始发送空值，默认查出全部品项
				this.getItem('qb- ')
			})
			this.$refs.classTreeContainer.clearSearchInput()
			this.$refs.itemTreeContainer.clearSearchInput()
			this.$emit('onTypeChange', e)
		},
		updateItemTree (type) {
			this.getListData(this.itemTypeId).then(res => {
				if (type === 'del') {
					let flag = false
					for (const item of res) {
						if (item.bomList) {
							for (const bom of item.bomList) {
								if (bom.id === this.bomDetail.id) {
									flag = true
									break
								}
							}
						}
					}
					if (!flag) {
						this.$emit('initBomDetail')
					}
				}
			})
		},
		showBom (e, item) {
			if (item.nodeFlag === 'bom') {
				this.$fxApi('bom.getBomDetail', this.type, item.id).then(res => {
					this.$emit('refreshBomDetail', res)
				})
			}
		},
		itemTreeContainerRefresh (id, type) {
			if (type === 'add') {
				this.$emit('getRefresh', id)
			}
			this.updateItemTree(type)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.sideContainer {
	width 240px
}
.border {
	border 1px solid #eee
	margin 4px 0 8px
	height calc((100% - 60px) / 2)
	overflow: auto
	.tree {
		height 100%
		>>>.organ-manage-tree {
			width 100%
		}
	}
}
.typeContainer {
	margin-left 10px
	height 34px
	>>>.el-radio-button__inner {
		width 75px
		padding: 6px 0;
	}
}
>>>.el-radio {
	margin-right 0
}
.first-radio {
	>>>.el-radio-button__inner{
		border-left: 1px !important;
		border-radius: 4px 0 0 4px;
	}
}
</style>
