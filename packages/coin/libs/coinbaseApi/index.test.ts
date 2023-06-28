/* eslint-disable max-len */
import { listAccounts, listTransactions } from '.';

/*
// listAccounts
{
  "pagination": {
    "ending_before": null,
    "starting_after": null,
    "previous_ending_before": null,
    "next_starting_after": "62113b33-4464-5a60-89ed-22938de074ad",
    "limit": 25,
    "order": "desc",
    "previous_uri": null,
    "next_uri": "/v2/accounts?starting_after=62113b33-4464-5a60-89ed-22938de074ad"
  },
  "data": [
    {
      "id": "41f6c2c0-0773-5851-b6f8-742975fb3ec9",
      "name": "MATIC Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "MATIC",
        "name": "Polygon",
        "color": "#8247E5",
        "sort_index": 162,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "026bcc1e-9163-591c-a709-34dd18b2e7a1",
        "slug": "polygon"
      },
      "balance": {
        "amount": "5.65742381",
        "currency": "MATIC"
      },
      "created_at": "2023-05-03T23:32:17Z",
      "updated_at": "2023-05-04T09:01:10Z",
      "resource": "account",
      "resource_path": "/v2/accounts/41f6c2c0-0773-5851-b6f8-742975fb3ec9",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "2a6faf61-98e3-55e1-aa1a-351b9b59d9a3",
      "name": "USDT Vault",
      "primary": false,
      "type": "vault",
      "currency": {
        "code": "USDT",
        "name": "Tether",
        "color": "#22A079",
        "sort_index": 171,
        "exponent": 6,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "b26327c1-9a34-51d9-b982-9b29e6012648",
        "slug": "tether"
      },
      "balance": {
        "amount": "0.000000",
        "currency": "USDT"
      },
      "created_at": "2023-05-01T04:07:26Z",
      "updated_at": "2023-05-01T04:12:32Z",
      "resource": "account",
      "resource_path": "/v2/accounts/2a6faf61-98e3-55e1-aa1a-351b9b59d9a3",
      "allow_deposits": true,
      "allow_withdrawals": true,
      "rewards_apy": null
    },
    {
      "id": "b722d562-9f66-5068-9c7a-2dfbbf31c0da",
      "name": "USDT Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "USDT",
        "name": "Tether",
        "color": "#22A079",
        "sort_index": 171,
        "exponent": 6,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "b26327c1-9a34-51d9-b982-9b29e6012648",
        "slug": "tether"
      },
      "balance": {
        "amount": "0.000000",
        "currency": "USDT"
      },
      "created_at": "2023-05-01T04:07:19Z",
      "updated_at": "2023-05-01T04:07:20Z",
      "resource": "account",
      "resource_path": "/v2/accounts/b722d562-9f66-5068-9c7a-2dfbbf31c0da",
      "allow_deposits": true,
      "allow_withdrawals": true,
      "rewards_apy": null
    },
    {
      "id": "f912373e-a0be-59d4-8d60-7089d3c6bcb2",
      "name": "AUD Wallet",
      "primary": false,
      "type": "fiat",
      "currency": {
        "code": "AUD",
        "name": "Australian Dollar",
        "color": "#0066cf",
        "sort_index": 0,
        "exponent": 2,
        "type": "fiat"
      },
      "balance": {
        "amount": "0.00",
        "currency": "AUD"
      },
      "created_at": "2023-04-30T13:07:24Z",
      "updated_at": "2023-05-05T10:10:27Z",
      "resource": "account",
      "resource_path": "/v2/accounts/f912373e-a0be-59d4-8d60-7089d3c6bcb2",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "21080ae1-07c1-5b9c-bdc0-9ca0de90e907",
      "name": "Staked ATOM",
      "primary": false,
      "type": "wallet",
      "currency": {
        "code": "ATOM",
        "name": "Cosmos",
        "color": "#2E3148",
        "sort_index": 133,
        "exponent": 6,
        "type": "crypto",
        "address_regex": "^cosmos1[ac-hj-np-z02-9]{38}$",
        "asset_id": "64c607d2-4663-5649-86e0-3ab06bba0202",
        "destination_tag_name": "ATOM Memo",
        "destination_tag_regex": "^\\w{1,24}$",
        "slug": "cosmos"
      },
      "balance": {
        "amount": "0.000000",
        "currency": "ATOM"
      },
      "created_at": "2023-03-19T20:54:16Z",
      "updated_at": "2023-04-06T06:32:43Z",
      "resource": "account",
      "resource_path": "/v2/accounts/21080ae1-07c1-5b9c-bdc0-9ca0de90e907",
      "allow_deposits": true,
      "allow_withdrawals": true,
      "rewards": {
        "apy": "0.0612",
        "formatted_apy": "6.12%",
        "label": "6.12% APY"
      }
    },
    {
      "id": "a58df2f0-f1f3-576b-9061-bc0d33887d6a",
      "name": "Staked XTZ",
      "primary": false,
      "type": "wallet",
      "currency": {
        "code": "XTZ",
        "name": "Tezos",
        "color": "#2C7DF7",
        "sort_index": 130,
        "exponent": 6,
        "type": "crypto",
        "address_regex": "(tz[1|2|3]([a-zA-Z0-9]){33})|(^KT1([a-zA-Z0-9]){33}$)",
        "asset_id": "69e559ec-547a-520a-aeb3-01cac23f1826",
        "slug": "tezos"
      },
      "balance": {
        "amount": "0.000000",
        "currency": "XTZ"
      },
      "created_at": "2023-03-19T20:50:04Z",
      "updated_at": "2023-04-06T06:32:43Z",
      "resource": "account",
      "resource_path": "/v2/accounts/a58df2f0-f1f3-576b-9061-bc0d33887d6a",
      "allow_deposits": true,
      "allow_withdrawals": true,
      "rewards": {
        "apy": "0.0319",
        "formatted_apy": "3.19%",
        "label": "3.19% APY"
      }
    },
    {
      "id": "2c52eb6d-2d17-5d1e-856d-240a7e70ad66",
      "name": "ETH2 Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "ETH2",
        "name": "Ethereum 2",
        "color": "#8E76FF",
        "sort_index": 161,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "3bec5bf3-507a-51ba-8e41-dc953b1a5c4d",
        "slug": "ethereum-2"
      },
      "balance": {
        "amount": "0.00000000",
        "currency": "ETH2"
      },
      "created_at": "2023-01-19T07:04:04Z",
      "updated_at": "2023-01-19T07:04:04Z",
      "resource": "account",
      "resource_path": "/v2/accounts/2c52eb6d-2d17-5d1e-856d-240a7e70ad66",
      "allow_deposits": false,
      "allow_withdrawals": false,
      "rewards": {
        "apy": "0.0474",
        "formatted_apy": "4.74%",
        "label": "4.74% APR"
      }
    },
    {
      "id": "5fa80973-55ff-5432-959e-3e8e099a1068",
      "name": "KNC Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "KNC",
        "name": "Kyber Network",
        "color": "#31CB9E",
        "sort_index": 121,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "8c853af0-5071-5dd7-9f70-1a871107f53c",
        "slug": "kyber-network"
      },
      "balance": {
        "amount": "0.00000000",
        "currency": "KNC"
      },
      "created_at": "2020-07-26T07:16:02Z",
      "updated_at": "2020-07-26T07:16:02Z",
      "resource": "account",
      "resource_path": "/v2/accounts/5fa80973-55ff-5432-959e-3e8e099a1068",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "2669860a-7049-5a5d-96bd-a995cc184a45",
      "name": "DAI Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "DAI",
        "name": "Dai",
        "color": "#FFB74D",
        "sort_index": 115,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "01e9e33b-d099-56fb-aa3b-76c19d0b250e",
        "slug": "dai"
      },
      "balance": {
        "amount": "0.00000000",
        "currency": "DAI"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/2669860a-7049-5a5d-96bd-a995cc184a45",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "dcb5ead1-dc4c-52c7-8d89-37d527576c40",
      "name": "ATOM Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "ATOM",
        "name": "Cosmos",
        "color": "#2E3148",
        "sort_index": 133,
        "exponent": 6,
        "type": "crypto",
        "address_regex": "^cosmos1[ac-hj-np-z02-9]{38}$",
        "asset_id": "64c607d2-4663-5649-86e0-3ab06bba0202",
        "destination_tag_name": "ATOM Memo",
        "destination_tag_regex": "^\\w{1,24}$",
        "slug": "cosmos"
      },
      "balance": {
        "amount": "0.000000",
        "currency": "ATOM"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/dcb5ead1-dc4c-52c7-8d89-37d527576c40",
      "allow_deposits": true,
      "allow_withdrawals": true,
      "rewards": {
        "apy": "0.0612",
        "formatted_apy": "6.12%",
        "label": "6.12% APY"
      }
    },
    {
      "id": "4f2d02b4-3aec-5f6c-87d7-199765915fa8",
      "name": "DASH Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "DASH",
        "name": "Dash",
        "color": "#008DE4",
        "sort_index": 132,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^([X7][a-km-zA-HJ-NP-Z1-9]{25,34})$",
        "asset_id": "b9c43d61-e77d-5e02-9a0d-800b50eb9d5f",
        "slug": "dash"
      },
      "balance": {
        "amount": "0.00000000",
        "currency": "DASH"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/4f2d02b4-3aec-5f6c-87d7-199765915fa8",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "eb0afd4c-bae1-53df-9c82-e380254c9212",
      "name": "XTZ Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "XTZ",
        "name": "Tezos",
        "color": "#2C7DF7",
        "sort_index": 130,
        "exponent": 6,
        "type": "crypto",
        "address_regex": "(tz[1|2|3]([a-zA-Z0-9]){33})|(^KT1([a-zA-Z0-9]){33}$)",
        "asset_id": "69e559ec-547a-520a-aeb3-01cac23f1826",
        "slug": "tezos"
      },
      "balance": {
        "amount": "0.000000",
        "currency": "XTZ"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/eb0afd4c-bae1-53df-9c82-e380254c9212",
      "allow_deposits": true,
      "allow_withdrawals": true,
      "rewards": {
        "apy": "0.0319",
        "formatted_apy": "3.19%",
        "label": "3.19% APY"
      }
    },
    {
      "id": "b4f37f74-6b65-5bc1-9a36-9422e037fe75",
      "name": "BAT Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "BAT",
        "name": "Basic Attention Token",
        "color": "#FF5000",
        "sort_index": 106,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "b8950bef-d61b-53cd-bb66-db436f0f81bc",
        "slug": "basic-attention-token"
      },
      "balance": {
        "amount": "0.00000000",
        "currency": "BAT"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/b4f37f74-6b65-5bc1-9a36-9422e037fe75",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "14a3210d-cf35-5be4-a025-88a2ce983fad",
      "name": "ETC Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "ETC",
        "name": "Ethereum Classic",
        "color": "#59D4AF",
        "sort_index": 103,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "c16df856-0345-5358-8a70-2a78c804e61f",
        "slug": "ethereum-classic"
      },
      "balance": {
        "amount": "0.00000000",
        "currency": "ETC"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/14a3210d-cf35-5be4-a025-88a2ce983fad",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "09f08b95-3d7d-5f31-91f1-86603520c3f2",
      "name": "REP Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "REP",
        "name": "Augur",
        "color": "#553580",
        "sort_index": 126,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "b8b44189-a54b-526f-b68d-1dbb27b462c3",
        "slug": "augur"
      },
      "balance": {
        "amount": "0.00000000",
        "currency": "REP"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/09f08b95-3d7d-5f31-91f1-86603520c3f2",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "71b62bef-fdb1-59f1-b0a2-92d12e5e9128",
      "name": "ZRX Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "ZRX",
        "name": "0x",
        "color": "#302C2C",
        "sort_index": 105,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "a2a8f5ae-83a6-542e-9064-7d335ae8a58d",
        "slug": "0x"
      },
      "balance": {
        "amount": "0.00000000",
        "currency": "ZRX"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/71b62bef-fdb1-59f1-b0a2-92d12e5e9128",
      "allow_deposits": true,
      "allow_withdrawals": true,
      "rewards_apy": null
    },
    {
      "id": "fa5e21d8-4005-5e11-80f0-6bb8e2b84f9a",
      "name": "COMP Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "COMP",
        "name": "Compound",
        "color": "#00D395",
        "sort_index": 137,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "65557d44-082d-50a1-a68b-bc98d961f794",
        "slug": "compound"
      },
      "balance": {
        "amount": "0.00000000",
        "currency": "COMP"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/fa5e21d8-4005-5e11-80f0-6bb8e2b84f9a",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "477e6621-593c-5c46-8d1b-3b111ec67dd9",
      "name": "OMG Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "OMG",
        "name": "OMG Network",
        "color": "#101010",
        "sort_index": 118,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "7616bfa5-9874-5680-87ef-6f04dd3a0e75",
        "slug": "omg-network"
      },
      "balance": {
        "amount": "0.00000000",
        "currency": "OMG"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/477e6621-593c-5c46-8d1b-3b111ec67dd9",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "a2eb0dc5-13e4-5179-af89-786f7a1ab116",
      "name": "MKR Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "MKR",
        "name": "Maker",
        "color": "#1AAB9B",
        "sort_index": 114,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "5553e486-7a85-5433-a5c1-aaeb18a154dd",
        "slug": "maker"
      },
      "balance": {
        "amount": "0.00000000",
        "currency": "MKR"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/a2eb0dc5-13e4-5179-af89-786f7a1ab116",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "32f323cf-a63f-56f9-b839-2db9a9d87a99",
      "name": "EOS Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "EOS",
        "name": "EOS",
        "color": "#000000",
        "sort_index": 128,
        "exponent": 4,
        "type": "crypto",
        "address_regex": "(^[a-z1-5.]{1,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)",
        "asset_id": "8d556883-6c26-5a88-9d8f-fa41fe8ed76e",
        "destination_tag_name": "EOS Memo",
        "destination_tag_regex": "^.{1,100}$",
        "slug": "eos"
      },
      "balance": {
        "amount": "0.0000",
        "currency": "EOS"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/32f323cf-a63f-56f9-b839-2db9a9d87a99",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "6d1fc45d-e88e-5b1b-a593-7787bae6ce3d",
      "name": "OXT Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "OXT",
        "name": "Orchid",
        "color": "#5F45BA",
        "sort_index": 136,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "07525606-a404-5f15-a71d-ba0e40e74eca",
        "slug": "orchid"
      },
      "balance": {
        "amount": "0.00000000",
        "currency": "OXT"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/6d1fc45d-e88e-5b1b-a593-7787bae6ce3d",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "b7cf68ac-6f4a-50db-b6ed-075f038400dc",
      "name": "ALGO Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "ALGO",
        "name": "Algorand",
        "color": "#000000",
        "sort_index": 131,
        "exponent": 6,
        "type": "crypto",
        "address_regex": "^[A-Z2-7]{58}$",
        "asset_id": "9220d47f-bc0a-53ad-9646-ef49918adcf3",
        "slug": "algorand"
      },
      "balance": {
        "amount": "0.000000",
        "currency": "ALGO"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/b7cf68ac-6f4a-50db-b6ed-075f038400dc",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "35947084-e984-5245-931f-aac8c05f32c9",
      "name": "USDC Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "USDC",
        "name": "USD Coin",
        "color": "#2775CA",
        "sort_index": 107,
        "exponent": 6,
        "type": "crypto",
        "address_regex": "^(?:0x)?[0-9a-fA-F]{40}$",
        "asset_id": "2b92315d-eab7-5bef-84fa-089a131333f5",
        "slug": "usdc"
      },
      "balance": {
        "amount": "0.000000",
        "currency": "USDC"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2023-05-05T10:10:58Z",
      "resource": "account",
      "resource_path": "/v2/accounts/35947084-e984-5245-931f-aac8c05f32c9",
      "allow_deposits": true,
      "allow_withdrawals": true,
      "rewards_apy": "0.02",
      "rewards": {
        "apy": "0.02",
        "formatted_apy": "2.00%",
        "label": "2.00% APY"
      }
    },
    {
      "id": "e8bd096a-54fd-518a-a13b-ef16052d830f",
      "name": "XLM Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "XLM",
        "name": "Stellar Lumens",
        "color": "#000000",
        "sort_index": 127,
        "exponent": 7,
        "type": "crypto",
        "address_regex": "^G[A-Z2-7]{55}$",
        "asset_id": "13b83335-5ede-595b-821e-5bcdfa80560f",
        "destination_tag_name": "XLM Memo",
        "destination_tag_regex": "^[ -~]{1,28}$",
        "slug": "stellar"
      },
      "balance": {
        "amount": "0.0000000",
        "currency": "XLM"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/e8bd096a-54fd-518a-a13b-ef16052d830f",
      "allow_deposits": true,
      "allow_withdrawals": true
    },
    {
      "id": "62113b33-4464-5a60-89ed-22938de074ad",
      "name": "ZEC Wallet",
      "primary": true,
      "type": "wallet",
      "currency": {
        "code": "ZEC",
        "name": "Zcash",
        "color": "#ECB244",
        "sort_index": 108,
        "exponent": 8,
        "type": "crypto",
        "address_regex": "^(t1|t3)[a-km-zA-HJ-NP-Z1-9]{33}$",
        "asset_id": "1d3c2625-a8d9-5458-84d0-437d75540421",
        "slug": "zcash"
      },
      "balance": {
        "amount": "0.00000000",
        "currency": "ZEC"
      },
      "created_at": "2020-07-26T07:16:01Z",
      "updated_at": "2020-07-26T07:16:01Z",
      "resource": "account",
      "resource_path": "/v2/accounts/62113b33-4464-5a60-89ed-22938de074ad",
      "allow_deposits": true,
      "allow_withdrawals": true
    }
  ]
}

// listTransactions
{
  "data": [
    {
      "id": "97988889-4e74-5272-b1e7-c0e1d4f8807a",
      "type": "send",
      "status": "completed",
      "amount": {
        "amount": "4.90383150",
        "currency": "MATIC"
      },
      "native_amount": {
        "amount": "4.90",
        "currency": "USD"
      },
      "description": null,
      "created_at": "2023-05-04T04:02:53Z",
      "updated_at": "2023-05-04T04:02:53Z",
      "resource": "transaction",
      "resource_path": "/v2/accounts/41f6c2c0-0773-5851-b6f8-742975fb3ec9/transactions/97988889-4e74-5272-b1e7-c0e1d4f8807a",
      "instant_exchange": false,
      "network": {
        "status": "unconfirmed",
        "status_description": "Pending (est. less than 10 minutes)",
        "hash": "0x81e46c25a18d4e7ab17035dbfab5498ad3165818de87f1d58753f4a7fe33e606",
        "transaction_url": "https://polygonscan.com/tx/0x81e46c25a18d4e7ab17035dbfab5498ad3165818de87f1d58753f4a7fe33e606"
      },
      "from": {
        "resource": "polygon_network",
        "currency": "MATIC"
      },
      "details": {
        "title": "Received Polygon",
        "subtitle": "From Polygon address",
        "header": "Received 4.9038315 MATIC ($4.90)",
        "health": "positive"
      },
      "hide_native_amount": false
    },
    {
      "id": "14582ed0-954e-5c1c-a610-4293ad6066c6",
      "type": "send",
      "status": "completed",
      "amount": {
        "amount": "-5.05835000",
        "currency": "MATIC"
      },
      "native_amount": {
        "amount": "-5.10",
        "currency": "USD"
      },
      "description": "Coinbase Commerce donation receipt: https://commerce.coinbase.com/receipts/YNBKMB6R",
      "created_at": "2023-05-03T23:33:50Z",
      "updated_at": "2023-05-03T23:34:04Z",
      "resource": "transaction",
      "resource_path": "/v2/accounts/41f6c2c0-0773-5851-b6f8-742975fb3ec9/transactions/14582ed0-954e-5c1c-a610-4293ad6066c6",
      "instant_exchange": false,
      "network": {
        "status": "pending",
        "status_description": "Pending (est. less than 10 minutes)",
        "hash": "0x05511086a785df4f04b193fa379f9a554e7ce0050fc90490156ddff936f25781",
        "transaction_url": "https://polygonscan.com/tx/0x05511086a785df4f04b193fa379f9a554e7ce0050fc90490156ddff936f25781",
        "transaction_fee": {
          "amount": "0.10000000",
          "currency": "MATIC"
        },
        "transaction_amount": {
          "amount": "4.95835000",
          "currency": "MATIC"
        },
        "confirmations": 0
      },
      "to": {
        "resource": "polygon_address",
        "address": "0x5dEE8c040704cead6c0cD78FbFCc91A6c25dE18E",
        "currency": "MATIC",
        "address_info": {
          "address": "0x5dEE8c040704cead6c0cD78FbFCc91A6c25dE18E"
        }
      },
      "idem": "YNBKMB6R",
      "application": {
        "id": "ed67f2a4-ed09-55fe-b20e-2764491ca24d",
        "resource": "application",
        "resource_path": "/v2/applications/ed67f2a4-ed09-55fe-b20e-2764491ca24d"
      },
      "details": {
        "title": "Sent Polygon",
        "subtitle": "To Polygon address on Polygon network",
        "header": "Sent 5.05835 MATIC ($5.10)",
        "health": "positive"
      },
      "hide_native_amount": false
    },
    {
      "id": "b9d8f766-cd9b-5ce2-a3cb-0a2ae660cfc3",
      "type": "buy",
      "status": "completed",
      "amount": {
        "amount": "5.81194231",
        "currency": "MATIC"
      },
      "native_amount": {
        "amount": "6.67",
        "currency": "USD"
      },
      "description": null,
      "created_at": "2023-05-03T23:32:35Z",
      "updated_at": "2023-05-03T23:32:35Z",
      "resource": "transaction",
      "resource_path": "/v2/accounts/41f6c2c0-0773-5851-b6f8-742975fb3ec9/transactions/b9d8f766-cd9b-5ce2-a3cb-0a2ae660cfc3",
      "instant_exchange": false,
      "buy": {
        "id": "5d0d2c8f-2886-4cdc-a851-98e04faa7bb6",
        "resource": "buy",
        "resource_path": "/v2/accounts/f912373e-a0be-59d4-8d60-7089d3c6bcb2/buys/5d0d2c8f-2886-4cdc-a851-98e04faa7bb6"
      },
      "details": {
        "title": "Bought Polygon",
        "subtitle": "Using AUD Wallet",
        "header": "Bought 5.81194231 MATIC ($6.67)",
        "health": "positive",
        "payment_method_name": "AUD Wallet"
      },
      "hide_native_amount": false
    }
  ],
  "pagination": {
    "ending_before": null,
    "starting_after": null,
    "previous_ending_before": null,
    "next_starting_after": null,
    "limit": 25,
    "order": "desc",
    "previous_uri": null,
    "next_uri": null
  }
}
*/

describe('coinbaseApi', () => {
  test('listAccounts', async () => {
    const accounts = await listAccounts();
    expect(accounts).toBeDefined();
    console.log(JSON.stringify(accounts, null, 2));
  });

  test('transactions', async () => {
    const accounts = await listAccounts();
    expect(accounts).toBeDefined();
    const maticAccount = accounts.data
      .find((item: any) => item?.currency?.code === 'MATIC');

    const transactions = await listTransactions(maticAccount.id);
    expect(transactions).toBeDefined();
    console.log(JSON.stringify(transactions, null, 2));
  });
});
