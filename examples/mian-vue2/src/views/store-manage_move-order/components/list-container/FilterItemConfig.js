export const filterItemConfig = {
	dateRange (h) {
		h = this.$createElement
		return (
			<el-form-item label="调拨时间">
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
				<w-input vModel={this.billCode} placeholder="请输入" class="form-input"/>
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
			<el-form-item label="入库方">
				<w-select-tab-mulity
					vModel={this.inOrganId}
					optionlist={this.organIdList}
					class="form-input"
					on-change={this.inOrganIdChange}
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	otherOrganId (h) {
		h = this.$createElement
		return (
			<el-form-item label="出库方">
				<w-select-tab-mulity
					vModel={this.outOrganId}
					optionlist={this.outOrganIdList}
					class="form-input"
					on-change={this.outOrganIdChange}
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
	agreeState (h) {
		h = this.$createElement
		return (
			<el-form-item label="同意状态">
				<w-select-mulity
					vModel={this.moveState}
					optionlist={this.moveStateList}
					class="form-input"
					showEmpty={false}
					optionProp={{ name: 'label' }}
				>
				</w-select-mulity>
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
	operateMan (h) {
		h = this.$createElement
		return (
			<el-form-item label="经办人">
				<w-select-mulity
					vModel={this.operateMan}
					optionlist={this.operatorList}
					class="form-input"
					showEmpty={false}
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	inHouse (h) {
		h = this.$createElement
		return (
			<el-form-item label="入库仓库">
				<w-select-tab-mulity
					vModel={this.inHouse}
					optionlist={this.inhouseSelect}
					filterKeys={this.tabStoreFilterKeys}
					optionRender={this.optionRender}
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	otherHouse (h) {
		h = this.$createElement
		return (
			<el-form-item label="出库仓库">
				<w-select-tab-mulity
					vModel={this.outHouse}
					optionlist={this.outhouseSelect}
					filterKeys={this.tabStoreFilterKeys}
					optionRender={this.optionRender}
					class="form-input"
				></w-select-tab-mulity>
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
