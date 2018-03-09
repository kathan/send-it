/*
send-file
*/

const FormData = require('form-data');
const fs = require('fs');
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