const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Display stored PDFs
router.get("/doc-vault", (req, res) => {
  const dirPath = path.join(__dirname, "../generated");
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.send("Error loading documents");
    res.render("doc-vault", { files });
  });
});

module.exports = router;