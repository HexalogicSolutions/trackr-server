const express = require('express');
const mongoose = require('mongoose');
const config = require('config')
const cors = require('cors');
const app = express()
const bodyParser = require('body-parser');
const ServerConstants = require('./global/ServerConstants');
const fs = require('fs');
const path = require('path');
const logger = require('./helpers/logger.js');
const fileHelper = require('./helpers/fileHelper.js');

// Passing middleware
app.use(express.json())
app.use(cors());
//For multer (this middleware is used for uploads folder which i made in trackr-server folder)
// app.use(bodyParser());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const Port = process.env.PORT || 5000;
const db = config.get('mongoURI')
//create the logger


mongoose
  .connect(db, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
  })
  .then(() => console.log('Database is connected...' + db.path))
  .catch(err => console.log('Database connection error : ' + err))


// Routes
app.use('/api/users', require('./routes/api/user'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/groups', require('./routes/api/groups'))
app.use('/api/entitytype', require('./routes/api/entitytype'))
app.use('/api/handheld', require('./routes/api/handheld'))
app.use('/api/entity', require('./routes/api/entity'))
app.use('/api/sales', require('./routes/api/sales'))
app.use('/api/entitysubtype', require('./routes/api/entitysubtype'))
app.use('/api/warehouse', require('./routes/api/warehouse'))
app.use('/api/locationarea', require('./routes/api/locationarea'))
app.use('/api/location', require('./routes/api/location'))
app.use('/api/entitystatus', require('./routes/api/entitystatus'))
app.use('/api/actiongroup', require('./routes/api/actiongroup'))
app.use('/api/brand', require('./routes/api/brand'))
app.use('/api/material', require('./routes/api/material'))
app.use('/api/test', require('./routes/api/test'))
app.use('/api/search', require('./routes/api/search'))
app.use('/api/reports', require('./routes/api/reports'))
app.use('/api/units', require('./routes/api/unit'))
app.use('/api/category', require('./routes/api/category'))
app.use('/api/item', require('./routes/api/item'))
app.use('/api/trace', require('./routes/api/trace'))
app.use('/api/supplier', require('./routes/api/supplier'))
app.use('/api/supplier/active', require('./routes/api/supplier'))
app.use('/api/suppstatus', require('./routes/api/supplierstatus'))
app.use('/api/suppstatus/active', require('./routes/api/supplierstatus'))
app.use('/api/stock', require('./routes/api/stock'))
app.use('/api/stocklevel', require('./routes/api/stocklevel'))
app.use('/api/stockstatus', require('./routes/api/stockstatus'))
app.use('/api/customer', require('./routes/api/customer'))
app.use('/api/param', require('./routes/api/param'))
app.use('/api', require('./routes/api/fileupload'))
app.use('/api/logs', require('./routes/api/logs'))
// var stkLine = require('./routes/api/stockline');
// app.use(stkLine.router);
app.use(express.static("trackr-client/build"));

app.post('/upload', function (req, res) {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  console.log('req.files >>>', req.files); // eslint-disable-line
  sampleFile = req.files.sampleFile;

  uploadPath = __dirname + '/trackr-client/public/images/' + sampleFile.name;

  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('File uploaded to ' + uploadPath);
  });
});

// server static assests if in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('trackr-client/build'));
//   const path = require('path')
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'trackr-client', 'build', 'index.html'))
//   })
// }


app.listen(Port, () => {
  // logger.info(`Serverxx is running at Port + ${Port}` );
  console.log(`Server is running at Port + ${Port}`);


  // check if ext folder is created
  var extFolderPath = fileHelper.getExternalFilesFolderPath();
  fs.existsSync(extFolderPath) || fs.mkdirSync(extFolderPath);

  // check if log folder is created
  var logFolderPath = fileHelper.getLogFolderPath();
  fs.existsSync(logFolderPath) || fs.mkdirSync(logFolderPath);


  // check if upload folder is created
  var uploadFolderPath = fileHelper.getUploadFolderPath();
  fs.existsSync(uploadFolderPath) || fs.mkdirSync(uploadFolderPath);

  logger.debug(`Server started and running at Port + ${Port}`)
  // logger.error('Trackr-server errorxxxx');
  // logger.info('Trackr-server infoxxxx');

})