import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { isSignInWithMagicLink, loginWithMagicLink, sendMagicLink } from '~libs/auth';
import { cacheRead, cacheWrite } from '~libs/cache';
import Button from '~ui/core/Button';
import Card from '~ui/core/Card';
import Stack from '~ui/core/Stack';
import TextInput from '~ui/core/TextInput';
import Title from '~ui/core/Title';
import { toastError } from '~ui/toast';

function LoginWithMagicLink() {
  const router = useRouter();

  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isSignInWithMagicLink()) {
      cacheRead<string>('magicLinkEmail').then((cache) => {
        let magicLinkEmail = cache;
        if (!magicLinkEmail) {
          // eslint-disable-next-line no-alert
          magicLinkEmail = window.prompt('Please provide your email for confirmation') || '';
        }
        loginWithMagicLink(magicLinkEmail, router.push);
      });
    }
  }, [router]);

  return (
    <Card withBorder radius="lg" shadow="xl">
      <Stack>
        <Title size="h4">Email me a Login Link</Title>
        <TextInput
          type="email"
          placeholder="email@gmail.com"
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button
          onClick={() => {
            if (!email) {
              toastError('Email is required');
              return;
            }
            cacheWrite<string>('magicLinkEmail', email);
            sendMagicLink(email);
          }}
        >
          Send now
        </Button>
      </Stack>
    </Card>
  );
}

export default LoginWithMagicLink;
