const multer = require("multer");
const fs = require("fs/promises");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

async function ensureUploadsDirectory() {
  try {
    await fs.mkdir("uploads", { recursive: true });
  } catch (err) {
    console.error("Error creating uploads directory:", err);
  }
}

const deleteFileAfterTimeout = (filePath, timeout = 120000) => {
  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${filePath}`, err);
      } else {
        console.log(`File deleted: ${filePath}`);
      }
    });
  }, timeout);
};

ensureUploadsDirectory();

module.exports = { upload, deleteFileAfterTimeout };
