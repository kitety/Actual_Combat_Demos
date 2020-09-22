const express = require("express");
const bodyParser = require("body-parser");

const connectDB = require("./config/db.js");
const app = express();
connectDB();
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", require("./routes/index"));
app.use("/api/url", require("./routes/url"));
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
