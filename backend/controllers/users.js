const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const { SALT_ROUND } = require('../configs/index.js');

const { JWT_SECRET } = process.env;

const { NotFoundError, InvalidError, WrongAuth } = require('../utils/errors.js');

const getUsers = async (req, res, next) => User.find({})
  .then((data) => res.status(200).send(data))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      const e = new InvalidError('Ошибка валидации');
      next(e);
    } else {
      next(err);
    }
  });

const getUser = (req, res, next) => {
  let idUser;
  if (req.params.id === 'me') {
    idUser = req.user.id;
  } else {
    idUser = req.params.id;
  }
  User.findOne({ _id: idUser })
    .orFail(() => {
      const error = new NotFoundError('Нет пользователя с таким id');
      throw error;
    })
    .then((userPer) => {
      res.send(userPer);
      return userPer;
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const e = new InvalidError('Неправильный id');
        next(e);
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { id } = req.user;
  const opts = { new: true, runValidators: true };
  User.findOneAndUpdate({ _id: id }, { name, about }, opts)
    .orFail(() => {
      const error = new NotFoundError('Нет пользователя с таким id');
      throw error;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new InvalidError('Ошибка валидации');
        next(error);
      } else if (err.kind === 'ObjectId') {
        const error = new InvalidError('Неправильный id');
        next(error);
      } else {
        next(err);
      }
    });
};

const newUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new InvalidError('Невалидные данные логина или пароля');
    throw err;
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        const err = new NotFoundError('Такой пользователь уже существует');
        throw err;
      }

      return bcrypt.hash(password, SALT_ROUND);
    })
    .then((hash) => {
      User.create({
        ...req.body,
        password: hash,
      })
        .then(({ _id }) => res.status(200).send({ _id }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const error = new InvalidError('Ошибка валидации');
            next(error);
          } else if (err.kind === 'ObjectId') {
            const error = new InvalidError('Неправильный id');
            next(error);
          } else {
            next(err);
          }
        });
    })
    .catch((err) => { next(err); });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { id } = req.user;
  const opts = { new: true, runValidators: true };
  User.findOneAndUpdate({ _id: id }, { avatar }, opts)
    .orFail(() => {
      const error = new NotFoundError('Нет пользователя с таким id');
      throw error;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new InvalidError('Ошибка валидации');
        next(error);
      } else if (err.kind === 'ObjectId') {
        const error = new InvalidError('Неправильный id');
        next(error);
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new InvalidError('Невалидные данные логина или пароля');
    throw (error);
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const error = new WrongAuth('Невалидные данные логина или пароля');
        throw (error);
      }

      bcrypt.compare(password, user.password).then((matched) => {
        if (matched) {
          const token = jwt.sign({
            id: user._id,
          }, JWT_SECRET, { expiresIn: '7d' });
          return res.send({
            token, email,
          });
        }
        const error = new WrongAuth('Невалидные данные логина или пароля');
        throw (error);
      })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers, getUser, updateUser, newUser, updateAvatar, login,
};
