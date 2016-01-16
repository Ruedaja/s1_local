var express = require('express');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring')
var router = express.Router();
var multer  = require('multer');
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:id', function(req,res,next){
  res.sendFile("/mnt/nas/" + req.params.id + ".mp3", function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', req.params.id);
    }
  });
});

router.post('/', multer({inMemory: true}),function(req,res,next){
  console.log(req.files.track);
  var track = req.files.track;
  var name = track.name;
  var extension = track.extension;
  var id = track.name.split('.')[0];

  var track_buffer = track.buffer;

  var server_url = "http://localhost:3000/";

  var url = server_url + id + "." + extension;
  var write_path =  "/mnt/nas/" + id + "." + extension;

    console.log(write_path);
    fs.writeFile( write_path, track_buffer, function(err){
    if(err){
      return console.log(err);
      res.sendStatus(500);
    }
    console.log("The file was saved!");
    res.status(200).json({url: id});
  });

});

router.delete('/:id', function(req,res,next){
  // Aquí debe implementarse el borrado del fichero de audio indetificado por trackId en tracks.cdpsfy.es
  var track_url = req.params.id;
  //TODO: Check extension
  var deletion_path = "/mnt/nas/" + track_url + ".mp3";

  fs.exists(deletion_path, function(exists) {
    if (exists){
      console.log("Deleted: " + deletion_path);
      fs.unlink(deletion_path);
      res.sendStatus(202);
    } else {
      console.log("Error deleting: " + deletion_path);
      return res.sendStatus(500);
    }
  });

});

module.exports = router;
