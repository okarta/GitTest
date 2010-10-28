;(function(){
hivext = {};

SERVER_URL = "http://api.hivext.com/1.0/";

function _wrapPrototype(service) {
    service.prototype._init = function(appid, session, serviceUrl) {
        var t = this;
        t.SERVER_SERVICE_URL = SERVER_URL;
        t.SERVICE_URL = t.SERVER_SERVICE_URL + t.SERVICE_PATH;
        t.serviceUrl = t.SERVICE_URL;

        var json = null;
        if (typeof appid == 'string') {
            json = {appid:appid, session:session, serviceUrl:serviceUrl};
        } else {
            json = appid || {};
        }
        if (json.appid) t.appid = json.appid;
        if (json.session) t.session = json.session;
        if (json.serviceUrl) t.serviceUrl = json.serviceUrl;

        t.getAppid = function() {
           return t.appid;
        }

        t.setAppid = function(appid) {
           t.appid = appid;
           return t;
        }

        t.getSession = function() {
           return t.session;
        }

        t.setSession = function(session) {
           t.session = session;
           return t;
        }

        t.getServiceUrl = function() {
           return t.serviceUrl;
        }

        t.setServiceUrl = function(serviceUrl) {
           t.serviceUrl = serviceUrl;
           return t;
        }

        t.getServerUrl = function() {
           return t.SERVER_SERVICE_URL;
        }

        t.setServerUrl = function(serverUrl) {
           t.SERVER_SERVICE_URL = serverUrl;
           var serviceUrl = t.SERVER_SERVICE_URL + t.SERVICE_PATH;
           if (t.serviceUrl == t.SERVICE_URL) t.serviceUrl = serviceUrl;
           t.SERVICE_URL = serviceUrl;
           return t;
        }       
        
    }
    return service;
};

var APPID_HOSTS = {};
function _call(appid, service, callback) {
    if (service.serviceUrl.indexOf("/api.hivext.com/") == -1) {
        callback();
        return;
    }
  	var host = APPID_HOSTS[appid];
  	if (host == null){
    		APPID_HOSTS[appid] = false;
    		new hivext.development.Applications().getAppHosts(appid, function(resp) {
      			if (resp.result === 0 && resp.optimal != null) {
        				APPID_HOSTS[appid] = resp.optimal.domain;
      			}
      			_call(appid, service, callback);
    		});
  	} else if (host === false){
    		callback();
  	} else {
    		service.serviceUrl = service.serviceUrl.replace("/api.hivext.com/", "/"+host+"/");
    		callback();
  	}			
}

String.prototype.replaceAll = function(s1, s2) { return this.split(s1).join(s2); }

function _toJSON(obj) {
    switch(typeof obj) {
        case "function" : return obj.toString();
        case "string" : return "\"" + obj.replaceAll('\n', '\\\\n').replaceAll('\r', '\\\\r').replaceAll("\\\"", "\\\\\"").replaceAll("\"", "\\\"") + "\"";
        case "object" : 
        var str = "";
        if(obj == null) return "null";
        if(obj instanceof Array) {
            for (var i = 0, l = obj.length; i < l; i++) str += ", " + _toJSON(obj[i])
            if (str.length > 0) str = str.substring(1);
            return "[ " + str + " ]";
        }
        for (var i in obj) str += ", " + i + " : " + _toJSON(obj[i]);
        return "{ " + (str.length > 0 ? str.substring(1) : str) + " }";
    }
    return obj;
}

function _encode(obj){
			for (var key in obj) {
				var value = obj[key];
				if (value == null) {
					delete obj[key];
					continue;
				}
				if (typeof value == 'object') {
					obj[key] = _toJSON(value);
				}
			}
			return obj;
}
function _transport(url, json){
    var callback = json.callback;
    delete json.callback;

    json = _encode(json);
    var encodedParams = _toJSON(json);
    var method = encodedParams.length < 2000 ? "get" : "post";
    hivext.HttpRequest[method](url, json, function(resp){
        callback(resp, json)
    });
}



    hivext.data = hivext.data || {};

/**
* @name Hivext API Client
* @version 1.0.4
* @copyright Hivext Technology, http://hivext.ru, http://hivext.com
**/

    hivext.data.Base = _wrapPrototype(function(appid, session, serviceUrl) {
        var t = this;
        t.SERVICE_PATH = "data/base/";
        t._init(appid, session, serviceUrl);

        t.defineType = t.DefineType = function(appid, session, type, fields, unique, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, fields:fields, unique:unique, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/definetype', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.undefineType = t.UndefineType = function(appid, session, type, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/undefinetype', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.renameType = t.RenameType = function(appid, session, oldType, newType, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, oldType:oldType, newType:newType, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/renametype', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.addField = t.AddField = function(appid, session, type, field, fieldType, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, field:field, fieldType:fieldType, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/addfield', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.removeField = t.RemoveField = function(appid, session, type, field, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, field:field, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/removefield', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.renameField = t.RenameField = function(appid, session, type, oldField, newField, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, oldField:oldField, newField:newField, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/renamefield', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.setUniqueFields = t.SetUniqueFields = function(appid, session, type, unique, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, unique:unique, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/setuniquefields', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getUniqueFields = t.GetUniqueFields = function(appid, session, type, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getuniquefields', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getType = t.GetType = function(appid, session, type, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/gettype', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getTypes = t.GetTypes = function(appid, session, from, count, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, from:from, count:count, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/gettypes', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getTypesCount = t.GetTypesCount = function(appid, session, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/gettypescount', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.createObject = t.CreateObject = function(appid, session, type, data, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, data:data, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/createobject', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.deleteObject = t.DeleteObject = function(appid, session, type, id, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, id:id, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/deleteobject', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.deleteObjectsByCriteria = t.DeleteObjectsByCriteria = function(appid, session, type, criteria, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, criteria:criteria, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/deleteobjectsbycriteria', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getObject = t.GetObject = function(appid, session, type, id, join, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, id:id, join:join, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getobject', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.setObject = t.SetObject = function(appid, session, type, id, data, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, id:id, data:data, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/setobject', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.createObjects = t.CreateObjects = function(appid, session, type, data, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, data:data, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/createobjects', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.setObjects = t.SetObjects = function(appid, session, type, data, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, data:data, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/setobjects', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getObjects = t.GetObjects = function(appid, session, type, from, count, join, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, from:from, count:count, join:join, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getobjects', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getObjectsByCriteria = t.GetObjectsByCriteria = function(appid, session, type, criteria, from, count, join, projection, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, criteria:criteria, from:from, count:count, join:join, projection:projection, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getobjectsbycriteria', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getObjectsCount = t.GetObjectsCount = function(appid, session, type, criteria, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, criteria:criteria, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getobjectscount', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getProperty = t.GetProperty = function(appid, session, type, id, property, join, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, id:id, property:property, join:join, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getproperty', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.setProperty = t.SetProperty = function(appid, session, type, id, property, value, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, id:id, property:property, value:value, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/setproperty', json, json.callback);
            }
           _call(json.appid, t, request);
        }

    });

    Data = window.Data || {};
    Data.Base = new hivext.data.Base();




    hivext.development = hivext.development || {};

/**
* @name Hivext API Client
* @version 1.0.4
* @copyright Hivext Technology, http://hivext.ru, http://hivext.com
**/

    hivext.development.Applications = _wrapPrototype(function(appid, session, serviceUrl) {
        var t = this;
        t.SERVICE_PATH = "development/applications/";
        t._init(appid, session, serviceUrl);

        t.generateApp = t.GenerateApp = function(appid, session, name, description, domain, keywords, config, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, name:name, description:description, domain:domain, keywords:keywords, config:config, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/generateapp', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.deleteApp = t.DeleteApp = function(appid, session, password, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, password:password, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/deleteapp', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getApp = t.GetApp = function(appid, session, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getapp', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getApps = t.GetApps = function(appid, session, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getapps', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.changeAppInfo = t.ChangeAppInfo = function(appid, session, targetAppid, field, value, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, field:field, value:value, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/changeappinfo', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.setAppPermission = t.SetAppPermission = function(appid, session, targetAppid, login, right, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, login:login, right:right, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/setapppermission', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getAppPermission = t.GetAppPermission = function(appid, session, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getapppermission', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.allowAppAccess = t.AllowAppAccess = function(appid, session, targetAppid, allowAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, allowAppid:allowAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/allowappaccess', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.removeAppAccess = t.RemoveAppAccess = function(appid, session, targetAppid, allowAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, allowAppid:allowAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/removeappaccess', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getAppAccess = t.GetAppAccess = function(appid, session, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getappaccess', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.createAppsPool = t.CreateAppsPool = function(appid, session, name, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, name:name, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/createappspool', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.deleteAppsPool = t.DeleteAppsPool = function(appid, session, name, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, name:name, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/deleteappspool', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getAppsPools = t.GetAppsPools = function(appid, session, name, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, name:name, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getappspools', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.addAppToPool = t.AddAppToPool = function(appid, session, name, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, name:name, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/addapptopool', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.removeAppFromPool = t.RemoveAppFromPool = function(appid, session, name, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, name:name, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/removeappfrompool', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.rebuildApp = t.RebuildApp = function(appid, session, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/rebuildapp', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.exportAppPersistance = t.ExportAppPersistance = function(appid, session, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/exportapppersistance', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.exportAppResources = t.ExportAppResources = function(appid, session, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/exportappresources', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.importAppPersistance = t.ImportAppPersistance = function(appid, session, path, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, path:path, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/importapppersistance', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.importAppResources = t.ImportAppResources = function(appid, session, path, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, path:path, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/importappresources', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.cloneApp = t.CloneApp = function(appid, session, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/cloneapp', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.createSolution = t.CreateSolution = function(appid, session, targetAppid, clonable, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, clonable:clonable, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/createsolution', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.deleteSolution = t.DeleteSolution = function(appid, session, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/deletesolution', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.changeSolutionInfo = t.ChangeSolutionInfo = function(appid, session, targetAppid, field, value, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, field:field, value:value, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/changesolutioninfo', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getSolution = t.GetSolution = function(appid, session, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getsolution', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getSolutions = t.GetSolutions = function(appid, session, targetAppid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, targetAppid:targetAppid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getsolutions', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.findSolutions = t.FindSolutions = function(appid, session, keywords, description, from, count, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, keywords:keywords, description:description, from:from, count:count, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/findsolutions', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getAppHosts = t.GetAppHosts = function(appid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getapphosts', json, json.callback);
            }
           _call(json.appid, t, request);
        }

    });

    Development = window.Development || {};
    Development.Applications = new hivext.development.Applications();




    hivext.development = hivext.development || {};

/**
* @name Hivext API Client
* @version 1.0.4
* @copyright Hivext Technology, http://hivext.ru, http://hivext.com
**/

    hivext.development.Scripting = _wrapPrototype(function(appid, session, serviceUrl) {
        var t = this;
        t.SERVICE_PATH = "development/scripting/";
        t._init(appid, session, serviceUrl);

        t.getScript = t.GetScript = function(appid, session, name, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, name:name, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getscript', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getEngineInfo = t.GetEngineInfo = function(appid, type, callback) {
            var json = typeof appid == 'string' ? {appid:appid, type:type, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getengineinfo', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.createScript = t.CreateScript = function(appid, session, name, type, code, annotations, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, name:name, type:type, code:code, annotations:annotations, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/createscript', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.deleteScript = t.DeleteScript = function(appid, session, name, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, name:name, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/deletescript', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getScripts = t.GetScripts = function(appid, session, type, from, count, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, type:type, from:from, count:count, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getscripts', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.changeScript = t.ChangeScript = function(appid, session, name, field, value, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, name:name, field:field, value:value, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/changescript', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.build = t.Build = function(appid, session, script, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, script:script, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/build', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t['eval'] = t.Eval = function(appid, session, script, params, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, script:script, params:params, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/eval', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.evalCode = t.EvalCode = function(appid, session, code, type, annotations, params, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, code:code, type:type, annotations:annotations, params:params, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/evalcode', json, json.callback);
            }
           _call(json.appid, t, request);
        }

    });

    Development = window.Development || {};
    Development.Scripting = new hivext.development.Scripting();




    hivext.io = hivext.io || {};

/**
* @name Hivext API Client
* @version 1.0.4
* @copyright Hivext Technology, http://hivext.ru, http://hivext.com
**/

    hivext.io.File = _wrapPrototype(function(appid, session, serviceUrl) {
        var t = this;
        t.SERVICE_PATH = "io/file/";
        t._init(appid, session, serviceUrl);

        t.getList = t.GetList = function(appid, session, path, ext, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, path:path, ext:ext, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getlist', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.create = t.Create = function(appid, session, path, isdir, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, path:path, isdir:isdir, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/create', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.rename = t.Rename = function(appid, session, oldPath, newPath, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, oldPath:oldPath, newPath:newPath, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/rename', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.read = t.Read = function(appid, session, path, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, path:path, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/read', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.write = t.Write = function(appid, session, path, body, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, path:path, body:body, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/write', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.copy = t.Copy = function(appid, session, src, dest, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, src:src, dest:dest, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/copy', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t['delete'] = t.Delete = function(appid, session, path, ext, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, path:path, ext:ext, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/delete', json, json.callback);
            }
           _call(json.appid, t, request);
        }

    });

    Io = window.Io || {};
    Io.File = new hivext.io.File();




    hivext.message = hivext.message || {};

/**
* @name Hivext API Client
* @version 1.0.4
* @copyright Hivext Technology, http://hivext.ru, http://hivext.com
**/

    hivext.message.Email = _wrapPrototype(function(appid, session, serviceUrl) {
        var t = this;
        t.SERVICE_PATH = "message/email/";
        t._init(appid, session, serviceUrl);

        t.send = t.Send = function(appid, session, from, to, subject, body, type, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, from:from, to:to, subject:subject, body:body, type:type, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/send', json, json.callback);
            }
           _call(json.appid, t, request);
        }

    });

    Message = window.Message || {};
    Message.Email = new hivext.message.Email();




    hivext.security = hivext.security || {};

/**
* @name Hivext API Client
* @version 1.0.4
* @copyright Hivext Technology, http://hivext.ru, http://hivext.com
**/

    hivext.security.AccessControl = _wrapPrototype(function(appid, session, serviceUrl) {
        var t = this;
        t.SERVICE_PATH = "security/accesscontrol/";
        t._init(appid, session, serviceUrl);

        t.createRole = t.CreateRole = function(appid, session, role, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, role:role, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/createrole', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.deleteRole = t.DeleteRole = function(appid, session, role, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, role:role, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/deleterole', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getRoles = t.GetRoles = function(appid, session, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getroles', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.applyRole = t.ApplyRole = function(appid, session, role, subject, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, role:role, subject:subject, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/applyrole', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.removeRole = t.RemoveRole = function(appid, session, role, subject, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, role:role, subject:subject, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/removerole', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getRolesBySubject = t.GetRolesBySubject = function(appid, session, subject, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, subject:subject, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getrolesbysubject', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getSubjectsByRole = t.GetSubjectsByRole = function(appid, session, role, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, role:role, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getsubjectsbyrole', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getRolesByObject = t.GetRolesByObject = function(appid, session, object, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, object:object, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getrolesbyobject', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getObjectsByRole = t.GetObjectsByRole = function(appid, session, role, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, role:role, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getobjectsbyrole', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.addPolicy = t.AddPolicy = function(appid, session, role, object, rights, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, role:role, object:object, rights:rights, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/addpolicy', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.removePolicy = t.RemovePolicy = function(appid, session, role, object, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, role:role, object:object, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/removepolicy', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getPolicy = t.GetPolicy = function(appid, session, role, object, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, role:role, object:object, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getpolicy', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.setRights = t.SetRights = function(appid, session, subject, object, rights, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, subject:subject, object:object, rights:rights, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/setrights', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.removeRights = t.RemoveRights = function(appid, session, subject, object, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, subject:subject, object:object, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/removerights', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getRights = t.GetRights = function(appid, session, subject, object, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, subject:subject, object:object, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getrights', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getRightsBySubject = t.GetRightsBySubject = function(appid, session, subject, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, subject:subject, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getrightsbysubject', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getRightsByObject = t.GetRightsByObject = function(appid, session, object, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, object:object, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getrightsbyobject', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.removeRightsBySubject = t.RemoveRightsBySubject = function(appid, session, subject, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, subject:subject, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/removerightsbysubject', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.removeRightsByObject = t.RemoveRightsByObject = function(appid, session, object, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, object:object, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/removerightsbyobject', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.checkRights = t.CheckRights = function(appid, session, subject, object, rights, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, subject:subject, object:object, rights:rights, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/checkrights', json, json.callback);
            }
           _call(json.appid, t, request);
        }

    });

    Security = window.Security || {};
    Security.AccessControl = new hivext.security.AccessControl();





hivext.HttpRequest = {

	get : function(url, params, callback) {
    	url += '?charset=' + (document.charset || document.characterSet);	
		var process = true,
			sid = 'sid' + parseInt(Math.random()*1000000),
			cb = 'cb=hivext.HttpRequest.callback.' + sid,
			script = document.createElement('script');
		script.type = 'text/javascript';
		script.charset = 'utf-8';
		if(params) {
			if(typeof params == "string") {
				url += '&' + params;
			} else {
				var sep = ''; url += '&';
				for(var name in params) {
					url += sep + name + '=' + params[name];
					sep = '&';
				}
			}
		}
		if(url.indexOf('?') == -1) script.src = url + '?' + cb;
		else if(url.match(/\?[\w\d]+/)) script.src = url + '&' + cb;
		else script.src = url + cb;
		hivext.HttpRequest.callback[sid] = function(response) {
			process = false;
			callback(response);
		};
		script.onerror = script.onload = script.onreadystatechange = function() {
			if(!this.loaded && (!this.readyState
				|| this.readyState == 'loaded'
				|| this.readyState == 'complete'))
			{
				this.loaded = 1;
				this.onerror = this.onload = this.onreadystatechange = null;
				if(process) { callback(false); } else { /* Ответ пришел */ }
				this.parentNode.removeChild(this);
				delete script;
				delete hivext.HttpRequest.callback[sid];
			}
		}
		if(document.getElementsByTagName('head').length) {
			document.getElementsByTagName('head')[0].appendChild(script);
		} else { document.appendChild(script); }
	},

	post : function(url, params, callback) {
    	url += '?charset=' + (document.charset || document.characterSet);	
		function add2body(html) {
			var b = document.body;
			var div = document.createElement('div');        
			div.innerHTML = html.join ? html.join('') : html;    
			while (div.childNodes.length > 0) b.appendChild(div.childNodes[0]);
			return b.lastChild;
		}
		var form, input, doc = document, fid = 'fid' + parseInt(Math.random()*1000000),
  			html = '<iframe style="display:none" onload="hivext.HttpRequest._onLoad(this)"'
		  		+ ' src="javascript:true" id="' + fid + '" name="' + fid + '"></iframe>';
		var frame = add2body(html);
		hivext.HttpRequest.callback[fid] = callback;
		if(params) {
			if(params.nodeType) {
				form = params;
			} else {
				form = document.createElement('form');
				for(var name in params) {
					var value = params[name];
					input = document.createElement('textarea');
					input.name = name;
					input.value = value;			
					form.appendChild(input);
				}
			}
			if(form) {
				form.method = 'post';
				form.action = url;
				form.target = fid;
				form.style.display = 'none';
				document.body.appendChild(form);
				form.submit();
				form.parentNode.removeChild(form);
			}
		} else {
			frame.src = url;
			if(frame.contentWindow) {
				frame.contentWindow.location.replace(url);
			}	
		}
	},

	formPost : function(form, callback) { this.post(form.action, form, callback); },

	callback : {},

	_getData : function(frame) {
		if(frame.abort) return;
		var callback = hivext.HttpRequest.callback[frame.id];
		if(callback) {
			try {
				callback(window['eval']("(" + frame.contentWindow.name + ")"));
			} catch (ex) {}
			delete hivext.HttpRequest.callback[frame.id];
		}
		setTimeout(function() { frame.parentNode.removeChild(frame); }, 0);				
	},

	_onLoad : function(frame) {
		var blank = 'about:blank',
			wnd = frame.contentWindow;
		try {
        	if (!frame.state && (wnd.location == blank
				|| wnd.location == 'javascript:true')) return;
		} catch (ex) {}
		if(frame.state) {
			return this._getData(frame);
		} else wnd.location = blank;
		frame.state = 1;
	}

}



    hivext.users = hivext.users || {};

/**
* @name Hivext API Client
* @version 1.0.4
* @copyright Hivext Technology, http://hivext.ru, http://hivext.com
**/

    hivext.users.Account = _wrapPrototype(function(appid, session, serviceUrl) {
        var t = this;
        t.SERVICE_PATH = "users/account/";
        t._init(appid, session, serviceUrl);

        t.changeEmail = t.ChangeEmail = function(appid, session, password, email, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, password:password, email:email, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/changeemail', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.changePassword = t.ChangePassword = function(appid, session, oldPassword, newPassword, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, oldPassword:oldPassword, newPassword:newPassword, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/changepassword', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.recoverPassword = t.RecoverPassword = function(appid, email, callback) {
            var json = typeof appid == 'string' ? {appid:appid, email:email, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/recoverpassword', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.changeName = t.ChangeName = function(appid, session, password, name, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, password:password, name:name, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/changename', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getUserInfo = t.GetUserInfo = function(appid, session, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getuserinfo', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.checkUser = t.CheckUser = function(appid, session, login, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, login:login, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/checkuser', json, json.callback);
            }
           _call(json.appid, t, request);
        }

    });

    Users = window.Users || {};
    Users.Account = new hivext.users.Account();




    hivext.users = hivext.users || {};

/**
* @name Hivext API Client
* @version 1.0.4
* @copyright Hivext Technology, http://hivext.ru, http://hivext.com
**/

    hivext.users.Authentication = _wrapPrototype(function(appid, session, serviceUrl) {
        var t = this;
        t.SERVICE_PATH = "users/authentication/";
        t._init(appid, session, serviceUrl);

        t.checkSign = t.CheckSign = function(appid, session, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/checksign', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.checkUser = t.CheckUser = function(appid, session, login, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, login:login, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/checkuser', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.changeSession = t.ChangeSession = function(appid, session, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/changesession', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.signout = t.Signout = function(appid, session, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/signout', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.signin = t.Signin = function(appid, login, password, callback) {
            var json = typeof appid == 'string' ? {appid:appid, login:login, password:password, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/signin', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getDeviceSignature = t.GetDeviceSignature = function(appid, callback) {
            var json = typeof appid == 'string' ? {appid:appid, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/getdevicesignature', json, json.callback);
            }
           _call(json.appid, t, request);
        }

    });

    Users = window.Users || {};
    Users.Authentication = new hivext.users.Authentication();




    hivext.users = hivext.users || {};

/**
* @name Hivext API Client
* @version 1.0.4
* @copyright Hivext Technology, http://hivext.ru, http://hivext.com
**/

    hivext.users.Registration = _wrapPrototype(function(appid, session, serviceUrl) {
        var t = this;
        t.SERVICE_PATH = "users/registration/";
        t._init(appid, session, serviceUrl);

        t.checkPassword = t.CheckPassword = function(appid, password, callback) {
            var json = typeof appid == 'string' ? {appid:appid, password:password, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/checkpassword', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.checkEmailRegistration = t.CheckEmailRegistration = function(appid, email, callback) {
            var json = typeof appid == 'string' ? {appid:appid, email:email, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/checkemailregistration', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.checkEmailExist = t.CheckEmailExist = function(appid, email, callback) {
            var json = typeof appid == 'string' ? {appid:appid, email:email, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/checkemailexist', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.createAccount = t.CreateAccount = function(appid, email, password, name, checkEmail, welcome, callback) {
            var json = typeof appid == 'string' ? {appid:appid, email:email, password:password, name:name, checkEmail:checkEmail, welcome:welcome, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/createaccount', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.activate = t.Activate = function(appid, key, callback) {
            var json = typeof appid == 'string' ? {appid:appid, key:key, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/activate', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.resendInvitation = t.ResendInvitation = function(appid, email, welcome, callback) {
            var json = typeof appid == 'string' ? {appid:appid, email:email, welcome:welcome, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/resendinvitation', json, json.callback);
            }
           _call(json.appid, t, request);
        }

    });

    Users = window.Users || {};
    Users.Registration = new hivext.users.Registration();




    hivext.utils = hivext.utils || {};

/**
* @name Hivext API Client
* @version 1.0.4
* @copyright Hivext Technology, http://hivext.ru, http://hivext.com
**/

    hivext.utils.Batch = _wrapPrototype(function(appid, session, serviceUrl) {
        var t = this;
        t.SERVICE_PATH = "utils/batch/";
        t._init(appid, session, serviceUrl);

        t.call = t.Call = function(appid, request, sync, callback) {
            var json = typeof appid == 'string' ? {appid:appid, request:request, sync:sync, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/call', json, json.callback);
            }
           _call(json.appid, t, request);
        }

    });

    Utils = window.Utils || {};
    Utils.Batch = new hivext.utils.Batch();




    hivext.utils = hivext.utils || {};

/**
* @name Hivext API Client
* @version 1.0.4
* @copyright Hivext Technology, http://hivext.ru, http://hivext.com
**/

    hivext.utils.Scheduler = _wrapPrototype(function(appid, session, serviceUrl) {
        var t = this;
        t.SERVICE_PATH = "utils/scheduler/";
        t._init(appid, session, serviceUrl);

        t.addTask = t.AddTask = function(appid, session, script, trigger, description, params, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, script:script, trigger:trigger, description:description, params:params, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/addtask', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getTask = t.GetTask = function(appid, session, id, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, id:id, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/gettask', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.removeTask = t.RemoveTask = function(appid, session, id, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, id:id, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/removetask', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.getTasks = t.GetTasks = function(appid, session, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/gettasks', json, json.callback);
            }
           _call(json.appid, t, request);
        }

        t.removeTasks = t.RemoveTasks = function(appid, session, callback) {
            var json = typeof appid == 'string' ? {appid:appid, session:session, callback:callback} : appid;
            var request = function() {
                _transport(t.serviceUrl + 'cross/removetasks', json, json.callback);
            }
           _call(json.appid, t, request);
        }

    });

    Utils = window.Utils || {};
    Utils.Scheduler = new hivext.utils.Scheduler();





})()