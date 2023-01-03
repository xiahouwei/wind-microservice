export const filterItemConfig = {
	dateRange (h) {
		h = this.$createElement
		return (
			<el-form-item label="营业时间">
				<w-date-picker
					vModel={this.filter.dateRang}
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					format="yyyy 年 MM 月 dd 日"
					value-format="yyyy-MM-dd HH:mm:ss"
					default-time={['00:00:00', '23:59:59']}
					picker-options={this.pickerOptions}
					class="form-date-input"
				></w-date-picker>
			</el-form-item>
		)
	},
	userBillCode (h) {
		h = this.$createElement
		return (
			<el-form-item label="单据号">
				<w-input vModel={this.filter.userBillCode} placeholder="请输入" class="form-input"/>
			</el-form-item>
		)
	},
	billState (h) {
		h = this.$createElement
		return (
			<el-form-item label="审核状态">
				<w-select-mulity
					vModel={this.filter.billState}
					optionlist={this.stateSearchList}
					class="form-input"
					optionProp={{ name: 'label' }}
					showEmpty={false}
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	offsetStateFilter (h) {
		h = this.$createElement
		return (
			<el-form-item label="冲减状态">
				<w-select-mulity
					vModel={this.filter.offsetState}
					optionlist={this.offsetSearchList}
					class="form-input"
					optionProp={{ name: 'label' }}
					showEmpty={false}
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	organId (h) {
		h = this.$createElement
		return (
			<el-form-item label="营业机构">
				<w-select-tab-mulity
					vModel={this.filter.organId}
					optionlist={this.organIdList}
					class="form-input"
					on-change={this.changeOrgan}
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	salesRegionId (h) {
		h = this.$createElement
		return (
			<el-form-item label="销售区域">
				<w-select-tab-mulity
					vModel={this.filter.salesRegionId}
					optionlist={this.salesRegionList}
					class="form-input"
					optionRender={this.optionRender}
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	item (h) {
		h = this.$createElement
		return (
			<el-form-item label="菜品">
				<w-select-mulity
					vModel={this.filter.item}
					optionlist={this.itemList}
					class="form-input"
					showEmpty={false}
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	billBizTypeId (h) {
		h = this.$createElement
		return (
			<el-form-item label="业务类型">
				<w-select-mulity
					vModel={this.filter.billBizTypeId}
					optionlist={this.billBizTypeList}
					class="form-input"
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	billType (h) {
		h = this.$createElement
		return (
			<el-form-item label="单据类型">
				<w-select-mulity
					vModel={this.filter.billType}
					optionlist={this.billtypeSelect}
					class="form-input"
					showEmpty={false}
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	memo (h) {
		h = this.$createElement
		return (
			<el-form-item label="备注">
				<w-input vModel={this.filter.memo} placeholder="请输入" class="form-input"/>
			</el-form-item>
		)
	},
	bdmemo (h) {
		h = this.$createElement
		return (
			<el-form-item label="明细备注">
				<w-input vModel={this.filter.bdmemo} placeholder="请输入" class="form-input"/>
			</el-form-item>
		)
	},
	source (h) {
		h = this.$createElement
		return (
			<el-form-item label="来源">
				<w-select-mulity
					vModel={this.filter.source}
					optionlist={this.billCreateTypeList}
					class="form-input"
					showEmpty={false}
					optionProp={{ name: 'label' }}
					disabled={true}
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	tagKey (h) {
		h = this.$createElement
		return (
			<el-form-item label="标签">
				<w-input
					vModel={this.filter.tagKey}
					placeholder="请输入"
					class="form-input"
					disabled={true}
				/>
			</el-form-item>
		)
	}
}
