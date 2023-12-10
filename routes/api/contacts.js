const express = require("express");

const contactsCtrl = require("../../controllers/contacts");
const authenticate = require("../../middlewares/authenticate");
const isValidId = require("../../middlewares/isValidId");

const router = express.Router();

router.get("/", authenticate, contactsCtrl.getAll);

router.get("/:id", authenticate, isValidId, contactsCtrl.getById);

router.post("/", authenticate, contactsCtrl.addNewContact);

router.put("/:id", authenticate, isValidId, contactsCtrl.updateContact);

router.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  contactsCtrl.updateStatusContact
);

router.delete("/:id", authenticate, isValidId, contactsCtrl.removeContact);

module.exports = router;
