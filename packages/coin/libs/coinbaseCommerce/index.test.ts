import { ChargePricingType } from '~constants/coinbaseCommerce';

import {
  cancelPayment, createPayment, getPayment, listPayments,
} from '.';

/*
// createPayment
{
  data: {
    "addresses": {
      "polygon": "0x7e6cc6e312d68f4b66963fcc65c56e3d7b9730f9",
      "pusdc": "0x7e6cc6e312d68f4b66963fcc65c56e3d7b9730f9",
      "pweth": "0x7e6cc6e312d68f4b66963fcc65c56e3d7b9730f9",
      "ethereum": "0x7e6cc6e312d68f4b66963fcc65c56e3d7b9730f9",
      "usdc": "0x7e6cc6e312d68f4b66963fcc65c56e3d7b9730f9",
      "dai": "0x7e6cc6e312d68f4b66963fcc65c56e3d7b9730f9",
      "apecoin": "0x7e6cc6e312d68f4b66963fcc65c56e3d7b9730f9",
      "shibainu": "0x7e6cc6e312d68f4b66963fcc65c56e3d7b9730f9",
      "tether": "0x7e6cc6e312d68f4b66963fcc65c56e3d7b9730f9",
      "bitcoincash": "qry6ffwgupjtu2ffd9k6xkrej7lrkwpa5y0d3nd9cd",
      "dogecoin": "DKNmqbZq4CrQPdjwAWdzcw57bXmNnBct68",
      "litecoin": "MN87AwUHY1DWR4XFRptjUfnrmoNmuhkUfL",
      "bitcoin": "3BduPnLN7Wbtu9jRifJE7BFuZq4M6kbgW3"
    },
    "brand_color": "#5A97C4",
    "brand_logo_url": "https://res.cloudinary.com/commerce/image/upload/v1683114912/ifl2sinmtigbmpuhq7u2.png",
    "code": "JEH2Y4MC",
    "coinbase_managed_merchant": false,
    "created_at": "2023-05-05T11:41:24Z",
    "description": "Test payment description",
    "exchange_rates": {
      "ETH-USD": "1904.865",
      "BTC-USD": "29123.93",
      "LTC-USD": "88.025",
      "DOGE-USD": "0.07857",
      "BCH-USD": "118.375",
      "USDC-USD": "1.0",
      "DAI-USD": "1.00005",
      "APE-USD": "3.797",
      "SHIB-USD": "0.000009905",
      "USDT-USD": "1.000435",
      "PMATIC-USD": "0.98975",
      "PUSDC-USD": "1.0",
      "PWETH-USD": "1904.13"
    },
    "expires_at": "2023-05-05T12:41:24Z",
    "fee_rate": 0.01,
    "fees_settled": true,
    "hosted_url": "https://commerce.coinbase.com/charges/JEH2Y4MC",
    "id": "d2a096a7-ee0a-4f86-8960-6e72c8c999cf",
    "local_exchange_rates": {
      "ETH-USD": "1904.865",
      "BTC-USD": "29123.93",
      "LTC-USD": "88.025",
      "DOGE-USD": "0.07857",
      "BCH-USD": "118.375",
      "USDC-USD": "1.0",
      "DAI-USD": "1.00005",
      "APE-USD": "3.797",
      "SHIB-USD": "0.000009905",
      "USDT-USD": "1.000435",
      "PMATIC-USD": "0.98975",
      "PUSDC-USD": "1.0",
      "PWETH-USD": "1904.13"
    },
    "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1683114912/ifl2sinmtigbmpuhq7u2.png",
    "metadata": {
      "customer_id": "id_1005",
      "customer_name": "Satoshi Nakamoto"
    },
    "name": "Test payment name",
    "offchain_eligible": false,
    "organization_name": "FishProvider",
    "payment_threshold": {
      "overpayment_relative_threshold": "0.99",
      "underpayment_relative_threshold": "0.99"
    },
    "payments": [],
    "pricing": {
      "local": {
        "amount": "100.00",
        "currency": "USD"
      },
      "polygon": {
        "amount": "101.035615000",
        "currency": "PMATIC"
      },
      "pusdc": {
        "amount": "100.000000",
        "currency": "PUSDC"
      },
      "pweth": {
        "amount": "0.052517422654965785",
        "currency": "PWETH"
      },
      "ethereum": {
        "amount": "0.052497000",
        "currency": "ETH"
      },
      "usdc": {
        "amount": "100.000000",
        "currency": "USDC"
      },
      "dai": {
        "amount": "99.995000249987500625",
        "currency": "DAI"
      },
      "apecoin": {
        "amount": "26.336581511719778773",
        "currency": "APE"
      },
      "shibainu": {
        "amount": "10095911.155981800000000000",
        "currency": "SHIB"
      },
      "tether": {
        "amount": "99.956519",
        "currency": "USDT"
      },
      "bitcoincash": {
        "amount": "0.84477297",
        "currency": "BCH"
      },
      "dogecoin": {
        "amount": "1272.75041360",
        "currency": "DOGE"
      },
      "litecoin": {
        "amount": "1.13604090",
        "currency": "LTC"
      },
      "bitcoin": {
        "amount": "0.00343360",
        "currency": "BTC"
      }
    },
    "pricing_type": "fixed_price",
    "pwcb_only": false,
    "resource": "charge",
    "support_email": "admin@fishprovider.com",
    "timeline": [
      {
        "status": "NEW",
        "time": "2023-05-05T11:41:24Z"
      }
    ],
    "utxo": false
  }
}

// listPayments
{
  pagination: {
    order: 'desc',
    starting_after: null,
    ending_before: null,
    total: 2,
    limit: 25,
    yielded: 2,
    cursor_range: [
      '23fc7bf2-a236-4cb6-ad27-d758546bf706',
      '9d6f8c41-69d2-4429-9779-0f19eddb9da0'
    ],
    previous_uri: 'https://api.commerce.coinbase.com/charges?ending_before=23fc7bf2-a236-4cb6-ad27-d758546bf706',
    next_uri: 'https://api.commerce.coinbase.com/charges?starting_after=9d6f8c41-69d2-4429-9779-0f19eddb9da0'
  },
  data: [
    {
      "addresses": {
        "polygon": "0x761854da25fc3281b3b3eb6d222a20005422ee03",
        "pusdc": "0x761854da25fc3281b3b3eb6d222a20005422ee03",
        "pweth": "0x761854da25fc3281b3b3eb6d222a20005422ee03",
        "ethereum": "0x761854da25fc3281b3b3eb6d222a20005422ee03",
        "usdc": "0x761854da25fc3281b3b3eb6d222a20005422ee03",
        "dai": "0x761854da25fc3281b3b3eb6d222a20005422ee03",
        "apecoin": "0x761854da25fc3281b3b3eb6d222a20005422ee03",
        "shibainu": "0x761854da25fc3281b3b3eb6d222a20005422ee03",
        "tether": "0x761854da25fc3281b3b3eb6d222a20005422ee03",
        "bitcoincash": "qr6cvmzq0mrv83eprkldvk0f7zwmsvn2cytkyhl9zw",
        "dogecoin": "DEWS6o8h1Ri7HoNEhkWepvri26pisxLSfC",
        "litecoin": "MTiujzwSoswXUFQtYm2Z2sygrRnpcwDJLQ",
        "bitcoin": "3NTidGyQ7onz3KvbeANntKYZAAUPr9uD3n"
      },
      "brand_color": "#5A97C4",
      "brand_logo_url": "https://res.cloudinary.com/commerce/image/upload/v1683114912/ifl2sinmtigbmpuhq7u2.png",
      "cancel_url": "https://www.fishprovider.com",
      "checkout": {
        "id": "9eeb1718-a966-4327-8ab8-92cdcbbe2c0d"
      },
      "code": "C35VK3MT",
      "coinbase_managed_merchant": false,
      "created_at": "2023-05-03T23:31:34Z",
      "description": "Think Big Do Small",
      "exchange_rates": {
        "APE-USD": "3.859",
        "BCH-USD": "120.27",
        "BTC-USD": "29067.935",
        "DAI-USD": "0.99995",
        "ETH-USD": "1906.605",
        "LTC-USD": "88.98",
        "DOGE-USD": "0.07982",
        "SHIB-USD": "0.000010125",
        "USDC-USD": "1.0",
        "USDT-USD": "1.000175",
        "PUSDC-USD": "1.0",
        "PWETH-USD": "1906.635",
        "PMATIC-USD": "1.009"
      },
      "expires_at": "2023-05-04T00:31:34Z",
      "fee_rate": 0.01,
      "fees_settled": true,
      "hosted_url": "https://commerce.coinbase.com/charges/C35VK3MT",
      "id": "8f54a218-0736-40c4-af7e-1b738ec3b23e",
      "local_exchange_rates": {
        "APE-USD": "3.859",
        "BCH-USD": "120.27",
        "BTC-USD": "29067.935",
        "DAI-USD": "0.99995",
        "ETH-USD": "1906.605",
        "LTC-USD": "88.98",
        "DOGE-USD": "0.07982",
        "SHIB-USD": "0.000010125",
        "USDC-USD": "1.0",
        "USDT-USD": "1.000175",
        "PUSDC-USD": "1.0",
        "PWETH-USD": "1906.635",
        "PMATIC-USD": "1.009"
      },
      "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1683008706/qvaw2eqxw8rvlirs6egk.png",
      "metadata": {},
      "name": "Donate FishProvider",
      "offchain_eligible": false,
      "organization_name": "FishProvider",
      "payments": [],
      "pricing_type": "no_price",
      "pwcb_only": false,
      "resource": "charge",
      "support_email": "admin@fishprovider.com",
      "timeline": [
        {
          "status": "NEW",
          "time": "2023-05-03T23:31:34Z"
        },
        {
          "status": "CANCELED",
          "time": "2023-05-03T23:32:50Z"
        }
      ],
      "utxo": false
    },
    {
      "addresses": {
        "polygon": "0xab8bdd120f0c322749e1ebe6930c98a7a966b36c",
        "pusdc": "0xab8bdd120f0c322749e1ebe6930c98a7a966b36c",
        "pweth": "0xab8bdd120f0c322749e1ebe6930c98a7a966b36c",
        "ethereum": "0xab8bdd120f0c322749e1ebe6930c98a7a966b36c",
        "usdc": "0xab8bdd120f0c322749e1ebe6930c98a7a966b36c",
        "dai": "0xab8bdd120f0c322749e1ebe6930c98a7a966b36c",
        "apecoin": "0xab8bdd120f0c322749e1ebe6930c98a7a966b36c",
        "shibainu": "0xab8bdd120f0c322749e1ebe6930c98a7a966b36c",
        "tether": "0xab8bdd120f0c322749e1ebe6930c98a7a966b36c",
        "bitcoincash": "qr40l9pjtclawfdhxl2fl9gll4ylhl4gavs828l8dp",
        "dogecoin": "D8v61MC3yMjV7Wfis6zdfF4LPoiakP2ArA",
        "litecoin": "MEi68HzDTTuDEUGcMCiz67ndQ6MewLW4hU",
        "bitcoin": "3QJCE433NoorFLRDKDd1NtcmJrvyE5chaY"
      },
      "brand_color": "#5A97C4",
      "brand_logo_url": "https://res.cloudinary.com/commerce/image/upload/v1683114912/ifl2sinmtigbmpuhq7u2.png",
      "cancel_url": "https://www.fishprovider.com",
      "checkout": {
        "id": "9eeb1718-a966-4327-8ab8-92cdcbbe2c0d"
      },
      "code": "AR87C7HV",
      "coinbase_managed_merchant": false,
      "confirmed_at": "2023-05-03T11:53:55Z",
      "created_at": "2023-05-03T11:37:13Z",
      "description": "Think Big Do Small",
      "exchange_rates": {
        "APE-USD": "3.8255",
        "BCH-USD": "118.265",
        "BTC-USD": "28600.645",
        "DAI-USD": "0.99985",
        "ETH-USD": "1866.225",
        "LTC-USD": "87.935",
        "DOGE-USD": "0.078245",
        "SHIB-USD": "0.000009975",
        "USDC-USD": "1.0",
        "USDT-USD": "1.000185",
        "PUSDC-USD": "1.0",
        "PWETH-USD": "1866.225",
        "PMATIC-USD": "0.9884"
      },
      "expires_at": "2023-05-03T12:37:13Z",
      "fee_rate": 0.01,
      "fees_settled": true,
      "hosted_url": "https://commerce.coinbase.com/charges/AR87C7HV",
      "id": "7288ae8a-5b15-46f6-a36e-20f7086afde6",
      "local_exchange_rates": {
        "APE-USD": "3.8255",
        "BCH-USD": "118.265",
        "BTC-USD": "28600.645",
        "DAI-USD": "0.99985",
        "ETH-USD": "1866.225",
        "LTC-USD": "87.935",
        "DOGE-USD": "0.078245",
        "SHIB-USD": "0.000009975",
        "USDC-USD": "1.0",
        "USDT-USD": "1.000185",
        "PUSDC-USD": "1.0",
        "PWETH-USD": "1866.225",
        "PMATIC-USD": "0.9884"
      },
      "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1683008706/qvaw2eqxw8rvlirs6egk.png",
      "metadata": {
        "custom": "yOXBkIIcXmM4yyGaDxfgxqTKHcv1"
      },
      "name": "Donate FishProvider",
      "offchain_eligible": false,
      "organization_name": "FishProvider",
      "payments": [
        {
          "payment_id": "8b058f50-bdb3-406c-9812-ac9008661539",
          "network": "polygon",
          "transaction_id": "0x9d9410c8d6a42a7b10e3ccbf9201ccfc0dfde984ece48fa547084dce546838e2",
          "status": "CONFIRMED",
          "detected_at": "2023-05-03T11:48:55Z",
          "value": {
            "local": {
              "amount": "5.00",
              "currency": "USD"
            },
            "crypto": {
              "amount": "5.000000",
              "currency": "PUSDC"
            }
          },
          "block": {
            "height": 42254315,
            "hash": "0x2aaa6bf5cfe5decba730dd12779f17cf1aa40b12ffeede5643d42653d014342d",
            "confirmations": 78825,
            "confirmations_required": 128
          },
          "deposited": {
            "autoconversion_enabled": false,
            "autoconversion_status": "PENDING",
            "status": "COMPLETED",
            "destination": "marco.dinh91@gmail.com",
            "exchange_rate": null,
            "amount": {
              "gross": {
                "local": null,
                "crypto": {
                  "amount": "5.000000",
                  "currency": "PUSDC"
                }
              },
              "net": {
                "local": null,
                "crypto": {
                  "amount": "4.950000",
                  "currency": "PUSDC"
                }
              },
              "coinbase_fee": {
                "local": null,
                "crypto": {
                  "amount": "0.050000",
                  "currency": "PUSDC"
                }
              }
            }
          },
          "coinbase_processing_fee": {
            "local": {
              "amount": "0.05",
              "currency": "USD"
            },
            "crypto": {
              "amount": "0.050000",
              "currency": "PUSDC"
            }
          },
          "net": {
            "local": {
              "amount": "4.95",
              "currency": "USD"
            },
            "crypto": {
              "amount": "4.950000",
              "currency": "PUSDC"
            }
          }
        }
      ],
      "pricing_type": "no_price",
      "pwcb_only": false,
      "resource": "charge",
      "support_email": "admin@fishprovider.com",
      "timeline": [
        {
          "status": "NEW",
          "time": "2023-05-03T11:37:13Z"
        },
        {
          "status": "PENDING",
          "time": "2023-05-03T11:48:55Z",
          "payment": {
            "network": "pusdc",
            "transaction_id": "0x9d9410c8d6a42a7b10e3ccbf9201ccfc0dfde984ece48fa547084dce546838e2",
            "value": {
              "amount": "5.000000",
              "currency": "PUSDC"
            }
          }
        },
        {
          "status": "COMPLETED",
          "time": "2023-05-03T11:53:55Z",
          "payment": {
            "network": "pusdc",
            "transaction_id": "0x9d9410c8d6a42a7b10e3ccbf9201ccfc0dfde984ece48fa547084dce546838e2",
            "value": {
              "amount": "5.000000",
              "currency": "PUSDC"
            }
          }
        }
      ],
      "utxo": false
    },
    {
      "addresses": {
        "polygon": "0x18aff55da11ef1438bc5b8bd708703278ba1069a",
        "pusdc": "0x18aff55da11ef1438bc5b8bd708703278ba1069a",
        "pweth": "0x18aff55da11ef1438bc5b8bd708703278ba1069a",
        "ethereum": "0x18aff55da11ef1438bc5b8bd708703278ba1069a",
        "usdc": "0x18aff55da11ef1438bc5b8bd708703278ba1069a",
        "dai": "0x18aff55da11ef1438bc5b8bd708703278ba1069a",
        "apecoin": "0x18aff55da11ef1438bc5b8bd708703278ba1069a",
        "shibainu": "0x18aff55da11ef1438bc5b8bd708703278ba1069a",
        "tether": "0x18aff55da11ef1438bc5b8bd708703278ba1069a",
        "bitcoincash": "qpezwdxf4awlcpm5mad4pfdathajkvymwqvyksqdae",
        "dogecoin": "DGLxHji9Q4a5skD8iZw3Q74g88iZVQThsw",
        "litecoin": "MDVLce7gsBmTGdS5Ufxo64QiN6Du8TRd2g",
        "bitcoin": "3KfSaTkS1eLRMUEY3tJgcqLWoHp1tVLrdg"
      },
      "brand_color": "#5A97C4",
      "brand_logo_url": "https://res.cloudinary.com/commerce/image/upload/v1683114912/ifl2sinmtigbmpuhq7u2.png",
      "cancel_url": "https://www.fishprovider.com",
      "checkout": {
        "id": "9eeb1718-a966-4327-8ab8-92cdcbbe2c0d"
      },
      "code": "PLWM467K",
      "coinbase_managed_merchant": false,
      "created_at": "2023-05-02T06:32:11Z",
      "description": "Think Big Do Small",
      "exchange_rates": {
        "APE-USD": "3.827",
        "BCH-USD": "117.16",
        "BTC-USD": "27982.85",
        "DAI-USD": "0.99985",
        "ETH-USD": "1826.905",
        "LTC-USD": "87.025",
        "DOGE-USD": "0.078425",
        "SHIB-USD": "0.000009885",
        "USDC-USD": "1.0",
        "USDT-USD": "1.000165",
        "PUSDC-USD": "1.0",
        "PWETH-USD": "1827.125",
        "PMATIC-USD": "0.9568"
      },
      "expires_at": "2023-05-02T07:32:11Z",
      "fee_rate": 0.01,
      "fees_settled": true,
      "hosted_url": "https://commerce.coinbase.com/charges/PLWM467K",
      "id": "35fd36c0-bdcc-4b1f-bed5-a7ba42c507cb",
      "local_exchange_rates": {
        "APE-USD": "3.827",
        "BCH-USD": "117.16",
        "BTC-USD": "27982.85",
        "DAI-USD": "0.99985",
        "ETH-USD": "1826.905",
        "LTC-USD": "87.025",
        "DOGE-USD": "0.078425",
        "SHIB-USD": "0.000009885",
        "USDC-USD": "1.0",
        "USDT-USD": "1.000165",
        "PUSDC-USD": "1.0",
        "PWETH-USD": "1827.125",
        "PMATIC-USD": "0.9568"
      },
      "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1683008706/qvaw2eqxw8rvlirs6egk.png",
      "metadata": {},
      "name": "Donate FishProvider",
      "offchain_eligible": false,
      "organization_name": "FishProvider",
      "payments": [],
      "pricing_type": "no_price",
      "pwcb_only": false,
      "resource": "charge",
      "support_email": "admin@fishprovider.com",
      "timeline": [
        {
          "status": "NEW",
          "time": "2023-05-02T06:32:11Z"
        },
        {
          "status": "EXPIRED",
          "time": "2023-05-02T07:32:18Z"
        }
      ],
      "utxo": false
    },
    {
      "addresses": {
        "polygon": "0xa4e8f7cc1b3abfef67fd7fce5804dfc702206a9f",
        "pusdc": "0xa4e8f7cc1b3abfef67fd7fce5804dfc702206a9f",
        "pweth": "0xa4e8f7cc1b3abfef67fd7fce5804dfc702206a9f",
        "ethereum": "0xa4e8f7cc1b3abfef67fd7fce5804dfc702206a9f",
        "usdc": "0xa4e8f7cc1b3abfef67fd7fce5804dfc702206a9f",
        "dai": "0xa4e8f7cc1b3abfef67fd7fce5804dfc702206a9f",
        "apecoin": "0xa4e8f7cc1b3abfef67fd7fce5804dfc702206a9f",
        "shibainu": "0xa4e8f7cc1b3abfef67fd7fce5804dfc702206a9f",
        "tether": "0xa4e8f7cc1b3abfef67fd7fce5804dfc702206a9f",
        "bitcoincash": "qrav555m5xylfef82958nvyyc3lthv94nyagn8m5e6",
        "dogecoin": "DPzCx8pb37rNAQJeBPzb9KNhUPimrvaxkK",
        "litecoin": "MRRFnmJavCaMZXcLH4Y4TBCDxgs5C5EUvK",
        "bitcoin": "3DYn4AJ6dfXW12M3yj9FGVnsDM3zpgmNma"
      },
      "brand_color": "#5A97C4",
      "brand_logo_url": "https://res.cloudinary.com/commerce/image/upload/v1683114912/ifl2sinmtigbmpuhq7u2.png",
      "checkout": {
        "id": "9eeb1718-a966-4327-8ab8-92cdcbbe2c0d"
      },
      "code": "Q9RNE6KX",
      "coinbase_managed_merchant": false,
      "created_at": "2023-05-02T06:25:24Z",
      "description": "Think Big Do Small",
      "exchange_rates": {
        "APE-USD": "3.831",
        "BCH-USD": "117.19",
        "BTC-USD": "27972.97",
        "DAI-USD": "0.99985",
        "ETH-USD": "1826.325",
        "LTC-USD": "87.02",
        "DOGE-USD": "0.078415",
        "SHIB-USD": "0.000009885",
        "USDC-USD": "1.0",
        "USDT-USD": "1.000165",
        "PUSDC-USD": "1.0",
        "PWETH-USD": "1826.975",
        "PMATIC-USD": "0.95725"
      },
      "expires_at": "2023-05-02T07:25:24Z",
      "fee_rate": 0.01,
      "fees_settled": true,
      "hosted_url": "https://commerce.coinbase.com/charges/Q9RNE6KX",
      "id": "344fb115-1579-420c-b0ab-d38a4ac0a0f5",
      "local_exchange_rates": {
        "APE-USD": "3.831",
        "BCH-USD": "117.19",
        "BTC-USD": "27972.97",
        "DAI-USD": "0.99985",
        "ETH-USD": "1826.325",
        "LTC-USD": "87.02",
        "DOGE-USD": "0.078415",
        "SHIB-USD": "0.000009885",
        "USDC-USD": "1.0",
        "USDT-USD": "1.000165",
        "PUSDC-USD": "1.0",
        "PWETH-USD": "1826.975",
        "PMATIC-USD": "0.95725"
      },
      "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1683008706/qvaw2eqxw8rvlirs6egk.png",
      "metadata": {},
      "name": "Donate FishProvider",
      "offchain_eligible": false,
      "organization_name": "FishProvider",
      "payments": [],
      "pricing_type": "no_price",
      "pwcb_only": false,
      "resource": "charge",
      "support_email": "admin@fishprovider.com",
      "timeline": [
        {
          "status": "NEW",
          "time": "2023-05-02T06:25:24Z"
        },
        {
          "status": "EXPIRED",
          "time": "2023-05-02T07:25:30Z"
        }
      ],
      "utxo": false
    }
  ]
}
*/

describe('coinbaseCommerce', () => {
  test('list', async () => {
    const res = await listPayments();
    expect(res).toBeDefined();

    console.log(JSON.stringify(res, null, 2));
  });

  test('create/get/cancel', async () => {
    const paymentNew = await createPayment({
      name: 'Test payment name',
      description: 'Test payment description',
      pricing_type: ChargePricingType.fixed_price,
      local_price: {
        currency: 'USD',
        amount: '100.00',
      },
      metadata: {
        customer_id: 'id_1005',
        customer_name: 'Satoshi Nakamoto',
      },
    });

    const paymentGet = await getPayment(paymentNew.id);
    expect(paymentGet.fee_rate).toBe(0.01);

    const paymentCancel = await cancelPayment(paymentNew.id);
    expect(paymentCancel.fee_rate).toBe(0.01);

    console.log(
      JSON.stringify(paymentNew, null, 2),
      JSON.stringify(paymentGet, null, 2),
      JSON.stringify(paymentCancel, null, 2),
    );
  });
});
