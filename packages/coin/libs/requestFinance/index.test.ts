import delay from '@fishprovider/utils/dist/helpers/delay';
import random from '@fishprovider/utils/dist/helpers/random';
import moment from 'moment';

import {
  cancelPayment,
  createPayment, getPayment, listPayments,
} from '.';

/*
listPayments
[
  {
    "id": "646b4b4819eb44de12d0298c",
    "paymentCurrency": "USDT-mainnet",
    "buyerInfo": {
      "email": "admin@fishprovider.com",
      "businessName": "FishProvider",
      "address": {
        "streetAddress": "",
        "extendedAddress": "",
        "country": "",
        "city": "",
        "region": "",
        "postalCode": "",
        "locality": "",
        "country-name": "",
        "extended-address": "",
        "postal-code": "",
        "street-address": ""
      },
      "userId": "646b455719eb44de12d02974"
    },
    "sellerInfo": {
      "email": "maidh91@gmail.com",
      "ccRecipients": [],
      "firstName": "Marco",
      "lastName": "Dinh",
      "userId": "646b44232d1dbc16e7cfd93b"
    },
    "paymentAddress": "0x21D63aee4623Cb6D242D9997b84EB95b5EEe5404",
    "invoiceItems": [
      {
        "currency": "USD",
        "name": "a",
        "quantity": 1,
        "tax": {
          "type": "percentage",
          "amount": "0"
        },
        "unitPrice": "1100"
      }
    ],
    "attachments": [],
    "categories": [],
    "paymentTerms": {
      "dueDate": "2023-06-21T13:59:59.999Z"
    },
    "recurringRule": "",
    "clientId": "646b454b2d1dbc16e7cfd93c",
    "note": "11",
    "draft": false,
    "invoiceNumber": "2",
    "creationDate": "2023-05-22T11:00:05.994Z",
    "meta": {
      "format": "rnf_invoice",
      "version": "0.0.3"
    },
    "createdBy": "646b44232d1dbc16e7cfd93b",
    "paymentOptions": [
      {
        "type": "wallet",
        "value": {
          "currencies": [
            "USDT-mainnet"
          ],
          "paymentInformation": {
            "paymentAddress": "0x21D63aee4623Cb6D242D9997b84EB95b5EEe5404",
            "chain": "mainnet"
          }
        }
      }
    ],
    "type": "live",
    "requestId": "014381a864f5ed66cfc8f91ff35ee6e4de1b4fd1b63dd187c49267476d897c54f7",
    "status": "open",
    "paymentMetadata": {},
    "events": [
      {
        "name": "create",
        "userId": "646b44232d1dbc16e7cfd93b",
        "date": "2023-05-22T11:00:45.000Z"
      }
    ],
    "miscellaneous": {
      "builderId": "request-team",
      "createdWith": "app.request.finance",
      "notifications": {
        "creation": true
      }
    },
    "role": "seller",
    "tags": []
  },
  {
    "id": "646b45562d1dbc16e7cfd93d",
    "paymentCurrency": "USDT-mainnet",
    "buyerInfo": {
      "email": "admin@fishprovider.com",
      "businessName": "FishProvider",
      "address": {
        "streetAddress": "",
        "extendedAddress": "",
        "country": "",
        "city": "",
        "region": "",
        "postalCode": "",
        "locality": "",
        "country-name": "",
        "extended-address": "",
        "postal-code": "",
        "street-address": ""
      },
      "userId": "646b455719eb44de12d02974"
    },
    "sellerInfo": {
      "email": "maidh91@gmail.com",
      "ccRecipients": [],
      "firstName": "Marco",
      "lastName": "Dinh",
      "userId": "646b44232d1dbc16e7cfd93b"
    },
    "paymentAddress": "0x21D63aee4623Cb6D242D9997b84EB95b5EEe5404",
    "invoiceItems": [
      {
        "currency": "USD",
        "name": "Test",
        "quantity": 1,
        "tax": {
          "type": "percentage",
          "amount": "0"
        },
        "unitPrice": "1000"
      }
    ],
    "attachments": [],
    "categories": [],
    "paymentTerms": {
      "dueDate": "2023-06-21T13:59:59.999Z"
    },
    "recurringRule": "",
    "clientId": "646b454b2d1dbc16e7cfd93c",
    "note": "test me",
    "draft": false,
    "invoiceNumber": "1",
    "creationDate": "2023-05-22T10:32:08.579Z",
    "meta": {
      "format": "rnf_invoice",
      "version": "0.0.3"
    },
    "createdBy": "646b44232d1dbc16e7cfd93b",
    "paymentOptions": [
      {
        "type": "wallet",
        "value": {
          "currencies": [
            "USDT-mainnet"
          ],
          "paymentInformation": {
            "paymentAddress": "0x21D63aee4623Cb6D242D9997b84EB95b5EEe5404",
            "chain": "mainnet"
          }
        }
      }
    ],
    "type": "live",
    "requestId": "01393b78a41b1d17101300bb927b1b413cc18836e37e68f80fd0c1591f94182b91",
    "status": "canceled",
    "paymentMetadata": {},
    "events": [
      {
        "name": "create",
        "userId": "646b44232d1dbc16e7cfd93b",
        "date": "2023-05-22T10:35:25.000Z"
      },
      {
        "name": "cancel",
        "userId": "646b44232d1dbc16e7cfd93b",
        "date": "2023-05-22T10:39:55.000Z"
      }
    ],
    "notes": [
      {
        "type": "cancel",
        "message": "a"
      }
    ],
    "miscellaneous": {
      "builderId": "request-team",
      "createdWith": "app.request.finance",
      "notifications": {
        "creation": true
      }
    },
    "role": "seller",
    "tags": []
  }
]
*/

/*
createPayment
{
  "id": "646b66e319eb44de12d029bb",
  "paymentCurrency": "USDT-mainnet",
  "buyerInfo": {
    "email": "admin@fishprovider.com",
    "userId": "646b455719eb44de12d02974"
  },
  "paymentAddress": "0x21d63aee4623cb6d242d9997b84eb95b5eee5404",
  "invoiceItems": [
    {
      "tax": {
        "type": "fixed",
        "amount": "0"
      },
      "currency": "USD",
      "quantity": 1,
      "unitPrice": "100",
      "name": "Deposit"
    }
  ],
  "paymentTerms": {
    "dueDate": "2023-05-22T13:58:10.227Z"
  },
  "invoiceNumber": "c751a4c244",
  "creationDate": "2023-05-22T12:58:10.227Z",
  "meta": {
    "format": "rnf_invoice",
    "version": "0.0.3"
  },
  "sellerInfo": {
    "email": "maidh91@gmail.com",
    "firstName": "Marco",
    "lastName": "Dinh",
    "userId": "646b44232d1dbc16e7cfd93b"
  },
  "createdBy": "646b44232d1dbc16e7cfd93b",
  "paymentOptions": [
    {
      "type": "wallet",
      "value": {
        "currencies": [
          "USDT-mainnet"
        ],
        "paymentInformation": {
          "paymentAddress": "0x21d63aee4623cb6d242d9997b84eb95b5eee5404",
          "chain": "mainnet"
        }
      }
    }
  ],
  "type": "live",
  "requestId": "01fed58bd340511bf940ddaae323e62f0d5d9e85fe7dc613b804047ef866736a26",
  "status": "open",
  "miscellaneous": {
    "notifications": {
      "creation": true
    }
  },
  "role": "seller",
  "tags": [],
  "invoiceLinks": {
    "pay": "https://app.request.finance/01fed58bd340511bf940ddaae323e62f0d5d9e85fe7dc613b804047ef866736a26?token=a900fb0b4cd3dc169b2be9cfb22b6bafb2ca37ad&enablePayment=true",
    "view": "https://app.request.finance/01fed58bd340511bf940ddaae323e62f0d5d9e85fe7dc613b804047ef866736a26?token=a900fb0b4cd3dc169b2be9cfb22b6bafb2ca37ad",
    "signUpAndPay": "https://app.request.finance/signup?invoice=01fed58bd340511bf940ddaae323e62f0d5d9e85fe7dc613b804047ef866736a26&token=a900fb0b4cd3dc169b2be9cfb22b6bafb2ca37ad&enablePayment=true"
  }
}
*/

/*
getPayment
{
  "id": "646b75b010842ee6bac1485f",
  "paymentCurrency": "ETH-goerli-goerli",
  "buyerInfo": {
    "email": "admin@fishprovider.com",
    "businessName": "",
    "address": {
      "streetAddress": "",
      "extendedAddress": "",
      "country": "",
      "city": "",
      "region": "",
      "postalCode": "",
      "locality": "",
      "country-name": "",
      "extended-address": "",
      "postal-code": "",
      "street-address": ""
    },
    "userId": "646b455719eb44de12d02974"
  },
  "sellerInfo": {
    "email": "maidh91@gmail.com",
    "ccRecipients": [],
    "firstName": "Marco",
    "lastName": "Dinh",
    "userId": "646b44232d1dbc16e7cfd93b"
  },
  "paymentAddress": "0x545Db60Ff56A5B582cF8AdF74E8d7411770a644d",
  "invoiceItems": [
    {
      "currency": "USD",
      "name": "",
      "quantity": 1,
      "tax": {
        "type": "percentage",
        "amount": "0"
      },
      "unitPrice": "1"
    }
  ],
  "attachments": [],
  "categories": [],
  "paymentTerms": {
    "dueDate": "2023-06-22T13:59:59.999Z"
  },
  "recurringRule": "",
  "clientId": "646b454b2d1dbc16e7cfd93c",
  "note": "",
  "draft": false,
  "invoiceNumber": "3",
  "creationDate": "2023-05-22T14:00:57.839Z",
  "meta": {
    "format": "rnf_invoice",
    "version": "0.0.3"
  },
  "createdBy": "646b44232d1dbc16e7cfd93b",
  "paymentOptions": [
    {
      "type": "wallet",
      "value": {
        "currencies": [
          "ETH-goerli-goerli"
        ],
        "paymentInformation": {
          "paymentAddress": "0x545Db60Ff56A5B582cF8AdF74E8d7411770a644d",
          "chain": "goerli"
        }
      }
    }
  ],
  "type": "test",
  "requestId": "01aac27a8d435c4fa1dbf21799db3408a0c5545519b12b814a434ea5eec6a5ed42",
  "status": "paid",
  "paymentMetadata": {
    "paymentFrom": "0x989BFDc886F1224d1bbFEE44B75BEe210b7EA60D",
    "paymentDate": "2023-05-22T14:39:36.000Z",
    "gasFeeUsd": "9.80",
    "paidAmount": "0.01",
    "paidAmountCrypto": "0.002",
    "paidAmountUsd": "0.01",
    "gasFee": "0.00539",
    "gasFeeCurrency": "ETH-goerli",
    "requestFee": "0.00000",
    "requestFeeCurrency": "ETH-goerli",
    "requestFeeUsd": "0.00",
    "txHash": "0x2e89fb4f5d8ffa5ab3e4a6dea680b1a984d9edf7a994d9a1dd2864252e9dda48",
    "chainName": "goerli",
    "paymentCurrency": "ETH-goerli",
    "isManuallyPaid": false
  },
  "events": [
    {
      "name": "create",
      "timestamp": 1684764120,
      "actorId": "646b44232d1dbc16e7cfd93b",
      "actorDisplayName": "Marco Dinh"
    }
  ],
  "trackedTransactions": [],
  "miscellaneous": {
    "builderId": "request-team",
    "createdWith": "baguette-app.request.finance",
    "notifications": {
      "creation": true
    }
  },
  "role": "buyer",
  "tags": []
}
*/

const walletAddresses: Record<string, string> = {
  'USDT-mainnet': '0x21d63aee4623cb6d242d9997b84eb95b5eee5404',
  'USDC-mainnet': '0x21d63aee4623cb6d242d9997b84eb95b5eee5404',
  'USDCRealT-goerli': '0x21d63aee4623cb6d242d9997b84eb95b5eee5404',
  'ETH-goerli-goerli': '0x21d63aee4623cb6d242d9997b84eb95b5eee5404',
  'USDT-tron': 'TPcPvD4cC17nUp65QFAgrEPgUddLguerk1',
  'USDC-tron': 'TPcPvD4cC17nUp65QFAgrEPgUddLguerk1',
  'BTC-mainnet': '1532ynUfaKWAc66GPcuQnoBJAefyfRTpGq',
};

describe('requestFinance', () => {
  test('list', async () => {
    const res = await listPayments();
    expect(res).toBeDefined();

    console.log(JSON.stringify(res, null, 2));
  });

  test('create', async () => {
    const paymentCurrency = 'BTC-mainnet';
    const paymentNew = await createPayment({
      buyerInfo: {
        email: 'admin2@fishprovider.com',
      },
      invoiceItems: [
        {
          currency: 'USD',
          name: 'Deposit',
          quantity: 1,
          unitPrice: 1000 * 100,
        },
      ],
      invoiceNumber: random(),
      paymentCurrency,
      declarativePaymentInformation: {
        paymentAddress: walletAddresses[paymentCurrency] || '',
      },
      creationDate: new Date(),
      paymentTerms: {
        dueDate: moment().add(1, 'hour').toDate(),
      },
      miscellaneous: {
        createdWith: 'fishprovider',
        logoUrl: 'https://www.fishprovider.com/logo.png',
      },
    }).catch((err) => {
      console.error(err.response.data);
      throw err;
    });
    console.log(JSON.stringify(paymentNew, null, 2));

    const paymentGet = await getPayment(paymentNew.id).catch((err) => {
      console.error(err.response.data);
      throw err;
    });
    expect(paymentGet.status).toBe('open');
    console.log(JSON.stringify(paymentGet, null, 2));

    await delay(30 * 1000);

    const paymentCancelled = await cancelPayment(paymentGet.id).catch((err) => {
      console.error(err.response.data);
      throw err;
    });
    console.log(JSON.stringify(paymentCancelled, null, 2));
  });

  test('cancel', async () => {
    const id = '64759a573480fd2334873af7';
    const paymentCancelled = await cancelPayment(id).catch((err) => {
      console.error(err);
      console.error(err.response.data);
      throw err;
    });

    console.log(JSON.stringify(paymentCancelled, null, 2));
  });

  test('get-paid', async () => {
    const id = '646b75b010842ee6bac1485f';
    const paymentGet = await getPayment(id);
    expect(paymentGet.status).toBe('paid');

    console.log(JSON.stringify(paymentGet, null, 2));
  });

  test('get-cancelled', async () => {
    const id = '647599bbc32fc930a8a4bdf4';
    const paymentGet = await getPayment(id);
    expect(paymentGet.status).toBe('canceled');

    console.log(JSON.stringify(paymentGet, null, 2));
  });

  test('get-open', async () => {
    const id = '64759a3c5a9b9665d0bd8142';
    const paymentGet = await getPayment(id);
    expect(paymentGet.status).toBe('open');

    console.log(JSON.stringify(paymentGet, null, 2));
  });
});
