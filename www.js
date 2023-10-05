const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const datetimeValue = require("./datetime_et");
const semester = require("./semesterprogress");

const pageHead = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Kryslin Rass, veebiprogrammeerimine 2023</title><script src="first.js" defer></script></head><body>'
const pageBanner = '<img src="banner.png" alt="Kursuse bänner">'
const tluPicture='\n\t<img src="tlu_42.jpg" alt="Tallinna Ülikool">';
const pageBody = '<h1>Kryslin Rass</h1><p>See veebileht on valminud <a href="https://www.tlu.ee" target="_blank">TLÜ</a> Digitehnoloogiate instituudi informaatika eriala õppetöö raames.</p>'
const pageFoot = '<hr></body></html>'

http.createServer(function(req, res){
	let currentURL = url.parse(req.url, true);
	//console.log(currentURL);
	if (currentURL.pathname === "/"){
	res.writeHead(200, {"Content-type": "text/html"});
	res.write(pageHead);
	res.write(pageBanner);
	res.write(pageBody);
	res.write("<p>Lehe avamise aeg oli " + datetimeValue.timeOfDayET() + " ja kell on " + datetimeValue.timeNowET() + "</p><p>Kuupäev on " + datetimeValue.dateNowET() + "</p>");
	res.write('\n\t<hr>\n\t<p><a href ="addname">Lisa oma nimi</a>!</p>');
	res.write('<p><a href="semesterprogress">Semestri kulg</a></p>');
	res.write('<p><a href="picture">Tore pilt.</a></p>');
	res.write(pageFoot);
	//console.log("keegi vaatab");
	return res.end();
}

else if (currentURL.pathname == "/addname"){
	res.writeHead(200, {"Content-type": "text/html"});
	res.write(pageHead);
	res.write(pageBanner);
	res.write(pageBody);
	res.write('\n\t<hr>\n\t<h2>Lisa palun oma nimi</h2>');
	res.write('\n\t<p>Edaspidi lisame siia asju<p>');
	res.write(pageFoot);
}
else if (currentURL.pathname==="/semesterprogress")
	{
		res.writeHead(200, {"Content-Type":"text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write("<p>" + semester.result + "</p>");
		res.write("<meter min='0' value='" + semester.semesterLastedFor + "' max='" + semester.semesterDuration + "'></meter>")
		res.write(pageFoot);
		return res.end();
	}
else if (currentURL.pathname==="/picture")
	{
		res.writeHead(200, {"Content-Type":"text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write(tluPicture);
		res.write(pageFoot);
		return res.end();
	}
else if (currentURL.pathname==="/tlu_42.jpg")
	{
		console.log("Tahan pilti!");
		let filePath=path.join(__dirname, "public", "tluphotos/tlu_42.jpg");
		fs.readFile(filePath, (err, data)=>
		{
			if(err)
			{
				throw err;
			}
			else
			{
				res.writeHead(200, {"Content-Type":"image/png"});
				res.end(data);
			}
		});
	}

else if (currentURL.pathname === "/banner.png"){
	console.log("Tahame pilti!");
	let bannerPath = path.join(__dirname, "public", "banner");
	console.log(bannerPath)
	fs.readFile(bannerPath + currentURL.pathname, (err, data)=>{
		if (err) {
			throw err;
		}
		else {
			res.writeHead(200, {"Content-type": "image/png"});
			res.end(data);
		}
	});
}
else {
	
	res.end("error 404");
}
}).listen(5109);

//rinde		5100
//mina		5109