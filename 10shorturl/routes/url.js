const express = require("express");
const router = express.Router();
const validUrl = require("valid-url");
const shortId = require("short-id");
const config = require("config");
const Url = require("../models/url");

router.post("/shorten", async (req, res, next) => {
  const { longUrl } = req.body;
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });
      if (url) {
        res.json({ shortUrl: `${config.get("baseUrl")}/${url.urlCode}` });
      } else {
        const urlCode = shortId.generate();
        url = new Url({ longUrl, urlCode });
        await url.save();
        res.json({ shortUrl: `${config.get("baseUrl")}/${url.urlCode}` });
      }
    } catch (e) {
      res.status(500).json("Server error");
    }
  } else {
    res.status(401).json("Invalid long url");
  }
});
module.exports = router;
