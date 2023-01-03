<template>
	<el-container class="app-container">
		<appMenu ref="menu" v-show="showMenu"></appMenu>
		<el-container direction="vertical">
			<div class="app-header">
				<fx-app-tabs
					:value="currentTab"
					:tabsList="tabsList"
					class="app-header__tabs"
				></fx-app-tabs>
			</div>
			<div class="app-margin"></div>
			<div v-show="appContainerVisible.default" class="app-content">
				<keep-alive :include="$fxAppTabs.getKeepAliveTabsNameList()">
					<router-view v-if="$route.meta.keepAlive" :key="$fxAppTabs.getKeepAliveTabRouteViewKey($route)"></router-view>
				</keep-alive>
				<router-view v-if="!$route.meta.keepAlive" :key="$fxAppTabs.getTabRouteViewKey($route)"></router-view>
			</div>
			<fx-teleport-father
				v-show="appContainerVisible.report"
				class="app-content"
				teleportKey="report"
			></fx-teleport-father>
		</el-container>
		<div v-show="showMenu" :class="['app-container__slide-collapse-btn', 'fx-cursor', {
			'is-collapsed': menuCollapse
		}]" @click="onCollapseBtnClick">
			<i :class="['slide-collapse-btn__arrow', menuCollapse?'el-icon-arrow-left':'el-icon-arrow-right']"></i>
		</div>
	</el-container>
</template>
<script>
import { mapState } from 'vuex'
import appMenu from './components/Menu.vue'
export default {
	name: 'app-main',
	components: {
		appMenu
	},
	data () {
		return {
			menuCollapse: true
		}
	},
	computed: {
		...mapState({
			appMenuHiddenFlag: state => state.system.appMenuHiddenFlag,
			tabsList: state => state.appTabs.tabsList,
			currentTab: state => state.appTabs.currentTab,
			appContainerVisible: state => state.appTabs.appContainerVisible
		}),
		showMenu () {
			return !this.appMenuHiddenFlag
		}
	},
	watch: {
		'$route.fullPath': {
			handler (val, oldVal) {
				this.$fxAppTabs.onRouteChange(val, oldVal)
			},
			immediate: true
		}
	},
	created () {
		this.$fxEventBus.initEvent(this, 'ebs-menu-hidden', this.menuHiddenHandler)
		this.$fxEventBus.initEvent(this, 'ebs-menu-active', this.menuActiveHandler)
		this.syncAreaData()
	},
	methods: {
		syncAreaData () {
			return this.$store.dispatch('syncAreaData')
		},
		menuHiddenHandler (flag) {
			this.$store.commit('SET_SYSTEM', {
				appMenuHiddenFlag: flag
			})
		},
		menuActiveHandler (menuId) {
			this.$refs.menu.setCurrentMenuActive(menuId)
		},
		onCollapseBtnClick () {
			this.menuCollapse = !this.menuCollapse
			this.$refs.menu.collapse(this.menuCollapse)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.app-container {
	height: 100%
	overflow:auto
	.app-header {
		display: flex
		padding-top: 10px
		&__tabs {
			flex: 1
		}
	}
	.app-margin {
		background-color: $fxGray2
		height: 5px
	}
	.app-content {
		flex: 1
		display:flex
		overflow-y:hidden
		overflow-x:auto
		background-color: $fxWhite
		box-sizing: border-box;
		position: relative
	}
	&__slide-collapse-btn {
		position: absolute;
		width: 26px;
		height: 26px;
		background-color: $fxDefaultColor;
		bottom: 50px;
		left: 49px;
		border-radius: 16px;
		border: 3px solid $fxWhite;
		transition: left 0.2s ease 0s;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 20
		&.is-collapsed {
			left: 109px;
		}
		.slide-collapse-btn__arrow {
			color: $fxWhite
			font-size: 14px
		}
	}
}
</style>
