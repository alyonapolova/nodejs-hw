const contacts = require("../models/contacts");
const HttpError = require("../helpers/httpError");
const addSchema = require("../helpers/schema");
const controllerWrapper = require("../helpers/controllerWrapper");
const getAll = async (req, res) => {
  const data = await contacts.listContacts();
  res.status(200).json(data);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const data = await contacts.getContactById(id);
  if (!data) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(data);
};

const addNewContact = async (req, res) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    const [{ path }] = error.details;
    console.log(path);
    throw HttpError(400, `Missing required ${path} field`);
  }
  const data = await contacts.addContact(req.body);
  res.status(201).json(data);
};

const updateContact = async (req, res) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    const [{ path }] = error.details;
    throw HttpError(400, `Missing required ${path} field`);
  }
  const { id } = req.params;
  const data = await contacts.updateContact(id, req.body);

  if (!data) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(data);
};

const removeContact = async (req, res) => {
  const { id } = req.params;
  const removedContact = await contacts.removeContact(id);
  if (!removedContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "Contact deleted" });
};

module.exports = {
  getAll: controllerWrapper(getAll),
  getById: controllerWrapper(getById),
  addNewContact: controllerWrapper(addNewContact),
  updateContact: controllerWrapper(updateContact),
  removeContact: controllerWrapper(removeContact),
};
