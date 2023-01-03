export const filterItemConfig = {
	dateRang (h) {
		h = this.$createElement
		return (
			<el-form-item label="生产计划日期">
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
	organ (h) {
		h = this.$createElement
		return (
			<el-form-item label="机构">
				<w-select-tab-mulity
					vModel={this.filter.organId}
					optionlist={this.organList}
					class="form-input"
					loading={this.organListLoading}
					on-visible-change={this.onOrganListVisibleChange}
					on-change={this.otherOrganIdChange}
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	house (h) {
		h = this.$createElement
		return (
			<el-form-item label="仓库">
				<w-select-tab-mulity
					vModel={this.filter.house}
					optionlist={this.houseList}
					filterKeys={this.tabStoreFilterKeys}
					optionRender={this.optionRender}
					loading={this.selectLoading}
					fpSelectShow={this.onHouseSelectShow}
					class="form-input"
				></w-select-tab-mulity>
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
					fpSelectShow={this.getItemSelectShow}
					class="form-input"
				>
				</w-select-tab-mulity>
			</el-form-item>
		)
	},
	createMachining (h) {
		h = this.$createElement
		return (
			<el-form-item label="生成加工单">
				<w-select-mulity
					vModel={this.filter.createMachiningFlag}
					optionlist={this.processSearchList}
					class="form-input"
					optionProp={{ name: 'label' }}
					showEmpty={false}
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	createPicking (h) {
		h = this.$createElement
		return (
			<el-form-item label="生成领料单">
				<w-select-mulity
					vModel={this.filter.createPickingFlag}
					optionlist={this.processSearchList}
					class="form-input"
					optionProp={{ name: 'label' }}
					showEmpty={false}
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	createProcedure (h) {
		h = this.$createElement
		return (
			<el-form-item label="生成工序任务">
				<w-select-mulity
					vModel={this.filter.createProcedureTaskFlag}
					optionlist={this.processSearchList}
					class="form-input"
					optionProp={{ name: 'label' }}
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
	}
}
