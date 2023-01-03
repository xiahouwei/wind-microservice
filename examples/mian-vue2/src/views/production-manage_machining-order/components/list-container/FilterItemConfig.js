export const filterItemConfig = {
	dateRang (h) {
		h = this.$createElement
		return (
			<el-form-item label="业务时间">
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
	billType (h) {
		h = this.$createElement
		return (
			<el-form-item label="单据来源">
				<w-select-mulity
					vModel={this.filter.billType}
					optionlist={this.machiningList}
					class="form-input"
					optionProp={{ name: 'label' }}
					showEmpty={false}
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
					optionlist={this.organIdList}
					class="form-input"
					loading={this.organListLoading}
					fpSelectShow={this.getOrganList}
					on-change={this.organIdChange}
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	productHouse (h) {
		h = this.$createElement
		return (
			<el-form-item label="成品仓库">
				<w-select-tab-mulity
					vModel={this.filter.productHouse}
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
	dosingHouse (h) {
		h = this.$createElement
		return (
			<el-form-item label="配料仓库">
				<w-select-tab-mulity
					vModel={this.filter.dosingHouse}
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
	product (h) {
		h = this.$createElement
		return (
			<el-form-item label="成品品项">
				<w-select-tab-mulity
					vModel={this.filter.product}
					optionlist={this.itemList}
					class="form-input"
					loading={this.itemSelectLoading}
				>
				</w-select-tab-mulity>
			</el-form-item>
		)
	},
	dosing (h) {
		h = this.$createElement
		return (
			<el-form-item label="配料品项">
				<w-select-tab-mulity
					vModel={this.filter.dosing}
					optionlist={this.itemList}
					class="form-input"
					loading={this.itemSelectLoading}
				>
				</w-select-tab-mulity>
			</el-form-item>
		)
	},
	checkDate (h) {
		h = this.$createElement
		return (
			<el-form-item label="审核时间">
				<w-date-picker
					vModel={this.filter.checkDate}
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
	operateMan (h) {
		h = this.$createElement
		return (
			<el-form-item label="经办人">
				<w-select-mulity
					vModel={this.filter.operateMan}
					optionlist={this.operatorList}
					class="form-input"
					showEmpty={false}
				>
				</w-select-mulity>
			</el-form-item>
		)
	}
}