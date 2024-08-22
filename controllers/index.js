const asyncErrorWrapper = require("express-async-handler");
const xml2js = require("xml2js");
const Papa = require("papaparse");
const { Builder } = require("xml2js");
const fs = require("fs");
const path = require("path");


const csvToJson = asyncErrorWrapper(async (req, res) => {
  try {
    const csvFilePath = req.file.path;
    const csvFile = fs.readFileSync(csvFilePath, "utf8");

    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        res.status(200).json(results.data);
        setTimeout(() => {
          fs.unlink(csvFilePath, (err) => {
            if (err) {
              console.error(`Error deleting file: ${csvFilePath}`, err);
            } else {
              console.log(`File deleted: ${csvFilePath}`);
            }
          });
        }, 120000);
      },
      error: (error) => {
        console.log("Error parsing CSV file:", error.message);
        res.status(500).json({ success: false, error: error.message });
        setTimeout(() => {
          fs.unlink(csvFilePath, (err) => {
            if (err) {
              console.error(`Error deleting file: ${csvFilePath}`, err);
            } else {
              console.log(`File deleted: ${csvFilePath}`);
            }
          });
        }, 120000);
      },
    });
  } catch (error) {
    console.log("Error processing CSV to JSON:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const jsonToCsv = asyncErrorWrapper(async (req, res) => {
  try {
    const jsonData = req.body;
    const fileName = "output.csv";
    const csv = Papa.unparse(jsonData);
    const filePath = path.join("uploads", fileName);

    fs.writeFileSync(filePath, csv);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.log("Error downloading CSV file:", err.message);
        return res.status(500).json({ error: err.message });
      }
      setTimeout(() => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
          } else {
            console.log(`File deleted: ${filePath}`);
          }
        });
      }, 60000);
    });
  } catch (error) {
    console.log("Error processing JSON to CSV:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const xmlToJson = asyncErrorWrapper(async (req, res) => {
  try {
    const xmlFilePath = req.file.path;
    const xmlFile = fs.readFileSync(xmlFilePath, "utf8");

    xml2js.parseString(xmlFile, { explicitArray: false }, (error, result) => {
      if (error) {
        console.log("Error parsing XML file:", error.message);
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(result);
      setTimeout(() => {
        fs.unlink(xmlFilePath, (err) => {
          if (err) {
            console.error(`Error deleting file: ${xmlFilePath}`, err);
          } else {
            console.log(`File deleted: ${xmlFilePath}`);
          }
        });
      }, 60000);
    });
  } catch (error) {
    console.log("Error processing XML to JSON:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const jsonToXml = asyncErrorWrapper(async (req, res) => {
  try {
    const jsonData = req.body;
    const fileName = "output.xml";
    const builder = new Builder();
    const xml = builder.buildObject(jsonData);
    const filePath = path.join("uploads", fileName);

    fs.writeFileSync(filePath, xml);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.log("Error downloading XML file:", err.message);
        return res.status(500).json({ error: err.message });
      }
      setTimeout(() => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
          } else {
            console.log(`File deleted: ${filePath}`);
          }
        });
      }, 60000);
    });
  } catch (error) {
    console.log("Error processing JSON to XML:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { csvToJson, jsonToCsv, xmlToJson, jsonToXml };
