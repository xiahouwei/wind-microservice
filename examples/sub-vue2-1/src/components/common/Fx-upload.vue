<template>
	<div>
		<w-upload
			ref="upload"
			:fileList="fileList"
			:limit="limit"
			:fileSize="fileSize"
			:disabled="disabled"
			:type="type"
			:pageType='pageType'
			@on-file-click="onFileClick"
			@on-change="onFileChange"
		></w-upload>
		<div v-if="notes" class="upload-describe">支持扩展名：{{acceptText}} 最多上传{{limit}}个文件, 单个文件大小不超过{{fileSize}}MB</div>
		<w-image-preview
			v-model="dialogImgVisible"
			:imageUrl="currentImg"
			:disabled="disabled"
			@on-image-change="onImgChange"
			@on-image-delete="onImgDelClick"
		></w-image-preview>
	</div>
</template>
<script>
/**
 * Fx-upload by shang 2020/8/25
 * @desc Fx-upload 文件上传通用组件
 * @params fileList[Array] 文件队列
 * @params fileSize[Number] 文件大小
 * @params disabled[Boolean] 只读
 * @params type[String] 文件类型 [file, image, word, excel]
 * @params notes[Boolean] 是否显示说明
 */
export default {
	name: 'fx-upload',
	props: {
		fileList: {
			type: Array,
			default: () => {
				return []
			}
		},
		fileSize: {
			type: Number,
			default: 1
		},
		limit: {
			type: Number,
			default: 3
		},
		disabled: Boolean,
		type: {
			type: String,
			default: 'file'
		},
		notes: {
			type: Boolean,
			default: true
		},
		pageType: {
			type: Number,
			default: 1
		}
	},
	data () {
		return {
			dialogImgVisible: false,
			currentImg: '',
			fileConfig: []
		}
	},
	computed: {
		accept () {
			return this.fileConfig[this.type] || []
		},
		acceptText () {
			return this.accept.join('，')
		}
	},
	mounted () {
		this.fileConfig = this.$refs.upload.getFileConfig()
	},
	methods: {
		onFileClick (item, index, type) {
			if (type === 'image') {
				this.currentImg = item
				this.dialogImgVisible = true
			} else {
				window.open(item)
			}
		},
		onImgChange (imgUrl, oldImgUrl) {
			const index = this.fileList.findIndex(item => {
				return item === oldImgUrl
			})
			this.currentImg = imgUrl
			this.fileList.splice(index, 1, imgUrl)
			this.$emit('on-change', this.fileList)
		},
		onImgDelClick (imageUrl) {
			const index = this.fileList.findIndex(item => {
				return item === imageUrl
			})
			this.fileList.splice(index, 1)
			this.$emit('on-change', this.fileList)
		},
		onFileChange () {
			this.$emit('on-change', this.fileList)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.upload-describe {
	width: 100%
	font-size: 12px
	color:$fxGray4
}
</style>

