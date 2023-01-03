
export default [{
	size: '6x4',
	handler (printData, filter) {
		const loadop = window.getCLodop()
		loadop.PRINT_INIT('品项条码打印')
		loadop.SET_PRINT_PAGESIZE(1, 600, 400, '')
		if (filter.includes('code')) {
			loadop.ADD_PRINT_TEXT(10, 10, 260, 20, printData.code)
		}
		if (filter.includes('spec')) {
			loadop.ADD_PRINT_TEXT(30, 10, 260, 20, printData.spec)
		}
		if (filter.includes('unit')) {
			loadop.ADD_PRINT_TEXT(30, 120, 260, 20, printData.unit)
		}
		loadop.ADD_PRINT_BARCODE(50, 20, 200, 50, '128Auto', printData.barcode)
		if (filter.includes('name')) {
			loadop.ADD_PRINT_TEXT(110, 10, 260, 20, printData.name)
		}
		if (filter.includes('refCostPrice')) {
			loadop.ADD_PRINT_TEXT(130, 10, 260, 20, printData.refCostPrice)
		}
		if (filter.includes('refSellingPrice')) {
			loadop.ADD_PRINT_TEXT(130, 120, 260, 20, printData.refSellingPrice)
		}
		loadop.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', true)
		loadop.PREVIEW()
	}
}]
