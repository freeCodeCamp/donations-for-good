const Stripe = require('stripe');
const keys = require('../keys');

const stripe = Stripe(keys.stripe.secret);

const subscriptionPlans = [300, 1000, 3500, 5000, 25000].reduce(
  (accu, current) => ({
    ...accu,
    [current]: {
      amount: current,
      interval: 'month',
      name:
        'Monthly Donation to freeCodeCamp.org - ' +
        `Thank you ($${current / 100})`,
      currency: 'usd',
      id: `monthly-donation-${current}`
    }
  }),
  {}
);

function createStripePlan(plan) {
  stripe.plans.create(plan, function(err) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(`${plan.id} created`);
    return;
  });
}

stripe.plans.list({}, function(err, plans) {
  if (err) {
    throw err;
  }
  const requiredPlans = Object.keys(subscriptionPlans).map(
    key => subscriptionPlans[key].id
  );
  const availablePlans = plans.data.map(plan => plan.id);
  requiredPlans.forEach(planId => {
    if (!availablePlans.includes(planId)) {
      const key = planId.split('-').slice(-1)[0];
      createStripePlan(subscriptionPlans[key]);
    }
  });
});

module.exports = (req, res) => {
  const { amount } = req.body;
  if (!amount) {
    return res.status(400).send({ error: 'Amount Required' });
  }
  return stripe.customers
    .create({
      email: req.body.token.email,
      card: req.body.token.id
    })
    .then(customer =>
      stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            plan: `monthly-donation-${amount}`
          }
        ]
      })
    )
    .then(subscription => res.send(subscription))
    .catch(err => {
      console.error('Stripe Processing Error:', err);
      if (err.type === 'StripeCardError') {
        return res.status(402).send({ error: err.message });
      }
      return res.status(500).send({ error: 'Donation Failed' });
    });
};
