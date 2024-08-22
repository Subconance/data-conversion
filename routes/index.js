const express = require("express");
const router = express.Router();

const {
  csvToJson,
  jsonToCsv,
  xmlToJson,
  jsonToXml,
} = require("../controllers");

const { upload } = require("../helpers");

router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Data Conversion API",
  });
});

router.post("/csv-to-json", upload.single("file"), csvToJson);
router.post("/json-to-csv", jsonToCsv);
router.post("/xml-to-json", upload.single("file"), xmlToJson);
router.post("/json-to-xml", upload.single("file"), jsonToXml);

module.exports = router;
