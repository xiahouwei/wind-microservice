/**
 * @模块说明 设备操作初始化
 *
 * @版权所有
 * 		天津市神州商龙科技股份有限公司
 * @修改历史
 * 		2014-10-08	李小龙	创建了该模块
 * 		2015-03-14	刘庆魁	完善isReady方法,内部初始化端口修正.
 * 		2015-03-14	于钊		CRM M1卡、IC卡读卡.
 * 		2015-12-04	鞠辰		调整设备管理器初始化，加入销毁方法
 * @requires JQuery
 *
 * TODO LXL 注释.
 * TODO LXL 初始化代码现在在pos设置中和前台都有, 能不能融合到此类中?
 *
 */
var DevicesInit = new function(){


	this.init = function(callback){
		var setting = TGloble.getSetting();
		console.log(setting)

		initVersion(setting, function(){
			initDevice(callback);
		});
		//fastreport初始化
		var report = new FastReport(true);
		TDevices.report = report;
		

//		// CustomReport初始化
		var customreport = new CustomReport(true);
		TDevices.customreport = customreport;

		//客显初始化
		var cusDisplay = new CustomerDisplay();
		TDevices.cusDisplay = cusDisplay;

		//钱箱初始化
		var cbox = new CashBox();
		TDevices.cbox = cbox;

		//电子称初始化参数
		var electronicScale = new ElectronicScale({
			"enabled":setting.pos.enableScale == "true"?1:0,// 是否使用电子秤 1=使用 0=不使用
			"scaleid":Number(setting.pos.scaleMode),// 设备id
			"com":Number(setting.pos.scalePort)// com端口
		});
		TDevices.electronicScale = electronicScale;

		// 副屏
		var viceScreenDevice = new ViceScreenDevice({
			"enabled":setting.pos.enableVice == "true"?1:0// 是否启用副屏 1=使用 0=不使用
		});
		TDevices.viceScreenDevice = viceScreenDevice;

		//一卡通 自动获取卡号 初始化
		var crmM1 = new CrmM1();
		TDevices.crmM1 = crmM1;

		//打开外部可执行文件
		var openExe = new OpenExe();
		TDevices.openExe = openExe;
		//预订单电话来电 初始化
		var incomingTel = new IncomingTel();
		TDevices.IncomingTel = incomingTel;
		//指纹识别初始化
		var fingerprint = new Fingerprint();
		TDevices.fingerprint = fingerprint;
		//易盘初始化
		var easydisk = new Easydisk();
		TDevices.easydisk = easydisk;
		TGloble.isInit = true;
	}
	this.destroy = function() {
		if(TDevices.electronicScale) {
			TDevices.electronicScale.close(function(result){
				if(result.returnCode == -1) {
					$.toast("关闭电子秤失败："+result.returnText,{type:"danger"});
				}
			});
		}
		if(TDevices.viceScreenDevice) {
			ViceApi.viceClose();
		}
	}

	function initDevice(callback) {
		//检测是否需要初始化客显
		if(TDevices.cusDisplay){
			TDevices.cusDisplay.open(); //打开客显
		}

		//检测是否需要初始化并口打印
		if(TDevices.report){
			TDevices.report.init(HTTP_CONTEXTPATH + "/");
		}

//		// 检测是否需要初始化并口打印
//		if(TDevices.customreport){
//			TDevices.customreport.init(HTTP_CONTEXTPATH + "/");
//		}
		//电子秤init、open
		if(TDevices.electronicScale){
			TDevices.electronicScale.init(function(result) {
				if(result.returnCode == -1) {
					$.toast("初始化电子秤失败："+result.returnText,{type:"danger"});
				}
			});

			TDevices.electronicScale.open(function(result){
				if(result.returnCode == -1) {
					$.toast("打开电子秤失败："+result.returnText,{type:"danger"});
				}
			});
		}
		//检测是否需要初始化来电电话
//		if(TDevices.IncomingTel){
//			TDevices.IncomingTel.open(function(result){
//			});
//		}
		if(TDevices.easydisk){
			//先进行关，在初始化易盘和智盘从而打开进行数据传输
//			openEasydisk();
		}
		if(callback){
			callback();
		}
		if(TDevices.fingerprint) {
			TDevices.fingerprint.close(function(result) {})
		}
	}
	//易盘和智盘的初始化函数 暂且不在这调用了
	function openEasydisk(){
		if(isEnableYiPan == 1){
			if(yiPanList.length > 0){
				for(var i=0; i<yiPanList.length; i++){
					var parameter ={
							"OpType":2,
							"IP":"",
							"Port":"",
							"DeviceType":1, 
						    "Com":"COM"+ yiPanList[i].port, 
						    "Rate":yiPanList[i].rate, 
						    "OpFrame":"8E1"
					    }
					setTimeout(function(){
						var uilog = new UILog();
						uilog.info('初始化关闭;' +'当前时间：' + new Date())+'。';
						uilog.submit();
						TDevices.easydisk.cosed(function(result){},parameter);
					},400);
					setTimeout(function(){		
						TDevices.easydisk.open(function(result){
							var uilog = new UILog();
							uilog.info('打开获取数据' + result+';' +'当前时间：' + new Date())+'。';
							uilog.submit();
							BillBsModule.Easydiskdata(result);
						},parameter);
					},1000);
				}
			}	
		}
		if(isEnableZhiPan == 1){
			if(zhiPanList.length > 0){
				for(var i=0; i<zhiPanList.length; i++){
					var parameters ={	
							"OpType":2,
							"IP":"",
							"Port":"",
							"DeviceType":2, 
						    "Com":"COM"+ zhiPanList[i].port, 
						    "Rate":zhiPanList[i].rate, 
						    "OpFrame":"8N1"
						}
					setTimeout(function(){
						TDevices.easydisk.cosed(function(result){},parameters);
					},400);
					setTimeout(function(){
						TDevices.easydisk.open(function(result){
							BillBsModule.Easydiskdata(result)
						},parameters);
					},1000)
				}
			}
		}
	}
	function initVersion(setting, callback) {
		if(setting.site && setting.sys) {
			//是否是win
			var isWin = browser.isWin();
			//当前设备管理器版本
			var curVer = setting.site.dmVersion;
			var curDmPackage = CONTEXTPATH + "/res/file/dm/DeveicMgrSetup_" + curVer + ".exe";
			//初始化TDevices
			if(isWin){
				var cfg = {
					location:"ws://127.0.0.1:5414",
					contextPath : HTTP_CONTEXTPATH,
					cusopen:function(){
						//检测设备管理器更新
						TDevices.checkVersion(curVer,function(result){
							Msg.confirm({
								msg:"设备管理器版本有更新("+ curVer +"),是否更新?",
								ok:function(){
									location.href = curDmPackage;//下载
								}
							});
						});

						if(callback) callback();
					},
					onerror:function(){
						var msg = "设备管理器连接失败，如需并口打印、钱箱、客显，请启动设备管理器。 如未安装请<a href ='" + curDmPackage +"'> 点击下载。</a>";
						if(TDevices.errShowed){
							$.toast("设备管理器连接失败，请启动设备管理器.",{type:"danger"});
							return;
						}
						Msg.warn(msg);
						TDevices.errShowed = true;
					},
					globle_opt:setting
				}
				TDevices.initWS(cfg);
			}

			TDevices.isWin = isWin;
		}
	}
};
