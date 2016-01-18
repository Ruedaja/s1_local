var fs = require('fs');

exports.findTrackByName = function(req, res){
    
	var main_name = req.params.name;
	var dir_NAS = "./media/";
	var main_url = dir_NAS+main_name;

	res.sendFile(main_name,{root: './media/'});
};

exports.addTrack = function(req, res){

	var dir_NAS = "./media/";

	if (req.method == 'POST') {
		var fileName = '';
		var mp3File = '';
    	var mp3_file;
    	var tempName = '';

        var body = '';
        var contador = 0;
        req.on('data', function (data) {
            body += data;
           
            if (contador == 0){

            	var stringData = data.toString();
            	stringData = stringData.substr(stringData.indexOf('filename')+13);
            	stringData = stringData.substr(0,stringData.indexOf('.')+4);
            	filename = stringData;
            	
            	var n_random = Math.floor((Math.random() * 100) + 1);

                console.log("This file has been uploaded: " + stringData);

                if (fileName == ""){
                    filename = ".mp3";
                }

            	tempName = new Date().getTime()+n_random+'_'+filename;
            	mp3File = dir_NAS + tempName;
            	mp3_file = fs.createWriteStream(mp3File);
            	mp3_file.write(data);
            	contador++;

            }else{
            	mp3_file.write(data);
            }
        });

        req.on('end', function () {

        	console.log("End of the process");

            mp3_file.end();
            res.writeHead(200, {'Content-Type': 'text/html'});
        	res.end(tempName);
        });

    }
};



exports.deleteTrackByName = function(req,res){
	var dir_NAS = "../media/";
	var main_name = req.params.name;
	var main_url = dir_NAS+main_name;
	var fs = require('fs');
	fs.unlinkSync(main_url);
	res.status(200);
	console.log("This file has beed delated:"+main_name);
};