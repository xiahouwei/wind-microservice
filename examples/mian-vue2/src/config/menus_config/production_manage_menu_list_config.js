// 生产管理（MES）菜单设置
export default {
	id: 'production-manage',
	title: '生产管理',
	shortTitle: '生产',
	icon: 'production-manage',
	child: [{
		id: 'production-manage_production-processing',
		title: '生产设置',
		child: [{
			id: 'production-manage_production-processing_work-kind',
			title: '工种信息',
			type: 'productionManage',
			path: 'productionManage',
			query: {
				router: 'main/workKind',
				tagTitle: '工种信息'
			}
		}, {
			id: 'production-manage_production-processing_station',
			title: '工位信息',
			type: 'productionManage',
			path: 'productionManage',
			query: {
				router: 'main/station',
				tagTitle: '工位信息'
			}
		}, {
			id: 'production-manage_production-processing_procedure',
			title: '工序信息',
			type: 'productionManage',
			path: 'productionManage',
			query: {
				router: 'main/procedure',
				tagTitle: '工序信息'
			}
		}, {
			id: 'production-manage_production-processing_process-route',
			title: '工艺路线',
			type: 'productionManage',
			path: 'productionManage',
			query: {
				router: 'main/processRoute',
				tagTitle: '工艺路线'
			}
		}, {
			id: 'production-manage_dosing-default-house',
			title: '配料默认仓库设置',
			path: 'dosingDefaultHouse'
		}]
	},
	{
		id: 'production-manage_production-plan',
		title: '生产计划',
		path: 'productionPlan'
	}, {
		id: 'production-manage_picking-list',
		title: '领料单',
		path: 'pickingList'
	}, {
		id: 'production-manage_process-task',
		title: '工序任务单',
		type: 'productionManage',
		path: 'productionManage',
		query: {
			router: 'main/processTask',
			tagTitle: '工序任务单'
		}
	}, {
		id: 'production-manage_machining-order',
		title: '组合加工单',
		path: 'machiningOrder'
	}, {
		id: 'production-manage_device-information',
		title: '设备信息',
		child: [{
			id: 'production-manage_device-information_device-management',
			title: '设备管理',
			type: 'productionManage',
			path: 'productionManage',
			query: {
				router: 'main/deviceManagement',
				tagTitle: '设备管理'
			}
		}, {
			id: 'production-manage_device-information_maintenance-record',
			title: '维修点检任务',
			type: 'productionManage',
			path: 'productionManage',
			query: {
				router: 'main/maintenanceRecord',
				tagTitle: '维修点检任务'
			}
		}]
	},
	{
		id: 'production-manage_production-board',
		title: '生产看板',
		type: 'productionManage',
		path: 'productionManage',
		query: {
			router: 'main/productionBoard',
			tagTitle: '生产看板'
		}
	}, {
		id: 'production-manage_log-watch',
		title: '生产日志',
		type: 'productionManage',
		path: 'productionManage',
		query: {
			router: 'main/logWatch',
			tagTitle: '生产日志'
		}
	}
	]
}
