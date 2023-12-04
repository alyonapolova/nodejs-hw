const express = require("express");

const controller = require("../../controllers/controllers");
const isValidId = require("../../middlewares/isValidId");

const router = express.Router();

router.get("/", controller.getAll);

router.get("/:id", isValidId, controller.getById);

router.post("/", controller.addNewContact);

router.put("/:id", isValidId, controller.updateContact);

router.patch("/:id/favorite", isValidId, controller.updateStatusContact);

router.delete("/:id", isValidId, controller.removeContact);

module.exports = router;
