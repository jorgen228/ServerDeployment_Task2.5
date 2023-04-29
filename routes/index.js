var express = require("express");
var router = express.Router();
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const CyclicDB = require("@cyclic.sh/dynamodb");
const db = CyclicDB(process.env.CYCLIC_DB);
const text = db.collection("text");

router.get("/json", async (req, res, next) => {
  let texts = await text.list();
});

router.post("/json", async (req, res, next) => {
  const newText = req.body.text;
  await text.set(newText);
  res.json({
    status: "success",
    message: "Text added",
    data: newText,
  });
});

module.exports = router;
