const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const { SALT_ROUND } = require('../configs/index.js');
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const { jwtVerify } = require('../middlewares/auth.js');

const getUsers = async(req, res) => {
  return User.find({})
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else {
        res.status(500).send('Ошибка сервера');
      }
    });
};

const getUser = (req, res) => {
  let idUser;
  if (req.params.id === "me") {
    idUser = req.user.id;
  }
  else {
    idUser = req.params.id;
  }
  User.findOne({ _id: idUser })
    .orFail(() => {
      const error = new Error('Нет пользователя с таким id');
      error.statusCode = 404;
      throw error;
    })
    .then((userPer) => {
      res.send(userPer);
      return userPer;
    })
    .catch((err) => {
      if (err.kind === undefined) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Неправильный id' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const { id } = req.user;
  const opts = { runValidators: true };
  User.findOneAndUpdate({ _id: id }, { name, about }, opts)
    .orFail(() => {
      const error = new Error('Нет пользователя с таким id');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Неправильный id' });
      } else {
        res.status(err.statusCode).send({ message: err.message });
      }
    });
};

const newUser = (req, res) => {
  const { email, password } = req.body;

  if( !email || !password) {
    return res.status(400).send({ message: "invalid" });
  }

  User.findOne({ email })
  .then(user => {
    if (user) {
      return res.status(409).send({ message: "there is such email in data" });
    }

    return bcrypt.hash(password, SALT_ROUND);
  })
  .then(hash => {
    User.create({
      ...req.body,
      password: hash
    })
    .then(({ _id }) => {
      return res.status(200).send({ _id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Неправильный id' });
      } else {
        res.status(err.statusCode).send({ message: err.message });
      }
    });
  })
  .catch(err => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации' });
    } else if (err.kind === 'ObjectId') {
      res.status(400).send({ message: 'Неправильный id' });
    } else {
      res.status(err.statusCode).send({ message: err.message });
    }
  })
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { id } = req.user;
  const opts = { runValidators: true };
  User.findOneAndUpdate({ _id: id }, { avatar }, opts)
    .orFail(() => {
      const error = new Error('Нет пользователя с таким id');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Неправильный id' });
      } else {
        res.status(err.statusCode).send({ message: err.message });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if( !email || !password) {
    return res.status(400).send({ message: "invalid" });
  }

  User.findOne({ email }).select('+password')
  .then(user => {
    if (!user) {
      return res.status(401).send({ message: "there is no such email in data" });
    }

    bcrypt.compare(password, user.password).then(matched => {
      if (matched) {
        const token = jwt.sign({
          id: user._id
        }, JWT_SECRET, { expiresIn: '7d' });
        return res.send({
          token
        });
      }
      return res.status(401).send({ message: "invalid pass" });
    })
  })
  .catch(err => {
    res.status(500).send({ message: err });
  })
};

module.exports = {
  getUsers, getUser, updateUser, newUser, updateAvatar, login
};
