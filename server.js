var http = require('http');
 
var fs = require('fs');
 
var index = fs.readFileSync('OldWeek/BarChart3.html');
 
http.createServer(function(request,response){
 
response.writeHead(200, {"Content-Type": "text/html"});
 
response.write(index);
 
response.end(); }).listen(1337, '127.0.0.1');
 
console.log('Webserver dang chay...');
