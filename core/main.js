/*
    Title: Http_Headers
    http://en.wikipedia.org/wiki/List_of_HTTP_headers
*/

hivext.local.SetHeader("Content-Type", "text/html");

var sRequestInfo = "-------------- HTTP Headers Request --------------<br />";

sRequestInfo += "User-Agent = " + hivext.local.GetHeader("User-Agent") + "<br />";
sRequestInfo += "Accept-Encoding = " + hivext.local.GetHeader("Accept-Encoding") + "<br />";
sRequestInfo += "Accept-Language = " + hivext.local.GetHeader("Accept-Language") + "<br />";
sRequestInfo += "Accept-Charset = " + hivext.local.GetHeader("Accept-Charset") + "<br />";
sRequestInfo += "Host = " + hivext.local.GetHeader("Host") + "<br />";

sRequestInfo += "--------------------------------------------------------------<br />";

return sRequestInfo;
​