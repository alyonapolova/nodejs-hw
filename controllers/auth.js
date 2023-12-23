const { User } = require("../models/user");
const HttpError = require("../helpers/httpError");
const controllerWrapper = require("../helpers/controllerWrapper");
const { registerSchema, loginSchema, emailSchema } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const transporter = require("../helpers/sendEmail");

const { SECRET_KEY, BASE_URL, META_USER } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    const [{ path }] = error.details;
    throw HttpError(400, `Missing required ${path} field`);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    from: META_USER,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click here to verify your email</a>`,
  };

  await transporter.sendMail(verifyEmail);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json("Verification successful");
};

const resendEmail = async (req, res) => {
  const { error } = emailSchema.validate(req.body);
  if (error) {
    const [{ path }] = error.details;
    throw HttpError(400, `Missing required ${path} field`);
  }

  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Invalid email");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    from: META_USER,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click here to verify your email</a>`,
  };

  await transporter.sendMail(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
};

const login = async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    const [{ path }] = error.details;
    throw HttpError(400, `Missing required ${path} field`);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email isn't verified");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const current = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json("Logout success");
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, req.body, { new: true });
  if (!user) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(user);
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "Missing required avatar field");
  }

  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  console.log("tempUpload", tempUpload);

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, originalname);

  Jimp.read(tempUpload)
    .then((avatar) => {
      return avatar.resize(250, 250).write(resultUpload);
    })
    .catch((err) => {
      console.error(err);
    });

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({ avatarURL: avatarURL });
};

module.exports = {
  register: controllerWrapper(register),
  verifyEmail: controllerWrapper(verifyEmail),
  resendEmail: controllerWrapper(resendEmail),
  login: controllerWrapper(login),
  current: controllerWrapper(current),
  logout: controllerWrapper(logout),
  updateSubscription: controllerWrapper(updateSubscription),
  updateAvatar: controllerWrapper(updateAvatar),
};
