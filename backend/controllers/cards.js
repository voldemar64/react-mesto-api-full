const Cards = require('../models/cards');

const ValidationError = require('../errors/ValidationError');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { id } = req.params;
  Cards.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным id не найдена.');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden('Невозможно удалить чужую карточку.');
      }
      Cards.findByIdAndRemove(id)
        .then(() => res.send({ card }))
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный _id карточки.'));
      }

      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;
  return Cards.create({ name, link, owner: ownerId })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные для карточки.'));
      }

      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { id } = req.params;
  Cards.findByIdAndUpdate(
    id,
    { $addToSet: { likes: ownerId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Передан несуществующий _id карточки.');
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный _id карточки.'));
      }

      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { id } = req.params;
  Cards.findByIdAndUpdate(
    id,
    { $pull: { likes: ownerId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Передан несуществующий _id карточки.');
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный _id карточки.'));
      }

      next(err);
    });
};
