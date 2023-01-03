/**
 * @模块说明 设备操作
 *
 * @版权所有
 * 		天津市神州商龙科技股份有限公司
 * @修改历史
 * 		2014-10-08	李小龙	创建了该模块
 * 		2015-03-14	刘庆魁	完善isReady方法,内部初始化端口修正.
 * 		2015-03-14	于钊		CRM M1卡、IC卡读卡.
 * @requires JQuery
 *
 * TODO LXL 注释.
 * TODO LXL 初始化代码现在在pos设置中和前台都有, 能不能融合到此类中?
 *
 */
var TDevices = new function(){

	var tdevs = this;
	tdevs.debug = false;

	//客显对象
	var CustomerDisplay = function(enable,opt){
		this.oper = CustomerDisplay.OPER;
		if(opt){
			this.options = extend({}, CustomerDisplay.DEFAULTS, opt)
			this.oper.params.open = this.options;
			this.isOpen = false;
			this.enable = enable;
			this.useGloble = false;
		}else{
			this.useGloble = true;
			this.setOpt = function(){
				if(!tdevs.isWin) { //不支持非windows
					this.enable = false;
					return;
				}
				var setting = tdevs.globle_opt;
				var cd_enable = setting.pos.enableScreen;//是否启用客显

				var cd_set = { //客显参数
					"typeindex":Number(setting.pos.screenMode),
					"port":Number(setting.pos.screenPort),
					"baudrate":Number(setting.pos.baudRate)
				};
				this.enable = cd_enable == "true";
				this.oper.params.open = cd_set;
			}
		}
	}
	//默认参数
	CustomerDisplay.DEFAULTS = {
		"typeindex":1,
		"port":3,
		"baudrate":9600
	};

	//操作参数
	CustomerDisplay.OPER = {
		cmd:{
			open:"tcsl.cdi.open",
			close:"tcsl.cdi.close",
			clear:"tcsl.cdi.clear",
			price:"tcsl.cdi.display_price",
			total:"tcsl.cdi.display_total",
			pay:"tcsl.cdi.display_pay",
			change:"tcsl.cdi.display_change"
		},
		params:{
			close:{"Param":"CloseCDI"},
			clear:{"Param":"CloseCDI"}
		}
	}

	//调用处理
	CustomerDisplay.prototype.operByName = function(op_name,price){
		var _this = this;
		var _method = _this.oper.cmd[op_name];
		var _params = _this.oper.params[op_name];
		if(price == undefined){
			if(!_params) _params = {};
			tdevs.rpc(GUID(),_method, _params);
		}else{
			tdevs.rpc(GUID(),_method, price);
		}
	}

	//封装调用处理
	CustomerDisplay.prototype.handle = function(op_name,price){
		var _this = this;
		if(_this.useGloble){
			_this.setOpt();
		}
		//console.debug(_this.isOpen);
		if(!_this.enable) {
			//console.debug("尚未启用客显示!");
			return;
		}
		/*
		if(!_this.isOpen){ //打开客显示
			_this.open();
			window.setTimeout(function(){
				_this.operByName(op_name,price);
			},1500);
		}else{*/
			_this.operByName(op_name,price);
		//}
	}
	//打开客显
	CustomerDisplay.prototype.open = function(){
		this.isOpen = true;
		this.handle("open");
	}
	//清空客显
	CustomerDisplay.prototype.clear = function(){
		this.handle("clear");
	}
	//显示单价
	CustomerDisplay.prototype.price = function(m){
		this.handle("price",m);
	}
	//显示应收
	CustomerDisplay.prototype.total = function(m){
		this.handle("total",m);
	}
	//显示收款
	CustomerDisplay.prototype.pay = function(m){
		this.handle("pay",m);
	}
	//显示找零
	CustomerDisplay.prototype.change = function(m){
		this.handle("change",m);
	}
	//关闭客显示
	CustomerDisplay.prototype.close = function(){
		this.handle("close");
	}

	window.CustomerDisplay = CustomerDisplay;

	//钱箱
	var CashBox = function(opt,enable){
		if(opt){
			this.options = extend({}, CashBox.DEFAULTS, opt)
			this.enable = enable;
			this.useGloble = false;
		}else{
			this.useGloble = true;
			//引用参数设置
			this.setOpt = function(){
				if(!tdevs.isWin) { //不支持非windows
					this.enable = false;
					return;
				}
				var setting = tdevs.globle_opt;
				var cb_enable = setting.pos.enableCashbox;//是否启用钱箱

				var cb_type = setting.pos.cashboxStyle;
				var cb_set;
				if(cb_type == "1"){ //按照打印机
					cb_set = {
						"mode":7,
						"cmd":setting.pos.cashboxStartCommand,
						"print_name":setting.pos.cashboxPrint
					}
				}else if(cb_type == "2"){ //按照厂商
					cb_set = {
						"mode": 1,
						"cmd": setting.pos.cashboxStartCommand,
						"print_name": setting.pos.cashboxPrint,
						"wbid": setting.pos.cashboxBrand,
						"wbnum": setting.pos.cashboxBrand == "1005004" ? 'LJRB_001' : setting.pos.cashboxBrandType
					}
				}
				/*这里ip判断是否为空 如果为空得有默认
				if(setting.pos.netConIP != ""){
					cb_set.socket_host = setting.pos.netConIP;
					cb_set.socket_port = setting.pos.netConPort;
				}*/
				if(cb_set){
					this.options = cb_set;
					this.enable = cb_enable == "true" && tdevs.isWin;
				}
			}
		}

	}

	CashBox.DEFAULTS ={
		"mode":2,
		"cmd":"27,112,0,5,254",
		"print_name":"",
		"wbid":1005001,
		"wbnum":""
		//"lpt_port":"LPT1",
		//"socket_host":"127.0.0.1",
		//"socket_port":0,
	}

	CashBox.prototype.open = function(){
		if(this.useGloble){
			this.setOpt();
		}
		if(!this.enable) {
			//console.debug("尚未启用钱箱!");
			return;
		}
		tdevs.rpc(GUID(),"tcsl.cashbox.open", this.options);
	}

	window.CashBox = CashBox;
	//指纹识别用做于授权
	var Fingerprint = function(opt, callback) {
		this.options = extend({},Fingerprint.DEFAULTS, opt);
	};
	//操作参数
	Fingerprint.OPER = {
		cmd:{
			register:"tcsl.Finger.RegisterEmp",//注册指纹
			distinguish:"tcsl.Finger.IdentifyEmp",//识别指纹
			close:"tcsl.Finger.Close"//关闭
		}
	};
	Fingerprint.DEFAULTS = {
		"enabled": 0 //0 代表了未开启指纹识别授权，1开启了
	};
	Fingerprint.prototype.handle = function(opt, callback){
		console.log(224)
		var cmd = Fingerprint.OPER.cmd[opt.cmd];
		var id = GUID();
		if(callback) {
			//注册一个回调事件
			regCallBack(id,cmd,function(result, param){
				callback(result, param);
			}, opt.param);
		}
		tdevs.rpc(id, cmd, opt.param);
	};
	Fingerprint.prototype.register = function(callback,param){
		this.handle({cmd:"register",param: param}, callback);
	};
	Fingerprint.prototype.distinguish = function(callback,param){
		this.handle({cmd:"distinguish",param: param}, callback);
	};
	Fingerprint.prototype.close = function(callback,param){
			this.handle({cmd:"close",param: param}, callback);
	};
	window.Fingerprint = Fingerprint;
	//易盘
	var Easydisk = function(opt, callback){
		this.options = extend({}, Easydisk.DEFAULTS, opt);
		this.opened = false;// 易盘打开标志
	};
	//操作参数
	Easydisk.OPER = {
		cmd:{
			open:"tcsl.ETag.InitETag",
			get:"tcsl.ETag.FreeETag",
			cosed:"tcsl.ETag.FreeETag"
		}
	};
	Easydisk.DEFAULTS = {
		"OpType":2,
		"IP":"",
		"Port":"",
		"Com":"COM1",
		"Rate":"38400",
		"OpFrame":"8E1"
	};
	Easydisk.prototype.handle = function(opt, callback){
		var cmd = Easydisk.OPER.cmd[opt.cmd];
		var id = GUID();
		if(callback) {
			//注册一个回调事件
			regCallBack(id,cmd,function(result, param){
				callback(result, param);
			}, opt.param);
		}
		tdevs.rpc(id, cmd, opt.param);
	};
	Easydisk.prototype.open = function(callback,param){
		this.handle({cmd:"open",param: param}, callback);
		this.opened = true;
	};
	Easydisk.prototype.get = function(callback,param){
		if(this.opened) {
			this.handle({cmd:"get",param: param}, callback);
			this.opened = false;
		}
	};
	Easydisk.prototype.cosed = function(callback,param){
			this.handle({cmd:"cosed",param: param}, callback);
	};
	window.Easydisk = Easydisk;
	// 电话来电
	var IncomingTel = function(opt, callback){
		this.options = extend({}, IncomingTel.DEFAULTS, opt);
		this.opened = false;// 电话链接标志
	}
	IncomingTel.OPER = {
			cmd:{
				open:'tcsl.IncomingTel.cy7_open',
//				get:'tcsl.IncomingTel.cy7_GetTel',
				close:'tcsl.IncomingTel.cy7_close'
			}
	}
	IncomingTel.DEFAULTS = {
			"IT":1,
			"DT":0
		}
	IncomingTel.prototype.handle = function(opt, callback){
//		if(this.options.enabled == 0) {
//			console.debug("电子秤未开启");
//			return;
//		}
		var cmd = IncomingTel.OPER.cmd[opt.cmd];
		var id = GUID();
		if(callback) {
			//注册一个回调事件
			regCallBack(id,cmd,function(result, param){
				callback(result, param);
			}, opt.param);
		}
		tdevs.rpc(id, cmd, this.options);
	}
	IncomingTel.prototype.open = function(callback){
		this.handle({cmd:"open"}, callback);
		this.opened = true;
	}
//	IncomingTel.prototype.get = function(callback, param){
//		this.handle({cmd:"get", param: param}, callback);
//	}
	IncomingTel.prototype.close = function(callback){
		if(this.opened) {
			this.handle({cmd:"close"}, callback);
			this.opened = false;
		}
	}
	window.IncomingTel = IncomingTel;

	// 电子秤
	var ElectronicScale = function(opt, callback){
		this.options = extend({}, ElectronicScale.DEFAULTS, opt);
		this.opened = false;// 电子秤打开标志
	}
	//操作参数
	ElectronicScale.OPER = {
		cmd:{
			init:"tcsl.scale.cy7_setconfig",
			open:"tcsl.scale.cy7_open",
			close:"tcsl.scale.cy7_close",
			get:"tcsl.scale.cy7_get"
		}
	}
	ElectronicScale.DEFAULTS = {
		"enabled":0,// 是否使用电子秤 1=使用 0=不使用
		"scaleid":1,// 设备id
		"com":1// com端口
	}
	ElectronicScale.prototype.handle = function(opt, callback){
		if(this.options.enabled == 0) {
			console.debug("电子秤未开启");
			return;
		}
		var cmd = ElectronicScale.OPER.cmd[opt.cmd];
		var id = GUID();
		if(callback) {
			//注册一个回调事件
			regCallBack(id,cmd,function(result, param){
				callback(result, param);
			}, opt.param);
		}
		tdevs.rpc(id, cmd, this.options);
	}
	ElectronicScale.prototype.init = function(callback){
		this.handle({cmd:"init"}, callback);
	}
	ElectronicScale.prototype.open = function(callback){
		this.handle({cmd:"open"}, callback);
		this.opened = true;
	}
	ElectronicScale.prototype.get = function(callback, param){
		this.handle({cmd:"get", param: param}, callback);
	}
	ElectronicScale.prototype.close = function(callback){
		if(this.opened) {// 只有当电子秤打开时才关闭
			this.handle({cmd:"close"}, callback);
			this.opened = false;
		}
	}
	window.ElectronicScale = ElectronicScale;

	// 副屏
	var ViceScreenDevice = function(opt){
		this.options = extend({}, ViceScreenDevice.DEFAULTS, opt);
		this.reqUrl = "/canyin/pos/vicescreen/view";
	};
	//操作参数
	ViceScreenDevice.OPER = {
		cmd:{
			open:"tcsl.submonitor.open",// 启动
			close:"tcsl.submonitor.close",// 关闭
			send:"tcsl.tosubmonitor"// 发消息
		},
		params:{
			open:{"URL":this.reqUrl},
			send:{"Data":"654321"}
		}
	}
	ViceScreenDevice.DEFAULTS = {
		"enabled":0// 是否使用副屏 1=使用 0=不使用
	}
	ViceScreenDevice.prototype.handle = function(opt, callback){
		if(this.options.enabled == 0) {
			console.debug("副屏未开启");
			return;
		}
		var cmd = ViceScreenDevice.OPER.cmd[opt.cmd];
		var params = opt.param;
//		var params = ViceScreenDevice.OPER.params[opt.cmd];
//		params = extend(params, opt.param);
//		if(open) {
//			params = params.URL;
//		}
		var id = GUID();
		/*if(callback) {
			//注册一个回调事件
			regCallBack(id,cmd,function(result, param){
				callback(result, param);
			}, opt.param);
		}*/
		tdevs.rpc(id, cmd, params);
	}
	ViceScreenDevice.prototype.open = function(paramId, buffet) {
		this.handle({cmd:"open", param: this.reqUrl + "?pointId=" + paramId + '&buffet=' + buffet}/*, callback*/);
	}
	ViceScreenDevice.prototype.close = function() {
		this.handle({cmd:"close"}/*, callback*/);
	}
	ViceScreenDevice.prototype.send = function(data) {
		var _param = {"param":data};
		this.handle({cmd:"send", param: data}/*, callback*/);
	}
	window.ViceScreenDevice = ViceScreenDevice;

	// 打开外部执行文件
	var OpenExe = function(enable){
		if(enable != undefined)
			this.enable = enable;
		else
			this.enable = true;// 未传默认开启
	}

	OpenExe.DEFAULTS ={
		"whichExe":1,
		"event":0
	}

	OpenExe.prototype.handle = function(opt){
		if(!this.enable) {
			dlog("外部程序打开驱动未启用！");
			return;
		}
		this.options = extend({}, OpenExe.DEFAULTS, opt);
		tdevs.rpc(GUID(), "tcsl.execute.open", this.options);
	}

	window.OpenExe = OpenExe;

	//fastreport
	var FastReport = function(enable){
		this.enable = enable;
		this.oper = FastReport.OPER;
		if(!tdevs.isWin) { //不支持非windows
			this.enable = false;
			return;
		}
	}

	FastReport.DEFAULTS = {
		"fileid":0,
		"exporttype":1,
		"printer" : "Microsoft XPS Document Writer"
		//DS1~5
	};

	FastReport.OPER = {
		cmd:{
			printerlist:"tcsl.report.printer_list",
			design:"tcsl.report.design_cldpointfr3",
			preview:"tcsl.report.preview",
			print:"tcsl.report.print",
						download:"tcsl.report.download_cldpointfr3",
						setParams:"tcsl.report.setparam_cldpointfr3",
			export_data:"tcsl.report.export_data",
			seturl:"tcsl.report.set_url",
			asyncprepare:"tcsl.report.async_prepare",
			asyncprint:"tcsl.report.async_print"
		}
	}
	//报表通用操作
	FastReport.prototype.handle = function(op_name,params){
		if(!this.enable) return;
		var _this = this;
		if(!_this.enable) {
			//console.debug("尚未启用报表!");
			return;
		}
		var _method = _this.oper.cmd[op_name];
		if(typeof(params) == "string"){
			tdevs.rpc(GUID(),_method, params);
		}else{
			var _params = extend({}, FastReport.DEFAULTS, params);
			tdevs.rpc(GUID(),_method, _params);
		}
	}
	//设计
	FastReport.prototype.design = function(params){
		this.handle("design",params);
	}
	//预览
	FastReport.prototype.preview = function(params){
		this.handle("preview",params);
	}
	//打印
	FastReport.prototype.print = function(params){
		this.handle("print",params);
	}
		//下载
		/* FastReport.prototype.download = function(params){
				this.handle("download",params);
		}*/
		//下载
		FastReport.prototype.download = function(callback){
			 if(!this.enable) return;
			 var id = GUID();
			 var _method = this.oper.cmd.download;
			 //注册一个回调事件
			 regCallBack(id,_method,function(result){
					 if(callback) callback(result);
			 });
			 tdevs.rpc(id,_method, {});
	 }

		FastReport.prototype.setParams = function(params){
				this.handle("setParams",params);
		}
		//设置参数
	 /* FastReport.prototype.setParams = function(params,callback){
				if(!this.enable) return;
				var id = GUID();
				var _method = this.oper.cmd.setParams;
				//注册一个回调事件
				regCallBack(id,_method,function(result){
						if(callback) callback(result);
				},params);
				tdevs.rpc(id,_method, params);
		}*/

	//异步打印
	FastReport.prototype.asyncprepare = function(params){
		this.handle("asyncprepare",params);
	}
	FastReport.prototype.asyncprint = function(params){
		this.handle("asyncprint",params);
	}

	//导出
	FastReport.prototype.exportdata = function(params){
		this.handle("export_data",params);
	}
	//初始化
	FastReport.prototype.init = function(url){
		var id = GUID();
		var _method = this.oper.cmd["seturl"];
		var _params = url;
		tdevs.rpc(id,_method, _params);
		this.url = url;
		this.inited = true;
	}
	//打印机列表
	FastReport.prototype.printerlist = function(callback){
		if(!this.enable) return;
		var id = GUID();
		var _method = this.oper.cmd.printerlist;
		//注册一个回调事件
		regCallBack(id,_method,function(result){
			if(callback) callback(result);
		});
		tdevs.rpc(id,_method, {});
	}

	window.FastReport = FastReport;

	//CustomReport
	var CustomReport = function(enable){
		this.enable = enable;
		this.oper = CustomReport.OPER;
		if(!tdevs.isWin) { //不支持非windows
			this.enable = false;
			return;
		}
	}

	CustomReport.DEFAULTS = {
		"fileid":0,
		"exporttype":1,
		"printer" : "Microsoft XPS Document Writer"
		//DS1~5
	};
	CustomReport.OPER = {
		cmd:{
			abandon:"tcsl.CustomReport.qfbz_print_fd",
			item:"tcsl.CustomReport.qfbz_print_px",
			business:"tcsl.CustomReport.qfbz_print_yy",
			datatime:"tcsl.CustomReport.qfbz_print_sd",
			reckoningbill:"tcsl.CustomReport.qfbz_print_jz",
			toatalbill:"tcsl.CustomReport.qfbz_print_zd"
		}
	}


	//庆丰包子四个专属打印
		CustomReport.prototype.handle = function(op_name,params){
		if(!this.enable) return;
		var _this = this;
		if(!_this.enable) {
			//console.debug("尚未启用报表!");
			return;
		}
		var _method = _this.oper.cmd[op_name];
		if(typeof(params) == "string"){
			tdevs.rpc(GUID(),_method, params);
		}else{
			var _params = extend({}, FastReport.DEFAULTS, params);
			tdevs.rpc(GUID(),_method, _params);
		}
	}

	//废单打印
//	debugger;
	CustomReport.prototype.abandon = function(params){
		this.handle("abandon",params);
	}
	//品相打印
	CustomReport.prototype.item = function(params){
		this.handle("item",params);
	}
	//营业打印
	CustomReport.prototype.business = function(params){
		this.handle("business",params);
	}
	//时段打印
	CustomReport.prototype.datatime = function(params){
		this.handle("datatime",params);
	}

	//结账单打印
	CustomReport.prototype.reckoningbill = function(params){
		this.handle("reckoningbill",params);
	}

	//总单打印
	CustomReport.prototype.toatalbill = function(params){
		this.handle("toatalbill",params);
	}

	window.CustomReport = CustomReport;
	//版本获取
	var Version = function(){
		this.oper = Version.OPER;
	}

	Version.OPER = {
		cmd:{
			getversion:"tcsl.devicemgr.get_version"
		}
	}

	Version.prototype.getversion = function(callback){
		var id = GUID();
		var _method = this.oper.cmd.getversion;
		//注册一个回调事件
		regCallBack(id,_method,function(result){
			if(callback) callback(result);
		});
		tdevs.rpc(id,_method, {});
	}

	//打印操作
	var DevicePrint = function(url){
		if(url) this.url = url;
		this.oper = DevicePrint.OPER;
	}

	DevicePrint.OPER = {
		cmd:{
			preview:"tcsl.xlsprint.preview",
			print:"tcsl.xlsprint.print",
		}
	}

	DevicePrint.prototype.handle = function(url,oper){
		if(this.url || url ){
			url = this.url;
			var id = GUID();
			tdevs.rpc(id,oper,url);
		}
	}

	//打印
	DevicePrint.prototype.print = function(url){
		this.handle(url,this.oper.cmd.print);
	}

	//预览
	DevicePrint.prototype.preview = function(url){
		this.handle(url,this.oper.cmd.preview);
	}

	window.DevicePrint = DevicePrint;

	/** CRM M1卡、IC卡读卡 begin */
	var CrmM1 = function(enable){
		this.enable = enable;
		this.oper = CrmM1.OPER;
	}

	CrmM1.DEFAULTS = {
		//读卡器类型--1=4442 2=330
		"mode":1,
		//COM端口号--mode=1是必须指定
		"comport":1,
		//COM波特率--mode=1是必须指定
		"comrate" : "9600",
		//IC卡的PIN码
		"pin" : "000003"
	};

	CrmM1.OPER = {
		cmd:{
			readno:"tcsl.cardop.read_no"
		}
	}
	//报表通用操作
	CrmM1.prototype.handle = function(op_name,params, callback){
		if(!tdevs.isWin) { //不支持非windows
			this.enable = false;
			return;
		}
		var _this = this;
		if(!_this.enable) {
			return;
		}
		var _method = _this.oper.cmd[op_name];
		var _params = extend({}, CrmM1.DEFAULTS, params);
		var id = GUID();
		if(callback) {
			//注册一个回调事件
			regCallBack(id,_method,function(result){
				if(callback) callback(result);
			});
		}
		tdevs.rpc(id,_method, _params);
	}

	//读卡
	CrmM1.prototype.readno = function(params, callback){
		this.handle("readno", params, callback);
	}

//	//设计
//	CrmM1.prototype.design = function(params){
//		this.handle("design",params);
//	}
//	//预览
//	CrmM1.prototype.preview = function(params){
//		this.handle("preview",params);
//	}
//	//打印
//	CrmM1.prototype.print = function(params){
//		this.handle("print",params);
//	}
//	//导出
//	CrmM1.prototype.exportdata = function(params){
//		this.handle("export_data",params);
//	}
//	//初始化
//	CrmM1.prototype.init = function(url){
//		var id = GUID();
//		var _method = this.oper.cmd["seturl"];
//		var _params = url;
//		tdevs.rpc(id,_method, _params);
//		this.url = url;
//		this.inited = true;
//	}
//	//打印机列表
//	CrmM1.prototype.readno = function(params, callback){
//		var id = GUID();
//		var _method = this.oper.cmd.readno;
//		//注册一个回调事件
//		regCallBack(id,_method,function(result){
//			if(callback) callback(result);
//		});
//		tdevs.rpc(id,_method, params);
//	}

	window.CrmM1 = CrmM1;
	/** CRM M1卡读卡 begin */

	//socket 归属TDevices
	var socket;
	//回调函数集合
	var _callbak_keys=[],_callbak_funcs=[];

	//注册回调事件
	var regCallBack = function(id,cmd,func,data){
		_callbak_keys.push(id);
		_callbak_funcs.push({
			id:id,
			cmd:cmd,
			func:func,
			data:data
		})
	}

	//根据id查找注册的回调
	var findCallBack = function(id){
		for (var i=0; i < _callbak_keys.length; i++) {
				if(_callbak_keys[i] == id) return _callbak_funcs[i];
		}
		return null;
	}

	//根据命令查找集合
	var findCallBacks = function(cmd){
		var funcs = [];
		for (var i=0; i < _callbak_funcs.length; i++) {
				if(_callbak_funcs[i].cmd == cmd)
					funcs.push(extend({},_callbak_funcs[i]));
		}
		return funcs;
	}

	//wsocket所需要的参数
	var _setting = {
		location:"ws://127.0.0.1:5414",
		onerror:function(event){
			/*
			if(tdevs.errShowed){
				return;
			}*/
			if(_setting.cuserr){
				_setting.cuserr();
			}

			if(_setting.errCallBack){
				_setting.errCallBack();
				_setting.errCallBack = false;
			}else{
				if(event.message){
					if(typeof($) != "undefined") $.toast(event.message,{type:"danger"});
					else if(typeof(tcsl) != "undefined") tcsl.Toast.warn(event.message);
				}else{
					if(typeof($) != "undefined") $.toast("设备连接失败",{type:"danger"});
					else if(typeof(tcsl) != "undefined") {
						var msg = "设备连接失败";
						if(tdevs.curDmPackage){ //如果有下载包链接
							msg = "设备管理器连接失败，如需并口打印、钱箱、客显，请启动设备管理器 <br/>如未安装请<a href ='" + tdevs.curDmPackage +"'>点击下载</a>";
						}
						tcsl.Msg.warn(msg);
					}
				}
				tdevs.errShowed = true;
			}
		},
		onopen:function(event){
			if(_setting.cusopen){
				_setting.cusopen();
			}

			if(_setting.initCallBack){
				_setting.initCallBack();
				_setting.initCallBack = false;
			}
		},
		onsgcrpcresult:function(m){
			//console.debug("onsgcrpcresult~!!!");
			var result = obj.result;
			var id = obj.id;
			var funcObj = findCallBack(id);
			if(funcObj)
				funcObj.func(obj.result,funcObj.data);
		}
	};

	this.opt = _setting;

	/**
	 * @public
	 * @return {Boolean}
	 */
	this.isReady = function(){
		//2015-3-14 处理socket未初始化的情况 lqk
		if( socket )
			return socket.state() == "open";

		return false;
	};

	//socket是否关闭状态
	this.isClose = function(){
		return socket.state() == "close";
	};

	//rpc协议请求
	this.rpc = function(id,method,params){
		if(this.notSupper) return;
		dlog("rpc params before :" , params);

		if(typeof params == "object"){
			params = JSON.stringify(params);
		}

		params = Base64.encode(params);
		params = '{"v":"'+ params +'"}';

		//params = JSON.stringify(params);

		dlog("rpc params after :" , params);

		if(socket != null && tdevs.isReady()){ //如果是open状态
			socket.rpc(id,method, params); //直接调用
		}else{
			var initCallBack = function(){
				socket.rpc(id,method, params);
			}
			this.initWS({initCallBack:initCallBack}); //检测socket是否初始化
		}
	}

	//获取设备管理器版本
	this.getVersion = function(callback){
		var ver = new Version();
		var version = ver.getversion(function(result){
			if(callback) callback(result);
		});
	}

	//检测是否有版本更新
	this.checkVersion = function(sversion,callback){
		if(!sversion) return;
		this.getVersion(function(result){
			var dmVer = result.message.version; //版本号为1.0.39(格式xx.xx.xx);
			/* 2015-3-26 更改
			var ver = dmVer.split(".");
			var sver = sversion = sversion.split("."); //服务器版本
			if(ver.length != sver.length ) return;
			var isup = false;
			for (var i=0; i < ver.length; i++) {
				if(Number(sver[i]) > Number(ver[i])){
				isup = true;
				break;
				}
			};
			if(isup){ //如果服务器版本>当前版本提示更新
				callback(result);
			}*/
			if(sversion != dmVer){
				callback(result);
			}

		});
	}

	//设置初始化回调
	this.setInitCallBack = function(fun){
		if(fun)
			_setting.initCallBack = fun;
	}

	function extend(){
		var  copy, name,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length;
		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				for ( name in options ) {
					copy = options[ name ];
					if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
		return target;
	}

	//合并ws参数
	function getWsSetting(opt){
		_setting = extend(_setting,opt);
		return _setting;
	}

	//设置ws参数
	function setAttr(socket,setting){
		for(var key in setting){
			var index = key.indexOf("on");
			if(index == 0){
				if(setting[key]){
					socket.on(key.substring(2,key.length), setting[key]);
				}
			}
		}
		if(setting.globle_opt) tdevs.globle_opt = setting.globle_opt;
	}


	this.init = function () {
		//var p = $.Deferred();
		if(!socket){
			p = $.Deferred();
		}else{
			if(socket.state() == "closed" || socket.state() == "closing"){
				p = $.Deferred();
			}
		}
		this.initWS({
			onerror: p.reject,
			cusopen: p.resolve
		});
		return p.promise();
	};

	//初始化ws
	this.initWS = function(opt, callback){
		if (!window.WebSocket){
			this.notSupper = true;
			return;
		}

		if(!socket){
			var setting = getWsSetting(opt);
			socket = new sgcws(setting.location);
			setAttr(socket,setting);
		}else{
			if(socket.state() == "closed" || socket.state() == "closing"){
				var setting = getWsSetting(opt);
				socket = new sgcws(setting.location);
				setAttr(socket,setting);
			}
		}
		if(callback) {
			callback();
		}
	};

	function dlog(m,o){
		if(tdevs.debug){
			console.debug(m);
			if(o) console.debug(o);
		}
	}
};
