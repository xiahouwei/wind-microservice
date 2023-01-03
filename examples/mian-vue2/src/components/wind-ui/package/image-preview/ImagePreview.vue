<template>
	<w-dialog v-model="visible" width="900px" top="5vh" title='查看图片'>
		<w-scroll-bar>
			<div class="dialog-container">
				<w-image :src="imageUrl" type="preview" class="dialog-img" ></w-image>
				<div v-if="!disabled" class="dialog-img__tools">
					<w-icon type="img-change" class="img-btn" pointer @click="onImgChangeClick"></w-icon>
					<input type="file" ref="uploadFile" name="file" accept="image/gif, image/jpeg, image/png" style="display: none" @change="onImgChange"/>
					<w-icon type="img-del" class="img-btn" pointer @click="onImgDelClick"></w-icon>
				</div>
			</div>
		</w-scroll-bar>
	</w-dialog>
</template>
<script>
import uploadFIleConfig from '../../js/config/upload_file_config.js'
export default {
	name: 'imagePreview',
	props: {
		value: Boolean,
		imageUrl: String,
		deleteText: {
			type: String,
			default: '确认后，附件内容将被删除，确认是否删除？'
		},
		fileSize: {
			type: Number,
			default: 1
		},
		disabled: Boolean
	},
	data () {
		return {
			visible: false
		}
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				this.visible = val
			}
		},
		visible (val) {
			if (!val) {
				this.$emit('input', false)
			}
		}
	},
	methods: {
		onImgChangeClick () {
			this.$refs.uploadFile.click()
		},
		onImgChange () {
			const file = this.$refs.uploadFile.files[0]
			const typeName = file.name.substring(file.name.lastIndexOf('.'))
			if (!uploadFIleConfig.image.includes(typeName)) {
				this.$fxMessage.warning(`只支持格式为：${uploadFIleConfig.image.join('，')}的文件`)
				return false
			}
			if (file.size > this.fileSize * 1024 * 1024) {
				this.$fxMessage.warning(`文件大小不能超过${this.fileSize}MB`)
				return false
			}
			this.$refs.uploadFile.value = ''
			this.onImgChangeHandler(file)
		},
		onImgChangeHandler (file) {
			const params = {
				file
			}
			return this.$fxApi('common.uploadFile')({ data: params }).then(res => {
				this.$emit('on-image-change', res, this.imageUrl)
				return Promise.resolve()
			})
		},
		onImgDelClick () {
			this.$fxConfirm(this.deleteText).then(() => {
				this.visible = false
				this.$emit('on-image-delete', this.imageUrl)
			})
		}
	}
}
</script>
<style lang="stylus" scoped>
.dialog-container {
	width: 100%
	position: relative
	max-height: 80vh
	.dialog-img {
		width: 100%
	}
	.dialog-img__tools {
		width: 64px
		height: 32px
		position: absolute
		right: 0
		top: 0
		background-color: #606266
		display: flex
		align-items: center;
		justify-content: space-evenly;
	}
	.img-btn {
		width: 20px
		height: 20px
	}
}
>>>.el-dialog__body {
	padding-bottom 0
	padding-right 5px
}
</style>
