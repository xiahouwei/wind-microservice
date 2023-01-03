export const filterItemConfig = {
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
					optionlist={this.buyerOrganIdList}
					class="form-input"
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
					optionlist={this.sellerOrganIdList}
					class="form-input"
				></w-select-tab-mulity>
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
	// billBizType (h) {
	// 	h = this.$createElement
	// 	return (
	// 		<el-form-item label="业务类型">
	// 			<w-select-mulity
	// 				vModel={this.billBizType}
	// 				optionlist={this.billBizTypeList}
	// 				class="form-input"
	// 			>
	// 			</w-select-mulity>
	// 		</el-form-item>
	// 	)
	// },
	sendState (h) {
		h = this.$createElement
		return (
			<el-form-item label="发单状态">
				<w-select
					vModel={this.sendState}
					optionlist={this.sendStateList}
					class="form-input"
					showEmpty={false}
					clearable={true}
					optionProp={{ name: 'label' }}
				></w-select>
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
	}
}
