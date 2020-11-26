class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class InvalidError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class WrongAuth extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = {
  NotFoundError,
  InvalidError,
  WrongAuth,
};
