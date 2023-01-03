<template>
	<w-tabs
		ref="tabsRef"
		:value="currentTab"
		type="card"
		class="fx-app-tabs"
		:beforeTabClick="beforeTabClick"
		@tab-click="onTabClick"
		@tab-remove="onTabRemove"
	>
		<el-tab-pane
			v-for="item in tabsList"
			:key="item.name"
			:label="formatterTabName(item.title)"
			:name="item.name"
			:closable="item.closable"
			>
		</el-tab-pane>
	</w-tabs>
</template>
<script>
/**
 * @name fx-app-tabs
 * @desc 应用分页交互
 * @author shw
 * @date 2022/07/29
 *
 * @param {string} value - 当前分页
 * @param {Array} tabsList - 分页队列
 */
const TAB_NAME_MAX_COUNT = 10
export default {
	name: 'fx-app-tabs',
	props: {
		value: String,
		tabsList: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data () {
		return {
			currentTab: ''
		}
	},
	watch: {
		value: {
			handler (val) {
				this.currentTab = val
			},
			immediate: true
		},
		currentTab (val) {
			this.$emit('input', val)
		}
	},
	mounted () {
		this.$refs.tabsRef.$el.addEventListener('mouseover', () => {
			let { id } = event.target
			if (id) {
				id = this.normalizationId(id)
				event.target.title = this.$fxAppTabs.getTabTitle(id)
			}
		})
		this.$fxContextMenu.init(this.$refs.tabsRef.$el, {
			menuList: [{
				label: '关闭',
				click: (contextEvent) => {
					const id = this.normalizationId(contextEvent.target.id)
					const tab = this.tabsList.find(item => item.name === id && item.closable)
					if (tab) {
						this.$fxAppTabs.tabsRemove(id)
					}
				}
			}, {
				label: '关闭右侧',
				click: (contextEvent) => {
					const id = this.normalizationId(contextEvent.target.id)
					const tabIndex = this.tabsList.findIndex(item => item.name === id && item.closable)
					if (tabIndex !== this.tabsList.length - 1 && ~tabIndex) {
						this.$fxAppTabs.tabsRemoveRightMulity(tabIndex)
					}
				}
			}],
			beforeShow: (contextEvent) => {
				const id = this.normalizationId(contextEvent.target.id)
				const index = this.tabsList.findIndex(item => item.name === id && item.closable)
				return ~index
			}
		})
	},
	methods: {
		formatterTabName (name) {
			const tabName = decodeURIComponent(name)
			return tabName.length > TAB_NAME_MAX_COUNT ? `${tabName.substring(0, TAB_NAME_MAX_COUNT)}...` : tabName
		},
		onTabClick ({ paneName }) {
			this.$fxAppTabs.tabsPush(paneName, false)
		},
		onTabRemove (removeName) {
			this.$fxAppTabs.tabsRemove(removeName)
		},
		beforeTabClick () {
			return this.$fxAppTabs.doTabsBeforeDeactivatedGenerator()
		},
		normalizationId (id) {
			return id.replace(/^tab-/, '')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-app-tabs {
	overflow: hidden
	>>>.el-tabs__header {
		border-bottom: none
		margin: 0
		.el-tabs__nav {
			border: none
		}
	}
	>>>.el-tabs__item {
		font-size: 12px
		border-bottom: none
		border-left: none !important
		position: relative
		&:hover {
			color: #333333
		}
		&::before {
			content: '';
			width: 1px;
			height: 20px;
			background-color: #e4e7ed;
			position: absolute;
			top: 10px;
			left: 0px;
		}
		&.is-active {
			background-color: #f4f8fc
			border-top-left-radius: 10px
			border-top-right-radius: 10px
			color: #333333
			&::before {
				display:none
			}
			&+.el-tabs__item::before {
				display:none
			}
			&.is-focus {
				box-shadow: none
				border-top-left-radius: 10px;
				border-top-right-radius: 10px;
			}
		}
	}
}
</style>

