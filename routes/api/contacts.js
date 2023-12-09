const express = require("express");

const contactsCtrl = require("../../controllers/contacts");
const isValidId = require("../../middlewares/isValidId");

const router = express.Router();

router.get("/", contactsCtrl.getAll);

router.get("/:id", isValidId, contactsCtrl.getById);

router.post("/", contactsCtrl.addNewContact);

router.put("/:id", isValidId, contactsCtrl.updateContact);

router.patch("/:id/favorite", isValidId, contactsCtrl.updateStatusContact);

router.delete("/:id", isValidId, contactsCtrl.removeContact);

module.exports = router;
