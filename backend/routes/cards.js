const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, postCard, getCard, putLike, deleteLike,
} = require('../controllers/cards.js');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required(),
  }),
}), postCard);

router.delete('/cards/:id', getCard);

router.put('/cards/:cardId/likes', putLike);

router.delete('/cards/:cardId/likes', deleteLike);

module.exports = router;
