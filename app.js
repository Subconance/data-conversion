const express = require("express");
require("dotenv").config();
const routes = require("./routes");

const app = express();

const PORT = process.env.PORT || 11700;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Data Conversion API");
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log("Data Conversion API started on port: " + PORT);
});
