
var APIConsole = function(sAppid) {

	var sPlatformLocation, sServiceLocation;
	var aDefaultLocations = [];

	var sEmail;
	var sPassword;

	var aSessions = [];
	var sCurrentAppid = sAppid;
	var sCurrentSession = '';

	var aAppidList = [];
	var aAppidAddList = [];
	aAppidList[sAppid] = "API Консоль";

	var aServiceTab = [];
	var sCurrentTab = "";

	if(Cookies.Get("ApplicationID")) sCurrentAppid = Cookies.Get("ApplicationID");
	else Cookies.Set("ApplicationID", sAppid);
	if(Cookies.Get("Session")) sCurrentSession = Cookies.Get("Session");

	function ClientConstruct(sClientName) {

		id("error").style.display = "none";

		var sNamespace = sClientName.split('.')[0];
		var sServiceName = sClientName.split('.')[1];
		
		if(!window[sNamespace]) {
			id("error").innerHTML = "Пространство имен не найдено.";
			id("error").style.display = "block";
			return false;
		}
		if(!window[sNamespace][sServiceName]) {
			id("error").innerHTML = "Сервис не найден.";
			id("error").style.display = "block";
			return false;
		}

		var oClient = window[sNamespace][sServiceName];

		var sLocation = oClient.oServiceBind.sLocation;

		// Save default location.
		if(!aDefaultLocations[sClientName]) aDefaultLocations[sClientName] = sLocation;
		else sLocation = aDefaultLocations[sClientName];

		sPlatformLocation = SplitLocation(sLocation).sPlatformLocation;
		sServiceLocation = SplitLocation(sLocation).sServiceLocation;

		if(Cookies.Get("Location")) sPlatformLocation = Cookies.Get("Location");
		else Cookies.Set("Location", sPlatformLocation);
		if(Cookies.Get(sClientName + ".Location")) sServiceLocation = Cookies.Get(sClientName + ".Location");
		else Cookies.Set(sClientName + ".Location", sServiceLocation);

		oClient.oServiceBind.sLocation = sPlatformLocation + sServiceLocation;

		id("client-platform-url").value = sPlatformLocation;
		id("client-service-url").value = sServiceLocation;

		id("client-service-change-url").onclick = function() {
			sPlatformLocation = id("client-platform-url").value;
			sServiceLocation = id("client-service-url").value;
			Cookies.Set("Location", sPlatformLocation);
			Cookies.Set(sClientName + ".Location", sServiceLocation);
			oClient.oServiceBind.sLocation = sPlatformLocation + sServiceLocation;

			if(Cookies.Get("Users.Authentication.Location"))
				Users.Authentication.oServiceBind.sLocation = sPlatformLocation + Cookies.Get("Users.Authentication.Location");
			if(Cookies.Get("Development.Applications.Location"))
				Development.Applications.oServiceBind.sLocation = sPlatformLocation + Cookies.Get("Development.Applications.Location");
		}

		id("client-service-default-url").onclick = function() {
			sDefaultLocation = aDefaultLocations[sClientName];
			oClient.oServiceBind.sLocation = sDefaultLocation;
			sPlatformLocation = SplitLocation(sDefaultLocation).sPlatformLocation;
			sServiceLocation = SplitLocation(sDefaultLocation).sServiceLocation;
			id("client-platform-url").value = sPlatformLocation;
			id("client-service-url").value = sServiceLocation;
			Cookies.Set("Location", sPlatformLocation);
			Cookies.Set(sClientName + ".Location", sServiceLocation);
			Users.Authentication.oServiceBind.sLocation = aDefaultLocations["Users.Authentication"];
			Development.Applications.oServiceBind.sLocation = aDefaultLocations["Development.Applications"];
		}

		if(!aServiceTab[sClientName]) {
			var oServiceTab = document.createElement("div");
			oServiceTab.id = sClientName;
			id("client-operations").appendChild(oServiceTab);
			aServiceTab[sClientName] = oServiceTab;			
			if(aServiceTab[sCurrentTab]) aServiceTab[sCurrentTab].style.display = "none";
			sCurrentTab = sClientName;
			aServiceTab[sCurrentTab].style.display = "";
		} else {
			if(aServiceTab[sCurrentTab]) aServiceTab[sCurrentTab].style.display = "none";
			sCurrentTab = sClientName;
			aServiceTab[sCurrentTab].style.display = "";
			SetConsoleParamValue("appid", sCurrentAppid);
			SetConsoleParamValue("session", sCurrentSession);
			return;
		}

		var aMethods = oClient.oServiceBind.aOperationLocation;

		var nCount = 0, nColumns = 0;

		for(var sMethodName in aMethods) nColumns++;
		
		nColumns = parseInt(nColumns/10) + 1;
		if(nColumns > 3) nColumns = 3;

		var sClientMethods = "<table class='client-methods'><tbody><tr>";
		for(var sMethodName in aMethods) {

			if(!(nCount % 8)) sClientMethods += "<td valign='top'>";

			/*alert(!nCount % 10);*/

			/*if(nCount % nColumns) sClientMethods += "<td valign='top'>";
			else sClientMethods += "<tr><td valign='top'>";*/

			sClientMethods += "<div class='code-hide'><div class='code-header' onclick=\"" +
				"var className=this.parentNode.className;if(className=='code-hide'){this.parentNode.className='code-show';" +
				"}else{this.parentNode.className='code-hide';}\"><b>" +
				sMethodName +
				"</b></div><div class='code-sample'>" +
				"<table><tbody>";

			var aInput = oClient[sMethodName + "Input"];
			if(aInput) {
				for(var sParamName in aInput) {
					var sInputId = sMethodName + ":" + sParamName;
					sClientMethods += "<tr><td valign='top'>" + sParamName + "</td><td>";
					if(aInput[sParamName] == "file") {
						sClientMethods += "<input id='" + sInputId + "' type='file' style='width: 250px' />";
					} else if(aInput[sParamName] == "boolean") {
						sClientMethods += "<select id='" + sInputId + "'><option value='false'>false</option><option value='true'>true</option></select>";
					} else {
						if(sParamName == "fields" || sParamName == "value" || sParamName == "data" || sParamName == "criteria" || sParamName == "code") {
							sClientMethods += "<textarea id='" + sInputId + "' style='width: 252px; height: 80px;'></textarea>";
						} else if(sParamName == "request") {
							sClientMethods += "<textarea id='" + sInputId + "' style='width: 500px; height: 250px;'></textarea>";
						} else if(sParamName == "session") {
							sClientMethods += "<input id='" + sInputId + "' value='" + sCurrentSession + "' style='width: 250px' />";
						} else if(sParamName == "appid") {
							sClientMethods += "<input id='" + sInputId + "' value='" + sCurrentAppid + "' style='width: 250px' readonly />";
						} else {
							sClientMethods += "<input id='" + sInputId + "' style='width: 250px' />";
						}
					}
					sClientMethods += "</td></tr>";
				}
				sClientMethods += "<tr><td colspan='2'><input id=\"" + sMethodName + "\" type=\"button\" value=\"" + sMethodName + "\" /></td></tr>";
			}

			sClientMethods += "<tr><td colspan='2'><div id=\"" + sMethodName + "Response\"></div></td></tr></tbody></table></div></div>";

			/*if(nCount % nColumns == nColumns - 1) sClientMethods += "</td></tr>";
			else sClientMethods += "</td>";*/

			if(nCount % 8 == 7) sClientMethods += "</td>";

			nCount++;			

		}

		sClientMethods += "</td></tr></tbody></table>";

		id(sClientName).innerHTML = sClientMethods;

		for(var sMethodName in aMethods) {
			id(sMethodName).onclick = function() {
				var sMethodName = this.id;
				id(sMethodName + "Response").innerHTML = '';
				var oRequest = {};
				var aInput = oClient[sMethodName + "Input"];
				if(aInput) {
					for(var sParamName in aInput) {			
						var sInputId = sMethodName + ":" + sParamName;
						if(aInput[sParamName] == "file") {						
							oRequest[sParamName] = id(sInputId);
						} else if(aInput[sParamName] == "boolean") {
							oRequest[sParamName] = id(sInputId).options[id(sInputId).options.selectedIndex].value;
						} else {
							if(id(sInputId).value)
								oRequest[sParamName] = id(sInputId).value;							
						}
					}
				}
				oClient[sMethodName](oRequest, function(oResponse) {
					var sResponse = "";
					if(oResponse) {

						if(sMethodName == "Signin" && oResponse.result == 0) {

							sEmail = oRequest.email;
							sPassword = oRequest.password;

							if(oResponse.name) id("developer-welcome").innerHTML = "Разработчик " + oResponse.name;
							else id("developer-welcome").innerHTML = "Разработчик " + oRequest.email;

							sCurrentSession = oResponse.session;
							Cookies.Set("Session", sCurrentSession);

							aAppidList = [];
							aAppidList[sAppid] = "API Консоль";					

							Development.Applications.GetApps(sCurrentAppid, sCurrentSession, function(oResponse) {							
								if(oResponse.result == 0 && oResponse.apps) {
									for(var i=0; i<oResponse.apps.length; i++) {
										aAppidList[oResponse.apps[i].appid] = oResponse.apps[i].name;
										if(!Session.Get(oResponse.apps[i].appid))
											Session.Set(oResponse.apps[i].appid, "");
									}
									FillConsoleAppid();
								}
							});
						}

						if(sMethodName == "Signout" && oResponse.result == 0) {
							sPassword = '';
							sCurrentAppid = sAppid;
							sCurrentSession = '';
							Cookies.Set("ApplicationID", sCurrentAppid);
							Cookies.Set("Session", sCurrentSession);

							SetConsoleParamValue("appid", sCurrentAppid);
							SetConsoleParamValue("session", sCurrentSession);

							id("developer-welcome").innerHTML = "";

							// Set default appid list.
							aAppidList = [];
							aAppidList[sAppid] = "API Консоль";
							FillConsoleAppid();
						}

						if(sMethodName == "GetApps" && oResponse.result == 0) {
							if(oResponse.apps) {
								for(var i=0; i<oResponse.apps.length; i++)
									aAppidList[oResponse.apps[i].appid] = oResponse.apps[i].name;
								FillConsoleAppid();
							}
						}

						if(sMethodName == "GenerateApp" && oResponse.result == 0) {
							aAppidList[oResponse.appid] = oRequest.name;
							FillConsoleAppid();
						}

						if(sMethodName == "DeleteApp" && oResponse.result == 0) {
							delete aAppidList[oRequest["targetAppid"]];
							FillConsoleAppid();
							if(sCurrentAppid == oRequest["targetAppid"]) {
								SetConsoleAppid();
							}
						}

						if(oResponse["session"]) {
							sCurrentSession = oResponse["session"];
							Session.Set(sCurrentAppid, sCurrentSession);
							Cookies.Set("Session", sCurrentSession);
							SetConsoleParamValue("session", sCurrentSession);
						}

						var sR = toSource(oResponse);

						sResponse += "<div><div align='right'><a href='javascript:void(0);' onclick='this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);'><small>Очистить ответ</small></a></div><textarea class='response' readonly>" 
							+ "</textarea>" + (bIsIE ? "</div>" : "<div class='textarea-resizer' title='Двигайте для изменения высоты'></div></div>");				
					}
					id(sMethodName + "Response").innerHTML = sResponse;

					var oTextArea = id(sMethodName + "Response").getElementsByTagName("textarea")[0];
					oTextArea.value = sR.substring(3, sR.length-2); 

					if(!bIsIE) {
						var oResizer = id(sMethodName + "Response").getElementsByTagName("div")[2];
						oResizer.onmousedown = function(oEvent) {
					  		if(!oEvent) oEvent = window.event;
							this.dragStartY = oEvent.clientY;
							this.dragStartH = parseFloat(getElementComputedStyle(oTextArea, "height"));
							var _T = this;
							document.addEventListener("mousemove", this.dragMoveHdlr = function(oEvent) {
								if(!oEvent) oEvent = window.event;
								oTextArea.style.height = _T.dragStartH + oEvent.clientY  - _T.dragStartY + "px";
								return false;
							}, false);
							document.addEventListener("mouseup", this.dragStopHdlr = function(oEvent) {
								document.removeEventListener("mousemove", _T.dragMoveHdlr, false);
								document.removeEventListener("mouseup", _T.dragStopHdlr, false);
							}, false);
							return false;
						}
					}

				});
			}
		}

		id("client-content").style.display = "block";

	}

	function SplitLocation(sLocation) {
		var oResult = { sPlatformLocation : "", sServiceLocation : "" };
		sLocation.replace(/(.*\/[\d.]*\/)(.*)/i, function() {
			oResult = {
				sPlatformLocation : arguments[1],
				sServiceLocation : arguments[2]
			};
		});	
		return oResult;
	}

	function SetOptionByValue(oSelect, value) {
		var aOptions = oSelect.options;
		for(var i=0; i<aOptions.length; i++) {
			if(aOptions[i].value == value) {
				aOptions.selectedIndex = i;
				return true;
			}
		}
		return false;
	}

	function FillConsoleAppid() {
		id("appid-list").options.length = 0;
		for(var sAppid in aAppidList) {
			var oOption = document.createElement("option");
			oOption.value = sAppid;
			oOption.innerHTML = aAppidList[sAppid];
			id("appid-list").appendChild(oOption);
		}
		for(var sAppid in aAppidAddList) {
			var oOption = document.createElement("option");
			oOption.value = sAppid;
			oOption.innerHTML = aAppidAddList[sAppid];
			id("appid-list").appendChild(oOption);
		}
		SetOptionByValue(id("appid-list"), sCurrentAppid);
	}

	function AddConsoleAppid() {
		id("appid-add-block").style.display = "block";
		id("appid-add-ok").onclick = function() {
			if(!id("appid-add-value").value) return;
			sCurrentAppid = id("appid-add-value").value;
			aAppidAddList[sCurrentAppid] = sCurrentAppid;
			FillConsoleAppid();
			SetConsoleAppid();
			id("appid-add-block").style.display = "none";
			id("appid-add-value").value = "";
		}
		id("appid-add-cancel").onclick = function() {
			id("appid-add-block").style.display = "none";
			id("appid-add-value").value = "";
		}
	}

	function SetConsoleAppid() {

		sCurrentAppid = id("appid-list").options[id("appid-list").options.selectedIndex].value;
		Cookies.Set("ApplicationID", sCurrentAppid);
		SetConsoleParamValue("appid", sCurrentAppid);

		Development.Applications.AllowAppAccess(sAppid, sCurrentSession, sCurrentAppid, sAppid, function(oResponse) {
			if(oResponse.result != 0) {
				sCurrentSession = "Выполните Signin под активным идентификатором.";
				SetConsoleParamValue("session", sCurrentSession);
			}
		});

		/*
		sCurrentSession = Session.Get(sCurrentAppid);
		if(sCurrentSession) {
			SetConsoleParamValue("session", sCurrentSession);
			Cookies.Set("Session", sCurrentSession);
		} else {		
			if(sPassword) {
				Users.Authentication.Signin(sCurrentAppid, sEmail, sPassword, function(oResponse) {
					if(oResponse.result === 0) {
						sCurrentSession = oResponse.session;
						Session.Set(sCurrentAppid, sCurrentSession);
						Cookies.Set("Session", sCurrentSession);
						SetConsoleParamValue("session", sCurrentSession);
					} else if(oResponse.result === 11) {}
				});
			} else {
				sCurrentSession = "Выполните Signin под активным идентификатором.";
				SetConsoleParamValue("session", sCurrentSession);
			}
		}*/
	}

	function SetConsoleParamValue(sName, sValue) {
		if(!id(sCurrentTab)) return;
		var aInputFields = id(sCurrentTab).getElementsByTagName('input');	
		for(var i=0; i<aInputFields.length; i++) {
			if(aInputFields[i].id.match(":" + sName))
				aInputFields[i].value = sValue;
		}
	}
	
	function GetTarget(oEvent) {
		var oTarg;
		if (!oEvent) var oEvent = window.event;
		if (oEvent.target) oTarg = oEvent.target;
		else if (oEvent.srcElement) oTarg = oEvent.srcElement;
		if (oTarg.nodeType == 3)
			oTarg = oTarg.parentNode;
		return oTarg;
	}

	//
	// Constructor.
	//

	FillConsoleAppid();

	// Prepare paths.
	aDefaultLocations["Users.Authentication"] = Users.Authentication.oServiceBind.sLocation;
	aDefaultLocations["Development.Applications"] = Development.Applications.oServiceBind.sLocation;

	if(Cookies.Get("Location")) sPlatformLocation = Cookies.Get("Location");
	else {
		sPlatformLocation = SplitLocation(aDefaultLocations["Users.Authentication"]).sPlatformLocation;
		Cookies.Set("Location", sPlatformLocation);
	}

	if(Cookies.Get("Users.Authentication.Location")) sServiceLocation = Cookies.Get("Users.Authentication.Location");
	else {
		sServiceLocation = SplitLocation(aDefaultLocations["Users.Authentication"]).sServiceLocation;
		Cookies.Set("Users.Authentication.Location", sServiceLocation);
	}
	Users.Authentication.oServiceBind.sLocation = sPlatformLocation + sServiceLocation;

	if(Cookies.Get("Development.Applications.Location")) sServiceLocation = Cookies.Get("Development.Applications.Location");
	else {
		sServiceLocation = SplitLocation(aDefaultLocations["Development.Applications"]).sServiceLocation;
		Cookies.Set("Development.Applications.Location", sServiceLocation);
	}
	Development.Applications.oServiceBind.sLocation = sPlatformLocation + sServiceLocation;

	// Set events.
	id("client-operations").onkeypress = function(oEvent) {
		var nKeyCode;
		if(!oEvent) nKeyCode = window.event.keyCode;
		else nKeyCode = oEvent.which;
		if(nKeyCode == 13 || nKeyCode == 10) {
			var oTarget = GetTarget(oEvent);
			if(oTarget.tagName.toLowerCase() != "textarea" && oTarget.id.indexOf(":") != -1) {
				var sMethodName = oTarget.id.split(":")[0];
				if(id(sMethodName)) id(sMethodName).onclick();
			}
		}
	}

	id("services-list").onchange = function() {
		var sClientName = this.options[this.options.selectedIndex].value;
		if(!sClientName) return false;
		location.href = window.location.protocol + "//" + window.location.host + window.location.pathname + "#" + sClientName;
		if(sClientName == "Utils.Batch") id("http-method-switcher").style.display = "inline";
		else id("http-method-switcher").style.display = "none";
		return ClientConstruct(sClientName); 
	}

	id("appid-list").onchange = function() { SetConsoleAppid(); }
	id("appid-add").onclick = function() { AddConsoleAppid(); }
	
	id("http-method-switcher").onclick = function() {
		if(GBatchHttpSwitcher) {
			this.value = "POST";
			GBatchHttpSwitcher = false;
		} else {
			this.value = "GET";
			GBatchHttpSwitcher = true;				
		}
	}

	var sClientName = location.href.split("#")[1];
	if(sClientName) {
		if(SetOptionByValue(id("services-list"), sClientName)) {
			if(sClientName == "Utils.Batch") id("http-method-switcher").style.display = "inline";
			else id("http-method-switcher").style.display = "none";
			ClientConstruct(sClientName);
		}
	}

	// Check user.
	Users.Authentication.CheckSign(sCurrentAppid, sCurrentSession, function(oResponse) {
		if(oResponse.result === 0) {
			sCurrentSession = oResponse.session;
			Session.Set(sCurrentAppid, sCurrentSession);
			Cookies.Set("Session", sCurrentSession);
			SetConsoleParamValue("session", sCurrentSession);

			if(oResponse.name) id("developer-welcome").innerHTML = "Разработчик " + oResponse.name;
			else id("developer-welcome").innerHTML = "Разработчик " + oResponse.email;

			Development.Applications.GetApps(sCurrentAppid, sCurrentSession, function(oResponse) {
				if(oResponse.result == 0 && oResponse.apps) {
					for(var i=0; i<oResponse.apps.length; i++) {
						aAppidList[oResponse.apps[i].appid] = oResponse.apps[i].name;
						if(!Session.Get(oResponse.apps[i].appid))
							Session.Set(oResponse.apps[i].appid, "");
					}
					FillConsoleAppid();
				}
			});
		} else {
			sCurrentAppid = sAppid;
			sCurrentSession = '';
			Cookies.Set("ApplicationID", sCurrentAppid);
			Cookies.Set("Session", sCurrentSession);
			SetConsoleParamValue("appid", sCurrentAppid);
			SetConsoleParamValue("session", sCurrentSession);
		}
	});

	return this;

}