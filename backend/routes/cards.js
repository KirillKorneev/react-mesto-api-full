const router = require('express').Router();

const {
  getCards, postCard, getCard, putLike, deleteLike,
} = require('../controllers/cards.js');

router.get('/cards', getCards);

router.post('/cards', postCard);

router.delete('/cards/:id', getCard);

router.put('/cards/:cardId/likes', putLike);

router.delete('/cards/:cardId/likes', deleteLike);

module.exports = router;
