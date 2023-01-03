<template>
	<fx-details-form-row>
		<el-form-item :label="paramItem.nickName" label-width="250px">
			<fx-render-dom
				:render="render"
			></fx-render-dom>
		</el-form-item>
		<w-icon pointer type="question-active" class="mark-icon" @click="onMarkClick"></w-icon>
	</fx-details-form-row>
</template>
<script>
export default {
	name: 'paramCell',
	props: {
		paramItem: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data () {
		return {
			optionProp: {
				key: 'id',
				name: 'nickName',
				value: 'id',
				disabled: 'disabled'
			}
		}
	},
	methods: {
		render (h) {
			h = this.$createElement
			switch (this.paramItem.type) {
			case 'SELECT':
				return <w-select
					vModel = { this.paramItem.code }
					optionlist = { this.paramItem.mparamConfigDetails }
					optionProp = { this.optionProp }
					disabled={ this.paramItem.disable }
					class="form-input">
				</w-select>
			case 'RADIO':
				return <el-radio-group vModel = { this.paramItem.code } disabled={ this.paramItem.disable } class="form-input">
					{
						this.paramItem.mparamConfigDetails.map((radioItem, radioIndex) => {
							return <el-radio label = { radioItem.id } key={ radioIndex }>{radioItem.nickName}</el-radio>
						})
					}
				</el-radio-group>
			case 'INPUT_NUMBER':
				return <w-input-number
					vModel = { this.paramItem.code }
					max = { this.paramItem.max }
					min = { this.paramItem.min }
					integer = { !!this.paramItem.integer }
					disabled={ this.paramItem.disable }
					class="form-input"
				></w-input-number>
			}
		},
		onMarkClick () {
			this.$emit('on-mark-click', this.paramItem)
		}
	}
}
</script>
<style lang="stylus" scoped>
@import '~$assets/stylus/varsty.styl'
.form-input {
	width: 200px
}
.mark-icon {
	margin-top 4px
}
</style>
