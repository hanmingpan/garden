var direct = 'DIRECT';
var http_proxy = 'PROXY 172.30.9.189:8899; DIRECT';

var gfwed_list = [
	"igengmei.com",
	"paas.env",
	"paas-week.env",
	"paas-dev.env",
];

var gfwed = {};
for (var i = 0; i < gfwed_list.length; i += 1) {
	gfwed[gfwed_list[i]] = true;
}

function host2domain(host) {
	var dotpos = host.lastIndexOf(".");
	if (dotpos === -1)
		return host;
	// Find the second last dot
	dotpos = host.lastIndexOf(".", dotpos - 1);
	if (dotpos === -1)
		return host;
	return host.substring(dotpos + 1);
};

function FindProxyForURL(url, host) {
	return gfwed[host2domain(host)] ? http_proxy : direct;
};
