/*******************************************
* send-it
* Copyright (c) 2018, Darrel Kathan 
* Licensed under the MIT license.
*
* A current version and some documentation is available at
*    https://github.com/kathan/send-it
*
* @summary     Javascript CGI process manager
* @description send-it A Javascript module that simplifies sending files and data over HTTP..
* @file        send-it
* @version     0.0.1
* @author      Darrel Kathan
* @license     MIT
*******************************************/
const fs = require('fs');
//=== Dependencies ====
const FormData = require('form-data');

const sendFile = function(url, files, data, callback){
  if(typeof data === 'function'){
    callback = data;
    data = {};
  }

  var form = new FormData();
  for(var i in data){
    form.append(i, data[i]);
  }
  if(Array.isArray(files)){
    for(var i in files){
      if(!fs.existsSync(files[i])){
        return callback(`${files[i]} does not exist.`, false);
      }
      form.append('file'+i, fs.createReadStream(files[i]));
    }
  }else{
    if(!fs.existsSync(files)){
      return callback(`${files} does not exist.`, false);
    }
    form.append('file', fs.createReadStream(files));
  }
  
  //form.on('response');
  
  process.nextTick(()=>{
    form.submit(url, (err, reply) => {
      //console.log('sendFile.response');
      if(err){return callback(err, false, reply);}
    
      if(reply.statusCode === 200){
        return callback(null, true, reply);
      }
      if(reply.end){
        reply.end();
      }
      return callback(null, false, reply);
    });
  });
};
    
module.exports = sendFile;