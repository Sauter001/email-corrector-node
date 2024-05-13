const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello Node.js!<h1/>");
});

app.post("/createEmail", (req, res) => {
    
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
