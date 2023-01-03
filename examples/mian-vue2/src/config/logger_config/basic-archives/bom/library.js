const createManageOrganMessage = function (item) {
	return `机构名称:${item.name}`
}
export default {
	main: [{
		id: 'name',
		label: 'BOM名称',
		type: 'basic'
	}, {
		id: 'code',
		label: 'BOM编号',
		type: 'basic'
	}, {
		id: 'unitName',
		label: '单位',
		type: 'basic'
	}, {
		id: 'processingCharge',
		label: '加工费',
		type: 'basic'
	}, {
		id: 'recipeCount',
		label: '配方数量',
		type: 'basic'
	}, {
		id: 'outIntoYieldZoom',
		label: '标准出成率',
		type: 'basic'
	}, {
		id: 'fixAmount',
		label: '固定费用',
		type: 'basic'
	}, {
		id: 'isDefault',
		label: '默认BOM',
		type: 'basic',
		handler ({ pre, cur }) {
			const preState = pre ? '是' : '否'
			const curState = cur ? '是' : '否'
			return `是否为默认BOM由"${preState}"改为"${curState}"`
		}
	}],
	details: [{
		id: 'item.name',
		label: '一级配料'
	}, {
		id: 'item.spec',
		label: '规格'
	}, {
		id: 'unit.name',
		label: '单位'
	}, {
		id: 'childBom.name',
		label: '下级BOM'
	}, {
		id: 'outputYieldZoom',
		label: '标准产出率'
	}, {
		id: 'materialDosage',
		label: '净料用量'
	}, {
		id: 'materialRate',
		label: '净料率'
	}, {
		id: 'rawMaterialDosage',
		label: '毛料用量'
	}, {
		id: 'beginDate',
		label: '生效日期'
	}, {
		id: 'endDate',
		label: '失效日期'
	}, {
		id: 'memo',
		label: '备注'
	}, {
		id: 'allOrgan',
		label: '适用机构',
		handler ({ pre, cur }) {
			const preState = pre ? '全部' : '自定义'
			const curState = cur ? '全部' : '自定义'
			return `赠品标记由"${preState}"改为"${curState}"`
		}
	}],
	manage: [{
		id: 'manageOrgan',
		label: '适用机构',
		type: 'connect',
		handler ({ pre, cur }) {
			return this.createDiffMessage({
				label: '适用机构',
				pre,
				cur,
				msgHandler: createManageOrganMessage
			})
		}
	}]
}
