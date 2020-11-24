const Card = require('../models/card.js');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((data) => res.status(200).send(data))
    .catch(() => res.status(500).send({ message: 'Ошибка чтения' }));
};

const postCard = (req, res) => {
  const { name, link } = req.body;
  const { id } = req.user;
  Card.create({ name, link, owner: id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else {
        res.status(500).send('Ошибка сервера');
      }
    });
};

const getCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      const error = new Error('Такой карточки не существует');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Неправильный id' });
      } else {
        res.status(err.statusCode).send({ message: err.message });
      }
    });
};

const putLike = (req, res) => {
  const { id } = req.user;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: id } },
    { new: true })
    .orFail(() => {
      const error = new Error('Такой карточки не существует');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Неправильный id' });
      } else {
        res.status(err.statusCode).send({ message: err.message });
      }
    });
};

const deleteLike = (req, res) => {
  const { id } = req.user;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: id } },
    { new: true })
    .orFail(() => {
      const error = new Error('Такой карточки не существует');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(400).send({ message: 'Неправильный id' });
      } else {
        res.status(err.statusCode).send({ message: err.message });
      }
    });
};

module.exports = {
  getCards, postCard, getCard, putLike, deleteLike,
};
