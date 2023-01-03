<template>
	<w-collapse v-model="collapseVisible" disabled :showArrow="false" title="品项信息">
		<el-form ref="form" :model="organDetails" :rules="rules" size="mini" label-width="90px" inline>
			<fx-details-form-row>
				<el-form-item prop="itemId" label="选择品项：">
					<w-select
						v-model="organDetails.itemId"
						:disabled="disabled || !isAdd"
						:optionlist="itemList"
						class="form-item-input"
						@change="onItemChange"
					>
					</w-select>
				</el-form-item>
				<div class="unit-tip fx-ellipsis">该品项可选单位包括：{{unitListText}}</div>
				<w-link v-if="showItemUnitSet" class="unit-set-btn fx-cursor" @click="onUnitSetClick">设置单位</w-link>
			</fx-details-form-row>
		</el-form>
	</w-collapse>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name: 'itemInfo',
	props: {
		organDetails: {
			type: Object,
			default: () => {
				return {}
			}
		},
		isAdd: Boolean,
		disabled: Boolean,
		unitList: {
			type: Array,
			default: () => {
				return []
			}
		},
		itemList: {
			type: Array,
			default: () => {
				return []
			}
		},
		billClass: String
	},
	data () {
		return {
			collapseVisible: true,
			rules: {
				itemId: [{ required: true, message: '该字段不能为空', trigger: 'no' }]
			}
		}
	},
	computed: {
		...mapGetters(['moduleAuthGetter']),
		unitListText () {
			if (!this.billClass) return ''
			if (['InStore', 'OutStore', 'CheckBill'].includes(this.billClass)) {
				return this.unitList.filter(item => !item.assistFlag).map(item => item.name).join('、')
			} else {
				return this.unitList.map(item => item.name).join('、')
			}
		},
		showItemUnitSet () {
			return this.moduleAuthGetter('basic-archives_item-manage')
		}
	},
	methods: {
		validate () {
			return new Promise(resolve => {
				this.$refs.form.validate().then(() => {
					resolve()
				}).catch(() => {
					this.$fxMessage.warning('请选择品项')
				})
			})
		},
		onItemChange (id, item) {
			this.$emit('update:unitList', item.itemUnitList || [])
			this.$emit('on-item-chang')
		},
		onUnitSetClick () {
			this.$fxAppTabs.tabsPush({
				path: 'itemManageDetail',
				query: {
					openType: 'edit',
					id: this.organDetails.itemId,
					isRecycle: false
				}
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.unit-tip {
	line-height 29px
	margin-left 10px
	max-width 500px
}
.unit-set-btn {
	height 29px
	line-height 29px
	margin-left 10px
}
.form-item-input {
	width: 240px
	box-sizing: border-box
}
>>>.title-text {
	font-size 14px
}
</style>
