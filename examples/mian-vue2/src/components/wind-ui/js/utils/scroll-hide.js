import throttle from './throttle.js'
const scrollThrottle = throttle()
class ScrollHide {
	constructor () {
		this.popoverList = []
		this.datePickerList = []
		this.selectList = []
		this.selectTabList = []
		this.selectMulityList = []
		this.validateList = []
	}

	add (vnode) {
		const list = this.getList(vnode.$options.fxComponentName)
		const index = list.findIndex(item => {
			return item === vnode
		})
		if (!~index) {
			list.push(vnode)
		}
	}

	remove (vnode) {
		const list = this.getList(vnode.$options.fxComponentName)
		const index = list.findIndex(item => {
			return item === vnode
		})
		if (~index) {
			list.splice(index, 1)
		}
	}

	getList (type) {
		switch (type) {
		case 'w-popover':
			return this.popoverList
		case 'w-date-picker':
			return this.datePickerList
		case 'w-select':
			return this.selectList
		case 'w-select-tab':
			return this.selectTabList
		case 'w-select-mulity':
			return this.selectMulityList
		case 'w-validate':
			return this.validateList
		}
	}

	init () {
		document.addEventListener('scroll', (e) => {
			scrollThrottle(300).then(() => {
				const target = e.target
				this.popoverListHide(target)
				this.datePickerListHide(target)
				this.selectListHide(target)
				this.selectTabListHide(target)
				this.selectMulityListHide(target)
				this.validateListHide(target)
			})
		}, true)
	}

	popoverListHide (target) {
		this.popoverList.forEach(item => {
			const popper = item.$refs.popper
			const isConnectPopover = item.isConnectPopover(target)
			if (popper && !popper.contains(target) && !isConnectPopover) {
				item.doClose()
			}
		})
	}

	datePickerListHide (target) {
		this.datePickerList.forEach(item => {
			const popper = item.picker
			if (popper && !popper.$el.contains(target)) {
				item.handleClose()
			}
		})
	}

	selectListHide (target) {
		this.selectList.forEach(item => {
			const select = item.$refs.select
			if (!(item.$refs.popper && item.$refs.popper.$refs.popper)) {
				return false
			}
			if (!item.$refs.popper.$refs.popper.contains(target) && !select.contains(target)) {
				item.handleClose()
			}
		})
	}

	selectTabListHide (target) {
		this.selectTabList.forEach(item => {
			const popper = item.$refs.popper.$refs.popper
			const select = item.$refs['select-tab']
			if (!popper.contains(target) && !select.contains(target)) {
				item.handleClose()
			}
		})
	}

	selectMulityListHide (target) {
		this.selectMulityList.forEach(item => {
			const popper = item.$refs.popper.$refs.popper
			const select = item.$refs['select-mulity']
			if (!popper.contains(target) && !select.contains(target)) {
				item.handleClose()
			}
		})
	}

	validateListHide (target) {
		this.validateList.forEach(item => {
			const popper = item.$refs.validate.$refs.popper
			if (!popper.contains(target)) {
				item.clear()
			}
		})
	}

	closeAllPopper () {
		this.popoverListHide()
		this.datePickerListHide()
		this.selectListHide()
		this.selectTabListHide()
		this.selectMulityListHide()
		this.validateListHide()
	}
}

export default new ScrollHide()
