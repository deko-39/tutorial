const axios = require("axios");
const express = require("express");

const app = express();

app.get("/", async (req, res, next) => {
  try {
    await axios.get("http://po12p4ok.com/"); // Bat dong bo nhung chay dong bo
    res.send("OK");
  } catch (error) {
    console.log("Co loi roi", JSON.stringify(error));
    res.send("Error");
  }
});

app.listen(3000);
