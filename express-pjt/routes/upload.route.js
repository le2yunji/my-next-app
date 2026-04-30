const router = require("express").Router();
const { authenticate } = require("../middlewares/auth.middleware");
const { getPresignedUrls } = require("../controllers/upload.controller");

router.post("/presigned", authenticate, getPresignedUrls);

module.exports = router;
