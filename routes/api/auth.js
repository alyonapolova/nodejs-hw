const express = require("express");
const authCtrl = require("../../controllers/auth");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");
const router = express.Router();

router.post("/register", authCtrl.register);
router.get("/verify/:verificationToken", authCtrl.verifyEmail);
router.post("/login", authCtrl.login);
router.get("/current", authenticate, authCtrl.current);
router.post("/logout", authenticate, authCtrl.logout);

router.patch("/", authenticate, authCtrl.updateSubscription);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authCtrl.updateAvatar
);

module.exports = router;
