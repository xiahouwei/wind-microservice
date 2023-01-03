<template>
	<w-collapse v-model="collapseVisible" title="关联设置">
		<el-form v-if="isOrganType(['store', 'section'])" size="mini" inline class="form-rel">
			<el-form-item label="该机构可管理哪些品项：">
				<el-radio v-model="organDetails.relAllGoods" :label="true" :disabled="disabled">全部品项</el-radio>
				<el-radio v-model="organDetails.relAllGoods" :label="false" :disabled="disabled">自定义</el-radio>
				<transition name="el-zoom-in-center">
					<el-button type="primary" v-show="!organDetails.relAllGoods" @click="onConnectSetting">设置关联品项</el-button>
				</transition>
			</el-form-item>
		</el-form>
		<el-form v-if="isOrganType(['store'])" size="mini" inline>
			<fx-details-form-row>
				<el-form-item label="此机构的默认入库仓库：" slot="left">
					<el-radio v-model="organDetails.defaultInFlag" :label="1" :disabled="!organDetails.enableFlag||disabled">是</el-radio>
					<el-radio v-model="organDetails.defaultInFlag" :label="0" :disabled="!organDetails.enableFlag||disabled">否</el-radio>
				</el-form-item>
				<el-form-item label="此机构的默认出库仓库：" slot="right">
					<el-radio v-model="organDetails.defaultOutFlag" :label="1" :disabled="!organDetails.enableFlag||disabled">是</el-radio>
					<el-radio v-model="organDetails.defaultOutFlag" :label="0" :disabled="!organDetails.enableFlag||disabled">否</el-radio>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
		<el-form v-if="isOrganType(['rdc', 'shop'])" size="mini" inline label-width="100px">
			<fx-details-form-row>
				<el-form-item label="默认入库仓库：" slot="left">
					<w-select
						ref="defaultInHouseId"
						v-model="organDetails.defaultInHouseId"
						v-fx-tab:focus.defaultOutHouseId
						:optionlist="defaultHouseList"
						:disabled="disabled"
						clearable
					>
					</w-select>
				</el-form-item>
				<el-form-item label="默认出库仓库：" slot="right">
					<w-select
						ref="defaultOutHouseId"
						v-model="organDetails.defaultOutHouseId"
						v-fx-tab:loop.basic-archives_organ-manage_details.connectSetting
						:optionlist="defaultHouseList"
						:disabled="disabled"
						clearable
					>
					</w-select>
				</el-form-item>
			</fx-details-form-row>
		</el-form>
		<connectItemDialog ref="connectItemDialog"></connectItemDialog>
	</w-collapse>
</template>
<script>
import connectItemDialog from '../connect-container/connect-item/connect-item.vue'
export default {
	name: 'connectSetting',
	components: {
		connectItemDialog
	},
	props: {
		organType: String,
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		defaultHouseList: {
			type: Array,
			default: () => {
				return []
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
		isOrganType (type = []) {
			return (type) => {
				return this.$fxTypeMiddleware.isCommonType('organType')(type)(this.organType)
			}
		}
	},
	watch: {
		'organDetails.enableFlag' (val) {
			if (!val) {
				this.organDetails.defaultInFlag = 0
				this.organDetails.defaultOutFlag = 0
			}
		}
	},
	methods: {
		onConnectSetting () {
			if (!this.organDetails.id) {
				this.$fxMessage.warning('请先保存机构信息')
				return false
			}
			this.emitConnectClick().then(() => {
				this.$refs.connectItemDialog.open(this.organDetails)
			})
		},
		emitConnectClick () {
			return new Promise(resolve => {
				this.$emit('on-connect-click', resolve)
			})
		},
		isCollapse () {
			return this.collapseVisible
		},
		defaultFocus () {
			this.$fxUtils.vDoRefFocus(this, 'defaultInHouseId')
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-rel {
	height 47px
}
</style>
