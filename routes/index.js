var express = require("express");
var router = express.Router();
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const CyclicDB = require("@cyclic.sh/dynamodb");
const db = CyclicDB(process.env.CYCLIC_DB);
const text = db.collection("text");

router.get("/json", async (req, res, next) => {
  let texts = await text.list();
  res.json(texts);
});

router.post("/json", async (req, res, next) => {
  const newText = req.body.text;
  await text.set(newText, {
    text: newText,
  });
  res.json({
    status: "success",
    message: "Text added",
    data: newText,
  });
});

router.get("/dishes", async (req, res, next) => {
  let dishes = await s3
    .listObjectsV2({
      Bucket: process.env.BUCKET_NAME,
    })
    .promise();
  result = dishes;
  res.json(result);
});

router.get("/dishes/:key", async (req, res, next) => {
  let specifficDish = req.params.key;
  let dish = await s3
    .getObject({
      Bucket: process.env.BUCKET_NAME,
      Key: specifficDish,
    })
    .promise();
  result = dish;
  res.json(result);
});

router.post("/dishes", async (req, res, next) => {
  const newDish = req.body.dish;
  await s3
    .putObject({
      Body: JSON.stringify(newDish),
      Bucket: process.env.BUCKET_NAME,
      Key: newDish,
    })
    .promise();
  res.json({
    status: "success",
    message: "Dish added",
    data: newDish,
  });
});

module.exports = router;
