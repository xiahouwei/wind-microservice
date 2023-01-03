<template>
	<w-collapse v-model="collapseVisible" title="关联设置">
		<el-form size="mini" inline>
			<fx-details-form-row>
				<el-form-item slot="left" label="存放仓库设置：">
					<el-tooltip content='品项类型仅为菜品时，无法进行该设置' placement="top" :disabled='!storeSettingAvailable'>
						<div>
							<el-button
								ref="storeSetting"
								type="primary"
								v-fx-tab:focus.locationSetting
								@click="onStoreSetting"
								:disabled='storeSettingAvailable || disabled'
							>设置存放仓库</el-button>
						</div>
					</el-tooltip>
				</el-form-item>
				<el-form-item slot="right" label="默认存放货位设置：">
					<el-button
						ref="locationSetting"
						type="primary"
						v-fx-tab:loop.basic-archives_item-manage_details.connectSetting
						@click="onLocationSetting"
						:disabled='disabled'
					>设置默认存放货位</el-button>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
		<connectStoreDialog ref="connectStoreDialog"></connectStoreDialog>
		<connectLocationDialog ref="connectLocationDialog"></connectLocationDialog>
	</w-collapse>
</template>
<script>
import connectStoreDialog from '../connect-container/connect-store.vue'
import connectLocationDialog from '../connect-container/connect-location.vue'
export default {
	name: 'connectSetting',
	components: {
		connectStoreDialog,
		connectLocationDialog
	},
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		disabled: Boolean
	},
	data () {
		return {
			collapseVisible: false
		}
	},
	computed: {
		storeSettingAvailable () {
			return JSON.stringify(this.organDetails.itemCategoryListSelect) === JSON.stringify([1])
		}
	},
	methods: {
		onStoreSetting () {
			if (!this.organDetails.id) {
				this.$fxMessage.warning('请先保存品项')
				return false
			}
			this.$refs.connectStoreDialog.open(this.organDetails)
		},
		onLocationSetting () {
			if (!this.organDetails.id) {
				this.$fxMessage.warning('请先保存品项')
				return false
			}
			this.$refs.connectLocationDialog.open(this.organDetails)
		},
		isCollapse () {
			return this.collapseVisible
		},
		defaultFocus () {
			this.$fxUtils.vDoRefFocus(this, 'storeSetting')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
