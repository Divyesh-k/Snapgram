const express = require('express');
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const { uploadFile , deleteFile} = require('../controllers/uploadController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

console.log(storage);

const upload = multer({ storage: storage });

router.post('/', auth, upload.single('file'), uploadFile);

router.delete('/:fileId', auth, deleteFile);

module.exports = router;