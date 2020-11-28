const Card = require('../models/card.js');
const { NotFoundError, InvalidError } = require('../utils/errors.js');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((data) => res.status(200).send(data))
    .catch((err) => next(err));
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const { id } = req.user;
  Card.create({ name, link, owner: id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = InvalidError('Ошибка валидации');
        next(error);
      } else {
        next(err);
      }
    });
};

const getCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      const error = new NotFoundError('Такой карточки не существует');
      throw error;
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error = new InvalidError('Такой карточки не существует');
        next(error);
      } else {
        next(err);
      }
    });
};

const putLike = (req, res, next) => {
  const { id } = req.user;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: id } },
    { new: true })
    .orFail(() => {
      const error = new NotFoundError('Такой карточки не существует');
      throw error;
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error = new InvalidError('Неправильный id');
        next(error);
      } else {
        next(err);
      }
    });
};

const deleteLike = (req, res, next) => {
  const { id } = req.user;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: id } },
    { new: true })
    .orFail(() => {
      const error = new NotFoundError('Такой карточки не существует');
      throw error;
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error = new InvalidError('Неправильный id');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards, postCard, getCard, putLike, deleteLike,
};
