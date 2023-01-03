<template>
	<div>
		<w-simple-table
			:tableData="value"
			bottomBtnText="+添加资质"
			:showBottomBtn="value.length<limit&&!disabled"
			@on-bottom-btn-click="onCertificateAddClick"
		>
			<w-simple-table-column prop="typeName" label="证照类型" width="16%">
				<span slot-scope="scope">{{getResourceTypeName(scope.row.type)}}</span>
			</w-simple-table-column>
			<w-simple-table-column prop="name" label="证照名称" width="25%">
				<el-tooltip :disabled="!tooltipShow(115-10, scope.row.name)" effect="light" :content="scope.row.name" placement="top" slot-scope="scope">
					<div class="fx-ellipsis">{{scope.row.name}}</div>
				</el-tooltip>
			</w-simple-table-column>
			<w-simple-table-column prop="code" label="证照编号" width="16%">
				<el-tooltip :disabled="!tooltipShow(120-10, scope.row.code)" effect="light" :content="scope.row.code" placement="top" slot-scope="scope">
					<div class="fx-ellipsis">{{scope.row.code}}</div>
				</el-tooltip>
			</w-simple-table-column>
			<w-simple-table-column prop="date" label="证照有效期" width="20%" align="center">
				<span slot-scope="scope">{{scope.row.begin ? `${scope.row.begin}-${scope.row.end}` : ''}}</span>
			</w-simple-table-column>
			<w-simple-table-column prop="file" label="附件" width="13%" align="center">
				<div slot-scope="scope">
					<w-link v-if="scope.row.appendixUrl" icon="file-watch" @click="onCertificateWatch(scope)">查看</w-link>
					<span v-else>无</span>
				</div>
			</w-simple-table-column>
			<w-simple-table-column :visible="!disabled" prop="tools" label="操作" width="10%" align="center">
				<div slot-scope="scope">
					<w-link type="danger" @click="onCertificateDelClick(scope)">删除</w-link>
					<w-link @click="onCertificateEditClick(scope)">编辑</w-link>
				</div>
			</w-simple-table-column>
		</w-simple-table>
		<certificateCreateDialog
			ref="createDialog"
			:resourceTypeList="resourceTypeList"
			:resourceList="value"
			@on-add-submit="onCertificateAddSubmit"
			@on-edit-submit="onCertificateEditSubmit"
		></certificateCreateDialog>
		<w-image-preview
			v-model="dialogCertificateImgVisible"
			:imageUrl="dialogCertificateImgUrl"
			:disabled="disabled"
			@on-image-change="onCertificateImgChange"
			@on-image-delete="onCertificateImgDelete"
		></w-image-preview>
	</div>
</template>
<script>
import certificateCreateDialog from './CertificateCreateDialog.vue'
export default {
	name: 'otherInfo',
	components: {
		certificateCreateDialog
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
	mounted () {
		this.getResourceTypeList()
	},
	data () {
		return {
			dialogCertificateImgVisible: false,
			dialogCertificateImgUrl: '',
			dialogCertificateImgIndex: 0,
			resourceTypeList: []
		}
	},
	methods: {
		onCertificateAddClick () {
			this.$refs.createDialog.addOpen()
		},
		onCertificateEditClick ({ row, index }) {
			this.$refs.createDialog.editOpen(row, index)
		},
		onCertificateDelClick ({ row, index }) {
			this.$fxConfirm('确定删除当前资质？').then(() => {
				this.value.splice(index, 1)
			})
		},
		onCertificateWatch ({ row, index }) {
			this.dialogCertificateImgUrl = row.appendixUrl
			this.dialogCertificateImgIndex = index
			this.dialogCertificateImgVisible = true
		},
		onCertificateImgChange (url) {
			this.dialogCertificateImgUrl = url
			this.value[this.dialogCertificateImgIndex].appendixUrl = url
		},
		onCertificateAddSubmit (item) {
			this.value.push(item)
		},
		onCertificateEditSubmit (item, index) {
			this.value.splice(index, 1, item)
		},
		getResourceTypeList () {
			return this.$fxApi('common.getResourceTypeList').then(res => {
				this.resourceTypeList = res
			})
		},
		getResourceTypeName (type) {
			const resourceType = this.resourceTypeList.find(item => item.id === type)
			return resourceType ? resourceType.name : ''
		},
		tooltipShow (length, str) {
			return this.$fxUtils.getTextWidth(str) > length
		},
		onCertificateImgDelete (url) {
			this.dialogCertificateImgUrl = null
			this.value[this.dialogCertificateImgIndex].appendixUrl = ''
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
</style>
