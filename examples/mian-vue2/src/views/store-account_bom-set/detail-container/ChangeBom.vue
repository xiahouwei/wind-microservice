<template>
	<w-dialog
		v-model='dialogVisible'
		width='400px'
		title='切换下级BOM'
	>
		<w-select
			v-model="childBom"
			:optionlist="selectList"
			:clearable='true'
		>
		</w-select>
		<template slot="footer-right">
			<el-button @click="onCancelClick">取消</el-button>
			<fx-button type="save" @click="onSaveClick">保存</fx-button>
		</template>
	</w-dialog>
</template>

<script>
export default {
	name: 'changeBom',
	components: {
	},
	props: {
		type: String,
		cardData: Object,
		bomDetail: Object
	},
	data () {
		return {
			childBom: '',
			dialogVisible: false,
			selectList: []
		}
	},
	computed: {
	},
	mounted () {
	},
	methods: {
		open (data, childBomId) {
			if (childBomId) {
				this.childBom = childBomId
			}
			this.selectList = data
			this.dialogVisible = true
		},
		onCancelClick () {
			this.childBom = {}
			this.selectList = []
			this.dialogVisible = false
		},
		onSaveClick () {
			const selcted = this.selectList.find(i => i.id === this.childBom)
			const data = this.bomDetail.details.find(i => i.id === this.cardData.id)
			data.childBom = selcted || {}
			data.childBomId = data.childBom.id || ''
			this.saveHandler(data).then(() => {
				this.$emit('refresh')
				this.onCancelClick()
			})
		},
		saveHandler (data) {
			return this.$fxApi('bom.editDetail', this.type, this.bomDetail.id)({ data }).then(res => {
				return Promise.resolve(res)
			})
		}
	}
}
</script>
