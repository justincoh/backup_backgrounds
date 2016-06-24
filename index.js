"use strict";
// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

let fs = require('fs'),
    exec = require('child_process').exec,
    AWS = require('aws-sdk'),
    settings = require('./settings');

let awsParams = {
 region: settings.region,
 accessKeyId: settings.accessKeyId,
 secretAccessKey: settings.secretAccessKey,
}
AWS.config.update(awsParams)
let s3 = new AWS.S3();
let backupName = settings.key + ".tar.gz";

let tarCommand = "tar -zcvf " + backupName + " " + settings.path + "Backgrounds";

// Callback to be passed into success of upload
let clean = function(){
    exec("rm "+backupName, (err, stdout, stdin)=>{
        if(err) return console.log('Something broke',err);
        console.log('DONE');
    });
}

// uploads stream to s3 bucket
let sendIt = function(callback){
    console.log('Creating Read Stream')
    var stream = fs.createReadStream('./' + backupName)
    
    let params = {Bucket: settings.bucket, Key: settings.key, Body: stream}
    console.log('sending to aws')

    s3.upload(params, function(err, data) {
      if(err) return console.log("ERR ",err);
      callback();
    });

}

//where the magic happens
exec(tarCommand, (err, stdout, stdin) => {
    if(err) return console.log(err);
    sendIt(clean);
});


