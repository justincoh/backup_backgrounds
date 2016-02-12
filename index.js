"use strict";
// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

let fs = require('fs'),
    exec = require('child_process').exec,
    zlib = require('zlib'),
    AWS = require('aws-sdk'),
    settings = require('./settings');

let awsParams = {
 region: settings.region,
 accessKeyId: settings.accessKeyId,
 secretAccessKey: settings.secretAccessKey,
}
AWS.config.update(awsParams)
let s3 = new AWS.S3();
let backupName = "backup.tar.gz";

let tarCommand = "tar -zcvf " + backupName + " " + settings.path + "Backgrounds";

// Callback to be passed into success of upload
let clean = function(){
    exec("rm backup.tar.gz", (err, stdout, stdin)=>{
        if(err) return console.log('Something broke',err);
        console.log('DONE');
    });
}

// uploads stream to s3 bucket
// should probably put in a progress log? took ~15 minutes at ~1.3 mb/s
let sendIt = function(callback){
    let stream = fs.createReadStream('./' + backupName).pipe(zlib.createGzip())
    let params = {Bucket: settings.bucket, Key: settings.key, Body: stream}

    s3.upload(params, function(err, data) {
      if(err) return console.log("ERR ",err);
      callback();
    });

}

// where the magic happens
exec(tarCommand, (err, stdout, stdin) => {
    if(err) return console.log(err);

    sendIt(clean);
});

