require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const userRoutes = require('./routes/users.js');
const cardsRoutes = require('./routes/cards.js');
const {
  newUser, login
} = require('./controllers/users.js');

const mongoDbUrl = 'mongodb://localhost:27017/mestodb-1';
const mongoConnectOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

//console.log(process.env.NODE_ENV); // production
mongoose.connect(mongoDbUrl, mongoConnectOptions);

const auth = require('./middlewares/auth.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/signin', login);
app.post('/signup', newUser);

app.use(auth);
app.use('/', cardsRoutes);
app.use('/', userRoutes);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {});
