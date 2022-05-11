const http = require('http');
const path = require('path');

const express = require('express');
const parse = require('csv-parse').parse
const os = require('os')
const multer  = require('multer')
const upload = multer({ dest: os.tmpdir() })
const fs = require('fs')
const stringify = require('csv-stringify').stringify
const bodyParser = require('body-parser')
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);

const app = express();

app.use(bodyParser.json())
router.use(express.static(path.resolve(__dirname, 'client')));

console.log('Booting up the server! Please wait until finished...')

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("All ready! Server listening at", addr.address + ":" + addr.port);
});

router.post('/read', upload.single('file'), (req, res) => {
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