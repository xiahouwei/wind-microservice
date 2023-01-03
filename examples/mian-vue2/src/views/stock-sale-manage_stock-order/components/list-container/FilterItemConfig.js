export const filterItemConfig = {
	dateRange (h) {
		h = this.$createElement
		return (
			<el-form-item label="订货时间">
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
	billCode (h) {
		h = this.$createElement
		return (
			<el-form-item label="单据号">
				<w-input vModel={this.billCode} placeholder="请输入" class="form-input"/>
			</el-form-item>
		)
	},
	state (h) {
		h = this.$createElement
		return (
			<el-form-item label="审核状态">
				<w-select-mulity
					vModel={this.state}
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
	buyerOrgan (h) {
		h = this.$createElement
		return (
			<el-form-item label="买方机构">
				<w-select-tab-mulity
					vModel={this.buyerOrgan}
					optionlist={this.organIdList}
					class="form-input"
					on-change={this.onOrganChange}
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	sellerOrgan (h) {
		h = this.$createElement
		return (
			<el-form-item label="卖方机构">
				<w-select-tab-mulity
					vModel={this.sellerOrgan}
					optionlist={this.otherOrganIdList}
					class="form-input"
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
	billKind (h) {
		h = this.$createElement
		return (
			<el-form-item label="单据类型">
				<w-select-mulity
					vModel={this.billKind}
					optionlist={this.billCreateTypeList}
					class="form-input"
					showEmpty={false}
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	buyerHouse (h) {
		h = this.$createElement
		return (
			<el-form-item label="买方仓库">
				<w-select-tab-mulity
					vModel={this.buyerHouse}
					optionlist={this.buyerHouseList}
					filterKeys={this.tabStoreFilterKeys}
					optionRender={this.optionRender}
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	purchasePlan (h) {
		h = this.$createElement
		return (
			<el-form-item label="订货方案">
				<w-select-mulity
					vModel={this.purchasePlan}
					optionlist={this.purchasePlanList}
					class="form-input"
				></w-select-mulity>
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
	sendState (h) {
		h = this.$createElement
		return (
			<el-form-item label="发单状态">
				<w-select-mulity
					vModel={this.sendState}
					optionlist={this.sendStateList}
					class="form-input"
					showEmpty={false}
					optionProp={{ name: 'label' }}
				></w-select-mulity>
			</el-form-item>
		)
	},
	urgent (h) {
		h = this.$createElement
		return (
			<el-form-item label="加急状态">
				<w-select-mulity
					vModel={this.urgent}
					optionlist={this.urgentStateList}
					class="form-input"
					showEmpty={false}
					optionProp={{ name: 'label' }}
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
				<w-input vModel={this.bdmemo} placeholder="请输入" class="form-input"/>
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
