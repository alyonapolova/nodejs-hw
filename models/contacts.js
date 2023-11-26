const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");
const contactsPath = path.join(__dirname, "contacts.json");

const readBd = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const writeBd = async (db) => {
  const data = JSON.stringify(db, null, 2);
  await fs.writeFile(contactsPath, data);
};

const listContacts = async () => {
  const contacts = await readBd();

  return contacts;
};

const getContactById = async (id) => {
  const contacts = await readBd();
  const contact = contacts.find((item) => {
    return item.id === id;
  });
  return contact || null;
};

const removeContact = async (id) => {
  const contacts = await readBd();
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  const removedContact = contacts.splice(index, 1);
  await writeBd(contacts);

  return removedContact;
};

const addContact = async (body) => {
  const contacts = await readBd();
  const newContact = { id: nanoid(), ...body };
  contacts.push(newContact);
  await writeBd(contacts);
  return newContact;
};

const updateContact = async (id, body) => {
  const contacts = await readBd();
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { id, ...body };
  await writeBd(contacts);
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
