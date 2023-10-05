const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const querystring = require("querystring")
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
	if(req.method === 'POST'){
		collectRequestData(req, result => {
            console.log(result);
            		//kirjutame andmeid tekstifaili
			fs.open('public/log.txt', 'a', (err, file)=>{
				if(err){
					throw err;
				}
				else {
					fs.appendFile('public/log.txt', result.firstNameInput + ';', (err)=>{
						if(err){
							throw err;
						}
						else {
							console.log('faili kirjutati!');
						}
					});
				}
				/* fs.close(file, (err)=>{
					if(err){
						throw err;
					}
				}); */
			});
			
			res.end(result.firstNameInput);
			//res.end('Tuligi POST!');
		});
	}

	else if (currentURL.pathname === "/"){
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
	res.write('\n\t<form method="POST">\n\t\t<label for="firstNameInput">Eesnimi: </label>\n\t\t<input type="text" name="firstNameInput" id="firstNameInput" placeholder="Sinu eesnimi ...">\n\t\t<br>\n\t\t<label for="lastNameInput">Perekonnanimi: </label>\n\t\t<input type="text" name="lastNameInput" id="lastNameInput" placeholder="Sinu perekonnanimi ...">\n\t\t<br>\n\t\t<input type="submit" name="nameSubmit" value="Salvesta">\n\t</form>');
	res.write('\n\t <p><a href="/">Tagasi avalehele</a>!</p>');
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
else if (currentURL.pathname === "/picture"){
		//loeme kataloogist fotode nimekirja ja loosime Ã¼he pildi
		let htmlOutput = '\n\t<p>Pilti ei saa nÃ¤idata!</p>';
		let listOutput = '';
		fs.readdir('public/tluphotos', (err, fileList)=>{
			if(err) {
				throw err;
				tluPhotoPage(res, htmlOutput, listOutput);
			}
			else {
				//console.log(fileList);
				let photoNum = Math.floor(Math.random() * fileList.length);
				htmlOutput = '\n\t<img src="' + fileList[photoNum] + '" alt="TLÃœ pilt">';
				//console.log(htmlOutput);
				listOutput = '\n\t<ul>';
				for (fileName of fileList){
					listOutput += '\n\t\t<li>' + fileName + '</li>';
				}
				listOutput += '\n\t</ul>';
				//console.log(listOutput);
				tluPhotoPage(res, htmlOutput, listOutput);
			}
		});
	}

	else if (currentURL.pathname === "/banner.png"){
		//console.log("Tahame pilti!");
		let bannerPath = path.join(__dirname, "public", "banner");
		//console.log(bannerPath + currentURL.pathname);
		fs.readFile(bannerPath + currentURL.pathname, (err, data)=>{
			if (err) {
				throw err;
			}
			else {
				//console.log("Tuli Ã¤ra!");
				res.writeHead(200, {"Content-type": "image/png"});
				res.end(data);
			}
		});
	}

	//else if (currentURL.pathname === "/tlu_42.jpg"){
	else if (path.extname(currentURL.pathname) === ".jpg"){
		console.log(path.extname(currentURL.pathname));
		//let filePath = path.join(__dirname, "public", "tluphotos/tlu_42.jpg");
		let filePath = path.join(__dirname, "public", "tluphotos");
		fs.readFile(filePath + currentURL.pathname, (err, data)=>{
			if(err){
				throw err;
			}
			else {
				res.writeHead(200, {"Content-Type": "image/jpeg"});
				res.end(data);
			}
		});
	} 

	else {
		res.end("ERROR 404");
	}
}).listen(5109);

function tluPhotoPage(res, htmlOut, listOutput){
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(pageHead);
	res.write(pageBanner);
	res.write(pageBody);
	res.write('\n\t<hr>');
	res.write(htmlOut);
	if(listOutput != ''){
		res.write(listOutput);
	}
	res.write('\n\t<img src="tlu_42.jpg" alt="TLÜ foto">');
	res.write('\n\t <p><a href="/">Tagasi avalehele</a>!</p>');
	res.write(pageFoot);
	return res.end();
}
function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let receivedData = '';
        request.on('data', chunk => {
            receivedData += chunk.toString();
        });
        request.on('end', () => {
            callback(querystring.decode(receivedData));
        });
    }
    else {
        callback(null);
    }
}

//rinde		5100
//mina		5109

//see töötab