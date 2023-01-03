export const filterItemConfig = {
	dateRang (h) {
		h = this.$createElement
		return (
			<el-form-item label="单据时间">
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
				<w-input
					vModel={this.filter.userBillCode}
					placeholder="请输入"
					class="form-input"
				/>
			</el-form-item>
		)
	},
	billState (h) {
		h = this.$createElement
		return (
			<el-form-item label="状态">
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
	organId (h) {
		h = this.$createElement
		return (
			<el-form-item label="入库方">
				<w-select-tab-mulity
					vModel={this.filter.organId}
					optionlist={this.organIdList}
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
					class="form-input"
					on-change={this.otherOrganIdChange}
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	billType (h) {
		h = this.$createElement
		return (
			<el-form-item label="单据类型">
				<w-select-mulity
					vModel={this.filter.billType}
					optionlist={this.billTypeList}
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
	item (h) {
		h = this.$createElement
		return (
			<el-form-item label="品项">
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
	inHouse (h) {
		h = this.$createElement
		return (
			<el-form-item label="入库仓库">
				<w-select-tab-mulity
					vModel={this.filter.inHouse}
					optionlist={this.inHouseList}
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
					vModel={this.filter.otherHouse}
					optionlist={this.outHouseList}
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
				<w-input vModel={this.filter.memo} placeholder="请输入" class="form-input"/>
			</el-form-item>
		)
	}
}
