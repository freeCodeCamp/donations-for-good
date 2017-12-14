const axios = require('axios');
const keys = require('../keys');

const {
  access,
  merchant,
  secretAccess
} = keys.amazon;
exports.amazonConfirm = (req, res) => {
  const { amazonBillingAgreementId } = req.body;
  if (!amazonBillingAgreementId) {
    res.sendStatus(400).end({error: 'Something went wrong when confirming details with Amazon, please try again'})
  }
  res.send('OK');
  // amazonBillingAgreementId
  axios(
    {
      url: 'https://mws.amazonservices.com/OffAmazonPayments_Sandbox/2013-01-01',
      method: 'post',
      headers: {'Content-Type': 'x-www-form-urlencoded'},
      params: {
        AWSAccessKeyId: access,
        AmazonBillingAgreementId: amazonBillingAgreementId,
        Action: 'ConfirmBillingAgreement',
        MWSAuthToken: 'amzn.mws.4ea38b7b-f563-7709-4bae-87aeaEXAMPLE',
        SellerId: merchant,
        SignatureMethod: 'HmacSHA256',
        SignatureVersion: 2,
        Timestamp: new Date(Date.now()).toISOString(),
        Version: '2013-01-01',
        Signature: secretAccess
      }
    })
    .then(resp => {
      console.info(resp)
    })
    .catch(err => {
      console.log(err)
    })
};
