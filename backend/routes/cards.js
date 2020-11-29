const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regex = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;

const {
  getCards, postCard, getCard, putLike, deleteLike,
} = require('../controllers/cards.js');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required().pattern(regex)
  })
}), postCard);

router.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().min(10)
  })
}), getCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().min(10)
  })
}), putLike);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().min(10)
  })
}), deleteLike);

module.exports = router;
