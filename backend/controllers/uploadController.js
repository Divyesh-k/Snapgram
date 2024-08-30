const path = require('path');
const fs = require('fs');

const uploadFile = (req, res) => {
  const { file, protocol, get } = req;

  // Check if a file was uploaded
  if (!file) {
    return res.status(400).json({ message: 'No file was uploaded.' });
  }

  // Construct the file URL
  // const fileUrl = `${process.env.BACKEND_URL}/uploads/${file.filename}`;
  const fileUrl =  `${file.filename}`;

  console.log(fileUrl);

  // Respond with the file URL and file ID
  return res.status(200).json({
    fileUrl,
    fileId: file.filename
  });
};

// New deleteFile method
const deleteFile = (req, res) => {
  const { fileId } = req.params; // Get the fileId from URL parameters
  const filePath = path.join(__dirname, '../uploads', fileId); // Construct the file path

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete file', error: err.message });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  });
};

module.exports = { uploadFile , deleteFile};

