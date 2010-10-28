var bIsIE = (navigator.appVersion.indexOf("MSIE") != -1);

function id(element) { return document.getElementById(element); }
function error(result, error) { return "Error [" + result + "]: " + error; }

String.prototype.replaceAll = function(s1, s2) { return this.split(s1).join(s2); }

var nDeep = -1;

function toSpace(nRepeat) {
	var sRes = "";
	var sStep = "       ";
	for(var i=0; i<nRepeat; i++) sRes += sStep;
	return sRes;
}

function toSource(obj) {
	switch(typeof obj) {
    	case 'function': return obj.toString();
        case 'string': return '"' + obj.replaceAll('"', '\\"') + '"';
    	case 'object': 
        	var str = '';
        	if(obj == null) return "null";
            if(obj instanceof Array) {
            	for (var i = 0, l = obj.length; i < l; i++) str += ', ' + toSource(obj[i])
                if (str.length > 0) str = str.substring(1);
                return '[ ' + str + ' ]';
            }
            nDeep++;
        	for (var i in obj) str += ',\n'+ toSpace(nDeep) + i + ' : ' + toSource(obj[i]);
			nDeep--;
        	return '{ ' + (str.length > 0 ? str.substring(1) : str) + '\n' + toSpace(nDeep) + '}';
	}
	return obj;
}

function getElementComputedStyle(elem, prop) {
  	if(typeof elem!="object") elem = document.getElementById(elem);
  	if(document.defaultView && document.defaultView.getComputedStyle) {
    		if (prop.match(/[A-Z]/)) prop = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
    		return document.defaultView.getComputedStyle(elem, "").getPropertyValue(prop);
  	}
  	if(elem.currentStyle) {
    		var i;
    		while((i=prop.indexOf("-"))!=-1) prop = prop.substr(0, i) + prop.substr(i+1,1).toUpperCase() + prop.substr(i+2);
    		return elem.currentStyle[prop];
  	}
  	return "";
}

var Cookies = {

	Set : function(name, value) {
		var argv = arguments,
			argc = arguments.length,
			expires = (argc > 2) ? argv[2] : null,
    		path = (argc > 3) ? argv[3] : '/',
    		domain = (argc > 4) ? argv[4] : null,
    		secure = (argc > 5) ? argv[5] : false;

    	document.cookie = name + "=" + escape (value) +
    		((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
    		((path == null) ? "" : ("; path=" + path)) +
        	((domain == null) ? "" : ("; domain=" + domain)) +
        	((secure == true) ? "; secure" : "");
	},

	Get : function(name) {
		var arg = name + "=",
			alen = arg.length,
			clen = document.cookie.length,
			i = 0,
			j = 0;

		while(i < clen) {
			j = i + alen;
			if (document.cookie.substring(i, j) == arg)
				return Cookies._getCookieVal(j);
			i = document.cookie.indexOf(" ", i) + 1;
			if(i == 0)
				break;
		}
		return null;
	},

	Clear : function(name) {
		if(Cookies.Get(name)) {
    		document.cookie = name + "=; expires=Thu, 01-Jan-70 00:00:01 GMT";
  		}
	},

	_getCookieVal : function(offset) {
   		var endstr = document.cookie.indexOf(";", offset);
   		if(endstr == -1) {
			endstr = document.cookie.length;
   		}
   		return unescape(document.cookie.substring(offset, endstr));
   	}

};

Session = {

	Get : function(key){
		var name = window.name;
		var ind1 = name.indexOf(';'+key+'=');
		if (ind1 > -1){
			var ind2 = name.indexOf(';', ind1+1);
			return name.substring(ind1+key.length + 2, ind2);
		}
		return false;
	},

	Set : function(key, val){
		var name = window.name;
		var ind1 = name.indexOf(';'+key+'=');
		if (ind1 > -1){
			var ind2 = name.indexOf(';', ind1+1);
			window.name = name.substring(0, ind1+key.length + 2) + val + name.substring(ind2);
		} else {
			window.name += ';'+key + '=' + val + ';';
		}
        return this;
	}

}
