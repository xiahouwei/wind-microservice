<template>
	<el-aside class="app-slide" :width="menuWidthComputed">
		<div :index="homeMenu.id" @click="onMenuClick(homeMenu)" :class="['logo-menu-container', {'is-hover':menuHoverFlag}]">
			<img :src="logoImgSrc" class="logo-img">
			<el-tooltip :content="tenantName" placement="top">
				<span class="logo-title fx-ellipsis">{{tenantName}}</span>
			</el-tooltip>
		</div>
		<el-menu
			:default-active="menuActive"
			unique-opened
			collapse
			:background-color="appVarsty.menuBackgroundColor"
			:text-color="appVarsty.menuTextColor"
			:active-text-color="appVarsty.menuActiveTextColor"
			menu-trigger="hover"
			:class="['app-slide__menu', 'fx-custom-scroll', {
				'is-collapse': menuHoverFlag
			}]"
		>
			<template v-for="(item, index) in menuList">
				<el-submenu
					v-if="Array.isArray(item.child) && item.child.length>0 && moduleAuthGetter(item.id, item.authType || item.type)"
					:key="index"
					:index="item.id"
					popper-class="sub-menu-popper"
				>
					<div slot="title" class="menu-item">
						<w-icon :type="`${item.icon}-shallow`" class="menu-icon is-shallow"></w-icon>
						<w-icon :type="item.icon" class="menu-icon"></w-icon>
						<span v-show="menuHoverFlag" class="menu-label">{{item.shortTitle}}</span>
					</div>
					<div class="sub-menu-container">
						<div class="sub-menu-title">{{item.title}}</div>
						<template v-for="(childItem, childIndex) in item.child">
							<el-menu-item
								v-if="moduleAuthGetter(childItem.authRelation || childItem.id,  childItem.authType || childItem.type) && !(Array.isArray(childItem.child) && childItem.child.length>0)"
								:key="childIndex"
								:index="childItem.id"
								class="sub-menu-item"
								@click="onMenuClick(childItem)"
							>{{childItem.title}}</el-menu-item>
							<el-submenu
								v-if="moduleAuthGetter(childItem.authRelation || childItem.id, childItem.authType || childItem.type) && (Array.isArray(childItem.child) && childItem.child.length>0)"
								:key="childIndex"
								:index="childItem.id"
								popper-class="sub-menu-popper"
								popper-append-to-body
								class="third-menu__parent"
							>
								<span slot="title" class="sub-menu-item">{{childItem.title}}</span>
								<template v-for="(subItem, subIndex) in childItem.child">
									<el-menu-item
										v-if="moduleAuthGetter(subItem.authRelation || subItem.id, subItem.authType || subItem.type)"
										:key="subIndex"
										:index="subItem.id"
										class="sub-menu-item"
										@click="onMenuClick(subItem)"
									>{{subItem.title}}</el-menu-item>
								</template>
							</el-submenu>
						</template>
					</div>
				</el-submenu>
				<el-menu-item
					v-if="!Array.isArray(item.child) && moduleAuthGetter(item.id, item.authType || item.type)"
					:key="index"
					:index="item.id"
					popper-class="sub-menu-popper"
					@click="onMenuClick(item)"
				>
					<div class="menu-item">
						<w-icon :type="`${item.icon}-shallow`" class="menu-icon is-shallow"></w-icon>
						<w-icon :type="item.icon" class="menu-icon"></w-icon>
						<span v-show="menuHoverFlag" class="menu-label">{{item.shortTitle}}</span>
					</div>
				</el-menu-item>
			</template>
		</el-menu>
		<div class="logout" @click="onLogout">
			<el-tooltip content="退出登录" placement="top" class="log-icon">
				<w-icon type="logout-new" width="14px" height="14px"></w-icon>
			</el-tooltip>
			<el-tooltip :content="employeeName" placement="top">
				<div v-show="menuHoverFlag" class="employeeName">{{employeeName}}</div>
			</el-tooltip>
		</div>
	</el-aside>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import MENU_LIST_CONFIG, { HOME_MENU } from '@/config/menu_list_config.js'
const DEFAULT_MENU = 'home'
const defaulLogoImg = require('@/assets/images/img/logo.png')
export default {
	name: 'app-menu',
	data () {
		return {
			homeMenu: HOME_MENU,
			menuList: MENU_LIST_CONFIG,
			menuActive: '',
			menuHoverFlag: true
		}
	},
	created () {
		this.setCurrentMenuActive()
	},
	watch: {
		$route () {
			this.setCurrentMenuActive()
		}
	},
	computed: {
		...mapState({
			username: state => state.loginer.username,
			hostname: state => state.loginer.hostname,
			employeeName: state => state.loginer.employeeName,
			appVarsty: state => state.stylusDynamic.appVarsty,
			logoImg: state => state.auth.tenantInfo.logoImg,
			tenantName: state => state.auth.tenantInfo.name
		}),
		...mapGetters(['moduleAuthGetter']),
		menuWidthComputed () {
			return this.menuHoverFlag ? '120px' : '60px'
		},
		logoImgSrc () {
			return this.logoImg || defaulLogoImg
		}
	},
	methods: {
		onMenuClick (item) {
			switch (item.type) {
			case 'report':
				this.$fxLogger.menuInfo(item.title)
				this.$fxAppTabs.tabsPush({
					path: item.path,
					query: {
						reportId: item.id,
						t: Date.now()
					}
				})
				break
			case 'reportNew':
				if (this.$route.name !== item.path) {
					this.$fxLogger.menuInfo(item.title)
					this.$fxAppTabs.tabsPush({
						path: item.path
					})
				}
				break
			case 'biubiuorder':
				this.$fxLogger.menuInfo(item.title)
				this.$fxAppTabs.tabsPush({
					path: item.path,
					query: {
						...item.query,
						biubiuorderId: item.id,
						t: Date.now()
					}
				})
				break
			case 'productionManage':
				this.$fxLogger.menuInfo(item.title)
				this.$router.push({ path: item.path, query: { ...item.query, t: Date.now(), productionManageId: item.id } })
				break
			default:
				if (this.$route.name !== item.path) {
					this.$fxLogger.menuInfo(item.title)
					this.$fxAppTabs.tabsPush(item.path)
				}
			}
		},
		setCurrentMenuActive (id) {
			const menuId = id || this.$route.query.reportId || this.$route.query.biubiuorderId || this.$route.query.productionManageId
			if (menuId) {
				this.menuActive = menuId
				return false
			}
			const pathName = this.$route.name
			const parentMenuPath = this.$route.meta.parentMenuPath || ''
			const menuListFlatten = this.$fxUtils.arrFlatten(this.menuList, item => {
				return item.child
			})
			this.menuActive = (menuListFlatten.find(item => {
				return item.path === pathName || item.path === parentMenuPath
			}) || {}).id || DEFAULT_MENU
		},
		onLogout () {
			this.$fxConfirm('是否确定退出登录？').then(() => {
				return this.$fxApi('auth.logout').then(res => {
					this.$fxRouter.routeLoginPage()
					this.$fxAppTabs.clear()
				})
			})
		},
		collapse (flag) {
			this.menuHoverFlag = flag
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.app-slide {
	text-align: left
	overflow-x: hidden
	display: flex
	flex-direction: column
	transition: width 0.2s ease 0s;
	position: relative
	.logo-menu-container {
		height: 120px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: -10px;
		width: 60px !important
		transition: width 0.2s ease 0s;
		background-color: $fxBlack4
		color: $fxWhite
		cursor: pointer
		span {
			width: 100%
		}
		&.is-hover {
			width: 120px !important
		}
		.logo-img {
			width: 48px
			height: 48px
		}
		.logo-title {
			display: inline-block
			width: 90%
			height: 30px
			line-height: 30px
			visibility: visible;
		}
	}
	&__menu {
		height: 100%
		width: 60px
		transition: width 0.2s ease 0s;
		overflow: auto;
		overflow-x: hidden;
		&.is-collapse {
			width: 120px
		}
		.menu-item {
			.menu-icon {
				margin-right 10px
			}
			.menu-label {
				display: inline-block
				width: 60px
				height: 30px
				line-height: 30px
				visibility: visible;
			}
		}
		.el-submenu {
			&.is-active {
				border-left: 4px solid $fxDefaultColor !important
				box-sizing: border-box;
				>>>.el-submenu__title {
					background-color: $fxWhite !important
					color: $fxDefaultColor !important
				}
				.menu-icon:not(.is-shallow) {
					display: none
				}
			}
			&:not(.is-active) {
				.is-shallow {
					display: none
				}
			}
		}
		.el-menu-item {
			&.is-active {
				border-left: 4px solid $fxDefaultColor !important
				box-sizing: border-box;
				background-color: $fxWhite !important
				color: $fxDefaultColor !important
				.menu-icon:not(.is-shallow) {
					display: none
				}
			}
			&:not(.is-active) {
				.is-shallow {
					display: none
				}
			}
		}
	}
}
.logout {
	height 50px
	border-top 2px solid rgb(39,39,46)
	background rgb(49,49,57)
	color #fff
	display flex
	align-items center
	justify-content: center;
}
.log-icon {
	cursor pointer
	margin-left 10px
	margin-right 10px
}
.employeeName {
	text-overflow:ellipsis;
	white-space:nowrap;
	overflow:hidden;
	width 90px
}

</style>
<style lang="stylus">
@import '~$assets/stylus/varsty.styl'
.sub-menu-popper {
	width: 180px
	box-sizing: border-box
	&>ul {
		background-color: $fxWhite !important
		padding: 0
		min-width: 180px !important;
	}
	.sub-menu-container {
		font-size: 14px;
		overflow: hidden;
		display: flex
		flex-direction: column
		width: 180px
		box-sizing: border-box
		background-color: $fxGray7
	}
	.sub-menu-title{
		color: $fxBlack1;
		font-weight: bold
		padding-left: 20px
		height: 24px;
		line-height: 24px;
		margin: 20px 0;
	}
	.sub-menu-item {
		display: inline-block;
		color: $fxGray6 !important
		border-left: 0!important
		height: 40px;
		line-height: 40px;
		padding-left: 20px !important
		box-sizing: border-box
		background-color: $fxGray7 !important
		width: 100%;
		&.is-active, &:hover {
			background: none!important
			font-weight: bold
			color: $fxDefaultColor !important;
			background-color: $fxBlue8 !important
		}
	}
	.third-menu__parent {
		display: inline-block;
		color: $fxGray6 !important
		border-left: 0!important
		height: 40px;
		line-height: 40px;
		box-sizing: border-box
		background-color: $fxGray7 !important
		.el-submenu__title {
			color: $fxGray6 !important
			border-left: 0!important
			height: 40px;
			padding: 0 !important;
			line-height: 40px;
			box-sizing: border-box
			background-color: $fxGray7 !important
			.sub-menu-item {
				padding-left: 0
			}
		}
	}
}
.logo-menu-container_popover {
	border: 1px solid red
	padding: 10px
	text-align: center
}
</style>
