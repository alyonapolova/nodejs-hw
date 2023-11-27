const express = require("express");

const controller = require("../../controllers/controllers");

const router = express.Router();

router.get("/", controller.getAll);

router.get("/:id", controller.getById);

router.post("/", controller.addNewContact);

router.put("/:id", controller.updateContact);

router.delete("/:id", controller.removeContact);

module.exports = router;
