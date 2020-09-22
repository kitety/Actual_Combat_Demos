const express = require("express");
const router = express.Router();
const Url = require("../models/url");

router.get("/:code", async (req, res, next) => {
  try {
    const urlCode = req.params.code;
    const url = await Url.findOne({ urlCode });
    if (url) {
      // 重定向
      res.redirect(url.longUrl);
    } else {
      res.status(404).json({ msg: "no url found" });
    }
  } catch (e) {
    res.status(500).json("Server error");
  }
});
module.exports = router;
