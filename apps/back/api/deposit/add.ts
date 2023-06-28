import { ChargePricingType } from '@fishbot/coin/constants/coinbaseCommerce';
import { createPayment as createPaymentCoinbaseCommerce } from '@fishbot/coin/libs/coinbaseCommerce';
import { createPayment as createPaymentRequestFinance } from '@fishbot/coin/libs/requestFinance';
import createDeposit from '@fishbot/coin/utils/transaction/createDeposit';
import createSpot from '@fishbot/coin/utils/wallet/createSpot';
import { ErrorType } from '@fishbot/utils/constants/error';
import { SourceType, TransactionType } from '@fishbot/utils/constants/pay';
import random from '@fishbot/utils/helpers/random';
import type { Wallet } from '@fishbot/utils/types/Pay.model';
import type { User } from '@fishbot/utils/types/User.model';
import moment from 'moment';

import isDemo from '~utils/isDemo';

const defaultSrcType = SourceType.coinbaseCommerce;

const walletAddresses: Record<string, string> = {
  'USDT-mainnet': '0x21d63aee4623cb6d242d9997b84eb95b5eee5404', // Exness
  'USDT-tron': 'TPcPvD4cC17nUp65QFAgrEPgUddLguerk1', // Exness
  'USDT-bsc': '0x680c9893c36925a1618541962486c20f03ebf98e', // Roboforex
  'USDC-mainnet': '0x21d63aee4623cb6d242d9997b84eb95b5eee5404', // Exness
  'USDC-tron': 'TPcPvD4cC17nUp65QFAgrEPgUddLguerk1', // Exness
  'BUSD-bsc': '0xf0b4b352c7090da2bd5c2e28abaf3d7fd56e1694', // Roboforex
  'DAI-mainnet': '0xc3ce2deaa4be5e8d07f4d4b1a9b19750cde15c57', // Roboforex
  'BTC-mainnet': '1532ynUfaKWAc66GPcuQnoBJAefyfRTpGq', // Exness
  'ETH-mainnet': '0x8dae1cda60dffbcd99ce28708ffce4e74596cab1', // Roboforex
  'BNB-bsc': '0x2c7e758f0fb7a5a3205e326cd93741297355e550', // Roboforex
  'SOL-solana': 'CeWYjfeTKqMpHEyoeenhmff3SzVRsDsmeYywE6BeBatj', // Roboforex
  'TRX-tron': 'TLcXwawbHLxh36Mb4RVbNEmmNHkd6wz8sq', // Roboforex
};

const depositAdd = async ({ data, userInfo }: {
  data: {
    amount: number,
    srcType?: SourceType,
    srcCurrency?: string,
  }
  userInfo: User,
}) => {
  const { amount } = data;
  if (!amount) {
    return { error: ErrorType.badRequest };
  }

  const { uid, name, email } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const dstCurrency = 'USD';
  const walletId = `${uid}-${dstCurrency}`;

  let wallet = await Mongo.collection<Wallet>('wallets').findOne({
    _id: walletId,
  }, {
    projection: {
      balance: 1,
    },
  });

  if (!wallet) {
    wallet = await createSpot({
      userId: uid,
      userEmail: email,
      userName: name,
      walletId,
      currency: dstCurrency,
    });
  }

  const { balance } = wallet;
  const {
    srcCurrency = dstCurrency,
  } = data;

  let {
    srcType = defaultSrcType,
  } = data;
  let srcId;
  let srcData;
  let srcPayUrl;

  if (isDemo) {
    srcType = SourceType.reward;
    srcId = random();
  } else {
    switch (srcType) {
      case SourceType.coinbaseCommerce: {
        const payment = await createPaymentCoinbaseCommerce({
          name: 'Deposit',
          description: `Deposit to ${dstCurrency} wallet of ${name} (${email})`,
          pricing_type: ChargePricingType.fixed_price,
          local_price: {
            currency: dstCurrency,
            amount: `${amount}`,
          },
          metadata: {
            customer_id: uid,
            customer_name: walletId,
          },
          redirect_url: 'https://www.fishprovider.com/deposit',
        });
        srcId = payment.id;
        srcData = payment;
        srcPayUrl = payment.hosted_url;
        break;
      }

      case SourceType.requestFinance: {
        const nameWords = name.split(' ');
        const lastName = nameWords.pop() || '';
        const firstName = nameWords.join(' ');
        const paymentAddress = walletAddresses[srcCurrency] || '';
        const payment = await createPaymentRequestFinance({
          buyerInfo: {
            email,
            lastName,
            firstName,
            businessName: name,
          },
          invoiceItems: [
            {
              currency: dstCurrency,
              name: 'Deposit',
              quantity: 1,
              unitPrice: amount * 100,
            },
          ],
          invoiceNumber: random(),
          paymentCurrency: srcCurrency,
          declarativePaymentInformation: {
            paymentAddress,
          },
          creationDate: new Date(),
          paymentTerms: {
            dueDate: moment().add(1, 'hour').toDate(),
          },
          tags: [uid, walletId],
        });
        srcId = payment.id;
        srcData = payment;
        srcPayUrl = payment.invoiceLinks.pay;
        break;
      }

      case SourceType.fishPay: {
        return { error: 'Coming soon...' };
      }

      default:
        return { error: ErrorType.badRequest };
    }
  }

  if (!srcId) {
    return { error: ErrorType.badRequest };
  }

  const payId = `${TransactionType.deposit}-${walletId}-${srcType}-${srcId}`;

  const transaction = await createDeposit({
    payId,
    userId: uid,

    srcType,
    srcId,
    srcCurrency,
    srcAmount: amount,

    srcData,
    srcPayUrl,

    dstCurrency,
    dstId: walletId,
    dstBalance: balance,
  });

  // cron will handle next and update transaction status to success

  return { result: transaction };
};

export default depositAdd;
