const config = require('../lib/config');

const keys = {
  stripe: {
    secret: config.stripe && config.stripe.secret,
    public: config.stripe && config.stripe.public
  },
  amazon: {
    access: config.amazon && config.amazon.access,
    merchant: config.amazon && config.amazon.merchant,
    public: config.amazon && config.amazon.public,
    secret: config.amazon && config.amazon.secret,
    secretAccess: config.amazon && config.amazon.secretAccess
  }
};

if (!keys.stripe.secret || !keys.stripe.public) {
  throw new Error('Stripe keys required');
}

if (!keys.amazon.merchant || !keys.amazon.public || !keys.amazon.secret || !keys.amazon.access || !keys.amazon.secretAccess) {
  throw new Error('Amazon keys required');
}

module.exports = keys;
