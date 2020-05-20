const express = require('express');
const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const camelcaseKeys = require('camelcase-keys');
const timers = require('timers');
const camelcase = require('camelcase');

const mocks = require('./mocks');

const app = express();
const options = {
  key: fs.readFileSync('../certs/tabby.local-key.pem'),
  cert: fs.readFileSync('../certs/tabby.local.pem'),
};

app.use(cookieParser());
app.use(bodyParser.json());

app.use(function(req, res, next) {
  const { origin, referer } = req.headers;

  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', origin || referer);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  return next();
});

app.post('/:version/checkout', function(req, res) {
  res.cookie('scenario', 'start');

  res.json(mocks.createCheckoutMock);
});

const delay = time => (req, res, next) => timers.setTimeout(next, time);

app.get('/:version/checkout/:id', function(req, res) {
  res.json(mocks.createCheckoutMock);
});

app.put('/:version/checkout/:id', delay(500), function(req, res) {
  const body = camelcaseKeys(req.body, { deep: true });
  const productType = camelcase(body.productType);

  if (productType === 'installments') {
    res.cookie('scenario', 'installmentPlan');

    if (req.cookies.scenario === 'start') {
      return res.status(400).json({
        errors: [{ name: 'confirmation_code', type: 'required' }],
      });
    }

    if (req.cookies.scenario === 'installmentPlan') {
      res.cookie('scenario', 'scan');
      return res.status(400).json({
        errors: [{ name: 'installment_plan', type: 'required' }],
      });
    }

    if (req.cookies.scenario === 'scan') {
      res.cookie('scenario', 'downpayment');
      return res.status(400).json({
        errors: [{ name: 'scan', type: 'required' }],
      });
    }

    if (req.cookies.scenario === 'downpayment') {
      res.cookie('scenario', null);
      return res.status(400).json({
        errors: [{ name: 'downpayment', type: 'required' }],
      });
    }
  } else if (productType === 'payLater') {
    if (req.cookies.scenario === 'start') {
      res.cookie('scenario', 'confirmationCode');

      return res.status(400).json({
        errors: [{ name: 'scan', type: 'required' }],
      });
    }

    if (req.cookies.scenario === 'confirmationCode') {
      res.cookie('scenario', null);

      return res.status(400).json({
        errors: [{ name: 'confirmation_code', type: 'required' }],
      });
    }
  }

  res.json(mocks.updateCheckoutMock);
});

app.get('/:version/downpayment/redirect', delay(500), function(req, res) {
  const params = camelcaseKeys(req.query, { deep: true });

  res.redirect(params.redirectUrl);
});

app.get('/:version/checkout/:id/downpayment', delay(500), function(req, res) {
  const params = camelcaseKeys(req.query, { deep: true });

  res.json({
    paymentUrl: `https://tabby.local:8011/downpayment/redirect?redirect_url=${params.redirectUrl}&cancel_url=${params.cancelUrl}`,
  });
});

app.post('/:version/checkout/:id/authorize', function(req, res) {
  res.json({});
});

app.post('/:version/checkout/:id/send_code', function(req, res) {
  res.json({});
});

app.post('/:version/auth/login', function(req, res) {
  res.json({ auth_token: 'token' });
});

app.post('/:version/auth/send_code', function(req, res) {
  res.json({});
});

app.post('/:version/checkout/identity/scan', function(req, res) {
  res.json({
    scanId: '100',
    name: 'Vadim Zhulanov',
    national_id: '1-123-1234-12345',
  });
});

app.get('/:version/customer/summary', function(req, res) {
  res.json({
    limit_is_blocked: true,
    show_maximal_limit: true,
    wallet_balance: 1000,
    credit_limit: {
      available: 100,
      total: 1000,
    },
    debt: {
      total: 100,
      overdue: 10,
    },
    currency: 'AED',
  });
});

app.get('/:version/customer/purchases', function(req, res) {
  const query = camelcaseKeys(req.query, { deep: true });
  const result = JSON.parse(JSON.stringify(mocks.customerPurchasesMock));

  result.purchases.forEach(purchase => {
    if (['not_due_yet', 'to_pay'].includes(query.status)) {
      purchase.loan.refunded_amount = null;
    }

    purchase.status = query.status;
  });

  res.json(result);
});

app.get('/:version/customer/purchases/:id', function(req, res) {
  const query = camelcaseKeys(req.query, { deep: true });
  const installmentsCountToPay = Number(query.installmentsCountToPay);
  const result = JSON.parse(JSON.stringify(mocks.getPurchaseMock));
  let alreadyChecked = 0;

  for (let i = 0; i < result.loan.installments.length; i++) {
    result.loan.installments[i].checked = false;

    if (result.loan.installments[i].is_paid) {
      alreadyChecked++;
    }
  }

  if (installmentsCountToPay) {
    for (let i = 0; i < installmentsCountToPay; i++) {
      result.loan.installments[i + alreadyChecked].checked = true;
    }
  }

  result.id = req.params.id;
  result.loan.amountToPay = 300;
  result.status = 'to_pay';

  res.json(result);
});

app.get('/:version/customer', function(req, res) {
  res.json({
    name: 'Vadim Zhulanov',
    phone: '+7 926 497 82 93',
    national_id: '1-123-12345-654321',
    email: 'maiordom@yandex.ru',
    photo_url: null,
  });
});

app.post('/:version/customer/repayment', function(req, res) {
  res.json(mocks.customerRepaymentMock);
});

https.createServer(options, app).listen(8011);
