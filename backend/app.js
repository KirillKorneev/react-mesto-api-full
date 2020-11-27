require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const cors = require('cors');
const userRoutes = require('./routes/users.js');
const cardsRoutes = require('./routes/cards.js');
const {
  newUser, login,
} = require('./controllers/users.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');

const mongoDbUrl = 'mongodb://localhost:27017/mestodb-1';
const mongoConnectOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.connect(mongoDbUrl, mongoConnectOptions);

const auth = require('./middlewares/auth.js');

app.use(cors());

//app.use(function(req, res, next) {
//  res.header('Access-Control-Allow-Origin', 'http://http://localhost:3000');
//  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
//
//  next();
//});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', login);
app.post('/signup', newUser);

app.use(auth);
app.use('/', cardsRoutes);
app.use('/', userRoutes);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {});
