export const filterItemConfig = {
	dateRang (h) {
		h = this.$createElement
		return (
			<el-form-item label="入库时间">
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
					vModel={this.filter.organId}
					optionlist={this.organIdList}
					loading={this.selectLoading}
					fpSelectShow={this.getOrganList}
					class="form-input"
					on-change={this.organIdChange}
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	otherOrganId (h) {
		h = this.$createElement
		return (
			<el-form-item label="出库方">
				<w-select-tab-mulity
					vModel={this.filter.otherOrganId}
					optionlist={this.otherOrganIdList}
					loading={this.selectLoading}
					fpSelectShow={this.getOtherOrganList}
					class="form-input"
					on-change={this.otherOrganIdChange}
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	itemType (h) {
		h = this.$createElement
		return (
			<el-form-item label="品项分类">
				<w-cascader
					vModel={this.filter.itemType}
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
					vModel={this.filter.item}
					optionlist={this.itemList}
					loading={this.selectLoading}
					fpSelectShow={this.getItemSelectTab}
					class="form-input"
				>
				</w-select-tab-mulity>
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
					loading={this.selectLoading}
					fpSelectShow={this.getBillBizTypeSelect}
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
					loading={this.selectLoading}
					fpSelectShow={this.getBilltypeSelect}
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
					vModel={this.filter.operateMan}
					optionlist={this.operatorList}
					loading={this.selectLoading}
					fpSelectShow={this.getAgentList}
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
					vModel={this.filter.sendState}
					optionlist={this.sendStateList}
					class="form-input"
					showEmpty={false}
					optionProp={{ name: 'label' }}
				></w-select-mulity>
			</el-form-item>
		)
	},
	inHouse (h) {
		h = this.$createElement
		return (
			<el-form-item label="入库仓库">
				<w-select-tab-mulity
					vModel={this.filter.inHouse}
					optionlist={this.inHouseList}
					filterKeys={this.tabStoreFilterKeys}
					optionRender={this.optionRender}
					loading={this.selectLoading}
					fpSelectShow={this.onInHouseSelectShow}
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
					vModel={this.filter.otherHouse}
					optionlist={this.outHouseList}
					filterKeys={this.tabStoreFilterKeys}
					optionRender={this.optionRender}
					loading={this.selectLoading}
					fpSelectShow={this.onOutHouseSelectShow}
					class="form-input"
				></w-select-tab-mulity>
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
					vModel={this.filter.generateWay}
					optionlist={this.generateWayList}
					class="form-input"
					showEmpty={false}
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
