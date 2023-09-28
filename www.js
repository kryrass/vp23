const http = require("http");

http.createServer(function(req, res){
	res.writeHead(200, {"Content-type": "text/html"});
	res.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Kryslin Rass, veebiprogrammeerimine 2023</title><script src="first.js" defer></script></head><body>');
	res.write('<h1>Kryslin Rass</h1><p>See veebileht on valminud <a href="https://www.tlu.ee" target="_blank">TLÜ</a> Digitehnoloogiate instituudi informaatika eriala õppetöö raames.</p>');
	res.write('<hr></body></html>');
	//valmis, saada ära
	return res.end();
}).listen(5109);

//rinde		5100
//mina		5109