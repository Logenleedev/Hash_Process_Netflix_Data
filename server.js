
// import packages
const http = require('http');
const path = require('path');
const express = require('express');
const parse = require('csv-parse').parse
const os = require('os')
const AWS = require('aws-sdk');
const multer  = require('multer')
const upload = multer({ dest: os.tmpdir() })
const fs = require('fs')
var stringify = require('csv-stringify')
const bodyParser = require('body-parser')
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
let data_filtered = null;



const ID = process.env.ID;
const SECRET = process.env.SECRET;

// The name of the bucket that you have created
const BUCKET_NAME = 'netflix-user-uata';
const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});


router.use(express.json({limit: '100mb'}));
router.use(bodyParser.json())
router.use(express.static(path.resolve(__dirname, 'client')));

console.log('Booting up the server! Please wait until finished...')

server.listen(process.env.PORT || 3000, function(){
  var addr = server.address();
  console.log("All ready! Server listening at", addr.address + ":" + addr.port);
});



router.post('/csv_upload', upload.single('file'), (req, res) => {
  const file = req.file


  const data = fs.readFileSync(file.path)
  
  parse(data, (err, records) => {
    if (err) {
      console.error(err)
      return res.status(400).json({success: false, message: 'An error occurred'})
    }
    
    return res.json({data: records})

  })

})




router.post('/submission', (req, res) => {
  data_filtered = req.body.data
  var random = Math.floor(Math.random() * 900000000000000000);

  filename = random + '-' + 'users.json';
  try{
    s3.putObject({
         Bucket: BUCKET_NAME,
         Key: filename,
         Body: JSON.stringify(data_filtered),
         ContentType: 'application/json; charset=utf-8'
     }).promise();
  }
    catch(e){
        throw e
  }
  console.log("All good!")
})