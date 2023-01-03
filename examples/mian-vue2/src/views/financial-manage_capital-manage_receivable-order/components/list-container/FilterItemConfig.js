export const filterItemConfig = {
	dateRang (h) {
		h = this.$createElement
		return (
			<el-form-item label="单据时间" label-width={this.labelWidth}>
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
			<el-form-item label="单据号" label-width={this.labelWidth}>
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
			<el-form-item label="状态" label-width={this.labelWidth}>
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
			<el-form-item label="收款机构" label-width={this.labelWidth}>
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
			<el-form-item label="付款机构" label-width={this.labelWidth}>
				<w-select-tab-mulity
					vModel={this.filter.otherOrganId}
					optionlist={this.otherOrganIdList}
					class="form-input"
				></w-select-tab-mulity>
			</el-form-item>
		)
	},
	billType (h) {
		h = this.$createElement
		return (
			<el-form-item label="单据类型" label-width={this.labelWidth}>
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
			<el-form-item label="业务类型" label-width={this.labelWidth}>
				<w-select-mulity
					vModel={this.filter.billBizTypeId}
					optionlist={this.billBizTypeList}
					class="form-input"
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	department (h) {
		h = this.$createElement
		return (
			<el-form-item label="核算部门" label-width={this.labelWidth}>
				<w-select-tab-mulity
					vModel={this.filter.departmentId}
					optionlist={this.departmentList}
					filterKeys={this.departmentFilterKeys}
					optionRender={this.optionRender}
					class="form-input"
				>
				</w-select-tab-mulity>
			</el-form-item>
		)
	},
	invoice (h) {
		h = this.$createElement
		return (
			<el-form-item label="发票号码" label-width={this.labelWidth}>
				<w-input vModel={this.filter.invoiceCode} placeholder="请输入" class="form-input"/>
			</el-form-item>
		)
	},
	operator (h) {
		h = this.$createElement
		return (
			<el-form-item label="经办人" label-width={this.labelWidth}>
				<w-select-mulity
					vModel={this.filter.operateMan}
					optionlist={this.operatorList}
					class="form-input"
					showEmpty={false}
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	sourceType (h) {
		h = this.$createElement
		return (
			<el-form-item label="业务来源" label-width={this.labelWidth}>
				<w-select-mulity
					vModel={this.filter.sourceType}
					optionlist={this.sourceTypeList}
					class="form-input"
					showEmpty={false}
					emptyItem={this.emptyItem}
				>
				</w-select-mulity>
			</el-form-item>
		)
	},
	payWay (h) {
		h = this.$createElement
		return (
			<el-form-item label="客户支付方式" label-width={this.labelWidth}>
				<w-select-mulity
					vModel={this.filter.payWay}
					optionlist={this.payWayList}
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
			<el-form-item label="备注" label-width={this.labelWidth}>
				<w-input vModel={this.filter.memo} placeholder="请输入" class="form-input"/>
			</el-form-item>
		)
	}
}
