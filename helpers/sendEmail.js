const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD, META_USER, META_HOST, META_PORT } = process.env;

const transporter = nodemailer.createTransport({
  host: META_HOST,
  port: META_PORT,
  secure: true,
  auth: {
    user: META_USER,
    pass: META_PASSWORD,
  },
});

module.exports = transporter;
