<template>
	<div class="wind-upload clearfix">
		<div
			v-for="(item, index) in fileList"
			:key="index"
			class="wind-upload__item"
		>
			<div
				class="wind-upload__item-container"
				@mouseover="onImgMouseOver(index)"
				@mouseleave="onImgMouseLeave"
			>
				<w-image
					v-if="getFileType(item) === 'image'"
					:src="item"
					class="wind-upload__item-img"
				></w-image>
				<div v-else class="wind-upload__item-div">
					<w-icon :type="`file-type-${getFileType(item)}`" class="wind-upload__item-type-icon"></w-icon>
				</div>
				<div
					v-show="imgActiveIndex===index"
					class="wind-upload__item-mask"
				>
					<w-icon type="img-watch" class="img-watch-btn" pointer @click="onImgWatchClick(item, index)"></w-icon>
					<w-icon v-if="!disabled" type="img-change" class="img-watch-btn" pointer @click="onFileChangeClick(item, index)"></w-icon>
				</div>
			</div>
			<el-popconfirm
				title="确认后，附件内容将被删除，确认是否删除？"
				hideIcon
				popper-class="wind-upload__delete-confirm"
				@onConfirm="onFileDelClick(item, index)"
			>
				<w-icon
					v-show="!disabled"
					slot="reference"
					type="file-del"
					class="file-del-btn"
					pointer
				></w-icon>
			</el-popconfirm>
		</div>
		<div
			v-if="fileList.length < limit"
			:class="['wind-upload__item', {'is-disabled': disabled }]"
			@click="onAddClick"
		>+</div>
		<input type="file" ref="uploadFile" name="file" :accept="accept" style="display: none" @change="onFileChange"/>
	</div>
</template>
<script>
/**
 * upload by shang 2020/8/4
 * @desc upload 文件上传插件
 * @params [Number] fileSize 文件大小
 */
import uploadFIleConfig from '../../js/config/upload_file_config.js'
export default {
	name: 'upload',
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
		api: {
			type: String,
			default: 'common.uploadFile'
		}
	},
	data () {
		return {
			imgActiveIndex: -1,
			changeIndex: -1
		}
	},
	computed: {
		getFileType (url) {
			return (url) => {
				const _url = url.replace(/\s*/g, '')
				if (/(\.gif|\.jpeg|\.png|\.jpg|\.bmp)$/i.test(_url)) {
					return 'image'
				} else if (/(\.ppt|\.pptx)$/i.test(_url)) {
					return 'ppt'
				} else if (/(\.docx|\.doc)$/i.test(_url)) {
					return 'word'
				} else if (/(\.xlsx|\.xls)$/i.test(_url)) {
					return 'excel'
				} else if (/(\.mp4|\.ogg|\.webm)$/i.test(_url)) {
					return 'video'
				} else {
					return 'default'
				}
			}
		},
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
			case 'video':
				_accept = 'audio/mp4,application/ogg,audio/ogg,.webm'
				break
			}
			return _accept
		}
	},
	methods: {
		onFileChange () {
			const file = this.$refs.uploadFile.files[0]
			const typeName = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
			if (!uploadFIleConfig[this.type].includes(typeName)) {
				this.$fxMessage.warning(`只支持格式为：${uploadFIleConfig[this.type].join('，')}的文件`)
				return false
			}
			if (file.size > this.fileSize * 1024 * 1024) {
				this.$fxMessage.warning(`文件大小不能超过${this.fileSize}MB`)
				return false
			}
			this.onFileUpload(file).then(res => {
				if (this.changeIndex === this.fileList.length) {
					this.fileList.push(res)
				} else {
					this.fileList.splice(this.changeIndex, 1, res)
				}
				this.$emit('on-change', this.fileList)
			})
		},
		onFileUpload (file) {
			const params = {
				file
			}
			return this.$fxApi(this.api)({ data: params })
		},
		onAddClick () {
			if (this.disabled) {
				return false
			}
			this.changeIndex = this.fileList.length
			this.$refs.uploadFile.value = ''
			this.$refs.uploadFile.click()
		},
		onImgMouseOver (index) {
			this.imgActiveIndex = index
		},
		onImgMouseLeave () {
			this.imgActiveIndex = -1
		},
		onImgWatchClick (item, index) {
			this.$emit('on-file-click', item, index, this.getFileType(item))
		},
		onFileChangeClick (item, index) {
			this.changeIndex = index
			this.$refs.uploadFile.click()
		},
		onFileDelClick (item, index) {
			this.fileList.splice(index, 1)
			this.$emit('on-change', this.fileList)
		},
		getFileConfig () {
			return uploadFIleConfig
		}
	}
}
</script>
<style lang="stylus" scoped>
.wind-upload {
	&__item {
		position: relative;
		float: left
		width: 80px
		height: 80px
		background-color: #F7F8FA
		border: 1px solid #E2E2E2
		border-radius: 4px
		font-size: 30px
		display: flex
		justify-content: center
		align-items: center
		color: #E2E2E2
		margin-right: 10px
		margin-bottom: 10px
		line-height: 80px
		cursor: pointer
		&:hover:not(.is-disabled ){
			border-color: #ccc
		}
		&-container {
			height: 100%
			width: 100%
			position: relative;
			border-radius: 3px;
			overflow: hidden;
		}
		&-img {
			height: 100%
			width: 100%
		}
		&-div {
			height: 100%
			width: 100%
			display: flex;
			align-items: center;
			justify-content: center;
		}
		&-type-icon {
			width: 50px
			height: 50px
		}
		&-mask {
			width: 100%
			height: 100%
			background-color: #303133c4
			position: absolute;
			top: 0;
			left: 0;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: space-evenly;
		}
		&.is-disabled {
			cursor:not-allowed
		}
		.img-watch-btn {
			height: 20px
			width:20px
		}
		.file-del-btn {
			width: 16px;
			height: 16px;
			position: absolute;
			top: -8px;
			right: -8px;
		}
	}
}
</style>
<style lang="stylus">
.wind-upload__delete-confirm {
	.el-popconfirm__main {
		height: 30px
		line-height: 30px
	}
}
</style>
