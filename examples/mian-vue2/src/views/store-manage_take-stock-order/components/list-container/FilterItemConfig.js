export const filterItemConfig = {
	dateRange (h) {
		h = this.$createElement
		return (
			<el-form-item label="盘点时间">
				<w-date-picker
					vModel={this.dateRang}
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
				<w-input vModel={this.sysBillCode} placeholder="请输入" class="form-input"/>
			</el-form-item>
		)
	},
	billState (h) {
		h = this.$createElement
		return (
			<el-form-item label="审核状态">
				<w-select-mulity
					vModel={this.billState}
					optionlist={this.stateSearchList}
					class="form-input"
					optionProp={{ name: 'label' }}
					showEmpty={false}
					disabled={this.billStateDisabled}
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	organId (h) {
		h = this.$createElement
		return (
			<el-form-item label="盘点机构">
				<w-select-tab-mulity
					vModel={this.organId}
					optionlist={this.organIdList}
					class="form-input"
					on-change={this.onOrganChange}
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	houseId (h) {
		h = this.$createElement
		return (
			<el-form-item label="盘点仓库">
				<w-select-tab-mulity
					vModel={this.houseId}
					optionlist={this.houseIdList}
					filterKeys={this.tabStoreFilterKeys}
					class="form-input"
					optionRender={this.optionRender}
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	itemType (h) {
		h = this.$createElement
		return (
			<el-form-item label="品项分类">
				<w-cascader
					vModel={this.itemType}
					collapseTags={true}
					checkAllChildNode={true}
					options={this.itemCascaderData}
					optionProps={this.itemTypeProps}
					showAllLevels={false}
					filterable={false}
					class="form-input"
				>
				</w-cascader>
			</el-form-item>
		)
	},
	item (h) {
		h = this.$createElement
		return (
			<el-form-item label="品项">
				<w-select-tab-mulity
					vModel={this.item}
					optionlist={this.itemList}
					class="form-input"
				>
				</w-select-tab-mulity>
			</el-form-item>
		)
	},
	billBizType (h) {
		h = this.$createElement
		return (
			<el-form-item label="业务类型">
				<w-select-mulity
					vModel={this.billBizType}
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
					vModel={this.billType}
					optionlist={this.billtypeSelect}
					class="form-input"
					showEmpty={false}
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	entryClerk (h) {
		h = this.$createElement
		return (
			<el-form-item label="经办人">
				<w-select-mulity
					vModel={this.entryClerk}
					optionlist={this.entryClerkList}
					showEmpty={false}
					class="form-input"
				></w-select-mulity>
			</el-form-item>
		)
	},
	memo (h) {
		h = this.$createElement
		return (
			<el-form-item label="备注">
				<w-input vModel={this.memo} placeholder="请输入" class="form-input"/>
			</el-form-item>
		)
	},
	bdmemo (h) {
		h = this.$createElement
		return (
			<el-form-item label="明细备注">
				<w-input vModel={this.detailMemo} placeholder="请输入" class="form-input"/>
			</el-form-item>
		)
	},
	source (h) {
		h = this.$createElement
		return (
			<el-form-item label="来源">
				<w-select-mulity
					vModel={this.source}
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
					vModel={this.tagKey}
					placeholder="请输入"
					class="form-input"
					disabled={true}
				/>
			</el-form-item>
		)
	}
}
