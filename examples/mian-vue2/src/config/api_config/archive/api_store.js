// import { get, post, put, del } from '@/js/api/dataSource'
import { get, put } from '@/js/api/dataSource'
export default {
	// 仓库接口
	store: {
		// 根据仓库查询关联品项
		getConnectItem (id) {
			return get({ url: `/archive/house/v1/itemhouse/${id}` })
		},
		// 查询除了传入id的所有的仓库
		getStoreExcludeId (houseId) {
			return get({ url: `/archive/house/v1/itemhouse/except/${houseId}/all` })
		},
		// 修改仓库与品项关联关系接口
		saveConnectItem (id) {
			return put({ url: `/archive/house/v1/itemhouse/${id}`, autoSuccessMsg: true })
		},
		// 复制关联关系—仓库到仓库
		copyConnectStore2Store (sourceHouseId, targetHouseId) {
			return put({ url: `/archive/house/v1/itemhouse/${sourceHouseId}/copy/${targetHouseId}`, autoSuccessMsg: true })
		},
		// 根据仓库复制关联品项关系到其他仓库接口
		copyConnectWithStore (id) {
			return put({ url: `/archive/house/v1/itemhouse/${id}/copy`, autoSuccessMsg: true })
		}
	}
}
