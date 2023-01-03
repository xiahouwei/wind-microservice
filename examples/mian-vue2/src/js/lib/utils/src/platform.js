// 判断平台 by shw
const platformIs = () => {
	const platformObj = {}
	const userAgent = navigator.userAgent
	if (/mobile/i.test(userAgent)) {
		platformObj.Mobile = true
	}
	if (/like Mac OS X/.test(userAgent)) {
		platformObj.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(userAgent)[2].replace(/_/g, '.')
		platformObj.iPhone = /iPhone/.test(userAgent)
		platformObj.iPad = /iPad/.test(userAgent)
	}
	if (/Android/.test(userAgent)) {
		platformObj.Android = /Android ([0-9\.]+)[\);]/.exec(userAgent)[1]
	}
	if (/webOS\//.test(userAgent)) {
		platformObj.webOS = /webOS\/([0-9\.]+)[\);]/.exec(userAgent)[1]
	}
	if (/(Intel|PPC) Mac OS X/.test(userAgent)) {
		platformObj.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(userAgent)[2].replace(/_/g, '.') || true
	}
	if (/Windows NT/.test(userAgent)) {
		platformObj.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(userAgent)[1]
	}
	if (/MicroMessenger/i.test(userAgent)) {
		platformObj.weixin = true
	}
	if (/Chrome/.test(userAgent)) {
		platformObj.chrome = true
	}
	if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
		platformObj.safari = true
	}
	return platformObj
}


export default {
	platformIs
}
