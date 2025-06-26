// const express = require("express");
// const router = express.Router();
// const upload = require("../middlewares/upload");
// const ocrController = require("../controllers/ocrController");

// router.get("/upload", (req, res) => res.render("result"));
// router.post("/upload", upload.single("document"), ocrController.processDocument);

// module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const ocrController = require("../controllers/ocrController");
router.get("/upload", (req, res) => {
  res.render("result", {
    itr: "ITR-1",
    result: null,
    data: null,
    showform : true
  });
});

router.post("/upload", upload.single("document"), ocrController.processDocument);


module.exports = router;

