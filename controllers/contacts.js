const {
  Contact,
  addSchema,
  updatefavoriteSchema,
} = require("../models/contact");

const HttpError = require("../helpers/httpError");

const controllerWrapper = require("../helpers/controllerWrapper");

const getAll = async (req, res) => {
  const data = await Contact.find();
  res.status(200).json(data);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const data = await Contact.findById(id);
  if (!data) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(data);
};

const addNewContact = async (req, res) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    const [{ path }] = error.details;
    throw HttpError(400, `Missing required ${path} field`);
  }
  const data = await Contact.create(req.body);
  res.status(201).json(data);
};

const updateContact = async (req, res) => {
  const { error } = addSchema.validate(req.body);
  if (error) {
    const [{ path }] = error.details;
    throw HttpError(400, `Missing required ${path} field`);
  }
  const { id } = req.params;
  const data = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (!data) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(data);
};

const updateStatusContact = async (req, res) => {
  const { error } = updatefavoriteSchema.validate(req.body);
  if (error) {
    throw HttpError(400, "Missing field favorite");
  }
  const { id } = req.params;
  const data = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (!data) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(data);
};

const removeContact = async (req, res) => {
  const { id } = req.params;
  const removedContact = await Contact.findByIdAndDelete(id);
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
  updateStatusContact: controllerWrapper(updateStatusContact),
  removeContact: controllerWrapper(removeContact),
};
