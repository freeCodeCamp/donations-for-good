const api = require('express').Router();

const keys = require('../keys');
const handleStripe = require('../paymentHandlers/stripe');
const { amazonConfirm } = require('../paymentHandlers/amazon');

api.get('/stripe-key', (req, res) => {
  res.json({ key: keys.stripe.public });
});

api.get('/amazon-key', (req, res) => {
  res.json({
    keys: {
      merchant: keys.amazon.merchant,
      public: keys.amazon.public }
    });
});

api.post('/confirm-amazon', amazonConfirm);
api.post('/charge-stripe', handleStripe);

module.exports = api;
