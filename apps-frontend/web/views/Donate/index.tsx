import { useEffect, useState } from 'react';

import { watchUserInfoController } from '~controllers/user.controller';
import useOnMount from '~hooks/useOnMount';
import useScript from '~hooks/useScript';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';
import { toastError, toastInfo, toastSuccess } from '~ui/toast';

enum PaymentEvent {
  'onPaymentDetected' = 'onPaymentDetected',
  'onSuccess' = 'onSuccess',
  'onFailure' = 'onFailure',
}

interface PaymentPayload {
  event: 'payment_detected' | 'charge_confirmed' | 'charge_failed',
  code: string, // Charge code, https://docs.cloud.coinbase.com/commerce/reference/getcharge
  buttonId: string,
}

const buttonId = 'donate-with-crypto';
const scriptId = 'coinbase-commerce';
const scriptUrl = 'https://commerce.coinbase.com/v1/checkout.js';
const checkoutUrl = 'https://commerce.coinbase.com/checkout/9eeb1718-a966-4327-8ab8-92cdcbbe2c0d';

function Donate() {
  const userId = watchUserInfoController((state) => state.activeUser?._id);

  useScript(scriptId, scriptUrl);

  const isFoundBuyWithCrypto = useOnMount(() => !!window.BuyWithCrypto);
  const isFoundButton = useOnMount(() => !!document.getElementById(buttonId));

  const [result, setResult] = useState<PaymentPayload>();

  useEffect(() => {
    Logger.info('BuyWithCrypto loaded', isFoundBuyWithCrypto);
    if (isFoundBuyWithCrypto) {
      window.BuyWithCrypto.registerCallback(
        PaymentEvent.onPaymentDetected,
        (payload: PaymentPayload) => {
          Logger.warn('Payment has been detected but not yet confirmed', payload);
          setResult(payload);
          toastInfo('Payment detected, but not yet confirmed. Thank you!');
        },
      );
      window.BuyWithCrypto.registerCallback(
        PaymentEvent.onSuccess,
        (payload: PaymentPayload) => {
          Logger.warn('Charge was successfully completed', payload);
          setResult(payload);
          toastSuccess('Payment completed. Thank you so much for the donation!');
        },
      );
      window.BuyWithCrypto.registerCallback(
        PaymentEvent.onFailure,
        (payload: PaymentPayload) => {
          Logger.warn('Charge failed', payload);
          setResult(payload);
          toastError('Payment failed. Thank you for trying to donate!');
        },
      );
    }
  }, [isFoundBuyWithCrypto]);

  useEffect(() => {
    Logger.info('Donate Button loaded', isFoundBuyWithCrypto, isFoundButton);
    if (isFoundBuyWithCrypto && isFoundButton) {
      const element = document.getElementById(buttonId);
      if (element) {
        const newInstance = new window.BuyWithCrypto();
        newInstance.install(element);
      }
    }
  }, [isFoundBuyWithCrypto, isFoundButton]);

  return (
    <ContentSection>
      <Stack py={50}>
        <Title>Donate</Title>
        <Text size="lg">We appreciate your support with all our heart ❤️</Text>
        <Text size="lg">Thank you very much 🙏</Text>
        <Text>
          <a
            id={buttonId}
            className={buttonId}
            href={checkoutUrl}
            onClick={(e) => e.preventDefault()}
            data-custom={userId}
          >
            Donate with Crypto
          </a>
        </Text>
        <Text>{JSON.stringify(result, null, 2)}</Text>
      </Stack>
    </ContentSection>
  );
}

export default Donate;
