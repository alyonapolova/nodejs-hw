const express = require("express");
const authCtrl = require("../../controllers/auth");
const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.get("/current", authenticate, authCtrl.current);
router.post("/logout", authenticate, authCtrl.logout);
router.post("/logout", authenticate, authCtrl.logout);
router.patch("/", authenticate, authCtrl.updateSubscription);
module.exports = router;
