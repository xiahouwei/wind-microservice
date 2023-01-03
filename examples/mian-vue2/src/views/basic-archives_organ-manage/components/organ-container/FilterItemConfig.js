export const filterItemConfig = {
	organ (h) {
		h = this.$createElement
		return (
			<el-form-item label="机构">
				<w-select-tab-mulity
					vModel={this.organKey}
					optionlist={this.organList}
					class="form-input"
					loading={this.organListLoading}
					on-visible-change={this.onOrganListVisibleChange}
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	fatherOrgan (h) {
		h = this.$createElement
		return (
			<el-form-item label="上级机构">
				<w-input
					vModel={this.father}
					placeholder="请输入"
					class="form-input"
				/>
			</el-form-item>
		)
	},
	enableFlag (h) {
		h = this.$createElement
		return (
			<el-form-item label="启停状态">
				<w-select
					vModel={this.enableFlag}
					optionlist={this.enableStateSelectList}
					optionProp={this.optionProp}
					class="form-input"
				/>
			</el-form-item>
		)
	},
	organType (h) {
		h = this.$createElement
		return (
			<el-form-item label="机构类型">
				<w-select
					vModel={this.organType}
					optionlist={this.organTypeSelectList}
					optionProp={this.optionProp}
					clearable={true}
					class="form-input"
				>
				</w-select>
			</el-form-item>
		)
	},
	tagKey (h) {
		h = this.$createElement
		return (
			<el-form-item label="标签">
				<w-input
					vModel={this.tagKey}
					placeholder="请输入"
					class="form-input"
					disabled
				/>
			</el-form-item>
		)
	},
	memo (h) {
		h = this.$createElement
		return (
			<el-form-item label="备注">
				<w-input vModel={this.memo}
					placeholder="请输入"
					class="form-input"
				/>
			</el-form-item>
		)
	}
}
