const { User } = require("../models/user");
const HttpError = require("../helpers/httpError");
const controllerWrapper = require("../helpers/controllerWrapper");
const { registerSchema, loginSchema } = require("../models/user");
const bcrypt = require("bcrypt");

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

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
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
  const token = "gfbhdnew23456";
  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

module.exports = {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
};
