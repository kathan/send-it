# send-it
A Javascript module that simplifies sending files and data over HTTP.

## Usage:
Create a server...
```js
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const port = 8080;

//==== Start Server ====
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(fileUpload());
app.post('*', (req, res) => {
  console.log({file_name: req.files.file.name});
  res.send('Success!');
});

var server = app.listen(port, () => {
  console.log(`Test app listening on port ${port}!`);
});
```
...then send a file!
```js
const sendIt = require('send-it');
const port = 8080;

//==== Send File ====
sendIt(`http://localhost:${port}`, path.resolve(__dirname, 'test.file'), (err, result, reply)=>{
  if(result){
    console.log('Success!');
  }else{
    console.log('Error!', reply.statusCode);
  }
});
```
