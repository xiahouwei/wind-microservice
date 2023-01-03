<template>
	<div class="fx-list-cell-upload" @click="onCellClick">
		<w-validate ref="validate">
			<fx-upload
				:fileList="currentInputValue"
				:limit="1"
				:disabled="disabled"
				:notes='false'
				type='image'
				class="upload-content"
				@on-change="onFileChange"
			></fx-upload>
		</w-validate>
	</div>
</template>
<script>
import cellMixin from '@/components/mixins/fxListCell.js'
export default {
	name: 'fx-list-cell-upload',
	mixins: [cellMixin],
	props: {
		isEdit: Boolean,
		value: null,
		stop: Boolean,
		disabled: Boolean
	},
	data () {
		return {
			currentInputValue: []
		}
	},
	computed: {
	},
	created () {
	},
	watch: {
		value: {
			immediate: true,
			handler (val) {
				this.currentInputValue = val
			}
		}
	},
	methods: {
		onCellClick () {
			if (this.stop) {
				event.stopPropagation()
			}
			this.$emit('click', this.row, this.rowIndex)
		},
		onFileChange (list) {
			this.$emit('change', list, this.row)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.fx-list-cell-upload {
	display: flex;
	flex-direction: row;
	align-items: center;
	.form-item-input {
		width: 150px
		box-sizing: border-box
	}
}
.upload-content {
	width: 100px
}
</style>
