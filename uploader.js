//uploader
var http = require('http');
var formidable = require('formidable');
var static = require('node-static');
var file = new static.Server('.');
var fs = require('fs');

http.createServer(function (req, res) {
    if(req.url == '/fileupload'){
        var form = new formidable.IncomingForm();
        form.parse(req,function(err, fields, files){
            if(err) console.log(err);
//            console.log(files);
            let audio = files.audioFile;
            var oldpath = audio.path;
            let ext = String(audio.type).split('/')[1];
            let timestamp = (new Date()).getTime();
            let newpath = `audio/${timestamp}.${ext}`;

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
