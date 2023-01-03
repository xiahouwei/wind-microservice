<template>
	<div class="wind-upload">
		<input class="wind-upload__input" type="file" ref="uploadFile" name="file" :accept="accept" @change="onFileChange"/>
	</div>
</template>
<script>
/**
 * upload
 * @desc hideUpload 隐藏式文件上传插件
 * @params [Number] fileSize 文件大小
 * @params [String] type 上传文件限制类型
 * @params [Function] uploadFn 上传文件回调

 * @method upload 触发上传文件
 */
import uploadFIleConfig from '../../js/config/upload_file_config.js'
export default {
	name: 'upload-hide',
	props: {
		fileSize: {
			type: Number,
			default: 30
		},
		type: {
			type: String,
			default: 'file'
		},
		uploadFn: Function
	},
	computed: {
		accept () {
			let _accept = ''
			switch (this.type) {
			case 'file':
				_accept = '*'
				break
			case 'image':
				_accept = 'image/gif, image/jpeg, image/png'
				break
			case 'word':
				_accept = '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
				break
			case 'excel':
				_accept = '.xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
				break
			}
			return _accept
		}
	},
	methods: {
		onFileChange () {
			const file = this.$refs.uploadFile.files[0]
			const typeName = file.name.substring(file.name.lastIndexOf('.'))
			if (!uploadFIleConfig[this.type].includes(typeName)) {
				this.$fxMessage.warning(`只支持格式为：${uploadFIleConfig[this.type].join('，')}的文件`)
				return false
			}
			if (file.size > this.fileSize * 1024 * 1024) {
				this.$fxMessage.warning(`文件大小不能超过${this.fileSize}MB`)
				return false
			}
			this.uploadFn(file)
		},
		upload () {
			this.$refs.uploadFile.value = ''
			this.$refs.uploadFile.click()
		}
	}
}
</script>
<style lang="stylus" scoped>
.wind-upload {
	&__input {
		display: none
	}
}
</style>
