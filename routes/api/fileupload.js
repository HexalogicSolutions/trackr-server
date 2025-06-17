const express = require('express');
const { upload } = require('../../helpers/multerConfig.js');
const { singleFileUpload } = require('../../controllers/fileuploaderControllers.js')
const router = express.Router();

router.post('/singleFile', upload.single('file'), singleFileUpload);
//jdhfjhsdf
module.exports = router;