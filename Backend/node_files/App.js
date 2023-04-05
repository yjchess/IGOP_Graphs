const http = require("http")
const fs = require('fs')
require("./generate_jsons.cjs")

const { contentType, lookup } = require("mime-types");
const port = 3000
console.log(Math.random());
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
console.log(appDir);


const server = http.createServer(function(req, res) {
    if(req.url === "/")
        serveFile("index.html", res);    
    else{
        serveFile(req.url.substring(1), res);
    }

});


function serveFile(file, res){

    fs.readFile(`Frontend/website/${file}`, function(error, data){
        if(error){
            res.writeHead(404);
            res.write('Error file not found');
        } else {
            res.writeHead(200, { "Content-Type": contentType(lookup(file))});
            res.write(data)
        }
        res.end()
    })
}

server.listen(port, function(error){
    if(error){
        console.log("Something went Wrong", error)
    }else[
        console.log("Server is listening on port " + port)
    ]
})
