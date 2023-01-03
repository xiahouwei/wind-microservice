<template>
	<div>
		<w-simple-table
			:tableData="value"
			bottomBtnText="+添加收货地址"
			:showBottomBtn="value.length<limit&&!disabled"
			@on-bottom-btn-click="onAddressAddClick"
		>
			<w-simple-table-column prop="areaText" label="省市区" width="25%"></w-simple-table-column>
			<w-simple-table-column prop="location" label="详细地址" width="25%"></w-simple-table-column>
			<w-simple-table-column prop="linkMan" label="联系人" width="13%" align="center"></w-simple-table-column>
			<w-simple-table-column prop="tel" label="联系电话" width="15%" align="center"></w-simple-table-column>
			<w-simple-table-column :visible="!disabled" prop="tools" label="操作" width="13%" align="center">
				<div slot-scope="scope">
					<w-link type="danger" @click="onAddressDelClick(scope)">删除</w-link>
					<w-link @click="onAddressEditClick(scope)">编辑</w-link>
				</div>
			</w-simple-table-column>
			<w-simple-table-column prop="default" label="默认" width="9%" align="center">
				<div slot-scope="scope">
					<el-checkbox v-model="scope.row.isDefault" :disabled="disabled" @change="onDefaultAddressChange(arguments, scope)"></el-checkbox>
				</div>
			</w-simple-table-column>
		</w-simple-table>
		<addressCreateDialog
			ref="createDialog"
			@on-add-submit="onAddressAddSubmit"
			@on-edit-submit="onAddressEditSubmit"
		></addressCreateDialog>
	</div>
</template>
<script>
import addressCreateDialog from './AddressCreateDialog.vue'
export default {
	name: 'addressManage',
	components: {
		addressCreateDialog
	},
	props: {
		value: {
			type: Array,
			default: () => {
				return []
			}
		},
		limit: {
			type: Number,
			default: 5
		},
		disabled: Boolean
	},
	methods: {
		onAddressDelClick ({ row, index }) {
			this.$fxConfirm('确定删除当前收货地址？').then(() => {
				this.value.splice(index, 1)
			})
		},
		onAddressEditClick ({ row, index }) {
			this.$refs.createDialog.editOpen(row, index)
		},
		onAddressAddClick () {
			this.$refs.createDialog.addOpen()
		},
		onDefaultAddressChange (checked, { row, index }) {
			if (checked) {
				this.value.forEach((item, addressIndex) => {
					if (index !== addressIndex) {
						item.isDefault = false
					}
				})
			}
		},
		onAddressAddSubmit (item) {
			if (item.isDefault) {
				this.clearAddressDefaultFlag()
			}
			this.value.push(item)
		},
		onAddressEditSubmit (item, index) {
			if (item.isDefault) {
				this.clearAddressDefaultFlag()
			}
			this.value.splice(index, 1, item)
		},
		clearAddressDefaultFlag () {
			this.value.forEach(item => {
				item.isDefault = false
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
