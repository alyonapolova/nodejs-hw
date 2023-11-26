const express = require("express");
const HttpError = require("../../helpers/httpError");

const addSchema = require("../../helpers/schema");
const controller = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await controller.listContacts();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await controller.getContactById(id);
    if (!data) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "Missing required name field");
    }
    const data = await controller.addContact(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "Missing required name field");
    }
    const { id } = req.params;
    const data = await controller.updateContact(id, req.body);

    if (!data) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedContact = await controller.removeContact(id);
    if (!removedContact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json({ message: "Contact deleted", data: removedContact });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
