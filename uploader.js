//uploader
var sys = require ('util'),
url = require('url'),
http = require('http'),
qs = require('querystring');
var formidable = require('formidable');
var static = require('node-static');
var file = new static.Server('.');
var fs = require('fs');

http.createServer(function (req, res) {
    console.log(req.url);
    if(req.url == '/fileupload'){
        var form = new formidable.IncomingForm();
        form.parse(req,function(err, fields, files){
            if(err) console.log(err);
//            console.log(files);
            var oldpath = files.audioFile.path;
            var newpath = 'audio/'+files.audioFile.name;
            fs.rename(oldpath, newpath, function(err){
               if(err) throw err;
                res.write(newpath);
                res.end();
            });
        });
    }else{
        file.serve(req, res);
    }
}).listen(8080);
console.log('file uploader started at port 8080');
