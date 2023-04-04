const http = require("http")
const fs = require('fs')
require("./node_files/generate_jsons.cjs")

const { contentType, lookup } = require("mime-types");
const port = 3000

// const server = http.createServer(function(req, res){

    
//     if (req.url ==="/"){serveFile("index.html",res)}
//     if (req.url ==="/index.mjs"){serveFile("index.mjs", res)}
//     if (req.url ==="/Calculations.mjs"){serveFile("Calculations.mjs", res)}
//     if (req.url ==="/Structures.mjs"){serveFile("Structures.mjs", res)}
//     if (req.url ==="/variables.mjs"){serveFile("variables.mjs", res)}
//     if (req.url ==="/user_interaction.mjs"){serveFile("user_interaction.mjs", res)}

// })

const authorizedFiles = ["/index.html", "/index.js", "/Calculations.js", "/Structures.js", "/user_interaction.js", "/variables.js"];

const server = http.createServer(function(req, res) {
    if(req.url === "/")
        serveFile("index.html", res);
//      else if(authorizedFiles.includes(req.url))
//          serveFile(req.url.substring(1), res);
//      else {
//          res.writeHead(404);
//          res.write("File not found");
//          res.end();
//   }
    
    else{
        serveFile(req.url.substring(1), res);
    }

});


function serveFile(file, res){

    fs.readFile(file, function(error, data){
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